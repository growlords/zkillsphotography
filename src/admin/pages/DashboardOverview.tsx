import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderKanban,
  Image as ImageIcon,
  Video,
  CheckCircle2,
  Clock,
  Activity,
  Plus,
  FileEdit,
  Upload,
  PhoneCall,
  ArrowUpRight,
  Eye,
  Star,
  ExternalLink,
} from 'lucide-react';
import { useAdminToast } from '../components/AdminToast';

interface StatsData {
  totalProjects: number;
  publishedProjects: number;
  draftProjects: number;
  totalImages: number;
  totalVideos: number;
  websiteStatus: string;
  serverUptime: number;
  dbEngine: string;
}

interface ProjectPreview {
  id: string;
  title: string;
  category: string;
  coverImage: string;
  published: boolean;
  featured: boolean;
  updatedAt: string;
}

export const DashboardOverview: React.FC = () => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [recentProjects, setRecentProjects] = useState<ProjectPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useAdminToast();

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsRes, portfolioRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/portfolio?all=true'),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (portfolioRes.ok) {
        const portData = await portfolioRes.json();
        setRecentProjects(portData.slice(0, 5));
      }
    } catch (err: any) {
      console.error(err);
      toast('Failed to load dashboard metrics', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const togglePublish = async (project: ProjectPreview) => {
    try {
      const updated = !project.published;
      const res = await fetch(`/api/portfolio/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...project,
          published: updated,
        }),
      });

      if (res.ok) {
        setRecentProjects((prev) =>
          prev.map((p) => (p.id === project.id ? { ...p, published: updated } : p))
        );
        toast(`Project ${updated ? 'published' : 'moved to drafts'}.`, 'success');
      }
    } catch {
      toast('Could not update project status', 'error');
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-champagne block mb-1">
            Studio Overview
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-white font-normal">
            Welcome to Z Skills Photography
          </h1>
          <p className="text-xs text-white/50 font-sans mt-1">
            Sirsa, Haryana, India • Real-time website management and media distribution.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono tracking-wider text-white flex items-center gap-2 transition-all"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5 text-champagne" />
          </a>
          <Link
            to="/admin/portfolio"
            className="px-4 py-2 rounded-xl bg-champagne hover:bg-champagne-dark text-black font-semibold text-xs font-mono tracking-wider flex items-center gap-2 shadow-lg shadow-champagne/20 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Project</span>
          </Link>
        </div>
      </div>

      {/* Overview Stat Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Projects */}
        <div className="bg-[#121217] border border-white/10 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-white/50 mb-3">
            <span className="text-xs font-mono uppercase tracking-wider">Portfolio</span>
            <FolderKanban className="w-4 h-4 text-champagne" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif text-white font-normal">
            {stats?.totalProjects ?? 0}
          </div>
          <div className="flex items-center gap-2 mt-2 text-[11px] text-white/50">
            <span className="text-emerald-400 font-medium">{stats?.publishedProjects ?? 0} Published</span>
            <span>•</span>
            <span>{stats?.draftProjects ?? 0} Drafts</span>
          </div>
        </div>

        {/* Total Images */}
        <div className="bg-[#121217] border border-white/10 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-white/50 mb-3">
            <span className="text-xs font-mono uppercase tracking-wider">Images</span>
            <ImageIcon className="w-4 h-4 text-champagne" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif text-white font-normal">
            {stats?.totalImages ?? 0}
          </div>
          <p className="text-[11px] text-white/50 mt-2">Indexed in media library</p>
        </div>

        {/* Total Videos */}
        <div className="bg-[#121217] border border-white/10 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-white/50 mb-3">
            <span className="text-xs font-mono uppercase tracking-wider">Films & Videos</span>
            <Video className="w-4 h-4 text-champagne" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif text-white font-normal">
            {stats?.totalVideos ?? 0}
          </div>
          <p className="text-[11px] text-white/50 mt-2">Wedding highlights & 4K cuts</p>
        </div>

        {/* Website Status */}
        <div className="bg-[#121217] border border-white/10 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-white/50 mb-3">
            <span className="text-xs font-mono uppercase tracking-wider">System Status</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-base sm:text-lg font-mono font-medium text-emerald-400">
              Operational
            </span>
          </div>
          <p className="text-[10px] font-mono text-white/40 mt-2 truncate">
            {stats?.dbEngine || 'SQLite WAL Persistence'}
          </p>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div>
        <h2 className="text-xs font-mono uppercase tracking-widest text-white/60 mb-3">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            to="/admin/portfolio"
            className="flex items-center gap-3 p-4 rounded-xl bg-[#121217] hover:bg-[#181820] border border-white/10 hover:border-champagne/40 transition-all group"
          >
            <div className="w-9 h-9 rounded-lg bg-champagne/10 text-champagne flex items-center justify-center group-hover:scale-105 transition-transform">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold text-white block">Add Portfolio</span>
              <span className="text-[10px] text-white/40">New shoot or reel</span>
            </div>
          </Link>

          <Link
            to="/admin/content"
            className="flex items-center gap-3 p-4 rounded-xl bg-[#121217] hover:bg-[#181820] border border-white/10 hover:border-champagne/40 transition-all group"
          >
            <div className="w-9 h-9 rounded-lg bg-champagne/10 text-champagne flex items-center justify-center group-hover:scale-105 transition-transform">
              <FileEdit className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold text-white block">Edit Website</span>
              <span className="text-[10px] text-white/40">Headlines & texts</span>
            </div>
          </Link>

          <Link
            to="/admin/media"
            className="flex items-center gap-3 p-4 rounded-xl bg-[#121217] hover:bg-[#181820] border border-white/10 hover:border-champagne/40 transition-all group"
          >
            <div className="w-9 h-9 rounded-lg bg-champagne/10 text-champagne flex items-center justify-center group-hover:scale-105 transition-transform">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold text-white block">Upload Media</span>
              <span className="text-[10px] text-white/40">Batch photos & reels</span>
            </div>
          </Link>

          <Link
            to="/admin/contact"
            className="flex items-center gap-3 p-4 rounded-xl bg-[#121217] hover:bg-[#181820] border border-white/10 hover:border-champagne/40 transition-all group"
          >
            <div className="w-9 h-9 rounded-lg bg-champagne/10 text-champagne flex items-center justify-center group-hover:scale-105 transition-transform">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold text-white block">Edit Contact</span>
              <span className="text-[10px] text-white/40">WhatsApp & phone</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Projects Table */}
      <div className="bg-[#121217] border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white">Recent Portfolio Projects</h2>
            <p className="text-xs text-white/40 mt-0.5">
              Live toggle for published status and featured placement.
            </p>
          </div>
          <Link
            to="/admin/portfolio"
            className="text-xs font-mono text-champagne hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-white/5 overflow-x-auto">
          {recentProjects.length === 0 ? (
            <div className="p-8 text-center text-xs text-white/40">No projects found.</div>
          ) : (
            recentProjects.map((p) => (
              <div
                key={p.id}
                className="p-4 flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <img
                    src={p.coverImage}
                    alt={p.title}
                    className="w-12 h-12 rounded-lg object-cover bg-black/40 border border-white/10 shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/hero/hero-poster.jpg';
                    }}
                  />
                  <div className="min-w-0">
                    <h3 className="text-xs font-medium text-white truncate">{p.title}</h3>
                    <p className="text-[11px] font-mono text-white/40">{p.category}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {p.featured && (
                    <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-champagne/15 text-champagne text-[10px] font-mono">
                      <Star className="w-3 h-3 fill-current" />
                      <span>Featured</span>
                    </span>
                  )}

                  <button
                    onClick={() => togglePublish(p)}
                    className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider transition-colors ${
                      p.published
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-white/10 text-white/50 border border-white/10 hover:text-white'
                    }`}
                  >
                    {p.published ? 'Published' : 'Draft'}
                  </button>

                  <Link
                    to={`/admin/portfolio?edit=${p.id}`}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-xs"
                    title="Edit project"
                  >
                    <FileEdit className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
