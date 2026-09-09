import { Phone, ArrowUp } from 'lucide-react';
import { InstagramIcon, YoutubeIcon } from '../common/Icons';
import { studioInfo } from '../../data/studioInfo';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-dark-950 border-t border-white/10 pt-20 pb-12 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-champagne/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          {/* Brand Manifesto */}
          <div className="md:col-span-5 space-y-5">
            <span className="text-[10px] tracking-widest-2xl text-champagne uppercase font-mono block">
              EST. CINEMA ARCHIVE
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-pearl font-normal">
              PREET CINEMATOGRAPHY
            </h2>
            <p className="text-pearl-muted text-sm font-sans max-w-sm leading-relaxed">
              Capturing moments. Creating stories. We craft bespoke wedding cinema and editorial visual legacies that endure through generations.
            </p>
            <div className="pt-2">
              <span className="text-xs text-pearl-faint font-mono block">
                {studioInfo.location}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-pearl">Navigation</h3>
            <ul className="space-y-2.5 text-sm font-sans text-pearl-muted">
              <li>
                <a href="#hero" className="hover:text-champagne transition-colors">Hero Film</a>
              </li>
              <li>
                <a href="#films" className="hover:text-champagne transition-colors">Cinematic Films</a>
              </li>
              <li>
                <a href="#work" className="hover:text-champagne transition-colors">Curated Portfolio</a>
              </li>
              <li>
                <a href="#services" className="hover:text-champagne transition-colors">Our Services</a>
              </li>
              <li>
                <a href="#about" className="hover:text-champagne transition-colors">Creative Approach</a>
              </li>
              <li>
                <a href="#process" className="hover:text-champagne transition-colors">Production Process</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-champagne transition-colors">Book Inquiry</a>
              </li>
            </ul>
          </div>

          {/* Social & Contact */}
          <div className="md:col-span-4 space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-pearl">Direct Connect</h3>
            <p className="text-sm text-pearl-muted">
              For bookings, destination dates, and collaboration:
            </p>
            <p className="font-mono text-champagne text-base tracking-wider">
              {studioInfo.phone}
            </p>
            <p className="font-sans text-xs text-pearl-muted">
              {studioInfo.email}
            </p>

            <div className="flex items-center gap-3 pt-3">
              <a
                href={studioInfo.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-dark-850 hover:bg-champagne hover:text-dark text-pearl transition-all duration-300 border border-white/10"
                aria-label="WhatsApp Direct"
                data-cursor="open"
                data-cursor-label="WHATSAPP"
              >
                <Phone className="w-4 h-4" />
              </a>
              <a
                href={studioInfo.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-dark-850 hover:bg-champagne hover:text-dark text-pearl transition-all duration-300 border border-white/10"
                aria-label="Instagram Profile"
                data-cursor="open"
                data-cursor-label="INSTA"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href={studioInfo.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-dark-850 hover:bg-champagne hover:text-dark text-pearl transition-all duration-300 border border-white/10"
                aria-label="YouTube Channel"
                data-cursor="open"
                data-cursor-label="YOUTUBE"
              >
                <YoutubeIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-pearl-muted">
          <p>© 2026 Preet Cinematography. All rights reserved.</p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 hover:text-champagne transition-colors group"
            aria-label="Back to top"
          >
            <span>BACK TO TOP</span>
            <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
};
