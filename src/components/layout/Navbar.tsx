import React, { useEffect, useState } from 'react';
import { Menu, X, Phone, Sparkles } from 'lucide-react';
import { WhatsAppIcon } from '../common/Icons';
import { studioInfo } from '../../data/studioInfo';

interface NavbarProps {
  onOpenBooking: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'py-3.5 bg-[#F5F2EA]/92 backdrop-blur-xl border-b border-[#D9D3C8] shadow-sm'
            : 'py-6 bg-gradient-to-b from-black/80 via-black/30 to-transparent'
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
              className={`font-serif text-lg sm:text-2xl tracking-widest transition-colors duration-300 ${
                isScrolled
                  ? 'text-[#171614] group-hover:text-[#B99A67]'
                  : 'text-white group-hover:text-[#DEC5A3]'
              }`}
            >
              PREET CINEMATOGRAPHY
            </span>
            <span
              className={`text-[9px] tracking-widest-2xl font-mono uppercase hidden sm:block ${
                isScrolled ? 'text-[#B99A67]' : 'text-[#DEC5A3]'
              }`}
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
                className={`text-xs tracking-widest uppercase font-mono focus:outline-none relative group py-1 transition-colors duration-300 ${
                  isScrolled
                    ? 'text-[#6F6A61] hover:text-[#171614]'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#B99A67] transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={studioInfo.phoneTel}
              className={`p-2.5 rounded-full border transition-all ${
                isScrolled
                  ? 'border-[#D9D3C8] text-[#6F6A61] hover:text-[#171614] hover:border-[#B99A67]'
                  : 'border-white/20 text-white/80 hover:text-white hover:border-[#DEC5A3]'
              }`}
              title="Call Preet Cinematography"
              data-cursor="open"
              data-cursor-label="CALL"
            >
              <Phone className="w-3.5 h-3.5" />
            </a>

            <a
              href={studioInfo.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2.5 rounded-full border transition-all ${
                isScrolled
                  ? 'border-[#D9D3C8] text-[#6F6A61] hover:text-[#171614] hover:border-[#B99A67]'
                  : 'border-white/20 text-white/80 hover:text-white hover:border-[#DEC5A3]'
              }`}
              title="Connect on WhatsApp"
              data-cursor="open"
              data-cursor-label="WHATSAPP"
            >
              <WhatsAppIcon className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={onOpenBooking}
              className="px-5 py-2.5 rounded-full bg-[#B99A67] hover:bg-[#A38350] text-white font-sans text-xs font-semibold tracking-wider transition-all duration-300 hover:shadow-lg hover:shadow-[#B99A67]/20 flex items-center gap-2 group"
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
              href={studioInfo.phoneTel}
              className="p-2 text-[#171614] border border-[#D9D3C8] rounded-full"
              aria-label="Call Preet Cinematography"
            >
              <Phone className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={onOpenBooking}
              className="px-3.5 py-1.5 rounded-full bg-[#B99A67] text-white text-[11px] font-semibold tracking-wider"
            >
              Book
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 focus:outline-none transition-colors ${
                isScrolled ? 'text-[#171614]' : 'text-white'
              }`}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu (Luxury Light Theme) */}
      <div
        className={`fixed inset-0 z-40 bg-[#FAF8F3]/98 backdrop-blur-3xl md:hidden transition-all duration-500 flex flex-col justify-between p-8 pt-28 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none -translate-y-8'
        }`}
      >
        <div className="flex flex-col space-y-6">
          <span className="text-[10px] tracking-widest-2xl text-[#B99A67] font-mono uppercase font-semibold">
            NAVIGATION
          </span>
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleLinkClick(link.href)}
              className="text-left font-serif text-2xl tracking-wider text-[#171614] hover:text-[#B99A67] transition-colors"
            >
              {link.label}
            </button>
          ))}
        </div>

        <div className="pt-8 border-t border-[#D9D3C8] space-y-4">
          <div className="flex flex-col gap-2.5">
            <a
              href={studioInfo.phoneTel}
              className="text-xs text-[#171614] hover:text-[#B99A67] font-mono flex items-center gap-2 font-medium"
            >
              <Phone className="w-3.5 h-3.5 text-[#B99A67]" />
              <span>Call: {studioInfo.phone}</span>
            </a>
            <a
              href={studioInfo.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#B99A67] hover:underline font-mono flex items-center gap-2 font-medium"
            >
              <WhatsAppIcon className="w-3.5 h-3.5" />
              <span>Connect on WhatsApp</span>
            </a>
            <span className="text-[11px] text-[#6F6A61] font-mono">
              {studioInfo.location}
            </span>
          </div>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenBooking();
            }}
            className="w-full py-3.5 rounded-xl bg-[#B99A67] text-white font-sans font-semibold tracking-wider text-sm flex items-center justify-center gap-2 shadow-md"
          >
            <span>Book a Shoot</span>
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
};
