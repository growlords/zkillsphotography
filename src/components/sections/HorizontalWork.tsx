import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Eye } from 'lucide-react';
import { projectsList, ProjectItem } from '../../data/projects';

gsap.registerPlugin(ScrollTrigger);

interface HorizontalWorkProps {
  onSelectProject: (project: ProjectItem) => void;
}

export const HorizontalWork: React.FC<HorizontalWorkProps> = ({ onSelectProject }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const featured = projectsList.slice(0, 5);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    // Check screen width: only activate GSAP pin scroll on desktop screens (>= 1024px)
    if (window.innerWidth < 1024 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const totalScrollWidth = track.scrollWidth - window.innerWidth + 120;

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: -totalScrollWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => `+=${totalScrollWidth}`,
          invalidateOnRefresh: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative bg-dark overflow-hidden py-20 lg:py-0 lg:h-screen flex flex-col justify-center border-b border-white/5"
    >
      {/* Top Header */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 w-full mb-8 lg:mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-widest-2xl text-champagne font-mono block mb-2">
            CURATED STORIES
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-pearl font-normal">
            Selected Portfolios
          </h2>
        </div>
        <p className="text-pearl-muted text-xs sm:text-sm font-sans max-w-sm hidden sm:block">
          Every love story possesses its own cadence. Explore our recent captures from Punjab, featuring authentic rituals and editorial compositions.
        </p>
      </div>

      {/* Horizontal Track / Carousel Container */}
      <div className="w-full overflow-x-auto lg:overflow-visible">
        <div
          ref={trackRef}
          className="flex flex-col lg:flex-row gap-6 sm:gap-8 px-6 sm:px-12 w-max"
        >
          {featured.map((project, idx) => (
            <div
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="group relative w-[85vw] sm:w-[460px] lg:w-[480px] h-[480px] sm:h-[520px] rounded-2xl overflow-hidden bg-dark-900 border border-white/10 cursor-pointer shrink-0 shadow-2xl transition-all duration-500 hover:border-champagne/40"
              data-cursor="view"
              data-cursor-label="VIEW"
            >
              {/* Cover Image */}
              <img
                src={project.coverImage}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/40 to-transparent transition-opacity duration-300 group-hover:opacity-80" />

              {/* Top Tags */}
              <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
                <span className="bg-dark-950/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest text-champagne border border-white/10">
                  {project.category}
                </span>
                <span className="text-xs font-mono text-pearl-muted bg-dark-950/60 px-2.5 py-1 rounded-full backdrop-blur-sm">
                  0{idx + 1}
                </span>
              </div>

              {/* Bottom Information & Action */}
              <div className="absolute bottom-6 left-6 right-6 z-10">
                <div className="space-y-1">
                  <span className="text-[11px] font-mono text-pearl-muted block">
                    {project.location} • {project.year}
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl text-pearl group-hover:text-champagne transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs text-pearl-muted/90 line-clamp-2 font-sans pt-1">
                    {project.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-pearl-muted group-hover:text-champagne transition-colors">
                  <span className="flex items-center gap-2">
                    <Eye className="w-3.5 h-3.5" />
                    <span>VIEW GALLERY</span>
                  </span>
                  <ArrowRight className="w-4 h-4 -translate-x-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
