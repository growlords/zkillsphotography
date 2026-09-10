import React, { useEffect, useState } from 'react';
import { Save, Loader2, MessageSquare, Phone, ExternalLink } from 'lucide-react';
import { InstagramIcon, YoutubeIcon } from '../../components/common/Icons';
import { useAdminToast } from '../components/AdminToast';

export const SocialSettings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useAdminToast();

  const [formData, setFormData] = useState({
    instagramUrl:
      'https://www.instagram.com/its._kamalpreet_13?stkn=MXBmOWR3NG9wNjV3bA%3D%3D',
    instagramHandle: '@its._kamalpreet_13',
    youtubeUrl: 'https://youtube.com/@zskillsphotography?si=9dr-0VvT0ZFkjrDl',
    whatsappUrl: 'https://wa.me/919729371307',
    phoneTel: 'tel:+919729371307',
  });

  const loadSocial = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/content/social');
      if (res.ok) {
        const data = await res.json();
        setFormData((prev) => ({ ...prev, ...data }));
      }
    } catch {
      toast('Failed to load social settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSocial();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await fetch('/api/content/social', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast('Social links updated across the live website!', 'success');
      } else {
        toast('Failed to save social links', 'error');
      }
    } catch {
      toast('Network error saving social links', 'error');
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
            Digital Channels
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-white font-normal">
            Social Media Management
          </h1>
          <p className="text-xs text-white/50 font-sans mt-1">
            Manage links for Instagram, YouTube, WhatsApp, and phone dispatch.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2 rounded-xl bg-champagne hover:bg-champagne-dark text-black font-semibold text-xs font-mono tracking-wider flex items-center gap-2 shadow-lg shadow-champagne/20 transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Saving...' : 'Save Links'}</span>
        </button>
      </div>

      <div className="space-y-4 max-w-3xl">
        {/* Instagram */}
        <div className="bg-[#121217] border border-white/10 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-pink-400">
              <InstagramIcon className="w-4 h-4" />
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-white">
                Instagram Channel
              </span>
            </div>
            {formData.instagramUrl && (
              <a
                href={formData.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-white/50 hover:text-white flex items-center gap-1"
              >
                <span>Test Link</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-white/50 mb-1">
              Full Instagram URL
            </label>
            <input
              type="text"
              name="instagramUrl"
              value={formData.instagramUrl}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl bg-[#09090C] border border-white/15 text-white text-xs font-mono focus:border-champagne"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-white/50 mb-1">
              Display Handle
            </label>
            <input
              type="text"
              name="instagramHandle"
              value={formData.instagramHandle}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl bg-[#09090C] border border-white/15 text-white text-xs font-mono focus:border-champagne"
            />
          </div>
        </div>

        {/* YouTube */}
        <div className="bg-[#121217] border border-white/10 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-red-500">
              <YoutubeIcon className="w-4 h-4" />
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-white">
                YouTube Channel
              </span>
            </div>
            {formData.youtubeUrl && (
              <a
                href={formData.youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-white/50 hover:text-white flex items-center gap-1"
              >
                <span>Test Link</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-white/50 mb-1">
              Full YouTube URL
            </label>
            <input
              type="text"
              name="youtubeUrl"
              value={formData.youtubeUrl}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl bg-[#09090C] border border-white/15 text-white text-xs font-mono focus:border-champagne"
            />
          </div>
        </div>

        {/* WhatsApp & Phone */}
        <div className="bg-[#121217] border border-white/10 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2.5 text-emerald-400">
            <MessageSquare className="w-4 h-4" />
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-white">
              Instant Messaging & Calls
            </span>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-white/50 mb-1">
              WhatsApp Link (wa.me)
            </label>
            <input
              type="text"
              name="whatsappUrl"
              value={formData.whatsappUrl}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl bg-[#09090C] border border-white/15 text-white text-xs font-mono focus:border-champagne"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-white/50 mb-1">
              Phone Dial Link (tel:)
            </label>
            <input
              type="text"
              name="phoneTel"
              value={formData.phoneTel}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl bg-[#09090C] border border-white/15 text-white text-xs font-mono focus:border-champagne"
            />
          </div>
        </div>
      </div>
    </form>
  );
};
