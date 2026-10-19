import React from 'react';

const features = [
  {
    title: '100% Browser-Side & Private',
    description:
      'Zero files uploaded to external servers. All decoding, compression, and encoding run locally in your browser memory using HTML5 Canvas and WebAssembly. Your photos, private documents, and client assets never leave your device.',
    icon: (
      <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    badge: 'Zero Uploads',
  },
  {
    title: 'Full Quality or Ultra-Compressed',
    description:
      'Total flexibility over output fidelity. Keep 100% full original quality for crisp archival and print preservation, or dial in the sweet spot (75%–85%) for dramatic 70%+ file size reduction without perceptible loss.',
    icon: (
      <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
    badge: 'Granular Controls',
  },
  {
    title: 'Modern Format Conversion',
    description:
      'Seamlessly convert between next-gen WebP, standard JPEG, transparent PNG, and WebM video. WebP delivers 25%–35% smaller file sizes compared to JPEG at equivalent visual fidelity.',
    icon: (
      <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    badge: 'WebP / JPG / PNG / WebM',
  },
  {
    title: 'Smart PNG Color Quantization',
    description:
      'Standard browser exports convert PNGs to uncompressed 32-bit TrueColor, which can bloat file sizes. Lumishift applies intelligent color posterization to reduce palette redundancy and achieve real in-browser compression.',
    icon: (
      <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4 4 4 0 014-4h10a4 4 0 014 4 4 4 0 01-4 4H7zM17 13V7a4 4 0 00-8 0v6" />
      </svg>
    ),
    badge: 'Anti-Bloat Tech',
  },
  {
    title: 'Resolution Scaling & Interactive Crop',
    description:
      'Downscale oversized camera and smartphone photos (10% to 100%) with high-grade bicubic smoothing. Built-in interactive crop allows you to re-frame images and eliminate unwanted margins before compressing.',
    icon: (
      <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
      </svg>
    ),
    badge: 'Crop & Resize',
  },
  {
    title: 'Real-Time Live Comparison & Metrics',
    description:
      'Inspect before-and-after results side-by-side with live synchronized playback for animated media. Track exact byte counts, resolution changes, and percentage savings instantly before saving.',
    icon: (
      <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    badge: 'Live Preview',
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-16 border-t border-slate-800/80">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-4">
          Built For Modern Web Performance
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Why Optimize Images With Lumishift?
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed">
          Traditional image compressors upload your sensitive media to external cloud servers. 
          Lumishift executes all compression, format conversion, and scaling <span className="text-cyan-300 font-medium">100% inside your browser</span>—providing unmatched speed, complete privacy, and zero file-size limitations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="group relative bg-slate-800/50 hover:bg-slate-800/80 border border-slate-700/70 hover:border-cyan-500/50 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-cyan-950/20"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/80 group-hover:scale-105 transition-transform duration-300">
                  {feature.icon}
                </div>
                <span className="text-[11px] font-semibold text-slate-400 bg-slate-900/60 border border-slate-700/50 px-2.5 py-1 rounded-full">
                  {feature.badge}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
