import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { db, initSchema } from './db.mjs';
import { authenticateUser, destroySession, validateSession, changeAdminPassword, requireAuth } from './auth.mjs';
import { upload, registerMediaFile } from './upload.mjs';

const app = express();
const PORT = process.env.PORT || 5001;

// Ensure database schema is ready
initSchema();

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(cookieParser());

// Static directories
const UPLOADS_DIR = path.resolve(process.cwd(), 'public/uploads');
const ASSETS_DIR = path.resolve(process.cwd(), 'public/assets');
app.use('/uploads', express.static(UPLOADS_DIR));
app.use('/assets', express.static(ASSETS_DIR));

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const result = authenticateUser(username, password);
  if (!result.success) {
    return res.status(401).json({ error: result.error });
  }

  res.cookie('admin_session', result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  res.json({
    success: true,
    user: result.user,
    token: result.token
  });
});

app.post('/api/auth/logout', (req, res) => {
  const token = req.cookies?.admin_session || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : null);
  destroySession(token);
  res.clearCookie('admin_session');
  res.json({ success: true, message: 'Logged out successfully' });
});

app.get('/api/auth/me', (req, res) => {
  const token = req.cookies?.admin_session || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : null);
  const user = validateSession(token);
  if (!user) {
    return res.status(401).json({ authenticated: false });
  }
  res.json({
    authenticated: true,
    user: {
      id: user.userId,
      username: user.username
    }
  });
});

app.post('/api/auth/change-password', requireAuth, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current password and new password are required' });
  }

  const result = changeAdminPassword(req.adminUser.userId, currentPassword, newPassword);
  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }

  res.json({ success: true, message: 'Password updated successfully' });
});

// ==========================================
// STATS / OVERVIEW ROUTE
// ==========================================

app.get('/api/stats', (req, res) => {
  try {
    const totalProjects = db.prepare('SELECT COUNT(*) as count FROM portfolio_projects').get().count;
    const publishedProjects = db.prepare('SELECT COUNT(*) as count FROM portfolio_projects WHERE published = 1').get().count;
    const draftProjects = db.prepare('SELECT COUNT(*) as count FROM portfolio_projects WHERE published = 0').get().count;
    const totalImages = db.prepare("SELECT COUNT(*) as count FROM media_files WHERE file_type = 'image'").get().count;
    const totalVideos = db.prepare("SELECT COUNT(*) as count FROM media_files WHERE file_type = 'video'").get().count;

    res.json({
      totalProjects,
      publishedProjects,
      draftProjects,
      totalImages,
      totalVideos,
      websiteStatus: 'Live & Operational',
      serverUptime: Math.floor(process.uptime()),
      dbEngine: 'Native SQLite 3 (node:sqlite WAL mode)'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// SITE CONTENT ROUTES
// ==========================================

// Public & Admin: Get all site content sections
app.get('/api/content', (req, res) => {
  try {
    const rows = db.prepare('SELECT key, data_json, updated_at FROM site_content').all();
    const content = {};
    for (const row of rows) {
      try {
        content[row.key] = JSON.parse(row.data_json);
      } catch {
        content[row.key] = row.data_json;
      }
    }
    res.json(content);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Public & Admin: Get specific section
app.get('/api/content/:section', (req, res) => {
  try {
    const row = db.prepare('SELECT data_json, updated_at FROM site_content WHERE key = ?').get(req.params.section);
    if (!row) {
      return res.status(404).json({ error: `Section '${req.params.section}' not found` });
    }
    res.json(JSON.parse(row.data_json));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Update section content
app.put('/api/content/:section', requireAuth, (req, res) => {
  try {
    const section = req.params.section;
    const dataJson = JSON.stringify(req.body);
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO site_content (key, data_json, updated_at)
      VALUES (?, ?, ?)
      ON CONFLICT(key) DO UPDATE SET
        data_json = excluded.data_json,
        updated_at = excluded.updated_at
    `).run(section, dataJson, now);

    res.json({ success: true, section, data: req.body, updatedAt: now });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// PORTFOLIO CRUD ROUTES
// ==========================================

// Get all projects
// Query param: ?all=true allows admin to see drafts; otherwise public sees published only
app.get('/api/portfolio', (req, res) => {
  try {
    const isAll = req.query.all === 'true';
    let query = 'SELECT * FROM portfolio_projects';
    if (!isAll) {
      query += ' WHERE published = 1';
    }
    query += ' ORDER BY display_order ASC, created_at DESC';

    const rows = db.prepare(query).all();
    const projects = rows.map((r) => ({
      id: r.id,
      title: r.title,
      category: r.category,
      year: r.year,
      location: r.location,
      description: r.description,
      coverImage: r.cover_image,
      gallery: JSON.parse(r.gallery_json || '[]'),
      videoSrc: r.video_src || undefined,
      featured: Boolean(r.featured),
      published: Boolean(r.published),
      displayOrder: r.display_order,
      createdAt: r.created_at,
      updatedAt: r.updated_at
    }));

    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single project
app.get('/api/portfolio/:id', (req, res) => {
  try {
    const r = db.prepare('SELECT * FROM portfolio_projects WHERE id = ?').get(req.params.id);
    if (!r) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({
      id: r.id,
      title: r.title,
      category: r.category,
      year: r.year,
      location: r.location,
      description: r.description,
      coverImage: r.cover_image,
      gallery: JSON.parse(r.gallery_json || '[]'),
      videoSrc: r.video_src || undefined,
      featured: Boolean(r.featured),
      published: Boolean(r.published),
      displayOrder: r.display_order,
      createdAt: r.created_at,
      updatedAt: r.updated_at
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Create project
app.post('/api/portfolio', requireAuth, (req, res) => {
  try {
    const {
      title,
      category,
      year,
      location,
      description,
      coverImage,
      gallery = [],
      videoSrc = null,
      featured = false,
      published = true,
      displayOrder = 0
    } = req.body;

    if (!title || !category || !coverImage) {
      return res.status(400).json({ error: 'Title, category, and cover image are required' });
    }

    const id = `proj-${Date.now()}`;
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO portfolio_projects (
        id, title, category, year, location, description, cover_image, gallery_json, video_src, featured, published, display_order, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      title,
      category,
      year || new Date().getFullYear().toString(),
      location || 'Sirsa, India',
      description || '',
      coverImage,
      JSON.stringify(gallery),
      videoSrc || null,
      featured ? 1 : 0,
      published ? 1 : 0,
      Number(displayOrder) || 0,
      now,
      now
    );

    res.status(201).json({ success: true, id, message: 'Project created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Update project
app.put('/api/portfolio/:id', requireAuth, (req, res) => {
  try {
    const id = req.params.id;
    const existing = db.prepare('SELECT id FROM portfolio_projects WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const {
      title,
      category,
      year,
      location,
      description,
      coverImage,
      gallery = [],
      videoSrc = null,
      featured = false,
      published = true,
      displayOrder = 0
    } = req.body;

    const now = new Date().toISOString();

    db.prepare(`
      UPDATE portfolio_projects SET
        title = ?,
        category = ?,
        year = ?,
        location = ?,
        description = ?,
        cover_image = ?,
        gallery_json = ?,
        video_src = ?,
        featured = ?,
        published = ?,
        display_order = ?,
        updated_at = ?
      WHERE id = ?
    `).run(
      title,
      category,
      year,
      location,
      description,
      coverImage,
      JSON.stringify(gallery),
      videoSrc || null,
      featured ? 1 : 0,
      published ? 1 : 0,
      Number(displayOrder) || 0,
      now,
      id
    );

    res.json({ success: true, id, message: 'Project updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Delete project
app.delete('/api/portfolio/:id', requireAuth, (req, res) => {
  try {
    const id = req.params.id;
    db.prepare('DELETE FROM portfolio_projects WHERE id = ?').run(id);
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Duplicate project
app.post('/api/portfolio/:id/duplicate', requireAuth, (req, res) => {
  try {
    const original = db.prepare('SELECT * FROM portfolio_projects WHERE id = ?').get(req.params.id);
    if (!original) {
      return res.status(404).json({ error: 'Original project not found' });
    }

    const newId = `proj-${Date.now()}`;
    const now = new Date().toISOString();
    const newTitle = `${original.title} (Copy)`;

    db.prepare(`
      INSERT INTO portfolio_projects (
        id, title, category, year, location, description, cover_image, gallery_json, video_src, featured, published, display_order, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      newId,
      newTitle,
      original.category,
      original.year,
      original.location,
      original.description,
      original.cover_image,
      original.gallery_json,
      original.video_src,
      0, // not featured by default
      0, // draft by default
      original.display_order + 1,
      now,
      now
    );

    res.status(201).json({ success: true, id: newId, title: newTitle });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Reorder projects
app.post('/api/portfolio/reorder', requireAuth, (req, res) => {
  try {
    const { order } = req.body; // array of { id, displayOrder }
    if (!Array.isArray(order)) {
      return res.status(400).json({ error: 'order array required' });
    }

    const updateStmt = db.prepare('UPDATE portfolio_projects SET display_order = ? WHERE id = ?');
    for (const item of order) {
      updateStmt.run(item.displayOrder, item.id);
    }

    res.json({ success: true, message: 'Projects reordered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// MEDIA LIBRARY ROUTES
// ==========================================

// Get all media files
app.get('/api/media', (req, res) => {
  try {
    const { type } = req.query;
    let query = 'SELECT * FROM media_files';
    const params = [];
    if (type && (type === 'image' || type === 'video')) {
      query += ' WHERE file_type = ?';
      params.push(type);
    }
    query += ' ORDER BY created_at DESC';

    const rows = db.prepare(query).all(...params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload media file(s)
app.post('/api/media/upload', requireAuth, upload.array('files', 20), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files were uploaded' });
    }

    const registeredFiles = req.files.map((file) => registerMediaFile(file));
    res.status(201).json({
      success: true,
      files: registeredFiles,
      message: `Successfully uploaded ${registeredFiles.length} file(s)`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload single media file (e.g. Hero video or poster)
app.post('/api/media/upload-single', requireAuth, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file was uploaded' });
    }

    const registered = registerMediaFile(req.file);
    res.status(201).json({
      success: true,
      file: registered,
      message: 'File uploaded successfully'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete media file
app.delete('/api/media/:id', requireAuth, (req, res) => {
  try {
    const file = db.prepare('SELECT * FROM media_files WHERE id = ?').get(req.params.id);
    if (!file) {
      return res.status(404).json({ error: 'Media file not found' });
    }

    // If file is located in uploads/, remove from disk
    if (file.url.startsWith('/uploads/')) {
      const diskPath = path.join(UPLOADS_DIR, file.filename);
      if (fs.existsSync(diskPath)) {
        try {
          fs.unlinkSync(diskPath);
        } catch (_) {}
      }
    }

    db.prepare('DELETE FROM media_files WHERE id = ?').run(file.id);
    res.json({ success: true, message: 'Media file deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// General error handler
app.use((err, req, res, next) => {
  console.error('[API Error]:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`[API Server] Running on http://localhost:${PORT}`);
  console.log(`[API Server] Uploads served at http://localhost:${PORT}/uploads`);
});
