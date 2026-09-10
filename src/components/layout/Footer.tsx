import React from 'react';
import { Phone, ArrowUp } from 'lucide-react';
import { InstagramIcon, YoutubeIcon, WhatsAppIcon } from '../common/Icons';
import { useSiteContent } from '../../context/SiteContentContext';

export const Footer: React.FC = () => {
  const { content } = useSiteContent();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const brandName = content?.branding?.brandName || "Z SKILLS PHOTOGRAPHY";
  const location = content?.contact?.location || "Sirsa, India";
  const phone = content?.contact?.phone || "+91 9729371307";
  const phoneTel = content?.contact?.phoneTel || "tel:+919729371307";
  const whatsappUrl = content?.contact?.whatsappUrl || "https://wa.me/919729371307";
  const instagramUrl = content?.social?.instagramUrl || "https://www.instagram.com/its._kamalpreet_13?stkn=MXBmOWR3NG9wNjV3bA%3D%3D";
  const youtubeUrl = content?.social?.youtubeUrl || "https://youtube.com/@zskillsphotography?si=9dr-0VvT0ZFkjrDl";
  const email = content?.contact?.email || "bookings@zskillsphotography.com";

  return (
    <footer className="relative bg-[#080808] border-t border-white/10 pt-20 pb-12 overflow-hidden text-pearl">
      {/* Ambient warm gold glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-champagne/10 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          {/* Brand Manifesto */}
          <div className="md:col-span-5 space-y-5">
            <span className="text-[10px] tracking-widest-2xl text-champagne uppercase font-mono block font-semibold">
              EST. CINEMA ARCHIVE
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal">
              {brandName}
            </h2>
            <p className="text-pearl/65 text-sm font-sans max-w-sm leading-relaxed font-light">
              Capturing moments. Creating stories. We craft bespoke wedding cinema and editorial visual legacies that endure through generations.
            </p>
            <div className="pt-2">
              <span className="text-xs text-pearl/50 font-mono block">
                {location} • Available Worldwide
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-white font-semibold">Navigation</h3>
            <ul className="space-y-2.5 text-sm font-sans text-pearl/70">
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
            <h3 className="text-xs font-mono uppercase tracking-widest text-white font-semibold">Direct Connect</h3>
            <p className="text-sm text-pearl/70">
              For bookings, destination dates, and collaboration:
            </p>
            <a
              href={phoneTel}
              className="font-mono text-champagne text-base tracking-wider font-medium hover:underline inline-block"
            >
              {phone}
            </a>
            <p className="font-sans text-xs text-pearl/50">
              {email}
            </p>

            <div className="flex items-center gap-3 pt-3">
              <a
                href={phoneTel}
                className="p-3 rounded-full bg-[#111114] hover:bg-champagne hover:text-black text-pearl transition-all duration-300 border border-white/10 shadow-sm"
                aria-label={`Call ${brandName}`}
                data-cursor="open"
                data-cursor-label="CALL"
              >
                <Phone className="w-4 h-4" />
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-[#111114] hover:bg-champagne hover:text-black text-pearl transition-all duration-300 border border-white/10 shadow-sm"
                aria-label="Connect on WhatsApp"
                data-cursor="open"
                data-cursor-label="WHATSAPP"
              >
                <WhatsAppIcon className="w-4 h-4" />
              </a>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-[#111114] hover:bg-champagne hover:text-black text-pearl transition-all duration-300 border border-white/10 shadow-sm"
                aria-label="Instagram Profile"
                data-cursor="open"
                data-cursor-label="INSTA"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-[#111114] hover:bg-champagne hover:text-black text-pearl transition-all duration-300 border border-white/10 shadow-sm"
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
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-pearl/50">
          <p>© 2026 {brandName}. All rights reserved.</p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 hover:text-champagne transition-colors group font-medium"
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
