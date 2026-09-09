import React, { useState } from 'react';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface TestimonialItem {
  id: string;
  quote: string;
  couple: string;
  event: string;
  location: string;
  year: string;
}

export const Testimonials: React.FC = () => {
  const testimonials: TestimonialItem[] = [
    {
      id: "t1",
      quote: "Watching our wedding film for the first time felt like watching a timeless Bollywood classic, but starring us. The way Preet captured our Anand Karaj prayers, tears of joy, and our grandparents dancing brought the whole room to tears.",
      couple: "Jasleen & Harpreet",
      event: "Sacred Anand Karaj & Royal Reception",
      location: "Barnala, Punjab",
      year: "2026"
    },
    {
      id: "t2",
      quote: "From the pre-wedding shoot in the blooming fields to the grand Sangeet night, the team was calm, artistic, and entirely unobtrusive. The color grading and drone shots look straight out of Vogue.",
      couple: "Simran & Gurkaran",
      event: "Destination Pre-Wedding & 3-Day Wedding",
      location: "Zira, Punjab",
      year: "2025"
    },
    {
      id: "t3",
      quote: "The reel they delivered within 48 hours went viral in our entire family WhatsApp group! Preet's eye for lighting and micro-expressions is unmatched. We will treasure these memories forever.",
      couple: "Navneet & Aman",
      event: "Mehendi Gala & Wedding Ceremony",
      location: "Chandigarh & Barnala",
      year: "2026"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const active = testimonials[currentIndex];

  return (
    <section className="py-28 sm:py-36 bg-[#FAF8F3] border-b border-[#D9D3C8] relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 relative z-10">
        <div className="flex flex-col items-center text-center">
          {/* Header Stars */}
          <div className="flex items-center gap-1.5 text-[#B99A67] mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
          </div>

          <span className="text-[11px] uppercase tracking-widest-2xl text-[#B99A67] font-mono block mb-8 font-semibold">
            WORDS FROM OUR COUPLES
          </span>

          {/* Quote Block */}
          <div className="relative max-w-4xl min-h-[220px] flex items-center justify-center">
            <Quote className="w-16 h-16 text-[#B99A67]/20 absolute -top-8 -left-4 pointer-events-none" />
            <blockquote className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#171614] font-normal leading-relaxed italic transition-all duration-500 ease-in-out">
              “{active.quote}”
            </blockquote>
          </div>

          {/* Client Details */}
          <div className="mt-8 space-y-1">
            <h4 className="font-sans text-base font-semibold tracking-wider text-[#171614]">
              {active.couple}
            </h4>
            <p className="text-xs font-mono text-[#B99A67] font-medium">
              {active.event}
            </p>
            <p className="text-xs font-mono text-[#6F6A61]">
              {active.location} • {active.year}
            </p>
          </div>

          {/* Nav Controls */}
          <div className="flex items-center gap-4 mt-10">
            <button
              onClick={handlePrev}
              className="p-3 rounded-full bg-white hover:bg-[#B99A67] hover:text-white text-[#171614] border border-[#D9D3C8] shadow-sm transition-all duration-300"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <span className="text-xs font-mono text-[#6F6A61] px-2 font-medium">
              0{currentIndex + 1} / 0{testimonials.length}
            </span>

            <button
              onClick={handleNext}
              className="p-3 rounded-full bg-white hover:bg-[#B99A67] hover:text-white text-[#171614] border border-[#D9D3C8] shadow-sm transition-all duration-300"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
