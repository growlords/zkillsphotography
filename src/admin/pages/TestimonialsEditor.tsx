import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit, Save, Loader2, Star, Check, X, MessageSquareQuote } from 'lucide-react';
import { useAdminToast } from '../components/AdminToast';

interface Testimonial {
  id: string;
  clientName: string;
  eventType: string;
  location: string;
  quote: string;
  rating?: number;
  published?: boolean;
  displayOrder?: number;
}

export const TestimonialsEditor: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const { toast } = useAdminToast();

  const [formData, setFormData] = useState<Testimonial>({
    id: '',
    clientName: '',
    eventType: '3-Day Punjabi Wedding',
    location: 'Sirsa',
    quote: '',
    rating: 5,
    published: true,
  });

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/content/testimonials');
      if (res.ok) {
        const data = await res.json();
        setTestimonials(Array.isArray(data) ? data : []);
      }
    } catch {
      toast('Failed to load testimonials', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const saveToApi = async (updated: Testimonial[]) => {
    try {
      setSaving(true);
      const res = await fetch('/api/content/testimonials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });

      if (res.ok) {
        setTestimonials(updated);
        toast('Testimonials saved successfully', 'success');
      } else {
        toast('Failed to save testimonials', 'error');
      }
    } catch {
      toast('Error saving testimonials', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      id: `test-${Date.now()}`,
      clientName: '',
      eventType: 'Grand Wedding Celebration',
      location: 'Sirsa, Haryana',
      quote: '',
      rating: 5,
      published: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Testimonial) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this testimonial?')) return;
    const updated = testimonials.filter((t) => t.id !== id);
    saveToApi(updated);
  };

  const handleTogglePublish = (id: string) => {
    const updated = testimonials.map((t) =>
      t.id === id ? { ...t, published: t.published === false ? true : false } : t
    );
    saveToApi(updated);
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientName.trim() || !formData.quote.trim()) {
      toast('Client name and review quote are required', 'error');
      return;
    }

    let updated: Testimonial[];
    if (editingItem) {
      updated = testimonials.map((t) => (t.id === editingItem.id ? formData : t));
    } else {
      updated = [...testimonials, formData];
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
            Client Words
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-white font-normal">
            Testimonials Editor
          </h1>
          <p className="text-xs text-white/50 font-sans mt-1">
            Manage authentic couple reviews, wedding event details, and ratings.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-xl bg-champagne hover:bg-champagne-dark text-black font-semibold text-xs font-mono tracking-wider flex items-center gap-2 shadow-lg shadow-champagne/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
        </button>
      </div>

      {/* Testimonials List */}
      {loading ? (
        <div className="flex items-center justify-center p-20">
          <Loader2 className="w-8 h-8 text-champagne animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-[#121217] border border-white/10 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-champagne/30 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-champagne">
                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                      t.published !== false
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-white/5 text-white/40'
                    }`}
                  >
                    {t.published !== false ? 'Live' : 'Draft'}
                  </span>
                </div>

                <p className="text-xs text-white/80 italic line-clamp-3 mb-3">
                  "{t.quote}"
                </p>

                <div>
                  <h4 className="text-sm font-semibold text-white">{t.clientName}</h4>
                  <p className="text-[11px] font-mono text-champagne/80">
                    {t.eventType} • {t.location}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <button
                  onClick={() => handleTogglePublish(t.id)}
                  className="text-xs font-mono text-white/60 hover:text-white"
                >
                  Toggle {t.published !== false ? 'Unpublish' : 'Publish'}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(t)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
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

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121217] border border-white/15 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-sm font-semibold text-white">
                {editingItem ? 'Edit Testimonial' : 'Add Testimonial'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-white/70 mb-1">
                  Client Name(s) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  placeholder="e.g. Gurpreet & Navjot"
                  className="w-full px-3 py-2 rounded-xl bg-[#09090C] border border-white/15 text-white text-sm focus:outline-none focus:border-champagne"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-white/70 mb-1">
                    Event Type
                  </label>
                  <input
                    type="text"
                    value={formData.eventType}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                    placeholder="3-Day Punjabi Wedding"
                    className="w-full px-3 py-2 rounded-xl bg-[#09090C] border border-white/15 text-white text-sm focus:outline-none focus:border-champagne"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-white/70 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Sirsa"
                    className="w-full px-3 py-2 rounded-xl bg-[#09090C] border border-white/15 text-white text-sm focus:outline-none focus:border-champagne"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-white/70 mb-1">
                  Review Quote *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.quote}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  placeholder="Write client testimonial..."
                  className="w-full px-3 py-2 rounded-xl bg-[#09090C] border border-white/15 text-white text-sm focus:outline-none focus:border-champagne"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.published !== false}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="w-4 h-4 rounded text-champagne bg-black border-white/20"
                  />
                  <span className="text-xs font-mono uppercase text-white/80">Published</span>
                </label>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-white/50">Rating:</span>
                  <select
                    value={formData.rating || 5}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                    className="px-2 py-1 rounded bg-[#09090C] border border-white/15 text-xs text-champagne"
                  >
                    <option value={5}>5 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={3}>3 Stars</option>
                  </select>
                </div>
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
                  <span>Save Testimonial</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
