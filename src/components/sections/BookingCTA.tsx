import React from 'react';
import { MagneticBtn } from '../common/MagneticBtn';
import { Sparkles, Calendar } from 'lucide-react';

interface BookingCTAProps {
  onStartStoryClick: () => void;
}

export const BookingCTA: React.FC<BookingCTAProps> = ({ onStartStoryClick }) => {
  return (
    <section className="relative py-32 sm:py-44 overflow-hidden border-b border-white/5 flex items-center justify-center">
      {/* Background Image with Cinematic Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/photos/royal-vintage-1.jpg"
          alt="Cinematic Romance Background"
          className="w-full h-full object-cover scale-105 filter brightness-[0.35] contrast-[1.1]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/70 to-dark" />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 text-center flex flex-col items-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-champagne/30 bg-dark-950/70 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-champagne" />
          <span className="text-[10px] sm:text-xs tracking-widest-2xl uppercase text-champagne font-mono">
            LIMITED WEDDING CALENDAR 2026–2027
          </span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl md:text-7xl text-pearl font-normal leading-[1.1] max-w-3xl tracking-tight">
          Your Story Deserves <br />
          <span className="italic text-shimmer">More Than A Camera.</span>
        </h2>

        <p className="font-sans text-sm sm:text-base md:text-lg text-pearl-muted max-w-xl leading-relaxed font-light">
          Let’s turn your moments into something you’ll want to relive forever. Dates book 6 to 12 months in advance to ensure our dedicated attention.
        </p>

        <div className="pt-4">
          <MagneticBtn
            onClick={onStartStoryClick}
            className="px-9 py-4.5 rounded-full bg-champagne hover:bg-champagne-light text-dark font-sans font-semibold text-xs tracking-widest uppercase shadow-2xl hover:shadow-champagne/30 transition-all flex items-center gap-2 group"
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
