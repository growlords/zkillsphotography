import React, { useRef, useState } from 'react';
import { Volume2, VolumeX, ArrowDown, Play, Sparkles } from 'lucide-react';
import { MagneticBtn } from '../common/MagneticBtn';

interface HeroProps {
  onExploreClick: () => void;
  onContactClick: () => void;
  onPlayFilm: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreClick,
  onContactClick,
  onPlayFilm,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <section
      id="hero"
      className="relative w-full h-screen min-h-[640px] flex items-center justify-center overflow-hidden bg-black select-none"
    >
      {/* Background Hero Video */}
      <video
        ref={videoRef}
        src="/assets/hero/hero-stream.mp4"
        poster="/assets/hero/hero-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover scale-[1.03] transition-transform duration-1000 ease-out"
      />

      {/* Cinematic Multi-layered Vignette & Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/40 to-dark/60 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-dark/80 via-transparent to-dark/80 pointer-events-none" />
      <div className="absolute inset-0 bg-black/25 pointer-events-none" />

      {/* Center Cinematic Content */}
      <div className="relative z-20 max-w-5xl mx-auto px-6 text-center flex flex-col items-center justify-center space-y-6 sm:space-y-8 pt-16">
        {/* Brand Tagline Header */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-champagne/30 bg-dark-900/60 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-champagne animate-ping" />
          <span className="text-[10px] sm:text-xs tracking-widest-2xl uppercase text-champagne font-mono">
            PREET CINEMATOGRAPHY
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-pearl font-normal leading-[1.08] max-w-4xl drop-shadow-2xl">
          Stories That Feel Like <span className="italic font-light text-shimmer">Cinema.</span>
        </h1>

        {/* Supporting Subtitle */}
        <p className="font-sans text-xs sm:text-sm md:text-base tracking-widest text-pearl-muted uppercase max-w-2xl font-normal leading-relaxed drop-shadow-md">
          Wedding Films <span className="text-champagne">•</span> Photography <span className="text-champagne">•</span> Pre-Weddings <span className="text-champagne">•</span> Events <span className="text-champagne">•</span> Reels
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 sm:pt-6 w-full sm:w-auto">
          <MagneticBtn
            onClick={onExploreClick}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-champagne hover:bg-champagne-light text-dark font-sans font-semibold text-xs tracking-widest uppercase shadow-xl hover:shadow-champagne/25"
            data-cursor="open"
            data-cursor-label="EXPLORE"
          >
            <span>Explore Our Work</span>
          </MagneticBtn>

          <MagneticBtn
            onClick={onContactClick}
            className="w-full sm:w-auto px-8 py-4 rounded-full border border-white/25 hover:border-champagne bg-dark-900/50 hover:bg-dark-800 backdrop-blur-md text-pearl hover:text-champagne font-sans font-medium text-xs tracking-widest uppercase transition-colors"
            data-cursor="open"
            data-cursor-label="BOOK"
          >
            <span>Let's Create Something</span>
          </MagneticBtn>
        </div>
      </div>

      {/* Audio Toggle Button (Bottom Left) */}
      <div className="absolute bottom-8 left-8 z-30 hidden sm:block">
        <button
          onClick={toggleSound}
          className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-dark-900/70 hover:bg-dark-800 border border-white/10 text-pearl-muted hover:text-champagne text-xs font-mono backdrop-blur-md transition-all duration-300"
          aria-label={isMuted ? 'Unmute background film' : 'Mute background film'}
          data-cursor="open"
          data-cursor-label={isMuted ? 'SOUND ON' : 'MUTE'}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-champagne" />}
          <span>{isMuted ? 'AUDIO OFF' : 'AUDIO ON'}</span>
        </button>
      </div>

      {/* Watch Hero Film in Fullscreen Button (Bottom Right) */}
      <div className="absolute bottom-8 right-8 z-30 hidden sm:block">
        <button
          onClick={onPlayFilm}
          className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-dark-900/70 hover:bg-champagne hover:text-dark border border-white/10 text-pearl text-xs font-mono backdrop-blur-md transition-all duration-300 group"
          data-cursor="play"
          data-cursor-label="WATCH"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>FULL CINEMA CUT</span>
        </button>
      </div>

      {/* Subtle Scroll Indicator (Center Bottom) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-pearl-muted/60 hover:text-champagne transition-colors pointer-events-none">
        <span className="text-[9px] tracking-widest-2xl font-mono uppercase">SCROLL</span>
        <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
      </div>
    </section>
  );
};
