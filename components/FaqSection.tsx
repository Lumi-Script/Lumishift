import React, { useState } from 'react';

export interface FaqItem {
  question: string;
  answer: string;
}

export const faqs: FaqItem[] = [
  {
    question: 'Are my images or videos ever uploaded to any server?',
    answer:
      'Never. Lumishift is a 100% browser-side application. When you drop a file, it is read into your browser memory using the FileReader and HTML5 Canvas APIs or decoded via client-side WebAssembly. All compression, scaling, cropping, and encoding operations happen entirely locally on your CPU/GPU. No remote server ever sees or stores your data.',
  },
  {
    question: 'How do I compress an image while keeping full quality?',
    answer:
      'In the Settings panel, set the Quality slider to 100% and ensure the Resolution (Resize) slider is set to 100%. For lossless output without any artifacting, select the PNG format or Lossless WebP. If you convert to JPEG or WebP at 100% quality, Lumishift strips bloated EXIF metadata, camera tags, and thumbnail containers while retaining full pixel fidelity.',
  },
  {
    question: 'What is the recommended compression setting for web performance?',
    answer:
      'For general web pages, blogs, and e-commerce websites, setting the format to WebP with a Quality value between 75% and 85% delivers the best balance. This typically reduces file weight by 60% to 80% while remaining visually indistinguishable from the original to human eyes, significantly boosting Google PageSpeed Insights and Core Web Vitals (Largest Contentful Paint).',
  },
  {
    question: 'Why did my PNG file size increase after compression?',
    answer:
      'Web browsers export PNGs from canvas as uncompressed 32-bit TrueColor RGBA by default. If your input PNG had an 8-bit indexed palette (e.g., from pngquant), a basic canvas re-export can increase the byte count. Lumishift features an intelligent "Color Depth / Quality" slider for PNGs that performs real-time color posterization, reducing redundant palette data so that DEFLATE can compress the PNG effectively in your browser.',
  },
  {
    question: 'How does resolution scaling help reduce file size?',
    answer:
      'Modern digital cameras and phone cameras capture images at 4000x3000 pixels or higher, but most website containers display images at 600px to 1920px width. Scaling resolution down to 50% reduces total pixel count by 75%, resulting in a massive file size reduction without any visible loss of sharpness when viewed on digital screens.',
  },
  {
    question: 'Can Lumishift convert animated WebP and MP4 video files?',
    answer:
      'Yes. Lumishift includes client-side media detection for animated WebP images and MP4 videos. You can compress animated content directly into modern, lightweight WebM format using browser-side WebAssembly, or extract high-resolution static frames as JPEG or PNG.',
  },
  {
    question: 'Is Lumishift completely free to use?',
    answer:
      'Yes, Lumishift is completely free and open-source. Because all processing is performed on your own device rather than on expensive cloud servers, there are no subscription fees, no artificial file size limits, no daily quotas, and no watermarks.',
  },
  {
    question: 'Does Lumishift work offline without an internet connection?',
    answer:
      'Yes. Once the web application is loaded in your browser tab, all compression and conversion scripts reside in your local cache. You can disconnect from the internet or use airplane mode, and Lumishift will continue to optimize your images seamlessly.',
  },
];

const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-16 border-t border-slate-800/80">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold uppercase tracking-wider mb-4">
          Got Questions?
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed">
          Learn how client-side compression works, how to choose quality settings, and how Lumishift safeguards your privacy.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-slate-800/50 border border-slate-700/70 rounded-2xl overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                aria-expanded={isOpen}
              >
                <span className="text-base sm:text-lg font-semibold text-slate-100">
                  {faq.question}
                </span>
                <span className={`p-1.5 rounded-lg bg-slate-700/60 text-slate-300 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180 text-cyan-400' : ''}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              {isOpen && (
                <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-slate-300 leading-relaxed border-t border-slate-700/40">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FaqSection;
