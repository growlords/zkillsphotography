import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { db } from './db.mjs';

const UPLOADS_DIR = path.resolve(process.cwd(), 'public/uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 40);
    const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
    cb(null, `${cleanName}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedImageMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'image/heic'];
  const allowedVideoMimes = ['video/mp4', 'video/webm', 'video/quicktime'];
  
  if (allowedImageMimes.includes(file.mimetype) || allowedVideoMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type (${file.mimetype}). Allowed types: Images (JPG, PNG, WebP, AVIF) & Videos (MP4, WebM, MOV)`), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 250 * 1024 * 1024 // 250 MB max
  }
});

// Helper to record uploaded file in media_files table
export function registerMediaFile(file) {
  const isVideo = file.mimetype.startsWith('video/');
  const url = `/uploads/${file.filename}`;
  const now = new Date().toISOString();
  const id = crypto.randomUUID();

  db.prepare(`
    INSERT INTO media_files (id, filename, original_name, url, file_type, mime_type, size_bytes, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    file.filename,
    file.originalname,
    url,
    isVideo ? 'video' : 'image',
    file.mimetype,
    file.size,
    now
  );

  return {
    id,
    filename: file.filename,
    originalName: file.originalname,
    url,
    fileType: isVideo ? 'video' : 'image',
    mimeType: file.mimetype,
    sizeBytes: file.size,
    createdAt: now
  };
}
