import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { Preloader } from '../components/common/Preloader';
import { CustomCursor } from '../components/common/CustomCursor';
import { Lightbox, LightboxData } from '../components/common/Lightbox';
import { FilmCanvas } from '../components/3d/FilmCanvas';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Hero } from '../components/sections/Hero';
import { BrandIntro } from '../components/sections/BrandIntro';
import { FeaturedFilms } from '../components/sections/FeaturedFilms';
import { HorizontalWork } from '../components/sections/HorizontalWork';
import { ProjectGrid } from '../components/sections/ProjectGrid';
import { Services } from '../components/sections/Services';
import { About } from '../components/sections/About';
import { Process } from '../components/sections/Process';
import { Testimonials } from '../components/sections/Testimonials';
import { BookingCTA } from '../components/sections/BookingCTA';
import { Contact } from '../components/sections/Contact';
import { FilmItem, ProjectItem, filmsList } from '../data/projects';
import { ServiceItem } from '../data/services';

export const PublicPortfolioPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [lightboxData, setLightboxData] = useState<LightboxData | null>(null);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  const handleOpenBooking = () => {
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExploreWork = () => {
    const el = document.getElementById('films');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleHeroFilmClick = () => {
    const heroFilm = filmsList[0];
    setLightboxData({
      type: 'video',
      src: heroFilm.videoSrc,
      title: heroFilm.title,
      category: heroFilm.category,
      location: heroFilm.location,
      year: heroFilm.year,
      description: heroFilm.description,
    });
  };

  const handleSelectFilm = (film: FilmItem) => {
    setLightboxData({
      type: 'video',
      src: film.videoSrc,
      title: film.title,
      category: film.category,
      location: film.location,
      year: film.year,
      description: film.description,
    });
  };

  const handleSelectProject = (project: ProjectItem) => {
    if (project.videoSrc) {
      setLightboxData({
        type: 'video',
        src: project.videoSrc,
        title: project.title,
        category: project.category,
        location: project.location,
        year: project.year,
        description: project.description,
      });
    } else {
      setLightboxData({
        type: 'image',
        src: project.coverImage,
        gallery: project.gallery,
        title: project.title,
        category: project.category,
        location: project.location,
        year: project.year,
        description: project.description,
      });
    }
  };

  const handleSelectService = (service: ServiceItem) => {
    if (service.bgVideo) {
      setLightboxData({
        type: 'video',
        src: service.bgVideo,
        title: service.title,
        category: 'Service Showcase',
        description: service.description,
      });
    } else {
      handleOpenBooking();
    }
  };

  return (
    <div className="relative min-h-screen bg-[#080808] text-[#FAF8F5] overflow-x-hidden">
      {/* Cinematic Film Grain Overlay */}
      <div className="film-grain" aria-hidden="true" />

      {/* Interactive Desktop Custom Cursor */}
      <CustomCursor />

      {/* Subtle Three.js Cinematic Dust / Lights */}
      <FilmCanvas />

      {/* Cinematic Preloader */}
      {loading && <Preloader onComplete={() => setLoading(false)} />}

      {/* Lightbox Modal */}
      <Lightbox data={lightboxData} onClose={() => setLightboxData(null)} />

      {/* Top Navbar */}
      <Navbar onOpenBooking={handleOpenBooking} />

      {/* Main Page Flow */}
      <main>
        <Hero
          onExploreClick={handleExploreWork}
          onContactClick={handleOpenBooking}
          onPlayFilm={handleHeroFilmClick}
        />

        <BrandIntro />

        <FeaturedFilms onSelectFilm={handleSelectFilm} />

        <HorizontalWork onSelectProject={handleSelectProject} />

        <ProjectGrid onSelectProject={handleSelectProject} />

        <Services onSelectService={handleSelectService} />

        <About />

        <Process />

        <Testimonials />

        <BookingCTA onStartStoryClick={handleOpenBooking} />

        <Contact />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
