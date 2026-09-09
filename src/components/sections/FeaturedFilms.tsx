import React, { useState } from 'react';
import { Play, Film, Clock, MapPin } from 'lucide-react';
import { filmsList, FilmItem } from '../../data/projects';

interface FeaturedFilmsProps {
  onSelectFilm: (film: FilmItem) => void;
}

export const FeaturedFilms: React.FC<FeaturedFilmsProps> = ({ onSelectFilm }) => {
  const [, setHoveredId] = useState<string | null>(null);

  const mainFilm = filmsList[1]; // A Wedding to Remember (6m45s)
  const secondaryFilms = [filmsList[0], filmsList[2]]; // Echoes of Eternity & Monochrome Reel

  return (
    <section id="films" className="relative py-28 sm:py-36 bg-[#EFEBE1] border-b border-[#D9D3C8]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Film className="w-3.5 h-3.5 text-[#B99A67]" />
              <span className="text-[11px] uppercase tracking-widest-2xl text-[#B99A67] font-mono font-medium">
                CINEMA ARCHIVE
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#171614] font-normal">
              Cinematic Films
            </h2>
          </div>
          <p className="text-[#6F6A61] text-sm sm:text-base font-sans max-w-md">
            Films crafted with anamorphic lenses, natural golden light, and authentic soundscapes. Click any film to experience the full cut in high definition.
          </p>
        </div>

        {/* Feature Film Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Hero Feature Film (8 cols) */}
          <div
            className="lg:col-span-8 group relative rounded-2xl overflow-hidden bg-[#FAF8F3] border border-[#D9D3C8] cursor-pointer shadow-xl hover:border-[#B99A67] transition-all duration-500"
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Play Button Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#B99A67] text-white flex items-center justify-center shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:bg-[#A38350]">
                  <Play className="w-8 h-8 fill-current translate-x-0.5" />
                </div>
              </div>

              {/* Timecode Badge */}
              <div className="absolute top-6 left-6 flex items-center gap-2 bg-[#FAF8F3]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#D9D3C8] text-xs font-mono text-[#171614] font-medium shadow-sm">
                <Clock className="w-3.5 h-3.5 text-[#B99A67]" />
                <span>{mainFilm.duration}</span>
              </div>

              <div className="absolute top-6 right-6 bg-[#B99A67] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full font-mono shadow-sm">
                FEATURED FILM
              </div>
            </div>

            {/* Card Details */}
            <div className="p-6 sm:p-8 bg-[#FAF8F3] border-t border-[#D9D3C8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-[#B99A67] tracking-widest uppercase font-mono block mb-1 font-semibold">
                  {mainFilm.category}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#171614] group-hover:text-[#B99A67] transition-colors">
                  {mainFilm.title}
                </h3>
                <p className="text-[#6F6A61] text-xs sm:text-sm font-sans mt-2 max-w-xl">
                  {mainFilm.description}
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-[#6F6A61] shrink-0">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#B99A67]" />
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
                className="group relative rounded-2xl overflow-hidden bg-[#FAF8F3] border border-[#D9D3C8] cursor-pointer shadow-lg hover:border-[#B99A67] transition-all duration-500 flex-1 flex flex-col"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Play Button Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-[#B99A67] text-white group-hover:bg-[#A38350] flex items-center justify-center shadow-xl transition-all duration-300 group-hover:scale-110">
                      <Play className="w-5 h-5 fill-current translate-x-0.5" />
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-[#FAF8F3]/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-mono text-[#171614] border border-[#D9D3C8] shadow-sm font-medium">
                    <Clock className="w-3.5 h-3.5 text-[#B99A67]" />
                    <span>{film.duration}</span>
                  </div>
                </div>

                <div className="p-5 bg-[#FAF8F3] border-t border-[#D9D3C8]">
                  <span className="text-[10px] text-[#B99A67] uppercase font-mono tracking-widest block mb-1 font-semibold">
                    {film.category}
                  </span>
                  <h4 className="font-serif text-xl text-[#171614] group-hover:text-[#B99A67] transition-colors">
                    {film.title}
                  </h4>
                  <div className="flex items-center justify-between text-xs font-mono text-[#6F6A61] mt-2">
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
