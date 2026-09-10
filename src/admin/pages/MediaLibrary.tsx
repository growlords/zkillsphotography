import React, { useEffect, useState, useRef } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Video,
  Trash2,
  Copy,
  Check,
  Search,
  Loader2,
  ExternalLink,
  Film,
} from 'lucide-react';
import { useAdminToast } from '../components/AdminToast';

interface MediaFile {
  id: string;
  filename: string;
  original_name: string;
  file_type: 'image' | 'video';
  mime_type: string;
  file_size: number;
  url: string;
  created_at: string;
}

export const MediaLibrary: React.FC = () => {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewMedia, setPreviewMedia] = useState<MediaFile | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useAdminToast();

  const loadMedia = async () => {
    try {
      setLoading(true);
      const url = filterType === 'all' ? '/api/media' : `/api/media?type=${filterType}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setMediaFiles(data);
      }
    } catch {
      toast('Failed to load media files', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, [filterType]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      setUploadProgress(`Uploading ${files.length} file(s)...`);

      const fd = new FormData();
      for (let i = 0; i < files.length; i++) {
        fd.append('files', files[i]);
      }

      const res = await fetch('/api/media/upload', {
        method: 'POST',
        body: fd,
      });

      const data = await res.json();
      if (res.ok) {
        toast(`Successfully uploaded ${data.files?.length || files.length} asset(s)`, 'success');
        loadMedia();
      } else {
        toast(data.error || 'Upload failed', 'error');
      }
    } catch {
      toast('Error uploading media', 'error');
    } finally {
      setUploading(false);
      setUploadProgress(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (file: MediaFile) => {
    if (!confirm(`Delete "${file.original_name}"? This cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/media/${file.id}`, { method: 'DELETE' });
      if (res.ok) {
        setMediaFiles((prev) => prev.filter((f) => f.id !== file.id));
        toast('Media asset deleted', 'success');
      } else {
        toast('Failed to delete media', 'error');
      }
    } catch {
      toast('Network error deleting media', 'error');
    }
  };

  const handleCopyUrl = (file: MediaFile) => {
    navigator.clipboard.writeText(file.url);
    setCopiedId(file.id);
    toast('Asset URL copied to clipboard', 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatBytes = (bytes: number) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const filtered = mediaFiles.filter((f) =>
    (f.original_name || f.filename).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-champagne block mb-1">
            Media Storage & CDN
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-white font-normal">
            Media Library
          </h1>
          <p className="text-xs text-white/50 font-sans mt-1">
            Upload, preview, organize, and copy URLs for high-resolution photography and 4K cinema cuts.
          </p>
        </div>

        <div>
          <input
            type="file"
            ref={fileInputRef}
            multiple
            accept="image/*,video/*"
            onChange={handleUpload}
            className="hidden"
          />
          <button
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="px-5 py-2.5 rounded-xl bg-champagne hover:bg-champagne-dark text-black font-semibold text-xs font-mono tracking-wider flex items-center gap-2 shadow-lg shadow-champagne/20 transition-all disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{uploadProgress || 'Uploading...'}</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Upload Media Assets</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search filenames..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#121217] border border-white/10 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-champagne"
          />
        </div>

        <div className="flex items-center gap-2">
          {(['all', 'image', 'video'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors ${
                filterType === type
                  ? 'bg-champagne text-black font-semibold'
                  : 'bg-[#121217] text-white/70 hover:text-white border border-white/10'
              }`}
            >
              {type === 'all' ? 'All Files' : type === 'image' ? 'Images' : 'Videos'}
            </button>
          ))}
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="flex items-center justify-center p-24">
          <Loader2 className="w-8 h-8 text-champagne animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-20 text-center text-xs text-white/40 bg-[#121217] rounded-2xl border border-white/10">
          No media files found in this category. Click "Upload Media Assets" above to upload photos and videos.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((file) => (
            <div
              key={file.id}
              className="bg-[#121217] border border-white/10 rounded-xl overflow-hidden group hover:border-champagne/40 transition-all flex flex-col"
            >
              {/* Media Thumbnail Container */}
              <div
                onClick={() => setPreviewMedia(file)}
                className="aspect-square bg-black/60 relative cursor-pointer overflow-hidden flex items-center justify-center"
              >
                {file.file_type === 'image' ? (
                  <img
                    src={file.url}
                    alt={file.original_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/hero/hero-poster.jpg';
                    }}
                  />
                ) : (
                  <div className="w-full h-full relative flex items-center justify-center bg-[#09090C]">
                    <video
                      src={file.url}
                      className="w-full h-full object-cover opacity-70"
                      muted
                      preload="metadata"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <Film className="w-8 h-8 text-champagne" />
                    </div>
                  </div>
                )}

                {/* Top Badge */}
                <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-mono text-white/70 uppercase">
                  {file.file_type}
                </div>
              </div>

              {/* Info & Actions */}
              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <p
                    className="text-xs font-medium text-white truncate"
                    title={file.original_name || file.filename}
                  >
                    {file.original_name || file.filename}
                  </p>
                  <p className="text-[10px] font-mono text-white/40 mt-0.5">
                    {formatBytes(file.file_size)}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-white/5">
                  <button
                    onClick={() => handleCopyUrl(file)}
                    className="p-1 rounded-md text-white/60 hover:text-champagne transition-colors"
                    title="Copy URL to clipboard"
                  >
                    {copiedId === file.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    onClick={() => setPreviewMedia(file)}
                    className="p-1 rounded-md text-white/60 hover:text-white transition-colors"
                    title="Preview Fullscreen"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDelete(file)}
                    className="p-1 rounded-md text-white/40 hover:text-rose-400 transition-colors"
                    title="Delete File"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fullscreen Preview Modal */}
      {previewMedia && (
        <div
          onClick={() => setPreviewMedia(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl w-full bg-[#121217] border border-white/20 rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white truncate max-w-lg">
                  {previewMedia.original_name || previewMedia.filename}
                </h3>
                <p className="text-[11px] font-mono text-white/40 mt-0.5">
                  {previewMedia.url} • {formatBytes(previewMedia.file_size)}
                </p>
              </div>
              <button
                onClick={() => setPreviewMedia(null)}
                className="px-3 py-1 rounded-lg bg-white/10 text-xs font-mono text-white hover:bg-white/20"
              >
                Close
              </button>
            </div>

            <div className="max-h-[70vh] flex items-center justify-center bg-black p-4">
              {previewMedia.file_type === 'image' ? (
                <img
                  src={previewMedia.url}
                  alt={previewMedia.original_name}
                  className="max-h-[65vh] max-w-full object-contain rounded-lg"
                />
              ) : (
                <video
                  src={previewMedia.url}
                  controls
                  autoPlay
                  className="max-h-[65vh] max-w-full rounded-lg"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
