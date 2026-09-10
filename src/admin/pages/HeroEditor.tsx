import React, { useEffect, useState, useRef } from 'react';
import { Save, Upload, Video, Image as ImageIcon, Loader2, Play, Eye, RefreshCw } from 'lucide-react';
import { useAdminToast } from '../components/AdminToast';

export const HeroEditor: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingPoster, setUploadingPoster] = useState(false);
  const { toast } = useAdminToast();

  const videoInputRef = useRef<HTMLInputElement>(null);
  const posterInputRef = useRef<HTMLInputElement>(null);

  const [heroData, setHeroData] = useState({
    badge: 'CINEMATIC FILM & LUXURY PHOTOGRAPHY',
    headline: 'Stories That Feel Like Cinema.',
    subheadline: 'Wedding Films • Photography • Pre-Weddings • Events • Reels',
    description: 'Z Skills Photography is an award-winning visual storytelling studio crafting high-end wedding films, editorial photography, and cinematic narratives in Sirsa and worldwide.',
    primaryCtaText: 'Explore Work',
    primaryCtaLink: '#films',
    secondaryCtaText: 'Book Your Dates',
    secondaryCtaLink: '#contact',
    videoSrc: '/assets/hero/hero-bg.mp4',
    posterSrc: '/assets/hero/hero-poster.jpg',
  });

  const loadHero = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/content/hero');
      if (res.ok) {
        const data = await res.json();
        setHeroData((prev) => ({ ...prev, ...data }));
      }
    } catch {
      toast('Failed to load hero configuration', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHero();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setHeroData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      toast('Please upload a valid video file (MP4, WebM, MOV)', 'error');
      return;
    }

    try {
      setUploadingVideo(true);
      const fd = new FormData();
      fd.append('file', file);

      const res = await fetch('/api/media/upload-single', {
        method: 'POST',
        body: fd,
      });

      const data = await res.json();
      if (res.ok && data.file?.url) {
        setHeroData((prev) => ({ ...prev, videoSrc: data.file.url }));
        toast('Hero video uploaded! Click "Save & Publish" to activate.', 'success');
      } else {
        toast(data.error || 'Video upload failed', 'error');
      }
    } catch {
      toast('Error uploading video', 'error');
    } finally {
      setUploadingVideo(false);
    }
  };

  const handlePosterUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast('Please upload a valid image file (JPG, PNG, WebP)', 'error');
      return;
    }

    try {
      setUploadingPoster(true);
      const fd = new FormData();
      fd.append('file', file);

      const res = await fetch('/api/media/upload-single', {
        method: 'POST',
        body: fd,
      });

      const data = await res.json();
      if (res.ok && data.file?.url) {
        setHeroData((prev) => ({ ...prev, posterSrc: data.file.url }));
        toast('Hero poster uploaded! Click "Save & Publish" to activate.', 'success');
      } else {
        toast(data.error || 'Poster upload failed', 'error');
      }
    } catch {
      toast('Error uploading poster', 'error');
    } finally {
      setUploadingPoster(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await fetch('/api/content/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(heroData),
      });

      if (res.ok) {
        toast('Hero section published to live website!', 'success');
      } else {
        toast('Failed to save hero section', 'error');
      }
    } catch {
      toast('Network error saving hero', 'error');
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
            Visual Experience
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-white font-normal">
            Hero Section Editor
          </h1>
          <p className="text-xs text-white/50 font-sans mt-1">
            Manage the hero background video, poster fallback, main headlines, and CTA links.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadHero}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-mono flex items-center gap-1.5 transition-all"
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
            <span>{saving ? 'Publishing...' : 'Save & Publish Hero'}</span>
          </button>
        </div>
      </div>

      {/* Hero Media Preview & Replacement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Background Video */}
        <div className="bg-[#121217] border border-white/10 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-champagne font-semibold flex items-center gap-2">
              <Video className="w-4 h-4" />
              <span>Hero Background Video</span>
            </span>
            <span className="text-[11px] font-mono text-white/40">Autoplays muted</span>
          </div>

          {/* Video Preview Player */}
          <div className="aspect-video w-full rounded-xl overflow-hidden bg-black relative border border-white/10">
            <video
              key={heroData.videoSrc}
              src={heroData.videoSrc}
              poster={heroData.posterSrc}
              controls
              playsInline
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase text-white/70">
              Video Stream URL
            </label>
            <input
              type="text"
              name="videoSrc"
              value={heroData.videoSrc}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl bg-[#09090C] border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-champagne"
            />
          </div>

          <div>
            <input
              type="file"
              ref={videoInputRef}
              accept="video/mp4,video/webm,video/quicktime"
              onChange={handleVideoUpload}
              className="hidden"
            />
            <button
              type="button"
              disabled={uploadingVideo}
              onClick={() => videoInputRef.current?.click()}
              className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white text-xs font-mono flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {uploadingVideo ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-champagne" />
                  <span>Uploading video...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 text-champagne" />
                  <span>Upload & Replace Hero Video</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Poster Image */}
        <div className="bg-[#121217] border border-white/10 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-champagne font-semibold flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              <span>Hero Poster Image</span>
            </span>
            <span className="text-[11px] font-mono text-white/40">Shows before video plays</span>
          </div>

          {/* Poster Preview */}
          <div className="aspect-video w-full rounded-xl overflow-hidden bg-black relative border border-white/10">
            <img
              src={heroData.posterSrc}
              alt="Hero Poster"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/hero/hero-poster.jpg';
              }}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase text-white/70">
              Poster Image URL
            </label>
            <input
              type="text"
              name="posterSrc"
              value={heroData.posterSrc}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl bg-[#09090C] border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-champagne"
            />
          </div>

          <div>
            <input
              type="file"
              ref={posterInputRef}
              accept="image/*"
              onChange={handlePosterUpload}
              className="hidden"
            />
            <button
              type="button"
              disabled={uploadingPoster}
              onClick={() => posterInputRef.current?.click()}
              className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white text-xs font-mono flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {uploadingPoster ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-champagne" />
                  <span>Uploading image...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 text-champagne" />
                  <span>Upload & Replace Poster Image</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Hero Typography & CTA Controls */}
      <div className="bg-[#121217] border border-white/10 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-champagne uppercase tracking-wider font-mono">
          Hero Copywriting & Navigation Buttons
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
              Badge Label
            </label>
            <input
              type="text"
              name="badge"
              value={heroData.badge}
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
              name="headline"
              value={heroData.headline}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl bg-[#09090C] border border-white/15 text-white text-sm focus:outline-none focus:border-champagne"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
              Subheadline / Tagline
            </label>
            <input
              type="text"
              name="subheadline"
              value={heroData.subheadline}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl bg-[#09090C] border border-white/15 text-white text-sm focus:outline-none focus:border-champagne"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
              Description Paragraph
            </label>
            <textarea
              name="description"
              rows={2}
              value={heroData.description}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl bg-[#09090C] border border-white/15 text-white text-sm focus:outline-none focus:border-champagne"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
              Primary CTA Text
            </label>
            <input
              type="text"
              name="primaryCtaText"
              value={heroData.primaryCtaText}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl bg-[#09090C] border border-white/15 text-white text-sm focus:outline-none focus:border-champagne"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
              Primary CTA Anchor/Link
            </label>
            <input
              type="text"
              name="primaryCtaLink"
              value={heroData.primaryCtaLink}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl bg-[#09090C] border border-white/15 text-white text-sm focus:outline-none focus:border-champagne"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
              Secondary CTA Text
            </label>
            <input
              type="text"
              name="secondaryCtaText"
              value={heroData.secondaryCtaText}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl bg-[#09090C] border border-white/15 text-white text-sm focus:outline-none focus:border-champagne"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
              Secondary CTA Anchor/Link
            </label>
            <input
              type="text"
              name="secondaryCtaLink"
              value={heroData.secondaryCtaLink}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl bg-[#09090C] border border-white/15 text-white text-sm focus:outline-none focus:border-champagne"
            />
          </div>
        </div>
      </div>
    </form>
  );
};
