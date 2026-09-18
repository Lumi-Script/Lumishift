import React, { useState, useRef } from 'react';
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop, convertToPixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Button from './Button';

interface Area { width: number; height: number; x: number; y: number; }

export const getCroppedImg = async (imageSrc: string, pixelCrop: Area, mimeType: string = 'image/jpeg'): Promise<File> => {
    const img = new Image();
    img.src = imageSrc;
    await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
    });

    const canvas = document.createElement('canvas');
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error("No 2d context");

    ctx.drawImage(
        img,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    );

    return new Promise((resolve, reject) => {
        canvas.toBlob(blob => {
            if (!blob) return reject(new Error("Canvas empty"));
            const extension = mimeType.split('/')[1] || 'jpeg';
            resolve(new File([blob], `cropped.${extension}`, { type: mimeType }));
        }, mimeType, 1);
    });
};

const ASPECT_RATIOS = [
    { label: 'Free', value: undefined },
    { label: '1:1', value: 1 },
    { label: '4:3', value: 4/3 },
    { label: '3:4', value: 3/4 },
    { label: '16:9', value: 16/9 },
    { label: '9:16', value: 9/16 },
];

interface CropModalProps {
    file: File;
    originalUrl: string;
    onClose: () => void;
    onApply: (croppedFile: File) => void;
}

export const CropModal: React.FC<CropModalProps> = ({ file, originalUrl, onClose, onApply }) => {
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const [aspect, setAspect] = useState<number | undefined>(undefined);
    const imgRef = useRef<HTMLImageElement>(null);

    const handleAspectClick = (newAspect: number | undefined) => {
        setAspect(newAspect);
        if (!imgRef.current) return;
        const { width, height } = imgRef.current;
        
        let newCrop: Crop;
        if (newAspect) {
            newCrop = centerCrop(
                makeAspectCrop({ unit: '%', width: 90 }, newAspect, width, height),
                width,
                height
            );
        } else {
            newCrop = { unit: '%', width: 100, height: 100, x: 0, y: 0 };
        }
        
        setCrop(newCrop);
        setCompletedCrop(convertToPixelCrop(newCrop, width, height));
    };

    const handleApply = async () => {
        if (!imgRef.current) return;
        
        const image = imgRef.current;
        let pixelCrop: Area;

        if (!completedCrop || completedCrop.width === 0 || completedCrop.height === 0) {
            // Fallback to the whole image if no crop selected
            pixelCrop = {
                x: 0,
                y: 0,
                width: image.naturalWidth,
                height: image.naturalHeight,
            };
        } else {
            const scaleX = image.naturalWidth / image.width;
            const scaleY = image.naturalHeight / image.height;

            pixelCrop = {
                x: Math.floor(completedCrop.x * scaleX),
                y: Math.floor(completedCrop.y * scaleY),
                width: Math.floor(completedCrop.width * scaleX),
                height: Math.floor(completedCrop.height * scaleY),
            };
        }

        try {
            const croppedFile = await getCroppedImg(originalUrl, pixelCrop, file.type);
            onApply(croppedFile);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
                <div className="p-4 border-b border-slate-800 flex justify-between items-center shrink-0">
                    <h2 className="text-xl font-bold text-white">Crop Image</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                
                <div className="flex-grow min-h-0 bg-slate-950 flex items-center justify-center p-4">
                    <ReactCrop
                        crop={crop}
                        onChange={(c) => setCrop(c)}
                        onComplete={(c) => setCompletedCrop(c)}
                        aspect={aspect}
                    >
                        <img 
                            ref={imgRef}
                            src={originalUrl} 
                            style={{ maxHeight: 'calc(90vh - 200px)', maxWidth: '100%' }}
                            alt="Crop preview"
                            onLoad={(e) => {
                                const { width, height } = e.currentTarget;
                                // set a default full-size crop if none exists
                                if (!crop) {
                                    const newCrop: Crop = { unit: '%', width: 100, height: 100, x: 0, y: 0 };
                                    setCrop(newCrop);
                                    setCompletedCrop(convertToPixelCrop(newCrop, width, height));
                                }
                            }}
                        />
                    </ReactCrop>
                </div>
                
                <div className="p-6 bg-slate-800 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between border-t border-slate-700 shrink-0 overflow-y-auto">
                    <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                        {ASPECT_RATIOS.map((ratio) => (
                            <button
                                key={ratio.label}
                                onClick={() => handleAspectClick(ratio.value)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                    aspect === ratio.value ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                }`}
                            >
                                {ratio.label}
                            </button>
                        ))}
                    </div>
                    
                    <div className="flex gap-3 w-full sm:w-auto mt-4 sm:mt-0">
                        <Button variant="secondary" onClick={onClose} className="flex-1 sm:flex-none">Cancel</Button>
                        <Button onClick={handleApply} className="flex-1 sm:flex-none">Apply Crop</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};