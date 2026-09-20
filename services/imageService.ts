import { CompressionSettings, ImageFormat } from '../types';

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const loadVideoFrame = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.autoplay = false;
    video.muted = true;
    video.playsInline = true;
    
    video.onloadeddata = () => {
      video.currentTime = 0.1;
    };
    
    video.onseeked = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/png'));
      } else {
        reject(new Error('Could not get canvas context'));
      }
      URL.revokeObjectURL(url);
    };
    
    video.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };
    
    video.src = url;
    video.load();
  });
};

export const loadImage = (source: File | string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = typeof source === 'string' ? source : URL.createObjectURL(source);
    img.onload = () => {
      resolve(img);
    };
    img.onerror = (e) => {
      if (typeof source !== 'string') URL.revokeObjectURL(url);
      reject(e);
    };
    img.src = url;
  });
};

export const isAnimatedWebP = async (file: File): Promise<boolean> => {
  if (file.type !== 'image/webp') return false;
  
  try {
    // Read the first 64 bytes to cover the header and first chunk
    const buffer = await file.slice(0, 64).arrayBuffer();
    const view = new DataView(buffer);
    
    // Check RIFF signature (0x52494646) at offset 0
    if (view.getUint32(0, false) !== 0x52494646) return false; 
    // Check WEBP signature (0x57454250) at offset 8
    if (view.getUint32(8, false) !== 0x57454250) return false;
    
    // Check for "VP8X" chunk at offset 12 (0x56503858)
    // VP8X is required for extended features like animation
    if (view.getUint32(12, false) !== 0x56503858) return false; 
    
    // The VP8X flags are at offset 20 (chunk payload byte 0)
    // Bit 1 (0x02) indicates Animation
    const flags = view.getUint8(20);
    return (flags & 0x02) !== 0;
  } catch (e) {
    console.warn("Could not check WebP animation status:", e);
    return false;
  }
};

export const compressImage = async (
  img: HTMLImageElement,
  settings: CompressionSettings
): Promise<{ blob: Blob; url: string; width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    const targetWidth = Math.round(img.width * settings.scale);
    const targetHeight = Math.round(img.height * settings.scale);

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    // Smoother resizing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Fill background for JPEGs (remove transparency)
    if (settings.format === ImageFormat.JPEG) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

    // Manual PNG Optimization (Posterization)
    // Browser toBlob ignores quality for PNG, so we manually reduce color depth
    // to improve DEFLATE compression efficiency.
    if (settings.format === ImageFormat.PNG && settings.quality < 1) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Calculate a reduction factor. 
        // Quality 0.99 -> factor ~1 (subtle)
        // Quality 0.1 -> factor ~45 (heavy banding)
        // We use a non-linear curve to make the top end of the slider more useful
        const reduction = (1 - settings.quality); 
        const factor = Math.max(1, Math.floor(reduction * 60));

        if (factor > 1) {
            for (let i = 0; i < data.length; i += 4) {
                // Round color values to the nearest factor step
                data[i] = Math.floor(data[i] / factor) * factor;     // Red
                data[i + 1] = Math.floor(data[i + 1] / factor) * factor; // Green
                data[i + 2] = Math.floor(data[i + 2] / factor) * factor; // Blue
                // We typically leave Alpha (data[i+3]) alone for smoother edges, 
                // but could quantize it too if needed.
            }
            ctx.putImageData(imageData, 0, 0);
        }
    }

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Compression failed'));
          return;
        }
        const url = URL.createObjectURL(blob);
        resolve({ blob, url, width: targetWidth, height: targetHeight });
      },
      settings.format,
      settings.quality
    );
  });
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        const result = reader.result as string;
        // Remove data url prefix for Gemini API if sending just base64 data
        const base64Data = result.split(',')[1];
        resolve(base64Data);
    };
    reader.onerror = (error) => reject(error);
  });
};