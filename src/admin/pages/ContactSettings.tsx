import React, { useEffect, useState } from 'react';
import { Save, Loader2, Phone, MessageSquare, MapPin, Mail, Clock } from 'lucide-react';
import { useAdminToast } from '../components/AdminToast';

export const ContactSettings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useAdminToast();

  const [formData, setFormData] = useState({
    phone: '+91 9729371307',
    phoneRaw: '9729371307',
    phoneTel: 'tel:+919729371307',
    whatsappUrl: 'https://wa.me/919729371307',
    email: 'kambojkamaljeet13@gmail.com',
    location: 'Sirsa, India',
    schemaAddress: 'Sirsa, Haryana, India',
    businessHours: 'Monday - Sunday: 9:00 AM - 9:00 PM',
    ctaHeadline: 'Let’s Create Something Eternal',
    ctaDescription:
      'Based in Sirsa, Haryana. Available across India and worldwide for destination weddings.',
  });

  const loadContact = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/content/contact');
      if (res.ok) {
        const data = await res.json();
        setFormData((prev) => ({ ...prev, ...data }));
      }
    } catch {
      toast('Failed to load contact settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContact();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      // Auto-compute tel: and wa.me if phone or whatsapp changes
      if (name === 'phone') {
        const digits = value.replace(/\D/g, '');
        const internationalDigits = digits.startsWith('91') ? digits : `91${digits}`;
        updated.phoneTel = `tel:+${internationalDigits}`;
        updated.whatsappUrl = `https://wa.me/${internationalDigits}`;
      }

      return updated;
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await fetch('/api/content/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast('Contact settings updated and active on website', 'success');
      } else {
        toast('Failed to save contact settings', 'error');
      }
    } catch {
      toast('Error saving contact settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="w-8 h-8 text-champagne animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-champagne block mb-1">
            Studio Communications
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-white font-normal">
            Contact Settings
          </h1>
          <p className="text-xs text-white/50 font-sans mt-1">
            Configure direct telephone, WhatsApp dispatch, location, and inquiry CTAs.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2 rounded-xl bg-champagne hover:bg-champagne-dark text-black font-semibold text-xs font-mono tracking-wider flex items-center gap-2 shadow-lg shadow-champagne/20 transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Phone & Direct Calling */}
        <div className="bg-[#121217] border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2.5 text-champagne">
            <Phone className="w-4 h-4" />
            <h2 className="text-sm font-semibold uppercase tracking-wider font-mono">
              Phone & Telephone Links
            </h2>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
              Display Phone Number
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl bg-[#09090C] border border-white/15 text-white text-sm focus:border-champagne"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
              Generated Dial Link (tel:)
            </label>
            <input
              type="text"
              name="phoneTel"
              value={formData.phoneTel}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl bg-[#09090C] border border-white/15 text-white/60 text-xs font-mono"
            />
          </div>
        </div>

        {/* WhatsApp & Messaging */}
        <div className="bg-[#121217] border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2.5 text-champagne">
            <MessageSquare className="w-4 h-4" />
            <h2 className="text-sm font-semibold uppercase tracking-wider font-mono">
              WhatsApp Integration
            </h2>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
              WhatsApp Direct Link
            </label>
            <input
              type="text"
              name="whatsappUrl"
              value={formData.whatsappUrl}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl bg-[#09090C] border border-white/15 text-white text-sm focus:border-champagne font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
              Studio Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl bg-[#09090C] border border-white/15 text-white text-sm focus:border-champagne"
            />
          </div>
        </div>

        {/* Location & Schema */}
        <div className="bg-[#121217] border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2.5 text-champagne">
            <MapPin className="w-4 h-4" />
            <h2 className="text-sm font-semibold uppercase tracking-wider font-mono">
              Location & Address
            </h2>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
              Display Location (Primary)
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl bg-[#09090C] border border-white/15 text-white text-sm focus:border-champagne"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
              Schema Address (SEO & Structured Data)
            </label>
            <input
              type="text"
              name="schemaAddress"
              value={formData.schemaAddress}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl bg-[#09090C] border border-white/15 text-white text-sm focus:border-champagne"
            />
          </div>
        </div>

        {/* Business Hours */}
        <div className="bg-[#121217] border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2.5 text-champagne">
            <Clock className="w-4 h-4" />
            <h2 className="text-sm font-semibold uppercase tracking-wider font-mono">
              Business Hours & Schedule
            </h2>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
              Consultation & Studio Hours
            </label>
            <input
              type="text"
              name="businessHours"
              value={formData.businessHours}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl bg-[#09090C] border border-white/15 text-white text-sm focus:border-champagne"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
              CTA Section Headline
            </label>
            <input
              type="text"
              name="ctaHeadline"
              value={formData.ctaHeadline}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl bg-[#09090C] border border-white/15 text-white text-sm focus:border-champagne"
            />
          </div>
        </div>
      </div>
    </form>
  );
};
