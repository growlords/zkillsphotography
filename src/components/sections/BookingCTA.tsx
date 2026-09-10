import React from 'react';
import { MagneticBtn } from '../common/MagneticBtn';
import { Sparkles, Calendar } from 'lucide-react';
import { useSiteContent } from '../../context/SiteContentContext';

interface BookingCTAProps {
  onStartStoryClick: () => void;
}

export const BookingCTA: React.FC<BookingCTAProps> = ({ onStartStoryClick }) => {
  const { content } = useSiteContent();
  const ctaHeadline = content?.contact?.ctaHeadline || "Begin Your Visual Legacy.";
  const ctaDesc = content?.contact?.ctaDescription || "Let’s turn your moments into something you’ll want to relive forever. Dates book 6 to 12 months in advance to ensure our dedicated attention.";

  return (
    <section className="relative py-32 sm:py-44 overflow-hidden border-b border-white/10 flex items-center justify-center bg-black">
      {/* Background Image with Cinematic Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/photos/royal-vintage-1.jpg"
          alt="Cinematic Romance Background"
          className="w-full h-full object-cover scale-105 filter brightness-[0.25] contrast-[1.15]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Smooth top and bottom transitions */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#0B0B0E] to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#080808] to-transparent pointer-events-none z-10" />

      {/* Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 text-center flex flex-col items-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-champagne/40 bg-black/60 backdrop-blur-md shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-champagne" />
          <span className="text-[10px] sm:text-xs tracking-widest-2xl uppercase text-champagne font-mono font-medium">
            LIMITED WEDDING CALENDAR 2026–2027
          </span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl md:text-7xl text-white font-normal leading-[1.1] max-w-3xl tracking-tight drop-shadow-xl">
          {ctaHeadline === "Your Story Deserves More Than A Camera." || ctaHeadline === "Begin Your Visual Legacy." ? (
            <>
              Your Story Deserves <br />
              <span className="italic text-champagne">More Than A Camera.</span>
            </>
          ) : (
            ctaHeadline
          )}
        </h2>

        <p className="font-sans text-sm sm:text-base md:text-lg text-pearl/90 max-w-xl leading-relaxed font-light drop-shadow-md">
          {ctaDesc}
        </p>

        <div className="pt-4">
          <MagneticBtn
            onClick={onStartStoryClick}
            className="px-9 py-4.5 rounded-full bg-champagne hover:bg-champagne-dark text-black font-sans font-semibold text-xs tracking-widest uppercase shadow-2xl hover:shadow-champagne/30 transition-all flex items-center gap-2 group"
            data-cursor="open"
            data-cursor-label="RESERVE"
          >
            <Calendar className="w-4 h-4" />
            <span>Start Your Story</span>
          </MagneticBtn>
        </div>
      </div>
    </section>
  );
};
