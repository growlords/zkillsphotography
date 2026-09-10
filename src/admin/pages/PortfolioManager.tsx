import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  Star,
  Trash2,
  Edit,
  Copy,
  ArrowUpDown,
  Upload,
  Video,
  Image as ImageIcon,
  Check,
  X,
  Loader2,
  ExternalLink,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { useAdminToast } from '../components/AdminToast';

interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  location: string;
  description: string;
  coverImage: string;
  gallery: string[];
  videoSrc?: string;
  featured: boolean;
  published: boolean;
  displayOrder: number;
  createdAt?: string;
}

const DEFAULT_CATEGORIES = [
  'Weddings',
  'Pre-Weddings',
  'Events',
  'Parties',
  'Retirement',
  'Reels',
  'Photography',
  'Cinematic Films',
];

export const PortfolioManager: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [saving, setSaving] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useAdminToast();

  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState<Omit<Project, 'id'>>({
    title: '',
    category: 'Weddings',
    year: new Date().getFullYear().toString(),
    location: 'Sirsa, India',
    description: '',
    coverImage: '',
    gallery: [],
    videoSrc: '',
    featured: false,
    published: true,
    displayOrder: 0,
  });

  const loadProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/portfolio?all=true');
      if (res.ok) {
        const data = await res.json();
        setProjects(data);

        // Check if query param requested edit
        const editId = searchParams.get('edit');
        if (editId) {
          const target = data.find((p: Project) => p.id === editId);
          if (target) {
            handleOpenEdit(target);
          }
        }
      }
    } catch {
      toast('Failed to load portfolio projects', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleOpenAdd = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      category: 'Weddings',
      year: new Date().getFullYear().toString(),
      location: 'Sirsa, India',
      description: '',
      coverImage: '/assets/photos/bridal-masterpiece-4k.jpg',
      gallery: [],
      videoSrc: '',
      featured: false,
      published: true,
      displayOrder: projects.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (proj: Project) => {
    setEditingProject(proj);
    setFormData({
      title: proj.title,
      category: proj.category,
      year: proj.year,
      location: proj.location,
      description: proj.description,
      coverImage: proj.coverImage,
      gallery: proj.gallery || [],
      videoSrc: proj.videoSrc || '',
      featured: proj.featured,
      published: proj.published,
      displayOrder: proj.displayOrder,
    });
    setIsModalOpen(true);
  };

  const handleDuplicate = async (id: string) => {
    try {
      const res = await fetch(`/api/portfolio/${id}/duplicate`, { method: 'POST' });
      if (res.ok) {
        toast('Project duplicated successfully (saved as Draft)', 'success');
        loadProjects();
      } else {
        toast('Failed to duplicate project', 'error');
      }
    } catch {
      toast('Error duplicating project', 'error');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/portfolio/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        toast('Project deleted successfully', 'success');
      } else {
        toast('Failed to delete project', 'error');
      }
    } catch {
      toast('Error deleting project', 'error');
    }
  };

  const togglePublished = async (proj: Project) => {
    try {
      const updated = !proj.published;
      const res = await fetch(`/api/portfolio/${proj.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...proj, published: updated }),
      });
      if (res.ok) {
        setProjects((prev) =>
          prev.map((p) => (p.id === proj.id ? { ...p, published: updated } : p))
        );
        toast(`Project ${updated ? 'published' : 'moved to draft'}.`, 'success');
      }
    } catch {
      toast('Failed to update project status', 'error');
    }
  };

  const toggleFeatured = async (proj: Project) => {
    try {
      const updated = !proj.featured;
      const res = await fetch(`/api/portfolio/${proj.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...proj, featured: updated }),
      });
      if (res.ok) {
        setProjects((prev) =>
          prev.map((p) => (p.id === proj.id ? { ...p, featured: updated } : p))
        );
        toast(`Project ${updated ? 'marked as Featured' : 'unfeatured'}.`, 'success');
      }
    } catch {
      toast('Failed to update featured flag', 'error');
    }
  };

  // Upload Cover Image
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingCover(true);
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/media/upload-single', { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok && data.file?.url) {
        setFormData((prev) => ({ ...prev, coverImage: data.file.url }));
        toast('Cover image uploaded', 'success');
      } else {
        toast(data.error || 'Upload failed', 'error');
      }
    } catch {
      toast('Error uploading cover', 'error');
    } finally {
      setUploadingCover(false);
    }
  };

  // Upload Video
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingVideo(true);
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/media/upload-single', { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok && data.file?.url) {
        setFormData((prev) => ({ ...prev, videoSrc: data.file.url }));
        toast('Project video uploaded', 'success');
      } else {
        toast(data.error || 'Video upload failed', 'error');
      }
    } catch {
      toast('Error uploading video', 'error');
    } finally {
      setUploadingVideo(false);
    }
  };

  // Upload multiple Gallery Images
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploadingGallery(true);
      const fd = new FormData();
      for (let i = 0; i < files.length; i++) {
        fd.append('files', files[i]);
      }
      const res = await fetch('/api/media/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok && Array.isArray(data.files)) {
        const newUrls = data.files.map((f: any) => f.url);
        setFormData((prev) => ({ ...prev, gallery: [...prev.gallery, ...newUrls] }));
        toast(`Uploaded ${newUrls.length} gallery image(s)`, 'success');
      }
    } catch {
      toast('Error uploading gallery photos', 'error');
    } finally {
      setUploadingGallery(false);
    }
  };

  const handleRemoveGalleryImage = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== idx),
    }));
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.coverImage.trim()) {
      toast('Title and Cover Image are required.', 'error');
      return;
    }

    try {
      setSaving(true);
      if (editingProject) {
        // Update
        const res = await fetch(`/api/portfolio/${editingProject.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          toast('Project updated successfully', 'success');
          setIsModalOpen(false);
          loadProjects();
        } else {
          toast('Failed to update project', 'error');
        }
      } else {
        // Create
        const res = await fetch('/api/portfolio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          toast('New project created and published', 'success');
          setIsModalOpen(false);
          loadProjects();
        } else {
          toast('Failed to create project', 'error');
        }
      }
    } catch {
      toast('Network error saving project', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Filtered list
  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', ...Array.from(new Set([...DEFAULT_CATEGORIES, ...projects.map((p) => p.category)]))];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-champagne block mb-1">
            Portfolio Management System
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-white font-normal">
            Portfolio CMS
          </h1>
          <p className="text-xs text-white/50 font-sans mt-1">
            Add, edit, duplicate, upload media, and order your cinematography shoots and photo sessions.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-xl bg-champagne hover:bg-champagne-dark text-black font-semibold text-xs font-mono tracking-wider flex items-center gap-2 shadow-lg shadow-champagne/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Filters & Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, location, description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#121217] border border-white/10 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-champagne"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-champagne text-black font-semibold'
                  : 'bg-[#121217] text-white/70 hover:text-white border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-[#121217] border border-white/10 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-20">
            <Loader2 className="w-8 h-8 text-champagne animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center text-xs text-white/40">
            No projects match your current filters.
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filtered.map((proj) => (
              <div
                key={proj.id}
                className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
              >
                {/* Thumbnail & Metadata */}
                <div className="flex items-start sm:items-center gap-4 min-w-0">
                  <div className="relative shrink-0 w-20 h-20 sm:w-24 sm:h-20 rounded-xl overflow-hidden bg-black/40 border border-white/10">
                    <img
                      src={proj.coverImage}
                      alt={proj.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/assets/hero/hero-poster.jpg';
                      }}
                    />
                    {proj.videoSrc && (
                      <div className="absolute top-1.5 right-1.5 p-1 rounded-md bg-black/70 text-champagne">
                        <Video className="w-3 h-3" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-champagne">
                        {proj.category}
                      </span>
                      <span className="text-[11px] font-mono text-white/40">{proj.year}</span>
                      <span className="text-[11px] text-white/40">• {proj.location}</span>
                    </div>

                    <h3 className="text-sm font-semibold text-white truncate">{proj.title}</h3>
                    <p className="text-xs text-white/50 line-clamp-1 mt-0.5">
                      {proj.description || 'No description provided.'}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] font-mono text-white/40 mt-2">
                      <span>{proj.gallery?.length || 0} Gallery Photos</span>
                      <span>•</span>
                      <span>Order: #{proj.displayOrder}</span>
                    </div>
                  </div>
                </div>

                {/* Actions & Toggles */}
                <div className="flex items-center gap-2.5 sm:self-center self-end shrink-0">
                  {/* Featured Toggle */}
                  <button
                    onClick={() => toggleFeatured(proj)}
                    className={`p-2 rounded-xl border transition-colors ${
                      proj.featured
                        ? 'bg-champagne/15 border-champagne/40 text-champagne'
                        : 'bg-white/5 border-white/10 text-white/40 hover:text-white'
                    }`}
                    title={proj.featured ? 'Featured Project' : 'Mark as Featured'}
                  >
                    <Star className={`w-4 h-4 ${proj.featured ? 'fill-current' : ''}`} />
                  </button>

                  {/* Published Toggle */}
                  <button
                    onClick={() => togglePublished(proj)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-colors ${
                      proj.published
                        ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-400'
                        : 'bg-white/5 border border-white/10 text-white/50 hover:text-white'
                    }`}
                  >
                    {proj.published ? 'Live' : 'Draft'}
                  </button>

                  {/* Duplicate */}
                  <button
                    onClick={() => handleDuplicate(proj.id)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white transition-colors"
                    title="Duplicate Project"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => handleOpenEdit(proj)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-champagne hover:text-black border border-white/10 text-white transition-colors"
                    title="Edit Project"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(proj.id, proj.title)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 hover:border-rose-500/40 text-white/60 hover:text-rose-400 border border-white/10 transition-colors"
                    title="Delete Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#121217] border border-white/15 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-white">
                  {editingProject ? 'Edit Portfolio Project' : 'Create New Portfolio Project'}
                </h2>
                <p className="text-xs text-white/40 mt-0.5">
                  Changes will be saved to the database and displayed on the live website.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveProject} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Row 1: Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Gurpreet & Navjot's Royal Wedding"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#09090C] border border-white/15 text-white text-sm focus:outline-none focus:border-champagne"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
                    Category *
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#09090C] border border-white/15 text-white text-sm focus:outline-none focus:border-champagne"
                    >
                      {DEFAULT_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Or custom..."
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-32 px-3 py-2 rounded-xl bg-[#09090C] border border-white/15 text-white text-xs focus:outline-none focus:border-champagne"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Year, Location, Display Order */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
                    Year
                  </label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#09090C] border border-white/15 text-white text-sm focus:outline-none focus:border-champagne"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#09090C] border border-white/15 text-white text-sm focus:outline-none focus:border-champagne"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
                    Display Order (#)
                  </label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) =>
                      setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-[#09090C] border border-white/15 text-white text-sm focus:outline-none focus:border-champagne"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
                  Editorial Description / Story
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Cinematographic notes, ceremonial details, aesthetic highlights..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#09090C] border border-white/15 text-white text-sm focus:outline-none focus:border-champagne"
                />
              </div>

              {/* Cover Image Upload & URL */}
              <div className="p-4 rounded-xl bg-[#09090C] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-mono uppercase text-champagne font-semibold">
                    Cover Image *
                  </label>
                  <span className="text-[11px] text-white/40">Used in grid, cards, & hero</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-black shrink-0 border border-white/10">
                    <img
                      src={formData.coverImage || '/assets/hero/hero-poster.jpg'}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-2 w-full">
                    <input
                      type="text"
                      value={formData.coverImage}
                      onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                      placeholder="/uploads/my-photo.jpg or URL"
                      className="w-full px-3 py-1.5 rounded-lg bg-[#121217] border border-white/15 text-white text-xs font-mono"
                    />

                    <input
                      type="file"
                      ref={coverInputRef}
                      accept="image/*"
                      onChange={handleCoverUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={uploadingCover}
                      onClick={() => coverInputRef.current?.click()}
                      className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-mono flex items-center gap-2 transition-all disabled:opacity-50"
                    >
                      {uploadingCover ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-champagne" />
                      ) : (
                        <Upload className="w-3.5 h-3.5 text-champagne" />
                      )}
                      <span>Upload New Cover Image</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Video Stream / Cut */}
              <div className="p-4 rounded-xl bg-[#09090C] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-mono uppercase text-champagne font-semibold flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    <span>Project Film / Video (Optional)</span>
                  </label>
                  <span className="text-[11px] text-white/40">Enables video player modal</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <input
                    type="text"
                    value={formData.videoSrc || ''}
                    onChange={(e) => setFormData({ ...formData, videoSrc: e.target.value })}
                    placeholder="/assets/films/my-film.mp4 or URL"
                    className="flex-1 px-3 py-2 rounded-lg bg-[#121217] border border-white/15 text-white text-xs font-mono"
                  />

                  <input
                    type="file"
                    ref={videoInputRef}
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={uploadingVideo}
                    onClick={() => videoInputRef.current?.click()}
                    className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-mono flex items-center gap-2 shrink-0 transition-all disabled:opacity-50"
                  >
                    {uploadingVideo ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-champagne" />
                    ) : (
                      <Upload className="w-3.5 h-3.5 text-champagne" />
                    )}
                    <span>Upload Video</span>
                  </button>
                </div>
              </div>

              {/* Gallery Photos */}
              <div className="p-4 rounded-xl bg-[#09090C] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-mono uppercase text-champagne font-semibold flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    <span>Gallery Images ({formData.gallery.length})</span>
                  </label>
                  <input
                    type="file"
                    ref={galleryInputRef}
                    accept="image/*"
                    multiple
                    onChange={handleGalleryUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={uploadingGallery}
                    onClick={() => galleryInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-mono flex items-center gap-1.5 transition-all disabled:opacity-50"
                  >
                    {uploadingGallery ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-champagne" />
                    ) : (
                      <Plus className="w-3.5 h-3.5 text-champagne" />
                    )}
                    <span>Add Multiple Photos</span>
                  </button>
                </div>

                {formData.gallery.length === 0 ? (
                  <p className="text-xs text-white/30 italic">No gallery photos added yet.</p>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {formData.gallery.map((img, idx) => (
                      <div
                        key={idx}
                        className="group relative aspect-square rounded-lg overflow-hidden bg-black/60 border border-white/10"
                      >
                        <img src={img} alt="Gallery" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(idx)}
                          className="absolute top-1 right-1 p-1 rounded-md bg-black/80 text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Toggles: Featured & Published */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded border-white/20 text-champagne focus:ring-champagne bg-black"
                  />
                  <span className="text-xs font-mono uppercase text-white/80">
                    Featured Project (High Priority)
                  </span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="w-4 h-4 rounded border-white/20 text-champagne focus:ring-champagne bg-black"
                  />
                  <span className="text-xs font-mono uppercase text-white/80">
                    Published (Visible on Live Website)
                  </span>
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
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
                  className="px-6 py-2 rounded-xl bg-champagne hover:bg-champagne-dark text-black font-semibold text-xs font-mono tracking-wider flex items-center gap-2 shadow-lg shadow-champagne/20 transition-all disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  <span>{saving ? 'Saving...' : 'Save & Publish Project'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
