import React, { useState } from 'react';
import { ProjectItem } from '../../data/projects';
import { Eye, Play } from 'lucide-react';
import { useSiteContent } from '../../context/SiteContentContext';

interface ProjectGridProps {
  onSelectProject: (project: ProjectItem) => void;
}

export const ProjectGrid: React.FC<ProjectGridProps> = ({ onSelectProject }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const { projects } = useSiteContent();

  const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category)))];

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  return (
    <section className="py-28 sm:py-36 bg-[#0B0B0E] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[11px] uppercase tracking-widest-2xl text-champagne font-mono block mb-3 font-semibold">
            PORTFOLIO ARCHIVE
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-white font-normal mb-4">
            Masterpieces in Motion & Stills
          </h2>
          <p className="text-pearl/70 text-sm font-sans font-light">
            Filter through our weddings, editorial portraits, and cinematic films captured across royal heritage estates and rural landscapes.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3 mb-16">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-champagne text-black font-semibold shadow-lg shadow-champagne/20'
                  : 'bg-[#17171C] text-pearl/70 hover:text-white hover:bg-[#23232A] border border-white/10'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Editorial Masonry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProjects.map((project, idx) => {
            const isWide = idx % 5 === 0;
            const isVideo = Boolean(project.videoSrc);

            return (
              <div
                key={project.id}
                onClick={() => onSelectProject(project)}
                className={`group relative rounded-2xl overflow-hidden bg-[#111114] border border-white/10 cursor-pointer shadow-xl transition-all duration-500 hover:border-champagne/50 hover:shadow-2xl ${
                  isWide ? 'sm:col-span-2 lg:col-span-2' : ''
                }`}
                data-cursor={isVideo ? 'play' : 'view'}
                data-cursor-label={isVideo ? 'PLAY' : 'VIEW'}
              >
                {/* Image / Video Poster */}
                <div className={`relative overflow-hidden ${isWide ? 'aspect-widescreen' : 'aspect-portrait'}`}>
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity duration-300" />

                  {/* Play Icon if video */}
                  {isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-champagne text-black flex items-center justify-center shadow-xl transition-transform duration-300 group-hover:scale-110">
                        <Play className="w-6 h-6 fill-current translate-x-0.5" />
                      </div>
                    </div>
                  )}

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest text-pearl border border-white/15 font-semibold shadow-sm">
                      {project.category}
                    </span>
                    {isVideo && (
                      <span className="bg-champagne/90 text-black backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono font-bold">
                        CINEMA
                      </span>
                    )}
                  </div>

                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono text-pearl/70 border border-white/15 shadow-sm">
                    {project.year}
                  </div>
                </div>

                {/* Bottom Details */}
                <div className="p-6 bg-[#111114] border-t border-white/10">
                  <span className="text-[11px] font-mono text-pearl/50 block mb-1">
                    {project.location}
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl text-white group-hover:text-champagne transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs text-pearl/65 line-clamp-2 mt-2 font-sans leading-relaxed font-light">
                    {project.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-champagne">
                    <span className="flex items-center gap-1.5 font-medium">
                      {isVideo ? <Play className="w-3 h-3 fill-current" /> : <Eye className="w-3 h-3" />}
                      <span>{isVideo ? 'WATCH FILM' : 'EXPLORE GALLERY'}</span>
                    </span>
                    <span className="text-pearl/50">
                      {project.gallery?.length || 1} {project.gallery?.length === 1 ? 'FILE' : 'FRAMES'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
