import React from 'react';
import { servicesList, ServiceItem } from '../../data/services';
import { Check, ArrowRight } from 'lucide-react';
import { useSiteContent } from '../../context/SiteContentContext';

interface ServicesProps {
  onSelectService: (service: ServiceItem) => void;
}

export const Services: React.FC<ServicesProps> = ({ onSelectService }) => {
  const { content } = useSiteContent();
  const services = content?.services?.length > 0 ? content.services : servicesList;

  return (
    <section id="services" className="py-28 sm:py-36 bg-[#080808] border-b border-white/10 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-champagne/[0.04] rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-[11px] uppercase tracking-widest-2xl text-champagne font-mono block mb-3 font-semibold">
              WHAT WE DO
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-white font-normal">
              Services & Craft
            </h2>
          </div>
          <p className="text-pearl/70 text-sm sm:text-base font-sans max-w-md font-light">
            From intimate Anand Karaj ceremonies to grand multi-day luxury weddings and commercial productions, every service is executed with world-class artistry.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, idx) => (
            <div
              key={service.id}
              onClick={() => onSelectService(service)}
              className="group relative rounded-2xl overflow-hidden bg-[#111114] border border-white/10 p-6 flex flex-col justify-between min-h-[380px] cursor-pointer transition-all duration-500 hover:bg-[#17171C] hover:border-champagne/50 hover:shadow-2xl hover:shadow-champagne/10"
              data-cursor="open"
              data-cursor-label="INQUIRE"
            >
              {/* Background image preview with subtle hover zoom */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                  src={service.bgImage || "/assets/films/wedding-story-poster.jpg"}
                  alt={service.title}
                  className="w-full h-full object-cover opacity-10 group-hover:opacity-20 scale-100 group-hover:scale-110 transition-all duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111114] via-[#111114]/90 to-[#111114]/80 group-hover:from-[#17171C] group-hover:via-[#17171C]/90 group-hover:to-[#17171C]/80 transition-colors duration-500" />
              </div>

              {/* Card Top */}
              <div className="relative z-10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-champagne text-xs tracking-widest font-semibold">
                    0{idx + 1}
                  </span>
                  <div className="w-7 h-7 rounded-full border border-white/15 flex items-center justify-center text-pearl/70 group-hover:text-champagne group-hover:border-champagne transition-all">
                    <ArrowRight className="w-3.5 h-3.5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                  </div>
                </div>

                <h3 className="font-serif text-2xl text-white group-hover:text-champagne transition-colors duration-300">
                  {service.title}
                </h3>
                {service.tagline && (
                  <span className="text-[11px] text-champagne font-mono block tracking-wider uppercase font-semibold">
                    {service.tagline}
                  </span>
                )}
                <p className="text-xs text-pearl/65 font-sans leading-relaxed pt-1 font-light">
                  {service.description}
                </p>
              </div>

              {/* Card Bottom Deliverables */}
              <div className="relative z-10 pt-6 mt-4 border-t border-white/10">
                <span className="text-[10px] font-mono uppercase tracking-widest text-pearl/50 block mb-2 font-semibold">
                  Key Deliverables
                </span>
                <ul className="space-y-1.5">
                  {(service.deliverables || (service as any).features || []).slice(0, 3).map((item: string, i: number) => (
                    <li key={i} className="text-[11px] font-sans text-pearl/70 flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-champagne shrink-0" />
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
