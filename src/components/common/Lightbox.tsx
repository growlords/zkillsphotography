import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { CinematicVideoPlayer } from './CinematicVideoPlayer';

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
  const [currentIndex, setCurrentIndex] = useState(0);

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

  return (
    <div className="fixed inset-0 z-[100000] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 md:p-8 animate-fadeIn">
      {/* Top Header with Close Button */}
      <div className="absolute top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 flex items-center justify-between z-50 pointer-events-auto">
        <div className="text-left max-w-[70vw] truncate">
          <span className="text-[10px] tracking-widest-2xl text-champagne uppercase font-mono block">
            {data.category || 'Z SKILLS PHOTOGRAPHY'}
          </span>
          <h2 className="text-base sm:text-xl md:text-2xl font-serif text-pearl truncate">
            {data.title}
          </h2>
        </div>

        <button
          onClick={onClose}
          className="p-2.5 sm:p-3 rounded-full bg-[#121217]/90 hover:bg-champagne hover:text-black text-pearl transition-all duration-300 border border-white/15 shadow-xl"
          aria-label="Close viewer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="relative w-full max-w-6xl max-h-[88vh] flex items-center justify-center pt-10 sm:pt-12">
        {data.type === 'video' ? (
          <div className="relative w-full h-[70vh] sm:h-[76vh] md:h-[80vh] flex items-center justify-center">
            <CinematicVideoPlayer
              src={data.src}
              title={data.title}
              category={data.category || 'Z SKILLS PHOTOGRAPHY'}
              location={data.location}
              year={data.year}
              autoPlay={true}
              initialMuted={false}
              className="w-full h-full"
            />
          </div>
        ) : (
          <div className="relative flex flex-col items-center justify-center max-h-[80vh]">
            <img
              src={activeImage}
              alt={data.title}
              className="max-h-[75vh] max-w-full w-auto rounded-lg shadow-2xl border border-white/10 object-contain"
            />

            {/* Carousel Navigation for Multi-image galleries */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute -left-3 sm:-left-12 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#121217]/90 hover:bg-champagne hover:text-black text-pearl border border-white/15 transition-all duration-300"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute -right-3 sm:-right-12 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#121217]/90 hover:bg-champagne hover:text-black text-pearl border border-white/15 transition-all duration-300"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                <div className="mt-3 text-xs font-mono text-pearl-muted bg-[#121217]/90 px-4 py-1.5 rounded-full border border-white/10">
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
