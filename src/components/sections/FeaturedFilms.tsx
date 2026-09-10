import React, { useState } from 'react';
import { Play, Film, Clock, MapPin } from 'lucide-react';
import { FilmItem } from '../../data/projects';
import { useSiteContent } from '../../context/SiteContentContext';

interface FeaturedFilmsProps {
  onSelectFilm: (film: FilmItem) => void;
}

export const FeaturedFilms: React.FC<FeaturedFilmsProps> = ({ onSelectFilm }) => {
  const [, setHoveredId] = useState<string | null>(null);
  const { films } = useSiteContent();

  const mainFilm = films[0] || {
    id: "film-main",
    title: "The Eternal Vows: Wedding Film",
    category: "Cinematic Films",
    year: "2026",
    location: "Sirsa, India",
    description: "Full cinematic wedding highlight film crafted with rich color harmony, original sound design, and narrative pacing.",
    posterSrc: "/assets/films/wedding-story-poster.jpg",
    videoSrc: "/assets/films/wedding-story-full.mp4",
    duration: "4K Cinema Cut"
  };

  const secondaryFilms = films.slice(1, 3);

  return (
    <section id="films" className="relative py-28 sm:py-36 bg-[#0B0B0E] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Film className="w-3.5 h-3.5 text-champagne" />
              <span className="text-[11px] uppercase tracking-widest-2xl text-champagne font-mono font-medium">
                CINEMA ARCHIVE
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-white font-normal">
              Cinematic Films
            </h2>
          </div>
          <p className="text-pearl/70 text-sm sm:text-base font-sans max-w-md font-light">
            Films crafted with anamorphic lenses, natural golden light, and authentic soundscapes. Click any film to experience the full cut in high definition.
          </p>
        </div>

        {/* Feature Film Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Hero Feature Film (8 cols) */}
          <div
            className="lg:col-span-8 group relative rounded-2xl overflow-hidden bg-[#111114] border border-white/10 cursor-pointer shadow-2xl hover:border-champagne/50 transition-all duration-500"
            onClick={() => onSelectFilm(mainFilm)}
            onMouseEnter={() => setHoveredId(mainFilm.id)}
            onMouseLeave={() => setHoveredId(null)}
            data-cursor="play"
            data-cursor-label="PLAY FILM"
          >
            <div className="relative aspect-widescreen overflow-hidden">
              <img
                src={mainFilm.posterSrc}
                alt={mainFilm.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              {/* Play Button Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-champagne text-black flex items-center justify-center shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:bg-champagne-light">
                  <Play className="w-8 h-8 fill-current translate-x-0.5" />
                </div>
              </div>

              {/* Timecode Badge */}
              <div className="absolute top-6 left-6 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-xs font-mono text-pearl font-medium shadow-sm">
                <Clock className="w-3.5 h-3.5 text-champagne" />
                <span>{mainFilm.duration || "4K Master Cut"}</span>
              </div>

              <div className="absolute top-6 right-6 bg-champagne text-black text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full font-mono shadow-sm">
                FEATURED FILM
              </div>
            </div>

            {/* Card Details */}
            <div className="p-6 sm:p-8 bg-[#111114] border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-champagne tracking-widest uppercase font-mono block mb-1 font-semibold">
                  {mainFilm.category}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-white group-hover:text-champagne transition-colors">
                  {mainFilm.title}
                </h3>
                <p className="text-pearl/65 text-xs sm:text-sm font-sans mt-2 max-w-xl font-light">
                  {mainFilm.description}
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-pearl/50 shrink-0">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-champagne" />
                  {mainFilm.location}
                </span>
                <span>•</span>
                <span>{mainFilm.year}</span>
              </div>
            </div>
          </div>

          {/* Secondary Films Column (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-8 justify-between">
            {secondaryFilms.map((film) => (
              <div
                key={film.id}
                className="group relative rounded-2xl overflow-hidden bg-[#111114] border border-white/10 cursor-pointer shadow-xl hover:border-champagne/50 transition-all duration-500 flex-1 flex flex-col"
                onClick={() => onSelectFilm(film)}
                onMouseEnter={() => setHoveredId(film.id)}
                onMouseLeave={() => setHoveredId(null)}
                data-cursor="play"
                data-cursor-label="PLAY"
              >
                <div className="relative aspect-video overflow-hidden flex-1 min-h-[190px]">
                  <img
                    src={film.posterSrc}
                    alt={film.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                  {/* Play Button Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-champagne text-black group-hover:bg-champagne-light flex items-center justify-center shadow-xl transition-all duration-300 group-hover:scale-110">
                      <Play className="w-5 h-5 fill-current translate-x-0.5" />
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-mono text-pearl border border-white/15 shadow-sm font-medium">
                    <Clock className="w-3.5 h-3.5 text-champagne" />
                    <span>{film.duration || "4K Reel"}</span>
                  </div>
                </div>

                <div className="p-5 bg-[#111114] border-t border-white/10">
                  <span className="text-[10px] text-champagne uppercase font-mono tracking-widest block mb-1 font-semibold">
                    {film.category}
                  </span>
                  <h4 className="font-serif text-xl text-white group-hover:text-champagne transition-colors">
                    {film.title}
                  </h4>
                  <div className="flex items-center justify-between text-xs font-mono text-pearl/50 mt-2">
                    <span>{film.location}</span>
                    <span>{film.year}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
