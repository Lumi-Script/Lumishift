import React from 'react';
import { CompressionSettings, ImageFormat } from '../types';
import Button from './Button';

interface SettingsPanelProps {
  settings: CompressionSettings;
  onChange: (settings: CompressionSettings) => void;
  isAnimated?: boolean;
  fileType?: string;
  onCropClick: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
  settings, 
  onChange, 
  isAnimated,
  fileType,
  onCropClick
}) => {
  const handleChange = (key: keyof CompressionSettings, value: any) => {
    onChange({ ...settings, [key]: value });
  };

  const isPng = settings.format === ImageFormat.PNG;

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 h-full flex flex-col space-y-6 shadow-xl">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
            Settings
        </h2>
        <button
          onClick={onCropClick}
          className="text-sm px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex items-center gap-1 border border-slate-600"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
          Crop Image
        </button>
      </div>

      {/* Format Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-slate-400">Format</label>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(ImageFormat).map(([key, value]) => (
            <button
              key={value}
              onClick={() => handleChange('format', value)}
              className={`px-3 py-2 text-sm rounded-lg font-medium transition-colors ${
                settings.format === value
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/50'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {key}
            </button>
          ))}
        </div>
        {isPng && (
           <p className="text-xs text-amber-400/80 mt-1">
             ⚠️ Note: Browsers export PNGs as 32-bit TrueColor. This may increase file size compared to optimized inputs unless you reduce Quality/Resolution.
           </p>
        )}
        {((isAnimated && settings.format !== ImageFormat.WEBM && settings.format !== ImageFormat.WEBP) || (fileType === 'video/mp4' && settings.format !== ImageFormat.WEBM && settings.format !== ImageFormat.WEBP)) && (
            <div className="p-3 bg-amber-900/30 border border-amber-600/50 rounded-lg flex items-start gap-2">
                <svg className="w-5 h-5 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-xs text-amber-200">
                    <b>Animated Media Detected.</b> The selected format only supports static frames. The output will be a single non-animated image.
                </p>
            </div>
        )}
      </div>

      {/* Quality Slider */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-slate-400">
                {isPng ? "Color Depth / Quality" : "Quality"}
            </label>
            <span className="text-sm font-mono text-cyan-400">{Math.round(settings.quality * 100)}%</span>
        </div>
        <input
          type="range"
          min="1"
          max="100"
          value={settings.quality * 100}
          onChange={(e) => handleChange('quality', parseInt(e.target.value) / 100)}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
        />
        <div className="flex justify-between text-xs text-slate-500">
            <span>{isPng ? "Fewer Colors" : "Low"}</span>
            <span>{isPng ? "Reduced" : "Balanced"}</span>
            <span>{isPng ? "Full Color" : "High"}</span>
        </div>
        {isPng && settings.quality < 1 && (
            <p className="text-xs text-slate-500">
                Reduces unique colors to help compression.
            </p>
        )}
      </div>

      {/* Scale Slider */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-slate-400">Resolution (Resize)</label>
            <span className="text-sm font-mono text-cyan-400">{Math.round(settings.scale * 100)}%</span>
        </div>
        <input
          type="range"
          min="10"
          max="100"
          step="10"
          value={settings.scale * 100}
          onChange={(e) => handleChange('scale', parseInt(e.target.value) / 100)}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
        />
      </div>
    </div>
  );
};

export default SettingsPanel;