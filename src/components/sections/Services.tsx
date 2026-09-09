import React from 'react';
import { servicesList, ServiceItem } from '../../data/services';
import { Check, ArrowRight } from 'lucide-react';

interface ServicesProps {
  onSelectService: (service: ServiceItem) => void;
}

export const Services: React.FC<ServicesProps> = ({ onSelectService }) => {
  return (
    <section id="services" className="py-28 sm:py-36 bg-[#F5F2EA] border-b border-[#D9D3C8] relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-[#B99A67]/[0.05] rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-[11px] uppercase tracking-widest-2xl text-[#B99A67] font-mono block mb-3 font-semibold">
              WHAT WE DO
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#171614] font-normal">
              Services & Craft
            </h2>
          </div>
          <p className="text-[#6F6A61] text-sm sm:text-base font-sans max-w-md">
            From intimate Gurudwara Anand Karaj ceremonies to grand multi-day luxury weddings and commercial productions, every service is executed with world-class artistry.
          </p>
        </div>

        {/* Services Grid (8 cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {servicesList.map((service) => (
            <div
              key={service.id}
              onClick={() => onSelectService(service)}
              className="group relative rounded-2xl overflow-hidden bg-[#FAF8F3] border border-[#D9D3C8] p-6 flex flex-col justify-between min-h-[380px] cursor-pointer transition-all duration-500 hover:bg-white hover:border-[#B99A67] hover:shadow-xl hover:shadow-[#B99A67]/10"
              data-cursor="open"
              data-cursor-label="INQUIRE"
            >
              {/* Background image preview with subtle hover zoom */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                  src={service.bgImage}
                  alt={service.title}
                  className="w-full h-full object-cover opacity-10 group-hover:opacity-20 scale-100 group-hover:scale-110 transition-all duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F3] via-[#FAF8F3]/90 to-[#FAF8F3]/80 group-hover:from-white group-hover:via-white/90 group-hover:to-white/80 transition-colors duration-500" />
              </div>

              {/* Card Top */}
              <div className="relative z-10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[#B99A67] text-xs tracking-widest font-semibold">
                    {service.number}
                  </span>
                  <div className="w-7 h-7 rounded-full border border-[#D9D3C8] flex items-center justify-center text-[#6F6A61] group-hover:text-[#B99A67] group-hover:border-[#B99A67] transition-all">
                    <ArrowRight className="w-3.5 h-3.5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                  </div>
                </div>

                <h3 className="font-serif text-2xl text-[#171614] group-hover:text-[#B99A67] transition-colors duration-300">
                  {service.title}
                </h3>
                <span className="text-[11px] text-[#B99A67] font-mono block tracking-wider uppercase font-semibold">
                  {service.tagline}
                </span>
                <p className="text-xs text-[#6F6A61] font-sans leading-relaxed pt-1">
                  {service.description}
                </p>
              </div>

              {/* Card Bottom Deliverables */}
              <div className="relative z-10 pt-6 mt-4 border-t border-[#D9D3C8]">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#6F6A61] block mb-2 font-semibold">
                  Key Deliverables
                </span>
                <ul className="space-y-1.5">
                  {service.deliverables.slice(0, 3).map((item, i) => (
                    <li key={i} className="text-[11px] font-sans text-[#6F6A61] flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-[#B99A67] shrink-0" />
                      <span className="truncate">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
