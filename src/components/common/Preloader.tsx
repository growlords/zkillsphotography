import React, { useEffect, useState } from 'react';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsFading(true), 300);
          setTimeout(() => onComplete(), 1000);
          return 100;
        }
        const increment = Math.floor(Math.random() * 15) + 5;
        return Math.min(prev + increment, 100);
      });
    }, 90);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[10000] bg-[#050505] flex flex-col items-center justify-center transition-opacity duration-700 ease-in-out ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="text-center px-6 max-w-xl">
        <span className="text-[11px] uppercase tracking-widest-2xl text-champagne/80 font-mono block mb-4">
          CINEMATOGRAPHY & EDITORIAL FILM
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl tracking-wider text-pearl font-normal mb-8">
          Z SKILLS PHOTOGRAPHY
        </h1>

        <div className="w-48 sm:w-64 h-[2px] bg-white/10 mx-auto overflow-hidden relative mb-4">
          <div
            className="h-full bg-champagne transition-all duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between w-48 sm:w-64 mx-auto text-xs text-pearl-muted font-mono">
          <span>INITIALIZING</span>
          <span>{progress}%</span>
        </div>
      </div>
    </div>
  );
};
