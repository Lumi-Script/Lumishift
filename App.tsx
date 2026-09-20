import React, { useState, useEffect, useRef } from 'react';
import { CompressionSettings, ImageFormat, ImageStats } from './types';
import { compressImage, loadImage, fileToBase64, isAnimatedWebP, loadVideoFrame } from './services/imageService';
import { convertVideoToWebm } from './services/videoService';
import UploadArea from './components/UploadArea';
import SettingsPanel from './components/SettingsPanel';
import PreviewArea from './components/PreviewArea';
import Button from './components/Button';
import { CropModal } from './components/CropModal';
import './index.css'

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [frameUrl, setFrameUrl] = useState<string | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Hidden input ref for re-uploading from preview area
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Settings State
  const [settings, setSettings] = useState<CompressionSettings>({
    quality: 0.8,
    format: ImageFormat.WEBP,
    scale: 1,
  });

  // Stats State
  const [stats, setStats] = useState<ImageStats>({
    originalSize: 0,
    compressedSize: 0,
    width: 0,
    height: 0,
    compressedWidth: 0,
    compressedHeight: 0,
    isAnimated: false,
  });

  // Debounce compression to avoid lag on slider drag
  const [debouncedSettings, setDebouncedSettings] = useState(settings);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSettings(settings);
    }, 300);
    return () => clearTimeout(handler);
  }, [settings]);

  // Handle File Upload
  const handleFileSelect = async (selectedFile: File) => {
    if (abortControllerRef.current) {
        abortControllerRef.current.abort();
    }
    setFile(selectedFile);
    
    let objectUrl = URL.createObjectURL(selectedFile);
    let extractedFrameUrl = objectUrl;
    let animated = false;
    let img: HTMLImageElement;

    if (selectedFile.type === 'video/mp4') {
        extractedFrameUrl = await loadVideoFrame(selectedFile);
        img = await loadImage(extractedFrameUrl);
    } else {
        animated = await isAnimatedWebP(selectedFile);
        img = await loadImage(objectUrl);
    }

    setOriginalUrl(objectUrl);
    setFrameUrl(extractedFrameUrl);
    setCompressedUrl(null);

    // Initial stats for original
    setStats(prev => ({
        ...prev,
        originalSize: selectedFile.size,
        width: img.width,
        height: img.height,
        isAnimated: animated,
        // Reset compressed stats
        compressedSize: 0,
        compressedWidth: 0,
        compressedHeight: 0
    }));

    // Auto-set format based on input
    let initialFormat = ImageFormat.WEBP;
    let initialQuality = 0.8;

    if (selectedFile.type === 'image/png') {
        initialFormat = ImageFormat.PNG;
        initialQuality = 1; 
    }
    if (selectedFile.type === 'image/jpeg') initialFormat = ImageFormat.JPEG;
    if (selectedFile.type === 'video/mp4') initialFormat = ImageFormat.WEBM;
    
    setSettings({
        quality: initialQuality,
        format: initialFormat === ImageFormat.PNG ? ImageFormat.PNG : (initialFormat === ImageFormat.WEBM ? ImageFormat.WEBM : ImageFormat.WEBP),
        scale: 1
    });
  };
  
  const handleHiddenInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
          handleFileSelect(e.target.files[0]);
      }
  };

  // Run Compression
  useEffect(() => {
    if (abortControllerRef.current) {
        abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const runCompression = async () => {
      if (!file || !frameUrl) return;

      setIsProcessing(true);
      setProgress(0);
      try {
        let result;
        if (file.type === 'video/mp4' && (debouncedSettings.format === ImageFormat.WEBM || debouncedSettings.format === ImageFormat.WEBP)) {
            result = await convertVideoToWebm(file, debouncedSettings, debouncedSettings.format, (p) => {
                if (!controller.signal.aborted) setProgress(Math.round(p * 100));
            }, controller.signal);
            if (controller.signal.aborted) return;
            setStats(prev => ({ ...prev, isAnimated: true }));
        } else {
            const img = await loadImage(frameUrl);
            result = await compressImage(img, debouncedSettings);
            if (controller.signal.aborted) return;
            setStats(prev => ({ ...prev, isAnimated: (file.type === 'video/mp4' ? false : prev.isAnimated) }));
        }
        
        // Revoke old url to prevent leaks
        if (compressedUrl) URL.revokeObjectURL(compressedUrl);
        
        setCompressedUrl(result.url);
        setStats(prev => ({
            ...prev,
            compressedSize: result.blob.size,
            compressedWidth: result.width,
            compressedHeight: result.height
        }));

      } catch (error: any) {
        if (error.message !== "Aborted") {
            console.error("Compression failed", error);
        }
      } finally {
        if (!controller.signal.aborted) {
            setIsProcessing(false);
            setProgress(0);
        }
      }
    };

    runCompression();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSettings, file, frameUrl]); 

  const isOutputAnimated = file?.type === 'video/mp4' && (settings.format === ImageFormat.WEBM || settings.format === ImageFormat.WEBP);
  const isAnimatedButOutputStatic = (stats.isAnimated || file?.type === 'video/mp4') && settings.format !== ImageFormat.WEBM && settings.format !== ImageFormat.WEBP;

  const handleDownload = () => {
      if (!compressedUrl) return;
      const link = document.createElement('a');
      link.href = compressedUrl;
      const ext = settings.format.split('/')[1];
      link.download = `optipix_compressed${isAnimatedButOutputStatic ? '_frame' : ''}.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const isFileSizeIncreased = stats.compressedSize > stats.originalSize;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 selection:bg-cyan-500/30 flex flex-col">
        {/* Hidden File Input for Re-upload logic */}
        <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleHiddenInputChange} 
            accept="image/*,video/mp4" 
            className="hidden" 
        />

        {/* Header */}
        <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                        Lumishift
                    </span>
                </div>

                <div className="text-sm text-slate-500 hidden sm:block">
                    Browser-Side Secure Compression
                </div>
            </div>
        </header>

        <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
            {!file ? (
                <div className="mt-20">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">
                            Smart Image Compression
                        </h1>
                        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                            Optimize your images for the web. 
                            Lossless and lossy compression processed entirely in your browser.
                        </p>
                    </div>
                    <UploadArea onFileSelect={handleFileSelect} />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* LEFT PANEL: Controls */}
                    <div className="lg:col-span-2 order-2 lg:order-2 h-fit">
                        <SettingsPanel 
                            settings={settings} 
                            onChange={setSettings} 
                            isAnimated={stats.isAnimated}
                            fileType={file.type}
                            onCropClick={() => setIsCropping(true)}
                        />
                        <div className="mt-4">
                             <Button 
                                onClick={handleDownload} 
                                variant={isFileSizeIncreased && !isOutputAnimated ? 'warning' : 'primary'}
                                className="w-full py-4 text-lg"
                                disabled={!compressedUrl}
                             >
                                {isAnimatedButOutputStatic ? 'Download Static Frame' : (isOutputAnimated ? 'Download Animated Media' : (isFileSizeIncreased ? 'Download Anyway (Larger Size)' : 'Download Compressed Image'))}
                             </Button>
                             {isFileSizeIncreased && !isOutputAnimated && (
                                <p className="text-xs text-amber-500 text-center mt-2">
                                    The compressed file is larger than the original. Try reducing Quality, Resolution, or changing Format.
                                </p>
                             )}
                             {isAnimatedButOutputStatic && (
                                <p className="text-xs text-amber-500 text-center mt-2">
                                    Warning: Download will be a single static frame.
                                </p>
                             )}
                        </div>

                        <button 
                            onClick={() => { setFile(null); setOriginalUrl(null); setCompressedUrl(null); }}
                            className="w-full mt-6 py-2 text-sm text-slate-500 hover:text-slate-300 transition-colors"
                        >
                            Upload Different Image
                        </button>
                    </div>

                    {/* RIGHT PANEL: Preview */}
                     <div className="lg:col-span-2 order-1 lg:order-1">
                         {originalUrl && (
                            <PreviewArea 
                                originalUrl={originalUrl} 
                                compressedUrl={compressedUrl} 
                                stats={stats} 
                                isProcessing={isProcessing}
                                progress={progress}
                                onOriginalClick={() => fileInputRef.current?.click()}
                                isVideo={file?.type === 'video/mp4'}
                                outputFormat={debouncedSettings.format}
                            />
                         )}
                     </div>
                </div>
            )}
        </main>

        {isCropping && file && frameUrl && (
            <CropModal
                file={file}
                originalUrl={frameUrl}
                onClose={() => setIsCropping(false)}
                onApply={(croppedFile) => {
                    handleFileSelect(croppedFile);
                    setIsCropping(false);
                }}
            />
        )}
    </div>
  );
};

export default App;