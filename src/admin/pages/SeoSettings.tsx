import React, { useEffect, useState } from 'react';
import { Save, Loader2, Globe, Search, Share2 } from 'lucide-react';
import { useAdminToast } from '../components/AdminToast';

export const SeoSettings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useAdminToast();

  const [seoData, setSeoData] = useState({
    title: 'Z Skills Photography | Wedding Photography & Cinematic Films',
    description:
      'Z Skills Photography creates cinematic wedding films, photography, pre-wedding shoots, event coverage and professional reels in Sirsa, India.',
    keywords:
      'Z Skills Photography, wedding cinematography Sirsa, wedding photography Haryana, pre-wedding shoots Sirsa, Anand Karaj films, luxury wedding videography',
    ogTitle: 'Z Skills Photography | Wedding Photography & Cinematic Films',
    ogDescription:
      'Stories That Feel Like Cinema. Luxury wedding films, editorial photography, and pre-wedding visual storytelling in Sirsa, India.',
    ogImage: '/assets/photos/bridal-masterpiece-4k.jpg',
    canonicalUrl: 'https://zskillsphotography.com/',
  });

  const loadSeo = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/content/seo');
      if (res.ok) {
        const data = await res.json();
        setSeoData((prev) => ({ ...prev, ...data }));
      }
    } catch {
      toast('Failed to load SEO settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSeo();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSeoData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await fetch('/api/content/seo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(seoData),
      });

      if (res.ok) {
        toast('SEO metadata updated successfully!', 'success');
      } else {
        toast('Failed to save SEO settings', 'error');
      }
    } catch {
      toast('Network error saving SEO metadata', 'error');
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
            Search & Social Indexing
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-white font-normal">
            SEO & Metadata Settings
          </h1>
          <p className="text-xs text-white/50 font-sans mt-1">
            Configure Google search engine snippets, OpenGraph social cards, and canonical links.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2 rounded-xl bg-champagne hover:bg-champagne-dark text-black font-semibold text-xs font-mono tracking-wider flex items-center gap-2 shadow-lg shadow-champagne/20 transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Saving...' : 'Save Metadata'}</span>
        </button>
      </div>

      {/* Google Search Engine Preview Card */}
      <div className="bg-[#121217] border border-white/10 rounded-2xl p-6 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-white/50 uppercase tracking-wider">
          <Search className="w-4 h-4 text-champagne" />
          <span>Google Search Result Snippet Preview</span>
        </div>
        <div className="p-4 rounded-xl bg-[#09090C] border border-white/5 space-y-1">
          <p className="text-[11px] font-mono text-emerald-400 truncate">
            {seoData.canonicalUrl || 'https://zskillsphotography.com'}
          </p>
          <h3 className="text-base text-blue-400 font-medium hover:underline cursor-pointer">
            {seoData.title || 'Z Skills Photography | Wedding Photography & Cinematic Films'}
          </h3>
          <p className="text-xs text-white/60 line-clamp-2">
            {seoData.description || 'Luxury wedding films and editorial photography in Sirsa, India.'}
          </p>
        </div>
      </div>

      {/* Primary Search Engine Fields */}
      <div className="bg-[#121217] border border-white/10 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-champagne uppercase tracking-wider font-mono">
          Search Engine Directives
        </h2>

        <div>
          <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
            Website Browser Title (title tag)
          </label>
          <input
            type="text"
            name="title"
            value={seoData.title}
            onChange={handleChange}
            className="w-full px-3.5 py-2 rounded-xl bg-[#09090C] border border-white/15 text-white text-sm focus:border-champagne"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
            Meta Description (150-160 chars recommended)
          </label>
          <textarea
            rows={3}
            name="description"
            value={seoData.description}
            onChange={handleChange}
            className="w-full px-3.5 py-2 rounded-xl bg-[#09090C] border border-white/15 text-white text-sm focus:border-champagne"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
            Search Keywords (Comma-separated)
          </label>
          <input
            type="text"
            name="keywords"
            value={seoData.keywords}
            onChange={handleChange}
            className="w-full px-3.5 py-2 rounded-xl bg-[#09090C] border border-white/15 text-white text-sm focus:border-champagne"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
            Canonical URL
          </label>
          <input
            type="text"
            name="canonicalUrl"
            value={seoData.canonicalUrl}
            onChange={handleChange}
            className="w-full px-3.5 py-2 rounded-xl bg-[#09090C] border border-white/15 text-white text-sm focus:border-champagne font-mono"
          />
        </div>
      </div>

      {/* OpenGraph & Social Sharing */}
      <div className="bg-[#121217] border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 text-champagne">
          <Share2 className="w-4 h-4" />
          <h2 className="text-sm font-semibold uppercase tracking-wider font-mono">
            OpenGraph & WhatsApp / Facebook Preview Card
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
              OG Title
            </label>
            <input
              type="text"
              name="ogTitle"
              value={seoData.ogTitle}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl bg-[#09090C] border border-white/15 text-white text-sm focus:border-champagne"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
              OG Share Image URL
            </label>
            <input
              type="text"
              name="ogImage"
              value={seoData.ogImage}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl bg-[#09090C] border border-white/15 text-white text-sm focus:border-champagne font-mono"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
              OG Description
            </label>
            <textarea
              rows={2}
              name="ogDescription"
              value={seoData.ogDescription}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl bg-[#09090C] border border-white/15 text-white text-sm focus:border-champagne"
            />
          </div>
        </div>
      </div>
    </form>
  );
};
