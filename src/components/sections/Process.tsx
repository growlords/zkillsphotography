import React from 'react';
import { Compass, Sparkles, Video, Sliders, CheckCircle } from 'lucide-react';

export const Process: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'DISCOVER',
      subtitle: 'The Vision & Connection',
      description: 'We sit down over chai or a video call to delve into your story, family traditions, personal aesthetic, and timeline expectations.',
      icon: Compass,
    },
    {
      number: '02',
      title: 'PLAN',
      subtitle: 'Creative Direction & Moodboard',
      description: 'Location scouting, lighting schedules around the golden hour, camera equipment selection, and bespoke shot lists tailored to your rituals.',
      icon: Sparkles,
    },
    {
      number: '03',
      title: 'CAPTURE',
      subtitle: 'Cinematic Production',
      description: 'Our cinematographers and photographers blend unobtrusively into your celebration, capturing raw emotion without interfering with rituals.',
      icon: Video,
    },
    {
      number: '04',
      title: 'EDIT',
      subtitle: 'Color Grading & Soundscapes',
      description: 'Meticulous footage curation, bespoke orchestral scores, dialogue mixing, and multi-pass color grading calibrated to rich Indian tones.',
      icon: Sliders,
    },
    {
      number: '05',
      title: 'DELIVER',
      subtitle: 'Heirloom Masterpieces',
      description: 'Digital 4K cloud delivery, social media teaser reels within days, and luxury bespoke archival hardcover wedding albums for your mantle.',
      icon: CheckCircle,
    },
  ];

  return (
    <section id="process" className="py-28 sm:py-36 bg-dark border-b border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-[11px] uppercase tracking-widest-2xl text-champagne font-mono block mb-3">
            METHODOLOGY
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-pearl font-normal mb-4">
            The Journey to Cinema
          </h2>
          <p className="text-pearl-muted text-sm font-sans">
            A seamless, transparent five-stage creative process engineered to ensure peace of mind on your most important days.
          </p>
        </div>

        {/* Timeline Grid (5 Steps) */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="group relative rounded-2xl bg-dark-900/70 border border-white/10 p-6 flex flex-col justify-between min-h-[320px] transition-all duration-300 hover:border-champagne/40 hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-xs text-champagne tracking-widest border-b border-champagne/30 pb-1">
                      {step.number}
                    </span>
                    <Icon className="w-5 h-5 text-pearl-muted group-hover:text-champagne transition-colors" />
                  </div>

                  <h3 className="font-serif text-2xl text-pearl group-hover:text-champagne transition-colors mb-1">
                    {step.title}
                  </h3>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-champagne/90 block mb-3">
                    {step.subtitle}
                  </span>
                  <p className="text-xs text-pearl-muted font-sans leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 text-[10px] font-mono text-pearl-muted/60 uppercase tracking-widest">
                  STEP {step.number} OF 05
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
