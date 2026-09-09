import React from 'react';
import { Camera, Film, Sparkles, Award } from 'lucide-react';
import { studioInfo } from '../../data/studioInfo';

export const BrandIntro: React.FC = () => {
  return (
    <section className="relative py-28 sm:py-36 bg-dark overflow-hidden border-b border-white/5">
      {/* Subtle background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-champagne/[0.03] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 sm:px-8 relative z-10">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Studio Tag */}
          <div className="flex items-center gap-3">
            <span className="h-[1px] w-12 bg-champagne/40" />
            <span className="text-[11px] uppercase tracking-widest-2xl text-champagne font-mono">
              THE MANIFESTO
            </span>
            <span className="h-[1px] w-12 bg-champagne/40" />
          </div>

          {/* Core Brand Statement */}
          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-pearl font-normal leading-[1.18] max-w-4xl tracking-tight">
            “We don't just capture moments.
            <br className="hidden sm:block" />
            <span className="text-shimmer italic"> We turn them into memories that move.”</span>
          </h2>

          {/* Description Paragraph */}
          <p className="font-sans text-sm sm:text-base md:text-lg text-pearl-muted max-w-3xl leading-relaxed font-light pt-2">
            {studioInfo.name} is a boutique visual storytelling house founded on the principle that real love, cultural grandeur, and timeless human bonds deserve an editorial canvas. Specializing in luxury weddings, intimate Anand Karaj ceremonies, cinematic pre-weddings, and high-impact social reels, we blend fine-art composition with contemporary motion design.
          </p>

          {/* Highlights Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-12 w-full max-w-4xl">
            <div className="p-6 rounded-2xl bg-dark-900/60 border border-white/5 text-center flex flex-col items-center">
              <Film className="w-5 h-5 text-champagne mb-3" />
              <span className="font-serif text-lg text-pearl">Cinematic Grade</span>
              <span className="text-[11px] text-pearl-muted mt-1 font-mono">24fps 4K Mastered</span>
            </div>

            <div className="p-6 rounded-2xl bg-dark-900/60 border border-white/5 text-center flex flex-col items-center">
              <Camera className="w-5 h-5 text-champagne mb-3" />
              <span className="font-serif text-lg text-pearl">Editorial Stills</span>
              <span className="text-[11px] text-pearl-muted mt-1 font-mono">Fine-Art Lighting</span>
            </div>

            <div className="p-6 rounded-2xl bg-dark-900/60 border border-white/5 text-center flex flex-col items-center">
              <Sparkles className="w-5 h-5 text-champagne mb-3" />
              <span className="font-serif text-lg text-pearl">Color Artistry</span>
              <span className="text-[11px] text-pearl-muted mt-1 font-mono">Warm Golden Palettes</span>
            </div>

            <div className="p-6 rounded-2xl bg-dark-900/60 border border-white/5 text-center flex flex-col items-center">
              <Award className="w-5 h-5 text-champagne mb-3" />
              <span className="font-serif text-lg text-pearl">Bespoke Stories</span>
              <span className="text-[11px] text-pearl-muted mt-1 font-mono">Tailored to You</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
