import React, { useEffect, useState } from 'react';
import { Menu, X, Phone, Sparkles } from 'lucide-react';
import { WhatsAppIcon } from '../common/Icons';
import { useSiteContent } from '../../context/SiteContentContext';

interface NavbarProps {
  onOpenBooking: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { content } = useSiteContent();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'Films', href: '#films' },
    { label: 'Work', href: '#work' },
    { label: 'Services', href: '#services' },
    { label: 'About', href: '#about' },
    { label: 'Process', href: '#process' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const brandName = content?.branding?.brandName || "Z SKILLS PHOTOGRAPHY";
  const phoneTel = content?.contact?.phoneTel || "tel:+919729371307";
  const phoneDisplay = content?.contact?.phone || "+91 9729371307";
  const whatsappUrl = content?.contact?.whatsappUrl || "https://wa.me/919729371307";
  const location = content?.contact?.location || "Sirsa, India";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'py-3.5 bg-[#080808]/92 backdrop-blur-xl border-b border-white/10 shadow-2xl'
            : 'py-6 bg-gradient-to-b from-black/90 via-black/40 to-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <a
            href="#hero"
            className="group flex flex-col items-start focus:outline-none"
            data-cursor="open"
            data-cursor-label="HOME"
          >
            <span
              className="font-serif text-lg sm:text-2xl tracking-widest text-white group-hover:text-champagne transition-colors duration-300"
            >
              {brandName}
            </span>
            <span
              className="text-[9px] tracking-widest-2xl font-mono uppercase text-champagne hidden sm:block"
            >
              FILMS & EDITORIAL ARCHIVE
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleLinkClick(link.href)}
                className="text-xs tracking-widest uppercase font-mono text-pearl/80 hover:text-white focus:outline-none relative group py-1 transition-colors duration-300"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-champagne transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={phoneTel}
              className="p-2.5 rounded-full border border-white/15 text-pearl/80 hover:text-white hover:border-champagne transition-all"
              title={`Call ${brandName}`}
              data-cursor="open"
              data-cursor-label="CALL"
            >
              <Phone className="w-3.5 h-3.5" />
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full border border-white/15 text-pearl/80 hover:text-white hover:border-champagne transition-all"
              title="Connect on WhatsApp"
              data-cursor="open"
              data-cursor-label="WHATSAPP"
            >
              <WhatsAppIcon className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={onOpenBooking}
              className="px-5 py-2.5 rounded-full bg-champagne hover:bg-champagne-dark text-black font-sans text-xs font-semibold tracking-wider transition-all duration-300 hover:shadow-lg hover:shadow-champagne/20 flex items-center gap-2 group"
              data-cursor="open"
              data-cursor-label="BOOK"
            >
              <span>Book a Shoot</span>
              <Sparkles className="w-3 h-3 group-hover:rotate-12 transition-transform duration-300" />
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-3">
            <a
              href={phoneTel}
              className="p-2 text-pearl border border-white/15 rounded-full"
              aria-label={`Call ${brandName}`}
            >
              <Phone className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={onOpenBooking}
              className="px-3.5 py-1.5 rounded-full bg-champagne text-black text-[11px] font-semibold tracking-wider"
            >
              Book
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-white focus:outline-none transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu (Luxury Dark Theme) */}
      <div
        className={`fixed inset-0 z-40 bg-[#080808]/98 backdrop-blur-3xl md:hidden transition-all duration-500 flex flex-col justify-between p-8 pt-28 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none -translate-y-8'
        }`}
      >
        <div className="flex flex-col space-y-6">
          <span className="text-[10px] tracking-widest-2xl text-champagne font-mono uppercase font-semibold">
            NAVIGATION
          </span>
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleLinkClick(link.href)}
              className="text-left font-serif text-2xl tracking-wider text-white hover:text-champagne transition-colors"
            >
              {link.label}
            </button>
          ))}
        </div>

        <div className="pt-8 border-t border-white/10 space-y-4">
          <div className="flex flex-col gap-2.5">
            <a
              href={phoneTel}
              className="text-xs text-pearl hover:text-champagne font-mono flex items-center gap-2 font-medium"
            >
              <Phone className="w-3.5 h-3.5 text-champagne" />
              <span>Call: {phoneDisplay}</span>
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-champagne hover:underline font-mono flex items-center gap-2 font-medium"
            >
              <WhatsAppIcon className="w-3.5 h-3.5" />
              <span>Connect on WhatsApp</span>
            </a>
            <span className="text-[11px] text-pearl/50 font-mono">
              {location}
            </span>
          </div>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenBooking();
            }}
            className="w-full py-3.5 rounded-xl bg-champagne text-black font-sans font-semibold tracking-wider text-sm flex items-center justify-center gap-2 shadow-md"
          >
            <span>Book a Shoot</span>
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
};
