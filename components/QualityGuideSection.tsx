import React from 'react';

const QualityGuideSection: React.FC = () => {
  return (
    <section id="quality-guide" className="py-16 border-t border-slate-800/80">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-800/60 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-4">
          Quality Control & Optimization Guide
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          How to Compress Images or Keep Full Quality
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed">
          Lumishift gives you continuous, precision control over your media. 
          Choose between pristine full-fidelity retention, balanced web optimization, or aggressive byte-reduction.
        </p>
      </div>

      {/* 3 Quality Modes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* Mode 1: Full Quality */}
        <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 flex flex-col justify-between hover:border-emerald-500/50 transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                100% Full Quality
              </span>
              <span className="text-xs font-mono text-slate-400">Lossless / Hi-Fi</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Pristine Quality Mode</h3>
            <p className="text-sm text-slate-300 mb-4 leading-relaxed">
              Preserve every detail with 1:1 pixel fidelity. Strips bloated camera metadata, color profile bloat, and excess headers without altering picture sharpness.
            </p>
            <div className="space-y-2 text-xs text-slate-400 border-t border-slate-700/60 pt-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Quality Slider:</span>
                <span className="font-semibold text-emerald-400">100% (1.0)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Resolution Scale:</span>
                <span className="font-semibold text-emerald-400">100% (Original)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Recommended Format:</span>
                <span className="font-semibold text-slate-200">PNG or Lossless WebP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Best For:</span>
                <span className="text-slate-300">Logos, text art, portfolios, print photography</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mode 2: Balanced */}
        <div className="bg-gradient-to-b from-slate-800/90 to-slate-800/60 border-2 border-cyan-500/70 rounded-2xl p-6 flex flex-col justify-between relative shadow-lg shadow-cyan-950/30">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-md">
            Recommended For Web
          </div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">
                75% – 85% Quality
              </span>
              <span className="text-xs font-mono text-cyan-400">Sweet Spot</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Balanced Web Optimization</h3>
            <p className="text-sm text-slate-300 mb-4 leading-relaxed">
              The golden standard for web performance. Drastically slashes file size by <strong className="text-cyan-300">60% to 80%</strong> while remaining visually indistinguishable to the human eye on desktop and mobile displays.
            </p>
            <div className="space-y-2 text-xs text-slate-400 border-t border-slate-700/60 pt-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Quality Slider:</span>
                <span className="font-semibold text-cyan-400">75% – 85%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Resolution Scale:</span>
                <span className="font-semibold text-cyan-400">100% or target display</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Recommended Format:</span>
                <span className="font-semibold text-slate-200">WebP or JPEG</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Best For:</span>
                <span className="text-slate-300">E-commerce, blogs, landing pages, Core Web Vitals</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mode 3: Max Compression */}
        <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 flex flex-col justify-between hover:border-amber-500/50 transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-amber-950/80 text-amber-400 border border-amber-800/60">
                30% – 60% Quality
              </span>
              <span className="text-xs font-mono text-slate-400">Ultra-Compact</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Maximum Compression</h3>
            <p className="text-sm text-slate-300 mb-4 leading-relaxed">
              When minimal bandwidth and instantaneous loading are paramount. Compresses files by up to <strong className="text-amber-400">90%+</strong>, perfect for low-connectivity networks and massive media feeds.
            </p>
            <div className="space-y-2 text-xs text-slate-400 border-t border-slate-700/60 pt-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Quality Slider:</span>
                <span className="font-semibold text-amber-400">30% – 60%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Resolution Scale:</span>
                <span className="font-semibold text-amber-400">50% – 75%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Recommended Format:</span>
                <span className="font-semibold text-slate-200">WebP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Best For:</span>
                <span className="text-slate-300">Thumbnails, avatars, chat previews, email templates</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deep-Dive Insights: Resolution vs Quality & PNG Quantization */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-cyan-950 rounded-lg text-cyan-400 border border-cyan-800/50">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-base font-bold text-white">Resolution Scaling vs. Compression</h4>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            Modern smartphones capture photos at 4000x3000 pixels (12+ megapixels), yet most desktop monitors and mobile screens only display images at 800 to 1920 pixels wide. 
            Scaling the resolution to <strong>50%–70%</strong> reduces the raw pixel count by up to <strong>75%</strong> with zero perceptible loss in sharpness on digital screens.
          </p>
        </div>

        <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-950 rounded-lg text-purple-400 border border-purple-800/50">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4 4 4 0 014-4h10a4 4 0 014 4 4 4 0 01-4 4H7zM17 13V7a4 4 0 00-8 0v6" />
              </svg>
            </div>
            <h4 className="text-base font-bold text-white">PNG Color Depth & Posterization</h4>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            Browsers re-encode canvas PNGs as 32-bit TrueColor RGBA, which can occasionally make output files larger than indexed originals. 
            Lumishift solves this with our <strong>Color Depth / Quality slider</strong>: when lowered, it quantizes identical colors into uniform bands, enabling DEFLATE to compress PNGs significantly more efficiently.
          </p>
        </div>
      </div>
    </section>
  );
};

export default QualityGuideSection;
