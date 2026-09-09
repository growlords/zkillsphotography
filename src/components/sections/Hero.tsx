import React, { useRef, useState } from 'react';
import { Volume2, VolumeX, ArrowDown, Play } from 'lucide-react';
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

      {/* Cinematic Multi-layered Dark Vignette & Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/60 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60 pointer-events-none" />
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />

      {/* Smooth bottom transition gradient into the warm ivory page theme */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#F5F2EA] to-transparent pointer-events-none z-10" />

      {/* Center Cinematic Content */}
      <div className="relative z-20 max-w-5xl mx-auto px-6 text-center flex flex-col items-center justify-center space-y-6 sm:space-y-8 pt-16">
        {/* Brand Tagline Header */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#DEC5A3]/40 bg-black/60 backdrop-blur-md shadow-lg">
          <span className="w-2 h-2 rounded-full bg-[#DEC5A3] animate-ping" />
          <span className="text-[10px] sm:text-xs tracking-widest-2xl uppercase text-[#DEC5A3] font-mono font-medium">
            PREET CINEMATOGRAPHY
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-white font-normal leading-[1.08] max-w-4xl drop-shadow-2xl">
          Stories That Feel Like <span className="italic font-light text-[#DEC5A3]">Cinema.</span>
        </h1>

        {/* Supporting Subtitle */}
        <p className="font-sans text-xs sm:text-sm md:text-base tracking-widest text-white/90 uppercase max-w-2xl font-normal leading-relaxed drop-shadow-md">
          Wedding Films <span className="text-[#DEC5A3]">•</span> Photography <span className="text-[#DEC5A3]">•</span> Pre-Weddings <span className="text-[#DEC5A3]">•</span> Events <span className="text-[#DEC5A3]">•</span> Reels
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 sm:pt-6 w-full sm:w-auto">
          <MagneticBtn
            onClick={onExploreClick}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#B99A67] hover:bg-[#A38350] text-white font-sans font-semibold text-xs tracking-widest uppercase shadow-xl hover:shadow-[#B99A67]/30 transition-all"
            data-cursor="open"
            data-cursor-label="EXPLORE"
          >
            <span>Explore Our Work</span>
          </MagneticBtn>

          <MagneticBtn
            onClick={onContactClick}
            className="w-full sm:w-auto px-8 py-4 rounded-full border border-white/35 hover:border-[#DEC5A3] bg-black/50 hover:bg-black/70 backdrop-blur-md text-white hover:text-[#DEC5A3] font-sans font-medium text-xs tracking-widest uppercase transition-all shadow-md"
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
          className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 text-white/90 hover:text-[#DEC5A3] text-xs font-mono backdrop-blur-md transition-all duration-300 shadow-md"
          aria-label={isMuted ? 'Unmute background film' : 'Mute background film'}
          data-cursor="open"
          data-cursor-label={isMuted ? 'SOUND ON' : 'MUTE'}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#DEC5A3]" />}
          <span>{isMuted ? 'AUDIO OFF' : 'AUDIO ON'}</span>
        </button>
      </div>

      {/* Watch Hero Film in Fullscreen Button (Bottom Right) */}
      <div className="absolute bottom-8 right-8 z-30 hidden sm:block">
        <button
          onClick={onPlayFilm}
          className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-black/60 hover:bg-[#B99A67] text-white border border-white/20 text-xs font-mono backdrop-blur-md transition-all duration-300 group shadow-md"
          data-cursor="play"
          data-cursor-label="WATCH"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>FULL CINEMA CUT</span>
        </button>
      </div>

      {/* Subtle Scroll Indicator (Center Bottom) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/80 hover:text-[#DEC5A3] transition-colors pointer-events-none">
        <span className="text-[9px] tracking-widest-2xl font-mono uppercase">SCROLL</span>
        <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
      </div>
    </section>
  );
};
