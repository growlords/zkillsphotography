import React, { useState } from 'react';
import { projectsList, projectCategories, ProjectItem } from '../../data/projects';
import { Eye, Play } from 'lucide-react';

interface ProjectGridProps {
  onSelectProject: (project: ProjectItem) => void;
}

export const ProjectGrid: React.FC<ProjectGridProps> = ({ onSelectProject }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filteredProjects = activeCategory === 'All'
    ? projectsList
    : projectsList.filter((p) => p.category === activeCategory);

  return (
    <section className="py-28 sm:py-36 bg-[#FAF8F3] border-b border-[#D9D3C8]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[11px] uppercase tracking-widest-2xl text-[#B99A67] font-mono block mb-3 font-semibold">
            PORTFOLIO ARCHIVE
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#171614] font-normal mb-4">
            Masterpieces in Motion & Stills
          </h2>
          <p className="text-[#6F6A61] text-sm font-sans">
            Filter through our weddings, editorial portraits, and cinematic films captured across royal heritage estates and rural landscapes.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3 mb-16">
          {projectCategories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-[#B99A67] text-white font-semibold shadow-md shadow-[#B99A67]/20'
                  : 'bg-[#FAF8F3] text-[#6F6A61] hover:text-[#171614] hover:bg-[#EFEBE1] border border-[#D9D3C8]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Editorial Masonry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProjects.map((project) => {
            const isWide = project.aspectRatio === 'landscape';
            const isVideo = Boolean(project.videoSrc);

            return (
              <div
                key={project.id}
                onClick={() => onSelectProject(project)}
                className={`group relative rounded-2xl overflow-hidden bg-white border border-[#D9D3C8] cursor-pointer shadow-md transition-all duration-500 hover:border-[#B99A67] hover:shadow-xl ${
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300" />

                  {/* Play Icon if video */}
                  {isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-[#B99A67] text-white flex items-center justify-center shadow-xl transition-transform duration-300 group-hover:scale-110">
                        <Play className="w-6 h-6 fill-current translate-x-0.5" />
                      </div>
                    </div>
                  )}

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="bg-[#FAF8F3]/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest text-[#171614] border border-[#D9D3C8] font-semibold shadow-sm">
                      {project.category}
                    </span>
                    {isVideo && (
                      <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono text-white">
                        CINEMA
                      </span>
                    )}
                  </div>

                  <div className="absolute top-4 right-4 bg-[#FAF8F3]/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono text-[#6F6A61] border border-[#D9D3C8] shadow-sm">
                    {project.year}
                  </div>
                </div>

                {/* Bottom Details */}
                <div className="p-6 bg-white border-t border-[#D9D3C8]">
                  <span className="text-[11px] font-mono text-[#6F6A61] block mb-1">
                    {project.location}
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl text-[#171614] group-hover:text-[#B99A67] transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs text-[#6F6A61] line-clamp-2 mt-2 font-sans leading-relaxed">
                    {project.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-[#D9D3C8] flex items-center justify-between text-[11px] font-mono text-[#B99A67]">
                    <span className="flex items-center gap-1.5 font-medium">
                      {isVideo ? <Play className="w-3 h-3 fill-current" /> : <Eye className="w-3 h-3" />}
                      <span>{isVideo ? 'WATCH FILM' : 'EXPLORE GALLERY'}</span>
                    </span>
                    <span className="text-[#6F6A61]">
                      {project.gallery.length} {project.gallery.length === 1 ? 'FILE' : 'FRAMES'}
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
