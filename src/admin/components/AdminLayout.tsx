import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Video,
  FolderKanban,
  Sparkles,
  User,
  ListOrdered,
  MessageSquareQuote,
  PhoneCall,
  Share2,
  Search,
  Image as ImageIcon,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Camera,
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useAdminToast } from './AdminToast';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { path: '/admin/content', label: 'Website Content', icon: FileText },
  { path: '/admin/hero', label: 'Hero Section', icon: Video },
  { path: '/admin/portfolio', label: 'Portfolio CMS', icon: FolderKanban },
  { path: '/admin/services', label: 'Services', icon: Sparkles },
  { path: '/admin/about', label: 'About Story', icon: User },
  { path: '/admin/process', label: 'Process Steps', icon: ListOrdered },
  { path: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
  { path: '/admin/contact', label: 'Contact Info', icon: PhoneCall },
  { path: '/admin/social', label: 'Social Links', icon: Share2 },
  { path: '/admin/seo', label: 'SEO & Metadata', icon: Search },
  { path: '/admin/media', label: 'Media Library', icon: ImageIcon },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
];

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useAdminToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast('Logged out successfully', 'info');
    navigate('/admin/login');
  };

  const isActive = (path: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#09090C] text-[#FAF8F5] flex flex-col md:flex-row antialiased">
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#111116] border-b border-white/10 sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-champagne/15 border border-champagne/30 flex items-center justify-center text-champagne">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <span className="font-mono text-xs font-semibold tracking-wider text-white">Z SKILLS</span>
            <span className="block text-[10px] font-mono text-champagne/80">ADMIN PANEL</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white"
            title="View Live Website"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-72 bg-[#0F0F14] border-r border-white/10 flex flex-col transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-champagne/15 border border-champagne/40 flex items-center justify-center text-champagne shadow-lg shadow-champagne/10">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-mono text-xs font-bold tracking-widest text-white uppercase">
                Z SKILLS
              </h2>
              <p className="text-[10px] font-mono text-champagne uppercase tracking-wider">
                Management Studio
              </p>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden p-1.5 text-white/60 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Links Navigation List */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-thin">
          <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-white/40 font-medium">
            Core Menu
          </div>
          {navItems.map((item) => {
            const active = isActive(item.path, item.exact);
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-sans font-medium transition-all duration-200 group ${
                  active
                    ? 'bg-champagne text-black font-semibold shadow-md shadow-champagne/20'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    active ? 'text-black' : 'text-champagne/80 group-hover:text-champagne'
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User & Live View Footer */}
        <div className="p-4 border-t border-white/10 bg-[#0A0A0D]/80 space-y-3">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-champagne transition-all"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live Website</span>
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
              Active
            </span>
          </a>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-champagne/20 text-champagne flex items-center justify-center font-mono text-xs font-bold">
                {user?.username?.[0]?.toUpperCase() || 'A'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-medium text-white truncate">{user?.username}</p>
                <p className="text-[10px] text-white/50 font-mono">Administrator</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-white/50 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="md:hidden fixed inset-0 bg-black/70 z-40 backdrop-blur-sm"
        />
      )}

      {/* Main Outlet Container */}
      <main className="flex-1 min-w-0 bg-[#08080B] p-4 sm:p-8 lg:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
