import React, { useState } from 'react';
import { studioInfo } from '../../data/studioInfo';
import { Phone, Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { WhatsAppIcon } from '../common/Icons';
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
        colors: ['#B99A67', '#DEC5A3', '#171614'],
      });
    } catch (_) {}
  };

  const getWhatsAppDirectLink = () => {
    const text = encodeURIComponent(
      `Hello Preet Cinematography, I would like to inquire about booking.\n\nName: ${formData.name || 'Client'}\nEvent: ${formData.eventType}\nDate: ${formData.eventDate || 'TBD'}\nLocation: ${formData.location || 'Punjab'}\nNote: ${formData.message || 'Please share availability and packages.'}`
    );
    return `https://wa.me/919729371307?text=${text}`;
  };

  return (
    <section id="contact" className="py-28 sm:py-36 bg-[#F5F2EA] relative overflow-hidden border-b border-[#D9D3C8]">
      {/* Background Subtle Ambience */}
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#B99A67]/[0.04] rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Direct Info & Editorial Contact (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="text-[11px] uppercase tracking-widest-2xl text-[#B99A67] font-mono block mb-3 font-semibold">
                LET'S CONNECT
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#171614] font-normal leading-[1.12]">
                Begin Your <br />
                <span className="italic text-shimmer">Visual Legacy.</span>
              </h2>
            </div>

            <p className="text-[#6F6A61] text-sm sm:text-base font-sans font-light leading-relaxed">
              Whether you are planning an intimate Sikh Anand Karaj, a lavish 3-day Punjabi wedding, or an editorial pre-wedding film, we would love to hear from you.
            </p>

            {/* Direct Details Cards */}
            <div className="space-y-4 pt-4">
              <a
                href={studioInfo.phoneTel}
                className="flex items-center gap-4 p-4 rounded-xl bg-[#FAF8F3] border border-[#D9D3C8] hover:border-[#B99A67] hover:bg-white transition-all group shadow-sm"
                data-cursor="open"
                data-cursor-label="CALL"
              >
                <div className="w-10 h-10 rounded-full bg-[#B99A67]/15 text-[#B99A67] flex items-center justify-center group-hover:bg-[#B99A67] group-hover:text-white transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#6F6A61] uppercase tracking-widest block font-medium">
                    Call Direct
                  </span>
                  <span className="text-sm font-mono text-[#171614] group-hover:text-[#B99A67] transition-colors font-medium">
                    {studioInfo.phone}
                  </span>
                </div>
              </a>

              <a
                href={studioInfo.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl bg-[#FAF8F3] border border-[#D9D3C8] hover:border-[#B99A67] hover:bg-white transition-all group shadow-sm"
                data-cursor="open"
                data-cursor-label="WHATSAPP"
              >
                <div className="w-10 h-10 rounded-full bg-[#B99A67]/15 text-[#B99A67] flex items-center justify-center group-hover:bg-[#B99A67] group-hover:text-white transition-colors">
                  <WhatsAppIcon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#6F6A61] uppercase tracking-widest block font-medium">
                    WhatsApp Chat
                  </span>
                  <span className="text-sm font-mono text-[#171614] group-hover:text-[#B99A67] transition-colors font-medium">
                    Connect on WhatsApp
                  </span>
                </div>
              </a>

              <a
                href={`mailto:${studioInfo.email}`}
                className="flex items-center gap-4 p-4 rounded-xl bg-[#FAF8F3] border border-[#D9D3C8] hover:border-[#B99A67] hover:bg-white transition-all group shadow-sm"
              >
                <div className="w-10 h-10 rounded-full bg-[#B99A67]/15 text-[#B99A67] flex items-center justify-center group-hover:bg-[#B99A67] group-hover:text-white transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#6F6A61] uppercase tracking-widest block font-medium">
                    Email Inquiries
                  </span>
                  <span className="text-sm font-sans text-[#171614] group-hover:text-[#B99A67] transition-colors">
                    {studioInfo.email}
                  </span>
                </div>
              </a>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-[#FAF8F3] border border-[#D9D3C8] shadow-sm">
                <div className="w-10 h-10 rounded-full bg-[#B99A67]/15 text-[#B99A67] flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#6F6A61] uppercase tracking-widest block font-medium">
                    Studio Location
                  </span>
                  <span className="text-sm font-sans text-[#171614]">
                    {studioInfo.location}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Booking Form (7 cols) */}
          <div className="lg:col-span-7 bg-[#FAF8F3] rounded-2xl p-6 sm:p-10 border border-[#D9D3C8] shadow-xl">
            {submitted ? (
              <div className="py-16 text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-[#B99A67]/20 text-[#B99A67] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-3xl text-[#171614]">Thank You!</h3>
                <p className="text-[#6F6A61] text-sm max-w-md mx-auto font-sans leading-relaxed">
                  Your inquiry has been received. Preet and our creative production team will review your dates and reach out within 24 hours.
                </p>
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a
                    href={getWhatsAppDirectLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-full bg-[#B99A67] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 shadow-md hover:bg-[#A38350] transition-colors"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                    <span>Connect on WhatsApp</span>
                  </a>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-3 rounded-full border border-[#D9D3C8] text-xs font-mono uppercase tracking-wider text-[#171614] hover:text-[#B99A67]"
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
                    <label className="text-[11px] font-mono uppercase tracking-wider text-[#171614] block font-medium">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Jaspreet Kaur"
                      className="w-full bg-white border border-[#D9D3C8] rounded-xl px-4 py-3 text-sm text-[#171614] placeholder-[#6F6A61]/50 focus:outline-none focus:border-[#B99A67] transition-colors shadow-xs"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-[#171614] block font-medium">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 9729371307"
                      className="w-full bg-white border border-[#D9D3C8] rounded-xl px-4 py-3 text-sm text-[#171614] placeholder-[#6F6A61]/50 focus:outline-none focus:border-[#B99A67] transition-colors shadow-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-[#171614] block font-medium">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@domain.com"
                      className="w-full bg-white border border-[#D9D3C8] rounded-xl px-4 py-3 text-sm text-[#171614] placeholder-[#6F6A61]/50 focus:outline-none focus:border-[#B99A67] transition-colors shadow-xs"
                    />
                  </div>

                  {/* Event Type */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-[#171614] block font-medium">
                      Event Type *
                    </label>
                    <select
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleChange}
                      className="w-full bg-white border border-[#D9D3C8] rounded-xl px-4 py-3 text-sm text-[#171614] focus:outline-none focus:border-[#B99A67] transition-colors shadow-xs"
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
                    <label className="text-[11px] font-mono uppercase tracking-wider text-[#171614] block font-medium">
                      Event Date / Estimated Month
                    </label>
                    <input
                      type="date"
                      name="eventDate"
                      value={formData.eventDate}
                      onChange={handleChange}
                      className="w-full bg-white border border-[#D9D3C8] rounded-xl px-4 py-3 text-sm text-[#171614] focus:outline-none focus:border-[#B99A67] transition-colors shadow-xs"
                    />
                  </div>

                  {/* Event Location */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-[#171614] block font-medium">
                      City / Venue Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g. Barnala, Zira, Amritsar, or Destination"
                      className="w-full bg-white border border-[#D9D3C8] rounded-xl px-4 py-3 text-sm text-[#171614] placeholder-[#6F6A61]/50 focus:outline-none focus:border-[#B99A67] transition-colors shadow-xs"
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-[#171614] block font-medium">
                    Tell Us About Your Vision & Events
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Share event dates, number of functions, specific locations, or special requests..."
                    className="w-full bg-white border border-[#D9D3C8] rounded-xl px-4 py-3 text-sm text-[#171614] placeholder-[#6F6A61]/50 focus:outline-none focus:border-[#B99A67] transition-colors resize-none shadow-xs"
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                  <button
                    type="submit"
                    className="w-full sm:flex-1 py-4 rounded-xl bg-[#B99A67] hover:bg-[#A38350] text-white font-sans font-semibold text-xs tracking-widest uppercase transition-all shadow-lg hover:shadow-[#B99A67]/25 flex items-center justify-center gap-2 group"
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
                    className="w-full sm:w-auto px-6 py-4 rounded-xl border border-[#D9D3C8] hover:border-[#B99A67] text-[#171614] hover:text-[#B99A67] bg-white text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xs"
                    data-cursor="open"
                    data-cursor-label="WHATSAPP"
                  >
                    <WhatsAppIcon className="w-4 h-4 text-[#B99A67]" />
                    <span>Connect on WhatsApp</span>
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
