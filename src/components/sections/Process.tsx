import React from 'react';
import { Compass, Sparkles, Video, Sliders, CheckCircle } from 'lucide-react';
import { useSiteContent } from '../../context/SiteContentContext';

export const Process: React.FC = () => {
  const { content } = useSiteContent();

  const iconMap = [Compass, Sparkles, Video, Sliders, CheckCircle];

  const defaultSteps = [
    {
      number: '01',
      title: 'DISCOVER',
      subtitle: 'The Vision & Connection',
      description: 'We sit down over chai or a video call to delve into your story, family traditions, personal aesthetic, and timeline expectations.',
    },
    {
      number: '02',
      title: 'PLAN',
      subtitle: 'Creative Direction & Moodboard',
      description: 'Location scouting, lighting schedules around the golden hour, camera equipment selection, and bespoke shot lists tailored to your rituals.',
    },
    {
      number: '03',
      title: 'CAPTURE',
      subtitle: 'Cinematic Production',
      description: 'Our cinematographers and photographers blend unobtrusively into your celebration, capturing raw emotion without interfering with rituals.',
    },
    {
      number: '04',
      title: 'EDIT',
      subtitle: 'Color Grading & Soundscapes',
      description: 'Meticulous footage curation, bespoke orchestral scores, dialogue mixing, and multi-pass color grading calibrated to rich Indian tones.',
    },
    {
      number: '05',
      title: 'DELIVER',
      subtitle: 'Heirloom Masterpieces',
      description: 'Digital 4K cloud delivery, social media teaser reels within days, and luxury bespoke archival hardcover wedding albums for your mantle.',
    },
  ];

  const steps = content?.process?.length > 0
    ? content.process.map((p, idx) => ({
        number: p.step || `0${idx + 1}`,
        title: p.title.toUpperCase(),
        subtitle: `Phase 0${idx + 1}`,
        description: p.description
      }))
    : defaultSteps;

  return (
    <section id="process" className="py-28 sm:py-36 bg-[#080808] border-b border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-[11px] uppercase tracking-widest-2xl text-champagne font-mono block mb-3 font-semibold">
            METHODOLOGY
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-white font-normal mb-4">
            The Journey to Cinema
          </h2>
          <p className="text-pearl/70 text-sm font-sans font-light">
            A seamless, transparent creative process engineered to ensure peace of mind on your most important days.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className={`grid grid-cols-1 ${steps.length === 4 ? 'md:grid-cols-4' : 'md:grid-cols-5'} gap-6 relative`}>
          {steps.map((step, idx) => {
            const Icon = iconMap[idx % iconMap.length];
            return (
              <div
                key={step.number}
                className="group relative rounded-2xl bg-[#111114] border border-white/10 p-6 flex flex-col justify-between min-h-[320px] transition-all duration-300 hover:bg-[#17171C] hover:border-champagne/50 hover:-translate-y-1 shadow-lg hover:shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-xs text-champagne tracking-widest border-b border-champagne/40 pb-1 font-semibold">
                      {step.number}
                    </span>
                    <Icon className="w-5 h-5 text-pearl/50 group-hover:text-champagne transition-colors" />
                  </div>

                  <h3 className="font-serif text-2xl text-white group-hover:text-champagne transition-colors mb-1">
                    {step.title}
                  </h3>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-champagne block mb-3 font-semibold">
                    {step.subtitle}
                  </span>
                  <p className="text-xs text-pearl/65 font-sans leading-relaxed font-light">
                    {step.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 text-[10px] font-mono text-pearl/40 uppercase tracking-widest">
                  STEP {step.number}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
