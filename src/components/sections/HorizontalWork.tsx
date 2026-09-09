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

    // Use official GSAP matchMedia for flawless responsive handling
    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px)', () => {
      // Desktop: calculate exact horizontal scroll distance
      const totalScrollWidth = track.scrollWidth - window.innerWidth + 120;

      const anim = gsap.to(track, {
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

      return () => {
        if (anim.scrollTrigger) anim.scrollTrigger.kill();
        anim.kill();
      };
    });

    mm.add('(max-width: 1023px)', () => {
      // Mobile & Tablet: ensure zero horizontal translation or pinned scroll
      gsap.set(track, { clearProps: 'all' });
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === section) {
          st.kill();
        }
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative bg-[#F5F2EA] overflow-hidden py-20 lg:py-0 lg:h-screen flex flex-col justify-center border-b border-[#D9D3C8]"
    >
      {/* Top Header */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 w-full mb-8 lg:mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-widest-2xl text-[#B99A67] font-mono block mb-2 font-medium">
            CURATED STORIES
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#171614] font-normal">
            Selected Portfolios
          </h2>
        </div>
        <p className="text-[#6F6A61] text-xs sm:text-sm font-sans max-w-sm hidden sm:block">
          Every love story possesses its own cadence. Explore our recent captures from Punjab, featuring authentic rituals and editorial compositions.
        </p>
      </div>

      {/* Track Container:
          On Mobile (< 1024px): w-full, vertical stacked list, perfectly bounded inside the viewport.
          On Desktop (>= 1024px): horizontal scrolling track with w-max.
      */}
      <div className="w-full max-w-full overflow-hidden lg:overflow-visible px-4 sm:px-6 lg:px-0">
        <div
          ref={trackRef}
          className="flex flex-col lg:flex-row gap-8 lg:gap-8 w-full max-w-xl mx-auto lg:max-w-none lg:w-max lg:px-12"
        >
          {featured.map((project, idx) => (
            <div
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="group relative w-full lg:w-[480px] h-[460px] sm:h-[500px] lg:h-[520px] rounded-2xl overflow-hidden bg-[#FAF8F3] border border-[#D9D3C8] cursor-pointer shrink-0 shadow-lg transition-all duration-500 hover:border-[#B99A67] hover:shadow-xl"
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

              {/* Gradient Overlay for text contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#171614]/90 via-[#171614]/30 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

              {/* Top Badges */}
              <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
                <span className="bg-[#FAF8F3]/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest text-[#171614] border border-[#D9D3C8] font-semibold">
                  {project.category}
                </span>
                <span className="text-xs font-mono text-white/90 bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-sm">
                  0{idx + 1}
                </span>
              </div>

              {/* Bottom Information & Action */}
              <div className="absolute bottom-6 left-6 right-6 z-10">
                <div className="space-y-1">
                  <span className="text-[11px] font-mono text-[#DEC5A3] block">
                    {project.location} • {project.year}
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl text-white group-hover:text-[#DEC5A3] transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs text-white/80 line-clamp-2 font-sans pt-1">
                    {project.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs font-mono text-white/90 group-hover:text-[#DEC5A3] transition-colors">
                  <span className="flex items-center gap-2">
                    <Eye className="w-3.5 h-3.5 text-[#B99A67]" />
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
