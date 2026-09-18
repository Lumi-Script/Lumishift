import React, { useRef, useState } from 'react';

interface UploadAreaProps {
  onFileSelect: (file: File) => void;
}

const UploadArea: React.FC<UploadAreaProps> = ({ onFileSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcess(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcess(e.target.files[0]);
    }
  };

  const validateAndProcess = (file: File) => {
    if (file.type.startsWith('image/')) {
      onFileSelect(file);
    } else {
      alert('Please upload a valid image file.');
    }
  };

  return (
    <div 
      className={`relative group cursor-pointer flex flex-col items-center justify-center w-full max-w-2xl mx-auto h-64 rounded-2xl border-2 border-dashed transition-all duration-300 ${
        isDragging 
          ? 'border-cyan-400 bg-cyan-900/10 scale-[1.02]' 
          : 'border-slate-600 hover:border-cyan-500/50 hover:bg-slate-800/50 bg-slate-800/20'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileInput} 
        accept="image/*" 
        className="hidden" 
      />
      
      <div className="flex flex-col items-center text-center p-6 space-y-4">
        <div className={`p-4 rounded-full bg-slate-700/50 group-hover:bg-cyan-500/20 transition-colors ${isDragging ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 group-hover:text-cyan-400'}`}>
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
            <p className="text-lg font-medium text-slate-200">
                Click or drag image to upload
            </p>
            <p className="text-sm text-slate-400 mt-1">
                Supports JPG, PNG, WebP
            </p>
        </div>
      </div>
    </div>
  );
};

export default UploadArea;