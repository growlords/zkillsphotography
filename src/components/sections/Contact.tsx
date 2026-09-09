import React, { useState } from 'react';
import { studioInfo } from '../../data/studioInfo';
import { Phone, Mail, MapPin, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import confetti from 'canvas-confetti';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: 'Wedding',
    eventDate: '',
    location: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#C6A87D', '#DEC5A3', '#F5F4F0'],
      });
    } catch (_) {}
  };

  const getWhatsAppDirectLink = () => {
    const text = encodeURIComponent(
      `Hello Preet Cinematography, I would like to inquire about booking.\n\nName: ${formData.name || 'Client'}\nEvent: ${formData.eventType}\nDate: ${formData.eventDate || 'TBD'}\nLocation: ${formData.location || 'Punjab'}\nNote: ${formData.message || 'Please share availability and packages.'}`
    );
    return `https://wa.me/919988389012?text=${text}`;
  };

  return (
    <section id="contact" className="py-28 sm:py-36 bg-dark relative overflow-hidden">
      {/* Background Subtle Ambience */}
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-champagne/[0.02] rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Direct Info & Editorial Contact (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="text-[11px] uppercase tracking-widest-2xl text-champagne font-mono block mb-3">
                LET'S CONNECT
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-pearl font-normal leading-[1.12]">
                Begin Your <br />
                <span className="italic text-shimmer">Visual Legacy.</span>
              </h2>
            </div>

            <p className="text-pearl-muted text-sm sm:text-base font-sans font-light leading-relaxed">
              Whether you are planning an intimate Sikh Anand Karaj, a lavish 3-day Punjabi wedding, or an editorial pre-wedding film, we would love to hear from you.
            </p>

            {/* Direct Details Cards */}
            <div className="space-y-4 pt-4">
              <a
                href={studioInfo.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl bg-dark-900 border border-white/10 hover:border-champagne/50 hover:bg-dark-850 transition-all group"
                data-cursor="open"
                data-cursor-label="WHATSAPP"
              >
                <div className="w-10 h-10 rounded-full bg-champagne/10 text-champagne flex items-center justify-center group-hover:bg-champagne group-hover:text-dark transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-pearl-muted uppercase tracking-widest block">
                    Phone & WhatsApp Direct
                  </span>
                  <span className="text-sm font-mono text-pearl group-hover:text-champagne transition-colors">
                    {studioInfo.phone}
                  </span>
                </div>
              </a>

              <a
                href={`mailto:${studioInfo.email}`}
                className="flex items-center gap-4 p-4 rounded-xl bg-dark-900 border border-white/10 hover:border-champagne/50 hover:bg-dark-850 transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-champagne/10 text-champagne flex items-center justify-center group-hover:bg-champagne group-hover:text-dark transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-pearl-muted uppercase tracking-widest block">
                    Email Inquiries
                  </span>
                  <span className="text-sm font-sans text-pearl group-hover:text-champagne transition-colors">
                    {studioInfo.email}
                  </span>
                </div>
              </a>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-dark-900 border border-white/10">
                <div className="w-10 h-10 rounded-full bg-champagne/10 text-champagne flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-pearl-muted uppercase tracking-widest block">
                    Studio Location
                  </span>
                  <span className="text-sm font-sans text-pearl">
                    {studioInfo.location}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Booking Form (7 cols) */}
          <div className="lg:col-span-7 bg-dark-900/80 rounded-2xl p-6 sm:p-10 border border-white/10 backdrop-blur-xl shadow-2xl">
            {submitted ? (
              <div className="py-16 text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-champagne/20 text-champagne flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-3xl text-pearl">Thank You!</h3>
                <p className="text-pearl-muted text-sm max-w-md mx-auto font-sans leading-relaxed">
                  Your inquiry has been received. Preet and our creative production team will review your dates and reach out within 24 hours.
                </p>
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a
                    href={getWhatsAppDirectLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-full bg-champagne text-dark text-xs font-semibold uppercase tracking-wider flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Send via WhatsApp Now</span>
                  </a>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-3 rounded-full border border-white/10 text-xs font-mono uppercase tracking-wider text-pearl hover:text-champagne"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-pearl-muted block">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Jaspreet Kaur"
                      className="w-full bg-dark-950/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-pearl placeholder-white/20 focus:outline-none focus:border-champagne transition-colors"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-pearl-muted block">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 99883 89012"
                      className="w-full bg-dark-950/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-pearl placeholder-white/20 focus:outline-none focus:border-champagne transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-pearl-muted block">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@domain.com"
                      className="w-full bg-dark-950/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-pearl placeholder-white/20 focus:outline-none focus:border-champagne transition-colors"
                    />
                  </div>

                  {/* Event Type */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-pearl-muted block">
                      Event Type *
                    </label>
                    <select
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleChange}
                      className="w-full bg-dark-950/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-pearl focus:outline-none focus:border-champagne transition-colors"
                    >
                      <option value="Wedding Cinematography & Photo">Wedding Cinematography & Photography</option>
                      <option value="Anand Karaj Ceremony">Sacred Anand Karaj Ceremony</option>
                      <option value="Pre-Wedding Shoot">Pre-Wedding Shoot</option>
                      <option value="Mehendi / Sangeet / Party">Mehendi / Sangeet / Party</option>
                      <option value="Retirement & Milestone Event">Retirement & Milestone Event</option>
                      <option value="Reels & Social Production">Reels & Social Production</option>
                      <option value="Fine Art Portraits">Fine Art Portraits</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Event Date */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-pearl-muted block">
                      Event Date / Estimated Month
                    </label>
                    <input
                      type="date"
                      name="eventDate"
                      value={formData.eventDate}
                      onChange={handleChange}
                      className="w-full bg-dark-950/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-pearl focus:outline-none focus:border-champagne transition-colors"
                    />
                  </div>

                  {/* Event Location */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-pearl-muted block">
                      City / Venue Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g. Barnala, Zira, Amritsar, or Destination"
                      className="w-full bg-dark-950/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-pearl placeholder-white/20 focus:outline-none focus:border-champagne transition-colors"
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-pearl-muted block">
                    Tell Us About Your Vision & Events
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Share event dates, number of functions, specific locations, or special requests..."
                    className="w-full bg-dark-950/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-pearl placeholder-white/20 focus:outline-none focus:border-champagne transition-colors resize-none"
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                  <button
                    type="submit"
                    className="w-full sm:flex-1 py-4 rounded-xl bg-champagne hover:bg-champagne-light text-dark font-sans font-semibold text-xs tracking-widest uppercase transition-all shadow-xl hover:shadow-champagne/20 flex items-center justify-center gap-2 group"
                    data-cursor="open"
                    data-cursor-label="SUBMIT"
                  >
                    <span>Send Enquiry</span>
                    <Send className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <a
                    href={getWhatsAppDirectLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-4 rounded-xl border border-white/15 hover:border-champagne text-pearl hover:text-champagne text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                    data-cursor="open"
                    data-cursor-label="WHATSAPP"
                  >
                    <MessageSquare className="w-4 h-4 text-champagne" />
                    <span>Quick WhatsApp</span>
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
