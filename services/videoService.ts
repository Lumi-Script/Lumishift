import { Muxer, ArrayBufferTarget } from 'webm-muxer';
import { CompressionSettings, ImageFormat } from '../types';

class WebPMuxer {
  private chunks: Uint8Array[] = [];
  private width: number;
  private height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  write24(view: DataView, offset: number, value: number) {
    view.setUint8(offset, value & 0xFF);
    view.setUint8(offset + 1, (value >> 8) & 0xFF);
    view.setUint8(offset + 2, (value >> 16) & 0xFF);
  }

  addVideoChunk(chunk: EncodedVideoChunk, durationMs: number) {
    const vp8Data = new Uint8Array(chunk.byteLength);
    chunk.copyTo(vp8Data);

    const isOdd = vp8Data.length % 2 !== 0;
    const pad = isOdd ? 1 : 0;
    
    // ANMF payload size = 16 (ANMF header params) + 8 ('VP8 ' signature+size) + vp8Data.length + pad
    const anmfPayloadSize = 16 + 8 + vp8Data.length + pad;
    
    // Total chunk size including ANMF signature and size (8 bytes) = 8 + anmfPayloadSize
    const frameChunk = new Uint8Array(8 + anmfPayloadSize);
    const view = new DataView(frameChunk.buffer);

    // 'ANMF'
    frameChunk.set([0x41, 0x4E, 0x4D, 0x46], 0);
    view.setUint32(4, anmfPayloadSize, true); // Little endian size
    
    // x = 0, y = 0
    // width - 1
    this.write24(view, 14, this.width - 1);
    // height - 1
    this.write24(view, 17, this.height - 1);
    // duration
    this.write24(view, 20, Math.round(durationMs));
    // flags = 0
    view.setUint8(23, 0);
    
    // 'VP8 ' (Note the space!)
    frameChunk.set([0x56, 0x50, 0x38, 0x20], 24);
    view.setUint32(28, vp8Data.length, true);
    
    frameChunk.set(vp8Data, 32);
    if (isOdd) frameChunk[32 + vp8Data.length] = 0; // padding

    this.chunks.push(frameChunk);
  }

  finalize(): Blob {
    let totalDataSize = 0;
    for (const c of this.chunks) totalDataSize += c.length;

    // RIFF (12) + VP8X (18) + ANIM (14) = 44 bytes
    const header = new Uint8Array(44);
    const view = new DataView(header.buffer);

    // 'RIFF'
    header.set([0x52, 0x49, 0x46, 0x46], 0);
    // File size - 8. Header is 44 bytes. 44 - 8 = 36.
    view.setUint32(4, 36 + totalDataSize, true);
    // 'WEBP'
    header.set([0x57, 0x45, 0x42, 0x50], 8);

    // 'VP8X'
    header.set([0x56, 0x50, 0x38, 0x58], 12);
    view.setUint32(16, 10, true); // VP8X payload size
    view.setUint8(20, 0x02); // Animation flag
    // 21-23 reserved 0
    this.write24(view, 24, this.width - 1);
    this.write24(view, 27, this.height - 1);

    // 'ANIM'
    header.set([0x41, 0x4E, 0x49, 0x4D], 30);
    view.setUint32(34, 6, true); // ANIM payload size
    view.setUint32(38, 0xFFFFFFFF, true); // BG color white
    view.setUint16(42, 0, true); // Loop count 0 (infinite)

    return new Blob([header, ...this.chunks], { type: 'image/webp' });
  }
}

export const convertVideoToWebm = async (
  file: File, 
  settings: CompressionSettings,
  targetMimeType: string = 'video/webm',
  onProgress?: (progress: number) => void
): Promise<{ blob: Blob; url: string; width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.autoplay = false;
    video.muted = true;
    video.playsInline = true;

    const url = URL.createObjectURL(file);
    video.src = url;

    video.onloadedmetadata = async () => {
      try {
        if (typeof VideoEncoder === 'undefined') {
          throw new Error("Your browser does not support WebCodecs VideoEncoder. Please use Chrome or Edge.");
        }

        let duration = video.duration;
        if (isNaN(duration) || duration === Infinity || duration === 0) {
          duration = 5;
        }

        const originalWidth = video.videoWidth || 1280;
        const originalHeight = video.videoHeight || 720;
        
        const width = Math.round(originalWidth * settings.scale);
        const height = Math.round(originalHeight * settings.scale);
        
        const targetWidth = Math.max(2, width % 2 === 0 ? width : width - 1);
        const targetHeight = Math.max(2, height % 2 === 0 ? height : height - 1);

        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('No canvas context');

        const isWebp = targetMimeType === 'image/webp';
        const fps = 24;
        const durationMs = 1000 / fps;

        const webPMuxer = isWebp ? new WebPMuxer(targetWidth, targetHeight) : null;
        
        // Use webm-muxer ONLY for webm output
        const muxer = !isWebp ? new Muxer({
          target: new ArrayBufferTarget(),
          video: {
            codec: 'V_VP8',
            width: targetWidth,
            height: targetHeight,
          },
          fastStart: 'in-memory'
        }) : null;

        const videoEncoder = new VideoEncoder({
          output: (chunk, meta) => {
             if (isWebp && webPMuxer) {
                 webPMuxer.addVideoChunk(chunk, durationMs);
             } else if (muxer) {
                 muxer.addVideoChunk(chunk, meta);
             }
          },
          error: (e) => {
            console.error(e);
            reject(new Error("VideoEncoder error: " + e.message));
          }
        });

        try {
            videoEncoder.configure({
              codec: 'vp8',
              width: targetWidth,
              height: targetHeight,
              bitrate: 1e6 * (0.1 + settings.quality * 2), 
              framerate: fps,
            });
        } catch (e: any) {
            throw new Error("Failed to configure VideoEncoder (codec might not be supported): " + e.message);
        }

        let framesEncoded = 0;
        let finished = false;

        video.playbackRate = 8.0; 

        const finishExport = async () => {
            if (finished) return;
            finished = true;

            if (onProgress) onProgress(1.0); 

            try {
                await videoEncoder.flush();
                
                let blob;
                if (isWebp && webPMuxer) {
                    blob = webPMuxer.finalize();
                } else if (muxer) {
                    muxer.finalize();
                    blob = new Blob([muxer.target.buffer], { type: 'video/webm' });
                } else {
                    throw new Error("No muxer initialized");
                }
                
                const resultUrl = URL.createObjectURL(blob);
                URL.revokeObjectURL(url);
                
                resolve({ blob, url: resultUrl, width: targetWidth, height: targetHeight });
            } catch (err) {
                reject(err);
            }
        };

        video.onended = finishExport;

        const safetyInterval = setInterval(() => {
            if (finished) {
                clearInterval(safetyInterval);
            } else if (video.ended || (video.paused && video.currentTime > 0)) {
                finishExport();
            }
        }, 500);

        const extractLoop = async () => {
          if (finished) return;
          
          if (video.currentTime >= duration || video.ended) {
            await finishExport();
            return;
          }

          try {
            ctx.drawImage(video, 0, 0, targetWidth, targetHeight);
            const timestamp = framesEncoded * (1000000 / fps);
            const frame = new VideoFrame(canvas, { timestamp });
            
            if (videoEncoder.encodeQueueSize > 15) {
               await new Promise(r => setTimeout(r, 10));
            }
            
            // WebP animation requires true intra-frames (keyframes).
            // WebM can use delta frames perfectly fine.
            videoEncoder.encode(frame, { keyFrame: isWebp });
            frame.close();
            framesEncoded++;
            
            if (onProgress) {
              onProgress(Math.min(0.99, video.currentTime / duration));
            }
            
            if ('requestVideoFrameCallback' in video) {
              (video as any).requestVideoFrameCallback(extractLoop);
            } else {
              requestAnimationFrame(extractLoop);
            }
          } catch (e) {
            if (!finished) reject(e);
          }
        };

        if ('requestVideoFrameCallback' in video) {
          (video as any).requestVideoFrameCallback(extractLoop);
        } else {
          requestAnimationFrame(extractLoop);
        }
        
        video.play().catch((e) => {
            reject(new Error("Playback failed: " + e.message));
        });

      } catch (e) {
        URL.revokeObjectURL(url);
        reject(e);
      }
    };

    video.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };

    video.load();
  });
};
