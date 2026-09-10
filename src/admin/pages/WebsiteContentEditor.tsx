import React, { useEffect, useState } from 'react';
import { Save, Loader2, RefreshCw } from 'lucide-react';
import { useAdminToast } from '../components/AdminToast';

export const WebsiteContentEditor: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useAdminToast();

  const [formData, setFormData] = useState({
    // Branding
    brandName: 'Z SKILLS PHOTOGRAPHY',
    tagline: 'Stories That Feel Like Cinema.',
    location: 'Sirsa, India',
    // Hero
    heroBadge: 'CINEMATIC FILM & LUXURY PHOTOGRAPHY',
    heroHeadline: 'Stories That Feel Like Cinema.',
    heroSubheadline: 'Wedding Films • Photography • Pre-Weddings • Events • Reels',
    heroDescription: 'Z Skills Photography is an award-winning visual storytelling studio crafting high-end wedding films, editorial photography, and cinematic narratives in Sirsa and worldwide.',
    heroPrimaryCtaText: 'Explore Work',
    heroSecondaryCtaText: 'Book Your Dates',
    // About
    aboutBadge: 'THE CREATIVE PHILOSOPHY',
    aboutHeading: 'Behind Every Lens, A Timeless Story.',
    aboutDescription: 'At Z Skills Photography, we believe every love story, wedding celebration, and milestone is an unrepeatable chapter of human emotion. Based in Sirsa, India, our creative team documents genuine moments with editorial precision, nuanced lighting, and timeless color grading.',
    // Services
    servicesHeading: 'Tailored Cinematography & Photography',
    servicesDescription: 'Bespoke packages designed for multi-day weddings, destination celebrations, pre-wedding storytelling, and commercial reels.',
    // Process
    processHeading: 'The Art of Timeless Filmmaking',
    processDescription: 'Every frame is carefully considered, from the raw emotional capture to the final color-graded archive.',
    // CTA
    ctaHeadline: 'Begin Your Visual Legacy.',
    ctaDescription: 'Whether you are planning an intimate Anand Karaj, a lavish multi-day Punjabi wedding celebration, or an editorial pre-wedding film, we would love to hear from you.',
    // Contact
    contactHeading: 'Let’s Create Something Eternal',
    contactDescription: 'Based in Sirsa, Haryana. Available across India and worldwide for destination weddings.',
    // Footer
    footerTagline: 'Preserving emotional legacies through cinematic lenses and editorial stills in Sirsa, India.',
    footerCopyright: '© 2026 Z Skills Photography. All rights reserved.',
  });

  const loadContent = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/content');
      if (res.ok) {
        const data = await res.json();
        setFormData((prev) => ({
          ...prev,
          brandName: data.branding?.brandName || prev.brandName,
          tagline: data.branding?.tagline || prev.tagline,
          location: data.branding?.location || prev.location,
          heroBadge: data.hero?.badge || prev.heroBadge,
          heroHeadline: data.hero?.headline || prev.heroHeadline,
          heroSubheadline: data.hero?.subheadline || prev.heroSubheadline,
          heroDescription: data.hero?.description || prev.heroDescription,
          heroPrimaryCtaText: data.hero?.primaryCtaText || prev.heroPrimaryCtaText,
          heroSecondaryCtaText: data.hero?.secondaryCtaText || prev.heroSecondaryCtaText,
          aboutBadge: data.about?.badge || prev.aboutBadge,
          aboutHeading: data.about?.heading || prev.aboutHeading,
          aboutDescription: data.about?.description || prev.aboutDescription,
          ctaHeadline: data.contact?.ctaHeadline || prev.ctaHeadline,
          ctaDescription: data.contact?.ctaDescription || prev.ctaDescription,
        }));
      }
    } catch {
      toast('Error loading website content', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);

      // Save sections individually via API
      await Promise.all([
        // Branding
        fetch('/api/content/branding', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            brandName: formData.brandName,
            tagline: formData.tagline,
            location: formData.location,
          }),
        }),
        // Hero
        fetch('/api/content/hero', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            badge: formData.heroBadge,
            headline: formData.heroHeadline,
            subheadline: formData.heroSubheadline,
            description: formData.heroDescription,
            primaryCtaText: formData.heroPrimaryCtaText,
            secondaryCtaText: formData.heroSecondaryCtaText,
          }),
        }),
        // About
        fetch('/api/content/about', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            badge: formData.aboutBadge,
            heading: formData.aboutHeading,
            description: formData.aboutDescription,
          }),
        }),
        // Contact CTA
        fetch('/api/content/contact', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ctaHeadline: formData.ctaHeadline,
            ctaDescription: formData.ctaDescription,
          }),
        }),
      ]);

      toast('Website content saved and published successfully!', 'success');
    } catch (err: any) {
      toast(err.message || 'Failed to save content', 'error');
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
            Live Text Management
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-white font-normal">
            Website Content Editor
          </h1>
          <p className="text-xs text-white/50 font-sans mt-1">
            Edit all core headings, descriptions, badges, and button labels across the public website.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadContent}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-mono flex items-center gap-1.5 transition-all"
            title="Reload from server"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-champagne hover:bg-champagne-dark text-black font-semibold text-xs font-mono tracking-wider flex items-center gap-2 shadow-lg shadow-champagne/20 transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saving ? 'Publishing...' : 'Save & Publish'}</span>
          </button>
        </div>
      </div>

      {/* 1. Global Brand Settings */}
      <div className="bg-[#121217] border border-white/10 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-champagne uppercase tracking-wider font-mono">
          1. Brand Identity
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
              Brand Name
            </label>
            <input
              type="text"
              name="brandName"
              value={formData.brandName}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl bg-[#09090C] border border-white/15 text-white text-sm focus:outline-none focus:border-champagne"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
              Studio Tagline
            </label>
            <input
              type="text"
              name="tagline"
              value={formData.tagline}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl bg-[#09090C] border border-white/15 text-white text-sm focus:outline-none focus:border-champagne"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
              Studio Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl bg-[#09090C] border border-white/15 text-white text-sm focus:outline-none focus:border-champagne"
            />
          </div>
        </div>
      </div>

      {/* 2. Hero Section Content */}
      <div className="bg-[#121217] border border-white/10 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-champagne uppercase tracking-wider font-mono">
          2. Hero Section
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
              Hero Badge
            </label>
            <input
              type="text"
              name="heroBadge"
              value={formData.heroBadge}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl bg-[#09090C] border border-white/15 text-white text-sm focus:outline-none focus:border-champagne"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
              Main Headline
            </label>
            <input
              type="text"
              name="heroHeadline"
              value={formData.heroHeadline}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl bg-[#09090C] border border-white/15 text-white text-sm focus:outline-none focus:border-champagne"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
              Subheadline (Specialties)
            </label>
            <input
              type="text"
              name="heroSubheadline"
              value={formData.heroSubheadline}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl bg-[#09090C] border border-white/15 text-white text-sm focus:outline-none focus:border-champagne"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
              Hero Description
            </label>
            <textarea
              name="heroDescription"
              rows={2}
              value={formData.heroDescription}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl bg-[#09090C] border border-white/15 text-white text-sm focus:outline-none focus:border-champagne"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
              Primary CTA Button
            </label>
            <input
              type="text"
              name="heroPrimaryCtaText"
              value={formData.heroPrimaryCtaText}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl bg-[#09090C] border border-white/15 text-white text-sm focus:outline-none focus:border-champagne"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
              Secondary CTA Button
            </label>
            <input
              type="text"
              name="heroSecondaryCtaText"
              value={formData.heroSecondaryCtaText}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl bg-[#09090C] border border-white/15 text-white text-sm focus:outline-none focus:border-champagne"
            />
          </div>
        </div>
      </div>

      {/* 3. About Section */}
      <div className="bg-[#121217] border border-white/10 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-champagne uppercase tracking-wider font-mono">
          3. About Studio
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
                About Badge
              </label>
              <input
                type="text"
                name="aboutBadge"
                value={formData.aboutBadge}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl bg-[#09090C] border border-white/15 text-white text-sm focus:outline-none focus:border-champagne"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
                About Heading
              </label>
              <input
                type="text"
                name="aboutHeading"
                value={formData.aboutHeading}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl bg-[#09090C] border border-white/15 text-white text-sm focus:outline-none focus:border-champagne"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
              About Description
            </label>
            <textarea
              name="aboutDescription"
              rows={3}
              value={formData.aboutDescription}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl bg-[#09090C] border border-white/15 text-white text-sm focus:outline-none focus:border-champagne"
            />
          </div>
        </div>
      </div>

      {/* 4. Booking Call-To-Action */}
      <div className="bg-[#121217] border border-white/10 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-champagne uppercase tracking-wider font-mono">
          4. Booking Call To Action
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
              CTA Heading
            </label>
            <input
              type="text"
              name="ctaHeadline"
              value={formData.ctaHeadline}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl bg-[#09090C] border border-white/15 text-white text-sm focus:outline-none focus:border-champagne"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
              CTA Description
            </label>
            <textarea
              name="ctaDescription"
              rows={2}
              value={formData.ctaDescription}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl bg-[#09090C] border border-white/15 text-white text-sm focus:outline-none focus:border-champagne"
            />
          </div>
        </div>
      </div>

      {/* Bottom Save Bar */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-champagne hover:bg-champagne-dark text-black font-semibold text-xs font-mono tracking-wider flex items-center gap-2 shadow-lg shadow-champagne/20 transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Saving...' : 'Save & Publish Website Content'}</span>
        </button>
      </div>
    </form>
  );
};
