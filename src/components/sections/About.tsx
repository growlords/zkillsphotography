import React from 'react';
import { studioInfo } from '../../data/studioInfo';
import { Award, Compass, Heart, Film } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <section id="about" className="py-28 sm:py-36 bg-[#EFEBE1] border-b border-[#D9D3C8] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Visual Showcase (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-[#D9D3C8] shadow-2xl bg-[#FAF8F3] group">
              <img
                src="/assets/photos/bridal-masterpiece-4k.jpg"
                alt="Preet Cinematography Masterpiece Bridal Portrait"
                className="w-full h-auto max-h-[640px] object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

              {/* Floating Stamp / Quality Badge */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-white/90 backdrop-blur-md border border-[#D9D3C8] shadow-lg">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#B99A67] block font-semibold">
                  CRAFTED WITH PRECISION
                </span>
                <p className="font-serif text-lg text-[#171614]">
                  Every frame graded to editorial perfection.
                </p>
              </div>
            </div>

            {/* Subtle Accent Glow */}
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-[#B99A67]/15 rounded-full blur-3xl pointer-events-none" />
          </div>

          {/* Right Column: Editorial Text & Philosophy (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <span className="text-[11px] uppercase tracking-widest-2xl text-[#B99A67] font-mono block mb-3 font-semibold">
                ABOUT PREET CINEMATOGRAPHY
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#171614] font-normal leading-[1.12]">
                Behind Every Frame <br className="hidden sm:block" />
                <span className="italic text-shimmer">Is A Story Waiting To Be Felt.</span>
              </h2>
            </div>

            <div className="space-y-4 text-[#6F6A61] text-sm sm:text-base font-sans font-light leading-relaxed">
              <p>
                Founded in Punjab with a relentless passion for visual poetry, Preet Cinematography redefines wedding documentation. We believe wedding cinematography shouldn't look like a routine video tape; it should command the screen like a motion picture film.
              </p>
              <p>
                Our philosophy balances unscripted authenticity with high-fashion editorial rigor. We immerse ourselves in the warmth of your ceremonies—the sacred chants of Anand Karaj, the rhythm of Dholak beats, the quiet tears during Bidai, and the unfiltered euphoria of celebration.
              </p>
            </div>

            {/* Creative Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-[#FAF8F3] border border-[#D9D3C8] shadow-sm">
                <Heart className="w-5 h-5 text-[#B99A67] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif text-base text-[#171614]">Authentic Emotions</h4>
                  <p className="text-xs text-[#6F6A61] mt-0.5 font-sans">
                    Unposed, organic moments that reveal the true intimacy of your bonds.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-[#FAF8F3] border border-[#D9D3C8] shadow-sm">
                <Film className="w-5 h-5 text-[#B99A67] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif text-base text-[#171614]">Cinematic Storytelling</h4>
                  <p className="text-xs text-[#6F6A61] mt-0.5 font-sans">
                    Masterful multi-layered pacing, ambient soundscapes, and orchestral score sync.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-[#FAF8F3] border border-[#D9D3C8] shadow-sm">
                <Compass className="w-5 h-5 text-[#B99A67] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif text-base text-[#171614]">Location & Scenery</h4>
                  <p className="text-xs text-[#6F6A61] mt-0.5 font-sans">
                    Dramatic backdrops from historic havelis to sunlit blooming fields.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-[#FAF8F3] border border-[#D9D3C8] shadow-sm">
                <Award className="w-5 h-5 text-[#B99A67] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif text-base text-[#171614]">Color & Mastery</h4>
                  <p className="text-xs text-[#6F6A61] mt-0.5 font-sans">
                    Custom cinematic 3D LUTs calibrated for rich skin tones and gold jewels.
                  </p>
                </div>
              </div>
            </div>

            {/* Numbers & Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-[#D9D3C8]">
              {studioInfo.stats.map((stat, i) => (
                <div key={i} className="space-y-1">
                  <div className="font-serif text-3xl sm:text-4xl text-[#171614] flex items-baseline">
                    <span>{stat.value}</span>
                    <span className="text-[#B99A67] text-2xl font-normal">{stat.suffix}</span>
                  </div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#6F6A61] block font-medium">
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
