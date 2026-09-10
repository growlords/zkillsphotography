import React, { useEffect, useState, useRef } from 'react';
import {
  Plus,
  Trash2,
  Edit,
  Save,
  Loader2,
  X,
  Check,
  Upload,
  Video,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react';
import { useAdminToast } from '../components/AdminToast';

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  image: string;
  icon?: string;
  bgVideo?: string;
  features?: string[];
  displayOrder?: number;
  published?: boolean;
}

export const ServicesEditor: React.FC = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useAdminToast();

  const [formData, setFormData] = useState<ServiceItem>({
    id: '',
    title: '',
    description: '',
    image: '',
    icon: 'Sparkles',
    bgVideo: '',
    features: [],
    published: true,
  });

  const loadServices = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/content/services');
      if (res.ok) {
        const data = await res.json();
        setServices(Array.isArray(data) ? data : []);
      }
    } catch {
      toast('Failed to load services', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const saveToApi = async (updatedServices: ServiceItem[]) => {
    try {
      setSaving(true);
      const res = await fetch('/api/content/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedServices),
      });

      if (res.ok) {
        setServices(updatedServices);
        toast('Services updated and published', 'success');
      } else {
        toast('Failed to save services', 'error');
      }
    } catch {
      toast('Error saving services', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingService(null);
    setFormData({
      id: `service-${Date.now()}`,
      title: '',
      description: '',
      image: '/assets/photos/bridal-masterpiece-4k.jpg',
      icon: 'Camera',
      bgVideo: '',
      features: ['4K Ultra HD', 'Drone Cinematography', 'Color Graded Archive'],
      published: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (svc: ServiceItem) => {
    setEditingService(svc);
    setFormData({ ...svc });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    const updated = services.filter((s) => s.id !== id);
    saveToApi(updated);
  };

  const handleTogglePublish = (id: string) => {
    const updated = services.map((s) =>
      s.id === id ? { ...s, published: s.published === false ? true : false } : s
    );
    saveToApi(updated);
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
        setFormData((prev) => ({ ...prev, image: data.file.url }));
        toast('Service image uploaded', 'success');
      }
    } catch {
      toast('Failed to upload image', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast('Service title is required', 'error');
      return;
    }

    let updated: ServiceItem[];
    if (editingService) {
      updated = services.map((s) => (s.id === editingService.id ? formData : s));
    } else {
      updated = [...services, formData];
    }

    saveToApi(updated);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-champagne block mb-1">
            Studio Offerings
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-white font-normal">
            Services Management
          </h1>
          <p className="text-xs text-white/50 font-sans mt-1">
            Add, update, reorder, or publish cinematography & photography packages.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-xl bg-champagne hover:bg-champagne-dark text-black font-semibold text-xs font-mono tracking-wider flex items-center gap-2 shadow-lg shadow-champagne/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Service</span>
        </button>
      </div>

      {/* Services List */}
      {loading ? (
        <div className="flex items-center justify-center p-20">
          <Loader2 className="w-8 h-8 text-champagne animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((svc) => (
            <div
              key={svc.id}
              className="bg-[#121217] border border-white/10 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-champagne/30 transition-all"
            >
              <div className="flex gap-4 items-start">
                <img
                  src={svc.image}
                  alt={svc.title}
                  className="w-20 h-20 rounded-xl object-cover bg-black/40 border border-white/10 shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/hero/hero-poster.jpg';
                  }}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-white truncate">{svc.title}</h3>
                    {svc.published === false && (
                      <span className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 text-[10px] font-mono">
                        Draft
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white/50 line-clamp-2">{svc.description}</p>
                  {svc.bgVideo && (
                    <div className="flex items-center gap-1 text-[11px] font-mono text-champagne mt-1">
                      <Video className="w-3 h-3" />
                      <span>Has Video Showcase</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <button
                  onClick={() => handleTogglePublish(svc.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                    svc.published !== false
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : 'bg-white/5 text-white/50'
                  }`}
                >
                  {svc.published !== false ? 'Published' : 'Draft'}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(svc)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(svc.id)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-white/40 hover:text-rose-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit/Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121217] border border-white/15 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-sm font-semibold text-white">
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-white/70 mb-1">
                  Service Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Wedding Cinematography & Teasers"
                  className="w-full px-3 py-2 rounded-xl bg-[#09090C] border border-white/15 text-white text-sm focus:outline-none focus:border-champagne"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-white/70 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description of the package, coverage, gear used..."
                  className="w-full px-3 py-2 rounded-xl bg-[#09090C] border border-white/15 text-white text-sm focus:outline-none focus:border-champagne"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-white/70 mb-1">
                  Cover Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-xl bg-[#09090C] border border-white/15 text-white text-xs font-mono"
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
                    className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-mono flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5 text-champagne" />
                    <span>Upload</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-white/70 mb-1">
                  Showcase Video URL (Optional)
                </label>
                <input
                  type="text"
                  value={formData.bgVideo || ''}
                  onChange={(e) => setFormData({ ...formData, bgVideo: e.target.value })}
                  placeholder="/assets/films/wedding-story-full.mp4"
                  className="w-full px-3 py-2 rounded-xl bg-[#09090C] border border-white/15 text-white text-xs font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published !== false}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-4 h-4 rounded text-champagne bg-black border-white/20"
                />
                <label htmlFor="published" className="text-xs font-mono uppercase text-white/80">
                  Published on Live Website
                </label>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-white/60 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-champagne hover:bg-champagne-dark text-black font-semibold text-xs font-mono tracking-wider flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Service</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
