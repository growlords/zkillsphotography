import React, { useEffect, useState, useRef } from 'react';
import { Save, Loader2, Upload, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { useAdminToast } from '../components/AdminToast';

interface StatItem {
  value: string;
  label: string;
  suffix?: string;
}

export const AboutEditor: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useAdminToast();

  const [aboutData, setAboutData] = useState({
    badge: 'THE CREATIVE PHILOSOPHY',
    heading: 'Behind Every Lens, A Timeless Story.',
    description:
      'At Z Skills Photography, we believe every love story, wedding celebration, and milestone is an unrepeatable chapter of human emotion. Based in Sirsa, India, our creative team documents genuine moments with editorial precision, nuanced lighting, and timeless color grading.',
    location: 'Sirsa, Haryana, India',
    image: '/assets/photos/bridal-masterpiece-4k.jpg',
    stats: [
      { value: '150', suffix: '+', label: 'Weddings & Celebrations' },
      { value: '10', suffix: '+', label: 'Years Of Craft' },
      { value: '100', suffix: '%', label: 'Artistic Precision' },
      { value: '4K', suffix: '', label: 'Cinema Quality' },
    ],
  });

  const loadAbout = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/content/about');
      if (res.ok) {
        const data = await res.json();
        setAboutData((prev) => ({
          ...prev,
          ...data,
          stats: data.stats || prev.stats,
        }));
      }
    } catch {
      toast('Failed to load about information', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAbout();
  }, []);

  const handleStatChange = (index: number, field: keyof StatItem, val: string) => {
    const updated = [...aboutData.stats];
    updated[index] = { ...updated[index], [field]: val };
    setAboutData({ ...aboutData, stats: updated });
  };

  const handleAddStat = () => {
    setAboutData({
      ...aboutData,
      stats: [...aboutData.stats, { value: '50', suffix: '+', label: 'New Metric' }],
    });
  };

  const handleRemoveStat = (index: number) => {
    setAboutData({
      ...aboutData,
      stats: aboutData.stats.filter((_, i) => i !== index),
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/media/upload-single', { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok && data.file?.url) {
        setAboutData((prev) => ({ ...prev, image: data.file.url }));
        toast('About image updated', 'success');
      }
    } catch {
      toast('Failed to upload image', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await fetch('/api/content/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aboutData),
      });

      if (res.ok) {
        toast('About story & statistics updated successfully', 'success');
      } else {
        toast('Failed to save about section', 'error');
      }
    } catch {
      toast('Network error saving about section', 'error');
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
            Studio Biography
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-white font-normal">
            About Section Editor
          </h1>
          <p className="text-xs text-white/50 font-sans mt-1">
            Edit studio philosophy, portrait visual, and business milestone counters.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2 rounded-xl bg-champagne hover:bg-champagne-dark text-black font-semibold text-xs font-mono tracking-wider flex items-center gap-2 shadow-lg shadow-champagne/20 transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Saving...' : 'Save & Publish'}</span>
        </button>
      </div>

      {/* Main Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#121217] border border-white/10 rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
              Badge Label
            </label>
            <input
              type="text"
              value={aboutData.badge}
              onChange={(e) => setAboutData({ ...aboutData, badge: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-[#09090C] border border-white/15 text-white text-sm focus:outline-none focus:border-champagne"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
              Heading
            </label>
            <input
              type="text"
              value={aboutData.heading}
              onChange={(e) => setAboutData({ ...aboutData, heading: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-[#09090C] border border-white/15 text-white text-sm focus:outline-none focus:border-champagne"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
              Editorial Story / Description
            </label>
            <textarea
              rows={5}
              value={aboutData.description}
              onChange={(e) => setAboutData({ ...aboutData, description: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-[#09090C] border border-white/15 text-white text-sm focus:outline-none focus:border-champagne"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
              Studio Location Note
            </label>
            <input
              type="text"
              value={aboutData.location}
              onChange={(e) => setAboutData({ ...aboutData, location: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-[#09090C] border border-white/15 text-white text-sm focus:outline-none focus:border-champagne"
            />
          </div>
        </div>

        {/* Feature Portrait */}
        <div className="bg-[#121217] border border-white/10 rounded-2xl p-6 space-y-4">
          <label className="block text-xs font-mono uppercase text-champagne font-semibold">
            Featured Portrait / Visual
          </label>
          <div className="aspect-[4/5] rounded-xl overflow-hidden bg-black border border-white/10">
            <img
              src={aboutData.image}
              alt="About Visual"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/hero/hero-poster.jpg';
              }}
            />
          </div>

          <input
            type="text"
            value={aboutData.image}
            onChange={(e) => setAboutData({ ...aboutData, image: e.target.value })}
            className="w-full px-3 py-1.5 rounded-lg bg-[#09090C] border border-white/15 text-white text-xs font-mono"
          />

          <input
            type="file"
            ref={imageInputRef}
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <button
            type="button"
            disabled={uploadingImage}
            onClick={() => imageInputRef.current?.click()}
            className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-mono flex items-center justify-center gap-2"
          >
            {uploadingImage ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Upload className="w-3.5 h-3.5 text-champagne" />
            )}
            <span>Upload New Photo</span>
          </button>
        </div>
      </div>

      {/* Editable Milestone Statistics */}
      <div className="bg-[#121217] border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-champagne uppercase tracking-wider font-mono">
              Milestone Statistics
            </h2>
            <p className="text-xs text-white/40 mt-0.5">
              Clearly editable numbers shown in the about counter cards.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddStat}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-mono flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-champagne" />
            <span>Add Stat</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {aboutData.stats.map((stat, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#09090C] border border-white/10 space-y-3 relative group"
            >
              <button
                type="button"
                onClick={() => handleRemoveStat(idx)}
                className="absolute top-2 right-2 p-1 text-white/30 hover:text-rose-400"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-[10px] font-mono text-white/50 uppercase">
                    Value
                  </label>
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => handleStatChange(idx, 'value', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#121217] border border-white/15 text-white text-sm font-mono font-bold"
                  />
                </div>
                <div className="w-16">
                  <label className="block text-[10px] font-mono text-white/50 uppercase">
                    Suffix
                  </label>
                  <input
                    type="text"
                    value={stat.suffix || ''}
                    onChange={(e) => handleStatChange(idx, 'suffix', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#121217] border border-white/15 text-white text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-white/50 uppercase">Label</label>
                <input
                  type="text"
                  value={stat.label}
                  onChange={(e) => handleStatChange(idx, 'label', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#121217] border border-white/15 text-white text-xs"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
};
