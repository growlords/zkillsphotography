import React from 'react';
import { studioInfo } from '../../data/studioInfo';
import { Award, Compass, Heart, Film } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <section id="about" className="py-28 sm:py-36 bg-dark-950 border-b border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Visual Showcase (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-dark-900 group">
              <img
                src="/assets/photos/bridal-masterpiece-4k.jpg"
                alt="Preet Cinematography Masterpiece Bridal Portrait"
                className="w-full h-auto max-h-[640px] object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent opacity-80" />

              {/* Floating Stamp / Quality Badge */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-dark-900/80 backdrop-blur-md border border-white/10">
                <span className="text-[10px] uppercase font-mono tracking-widest text-champagne block">
                  CRAFTED WITH PRECISION
                </span>
                <p className="font-serif text-lg text-pearl">
                  Every frame graded to editorial perfection.
                </p>
              </div>
            </div>

            {/* Subtle Accent Glow */}
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-champagne/10 rounded-full blur-3xl pointer-events-none" />
          </div>

          {/* Right Column: Editorial Text & Philosophy (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <span className="text-[11px] uppercase tracking-widest-2xl text-champagne font-mono block mb-3">
                ABOUT PREET CINEMATOGRAPHY
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-pearl font-normal leading-[1.12]">
                Behind Every Frame <br className="hidden sm:block" />
                <span className="italic text-shimmer">Is A Story Waiting To Be Felt.</span>
              </h2>
            </div>

            <div className="space-y-4 text-pearl-muted text-sm sm:text-base font-sans font-light leading-relaxed">
              <p>
                Founded in Punjab with a relentless passion for visual poetry, Preet Cinematography redefines wedding documentation. We believe wedding cinematography shouldn't look like a routine video tape; it should command the screen like a motion picture film.
              </p>
              <p>
                Our philosophy balances unscripted authenticity with high-fashion editorial rigor. We immerse ourselves in the warmth of your ceremonies—the sacred chants of Anand Karaj, the rhythm of Dholak beats, the quiet tears during Bidai, and the unfiltered euphoria of celebration.
              </p>
            </div>

            {/* Creative Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-dark-900/60 border border-white/5">
                <Heart className="w-5 h-5 text-champagne shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif text-base text-pearl">Authentic Emotions</h4>
                  <p className="text-xs text-pearl-muted mt-0.5 font-sans">
                    Unposed, organic moments that reveal the true intimacy of your bonds.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-dark-900/60 border border-white/5">
                <Film className="w-5 h-5 text-champagne shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif text-base text-pearl">Cinematic Storytelling</h4>
                  <p className="text-xs text-pearl-muted mt-0.5 font-sans">
                    Masterful multi-layered pacing, ambient soundscapes, and orchestral score sync.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-dark-900/60 border border-white/5">
                <Compass className="w-5 h-5 text-champagne shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif text-base text-pearl">Location & Scenery</h4>
                  <p className="text-xs text-pearl-muted mt-0.5 font-sans">
                    Dramatic backdrops from historic havelis to sunlit blooming fields.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-dark-900/60 border border-white/5">
                <Award className="w-5 h-5 text-champagne shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif text-base text-pearl">Color & Mastery</h4>
                  <p className="text-xs text-pearl-muted mt-0.5 font-sans">
                    Custom cinematic 3D LUTs calibrated for rich skin tones and gold jewels.
                  </p>
                </div>
              </div>
            </div>

            {/* Numbers & Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-white/10">
              {studioInfo.stats.map((stat, i) => (
                <div key={i} className="space-y-1">
                  <div className="font-serif text-3xl sm:text-4xl text-pearl flex items-baseline">
                    <span>{stat.value}</span>
                    <span className="text-champagne text-2xl">{stat.suffix}</span>
                  </div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-pearl-muted block">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
