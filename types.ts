export enum ImageFormat {
  JPEG = 'image/jpeg',
  PNG = 'image/png',
  WEBP = 'image/webp',
}

export interface CompressionSettings {
  quality: number; // 0 to 1
  format: ImageFormat;
  scale: number; // 0.1 to 1.0 (Resize factor)
}

export interface ImageStats {
  originalSize: number;
  compressedSize: number;
  width: number;
  height: number;
  compressedWidth: number;
  compressedHeight: number;
  isAnimated?: boolean;
}