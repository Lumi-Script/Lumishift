import React from 'react';

const formats = [
  {
    format: 'WebP',
    title: 'Google WebP Format',
    badge: 'Recommended for Web',
    badgeColor: 'bg-cyan-950 text-cyan-300 border-cyan-800',
    type: 'Lossy & Lossless',
    transparency: 'Full Alpha Channel',
    animation: 'Supported',
    sizeEfficiency: '25% - 35% smaller than JPEG',
    bestFor: 'Modern websites, web apps, hero banners, and high-performance e-commerce.',
  },
  {
    format: 'JPEG / JPG',
    title: 'Standard JPEG',
    badge: 'Universal Compatibility',
    badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-800',
    type: 'Lossy',
    transparency: 'Not Supported (White BG)',
    animation: 'Not Supported',
    sizeEfficiency: 'Standard Baseline',
    bestFor: 'Photographs, legacy platforms, email newsletters, and cross-platform sharing.',
  },
  {
    format: 'PNG',
    title: 'Portable Network Graphics',
    badge: 'Pixel-Perfect Lossless',
    badgeColor: 'bg-purple-950 text-purple-300 border-purple-800',
    type: 'Lossless (Quantizable)',
    transparency: 'Full Alpha Channel',
    animation: 'Not Supported',
    sizeEfficiency: 'Larger files, maximum crispness',
    bestFor: 'Logos, vector-raster illustrations, user interfaces, screenshots, and text overlays.',
  },
  {
    format: 'WebM',
    title: 'WebM Video Media',
    badge: 'Modern GIF Alternative',
    badgeColor: 'bg-amber-950 text-amber-300 border-amber-800',
    type: 'Video / Animated VP8/VP9',
    transparency: 'Supported',
    animation: 'Native Motion & Loop',
    sizeEfficiency: '80% - 95% smaller than GIF',
    bestFor: 'Animated stickers, UI walkthroughs, screencasts, and lightweight video loops.',
  },
];

const FormatComparisonSection: React.FC = () => {
  return (
    <section id="formats" className="py-16 border-t border-slate-800/80">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold uppercase tracking-wider mb-4">
          Supported Web Formats
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Which Image Format Should You Choose?
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed">
          Compare specifications and find the optimal balance between visual quality, transparency, and page speed.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {formats.map((f, idx) => (
          <div
            key={idx}
            className="bg-slate-800/50 border border-slate-700/70 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-600 transition-all shadow-lg"
          >
            <div>
              <div className="mb-3">
                <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border ${f.badgeColor}`}>
                  {f.badge}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">
                {f.format}
              </h3>
              <p className="text-xs text-slate-400 mb-4">{f.title}</p>

              <div className="space-y-3 text-xs text-slate-300 border-t border-slate-700/60 pt-4">
                <div>
                  <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">Compression Type</span>
                  <span className="font-medium text-slate-200">{f.type}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">Transparency</span>
                  <span className="font-medium text-slate-200">{f.transparency}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">Animation</span>
                  <span className="font-medium text-slate-200">{f.animation}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">Size Efficiency</span>
                  <span className="font-medium text-cyan-300">{f.sizeEfficiency}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">Best Used For</span>
                  <span className="text-slate-300 leading-normal">{f.bestFor}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FormatComparisonSection;
