import React, { useEffect, useRef, useState } from 'react';
import { X, Play, Pause, Volume2, VolumeX, ChevronLeft, ChevronRight, Maximize } from 'lucide-react';

export interface LightboxData {
  type: 'video' | 'image';
  src: string;
  title: string;
  category?: string;
  location?: string;
  year?: string;
  description?: string;
  gallery?: string[];
  initialIndex?: number;
}

interface LightboxProps {
  data: LightboxData | null;
  onClose: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({ data, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (data?.initialIndex !== undefined) {
      setCurrentIndex(data.initialIndex);
    } else {
      setCurrentIndex(0);
    }
  }, [data]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (data?.gallery && data.gallery.length > 1) {
        if (e.key === 'ArrowRight') handleNext();
        if (e.key === 'ArrowLeft') handlePrev();
      }
    };

    if (data) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [data, currentIndex]);

  if (!data) return null;

  const images = data.gallery && data.gallery.length > 0 ? data.gallery : [data.src];
  const activeImage = images[currentIndex] || data.src;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100000] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8 animate-fadeIn">
      {/* Top Header / Close Button */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20 pointer-events-auto">
        <div className="text-left">
          <span className="text-[10px] tracking-widest-2xl text-champagne uppercase font-mono block">
            {data.category || 'PREET CINEMATOGRAPHY'}
          </span>
          <h2 className="text-lg sm:text-2xl font-serif text-pearl">{data.title}</h2>
        </div>

        <button
          onClick={onClose}
          className="p-3 rounded-full bg-dark-800/80 hover:bg-champagne hover:text-dark text-pearl transition-all duration-300 border border-white/10"
          aria-label="Close viewer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="relative w-full max-w-6xl max-h-[85vh] flex items-center justify-center">
        {data.type === 'video' ? (
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            <video
              ref={videoRef}
              src={data.src}
              autoPlay
              playsInline
              controls={false}
              className="max-h-[75vh] w-auto max-w-full rounded-lg shadow-2xl border border-white/10 object-contain bg-black"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />

            {/* Custom Cinema Control Bar */}
            <div className="mt-4 flex items-center gap-4 bg-dark-900/90 border border-white/10 px-6 py-2.5 rounded-full backdrop-blur-md">
              <button
                onClick={togglePlay}
                className="text-pearl hover:text-champagne transition-colors p-1"
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>

              <button
                onClick={toggleMute}
                className="text-pearl hover:text-champagne transition-colors p-1"
                aria-label={isMuted ? 'Unmute video' : 'Mute video'}
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>

              <span className="text-xs font-mono text-pearl-muted px-2 border-l border-white/10">
                {data.year || '2026'} • {data.location || 'Punjab, India'}
              </span>

              <button
                onClick={toggleFullscreen}
                className="text-pearl hover:text-champagne transition-colors p-1 ml-auto"
                aria-label="Toggle Fullscreen"
              >
                <Maximize className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="relative flex flex-col items-center justify-center max-h-[80vh]">
            <img
              src={activeImage}
              alt={data.title}
              className="max-h-[75vh] max-w-full w-auto rounded-lg shadow-2xl border border-white/10 object-contain"
            />

            {/* Carousel Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute -left-3 sm:-left-12 top-1/2 -translate-y-1/2 p-3 rounded-full bg-dark-800/80 hover:bg-champagne hover:text-dark text-pearl border border-white/10 transition-all duration-300"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute -right-3 sm:-right-12 top-1/2 -translate-y-1/2 p-3 rounded-full bg-dark-800/80 hover:bg-champagne hover:text-dark text-pearl border border-white/10 transition-all duration-300"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                <div className="mt-3 text-xs font-mono text-pearl-muted bg-dark-900/80 px-4 py-1.5 rounded-full border border-white/10">
                  {currentIndex + 1} / {images.length}
                </div>
              </>
            )}

            {data.description && (
              <p className="mt-2 text-sm text-pearl-muted text-center max-w-lg font-sans">
                {data.description}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
