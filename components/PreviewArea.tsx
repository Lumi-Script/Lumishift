import React, { useRef, useEffect } from 'react';
import { formatFileSize } from '../services/imageService';
import { ImageStats, ImageFormat } from '../types';

interface PreviewAreaProps {
  originalUrl: string;
  compressedUrl: string | null;
  stats: ImageStats;
  isProcessing: boolean;
  progress?: number;
  onOriginalClick: () => void;
  isVideo?: boolean;
  outputFormat?: ImageFormat;
}

const PreviewArea: React.FC<PreviewAreaProps> = ({ originalUrl, compressedUrl, stats, isProcessing, progress, onOriginalClick, isVideo, outputFormat }) => {
  const savings = stats.originalSize > 0 
    ? Math.round(((stats.originalSize - stats.compressedSize) / stats.originalSize) * 100)
    : 0;

  const useVideoTagForOutput = stats.isAnimated && outputFormat === ImageFormat.WEBM;

  const originalVideoRef = useRef<HTMLVideoElement>(null);
  const compressedVideoRef = useRef<HTMLVideoElement>(null);

  // Sync videos when compressed video appears
  useEffect(() => {
    if (compressedUrl && !isProcessing) {
      if (originalVideoRef.current) {
        originalVideoRef.current.currentTime = 0;
        originalVideoRef.current.play().catch(e => console.log(e));
      }
      if (compressedVideoRef.current) {
        compressedVideoRef.current.currentTime = 0;
        compressedVideoRef.current.play().catch(e => console.log(e));
      }
    }
  }, [compressedUrl, isProcessing]);

  return (
    <div className="flex flex-col space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
        {/* Original */}
        <div className="space-y-3">
          <div className="flex justify-between items-end px-1">
             <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-400">Original</span>
                {stats.isAnimated && (
                    <span className="bg-purple-900/50 text-purple-300 text-[10px] px-1.5 py-0.5 rounded border border-purple-500/30 uppercase tracking-wide font-bold">
                        Anim/Gif
                    </span>
                )}
             </div>
             <span className="text-xs text-slate-500">{stats.width} x {stats.height}</span>
          </div>
          <div 
            onClick={onOriginalClick}
            className="relative aspect-video bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700 flex items-center justify-center cursor-pointer group transition-colors hover:border-cyan-500/50"
            title="Click to change image"
          >
             {isVideo ? (
                 <video ref={originalVideoRef} src={originalUrl} autoPlay loop muted playsInline className="max-w-full max-h-full object-contain" />
             ) : (
                 <img src={originalUrl} alt="Original" className="max-w-full max-h-full object-contain" />
             )}
             
             {/* Hover Overlay */}
             <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white backdrop-blur-[2px]">
                <svg className="w-8 h-8 mb-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span className="font-medium text-sm">Change Image</span>
             </div>

             <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md group-hover:opacity-0 transition-opacity">
                {formatFileSize(stats.originalSize)}
             </div>
          </div>
        </div>

        {/* Compressed */}
        <div className="space-y-3">
          <div className="flex justify-between items-end px-1">
             <span className="text-sm font-semibold text-cyan-400">Compressed</span>
             <span className="text-xs text-slate-500">{stats.compressedWidth} x {stats.compressedHeight}</span>
          </div>
          <div className="relative aspect-video bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700 flex items-center justify-center">
             {isProcessing ? (
                 <div className="flex flex-col items-center gap-3 text-cyan-500 w-full max-w-[80%] mx-auto">
                    <svg className="animate-spin h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-sm animate-pulse">
                       Compressing... {progress !== undefined && progress > 0 ? `${progress}%` : ''}
                    </span>
                    {progress !== undefined && progress > 0 && (
                       <div className="w-full bg-slate-700 rounded-full h-1.5 mt-2 overflow-hidden">
                          <div className="bg-cyan-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                       </div>
                    )}
                 </div>
             ) : compressedUrl ? (
                 <>
                    {useVideoTagForOutput ? (
                        <video ref={compressedVideoRef} src={compressedUrl} autoPlay loop muted playsInline className="max-w-full max-h-full object-contain" />
                    ) : (
                        <img src={compressedUrl} alt="Compressed" className="max-w-full max-h-full object-contain" />
                    )}
                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md flex items-center gap-2">
                        {formatFileSize(stats.compressedSize)}
                        {savings > 0 && <span className="text-green-400 font-bold">(-{savings}%)</span>}
                        {savings < 0 && <span className="text-red-400 font-bold">(+{Math.abs(savings)}%)</span>}
                    </div>
                 </>
             ) : (
                <span className="text-slate-600 text-sm">Waiting for settings...</span>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewArea;