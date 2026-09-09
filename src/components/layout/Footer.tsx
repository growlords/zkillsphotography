import React from 'react';
import { Phone, ArrowUp } from 'lucide-react';
import { InstagramIcon, YoutubeIcon, WhatsAppIcon } from '../common/Icons';
import { studioInfo } from '../../data/studioInfo';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#EBE6DC] border-t border-[#D9D3C8] pt-20 pb-12 overflow-hidden text-[#171614]">
      {/* Ambient warm glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-[#B99A67]/10 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-[#D9D3C8]">
          {/* Brand Manifesto */}
          <div className="md:col-span-5 space-y-5">
            <span className="text-[10px] tracking-widest-2xl text-[#B99A67] uppercase font-mono block font-semibold">
              EST. CINEMA ARCHIVE
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#171614] font-normal">
              PREET CINEMATOGRAPHY
            </h2>
            <p className="text-[#6F6A61] text-sm font-sans max-w-sm leading-relaxed">
              Capturing moments. Creating stories. We craft bespoke wedding cinema and editorial visual legacies that endure through generations.
            </p>
            <div className="pt-2">
              <span className="text-xs text-[#6F6A61]/80 font-mono block">
                {studioInfo.location}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#171614] font-semibold">Navigation</h3>
            <ul className="space-y-2.5 text-sm font-sans text-[#6F6A61]">
              <li>
                <a href="#hero" className="hover:text-[#B99A67] transition-colors">Hero Film</a>
              </li>
              <li>
                <a href="#films" className="hover:text-[#B99A67] transition-colors">Cinematic Films</a>
              </li>
              <li>
                <a href="#work" className="hover:text-[#B99A67] transition-colors">Curated Portfolio</a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#B99A67] transition-colors">Our Services</a>
              </li>
              <li>
                <a href="#about" className="hover:text-[#B99A67] transition-colors">Creative Approach</a>
              </li>
              <li>
                <a href="#process" className="hover:text-[#B99A67] transition-colors">Production Process</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#B99A67] transition-colors">Book Inquiry</a>
              </li>
            </ul>
          </div>

          {/* Social & Contact */}
          <div className="md:col-span-4 space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#171614] font-semibold">Direct Connect</h3>
            <p className="text-sm text-[#6F6A61]">
              For bookings, destination dates, and collaboration:
            </p>
            <a
              href={studioInfo.phoneTel}
              className="font-mono text-[#B99A67] text-base tracking-wider font-medium hover:underline inline-block"
            >
              {studioInfo.phone}
            </a>
            <p className="font-sans text-xs text-[#6F6A61]">
              {studioInfo.email}
            </p>

            <div className="flex items-center gap-3 pt-3">
              <a
                href={studioInfo.phoneTel}
                className="p-3 rounded-full bg-[#FAF8F3] hover:bg-[#B99A67] hover:text-white text-[#171614] transition-all duration-300 border border-[#D9D3C8] shadow-sm"
                aria-label="Call Preet Cinematography"
                data-cursor="open"
                data-cursor-label="CALL"
              >
                <Phone className="w-4 h-4" />
              </a>
              <a
                href={studioInfo.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-[#FAF8F3] hover:bg-[#B99A67] hover:text-white text-[#171614] transition-all duration-300 border border-[#D9D3C8] shadow-sm"
                aria-label="Connect on WhatsApp"
                data-cursor="open"
                data-cursor-label="WHATSAPP"
              >
                <WhatsAppIcon className="w-4 h-4" />
              </a>
              <a
                href={studioInfo.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-[#FAF8F3] hover:bg-[#B99A67] hover:text-white text-[#171614] transition-all duration-300 border border-[#D9D3C8] shadow-sm"
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
                className="p-3 rounded-full bg-[#FAF8F3] hover:bg-[#B99A67] hover:text-white text-[#171614] transition-all duration-300 border border-[#D9D3C8] shadow-sm"
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
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#6F6A61]">
          <p>© 2026 Preet Cinematography. All rights reserved.</p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 hover:text-[#B99A67] transition-colors group font-medium"
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
