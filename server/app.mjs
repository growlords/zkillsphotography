import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'node:path';
import fs from 'node:fs';
import { db, initSchema } from './db.mjs';
import { authenticateUser, destroySession, validateSession, changeAdminPassword, requireAuth } from './auth.mjs';
import { upload, registerMediaFile } from './upload.mjs';
import {
  getCloudContent,
  saveCloudContent,
  getCloudProjects,
  saveCloudProjects,
  uploadMediaToCloud
} from './cloudStore.mjs';

const app = express();

// Ensure database schema is ready
try {
  initSchema();
} catch (err) {
  console.warn('[DB] Schema initialization warning:', err.message);
}

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(cookieParser());

// Static directories
const isVercel = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const UPLOADS_DIR = isVercel
  ? path.resolve('/tmp', 'uploads')
  : path.resolve(process.cwd(), 'public/uploads');
const ASSETS_DIR = path.resolve(process.cwd(), 'public/assets');

// Uploaded file delivery with fallback to persistent cloud storage
app.get('/uploads/:filename', (req, res, next) => {
  const localFile = path.join(UPLOADS_DIR, req.params.filename);
  if (fs.existsSync(localFile)) {
    return res.sendFile(localFile);
  }
  // If ephemeral /tmp does not have the file on cold start, redirect to permanent cloud asset
  return res.redirect(302, `https://raw.githubusercontent.com/growlords/zkillsphotography/main/public/uploads/${req.params.filename}`);
});

app.use('/uploads', express.static(UPLOADS_DIR));
app.use('/assets', express.static(ASSETS_DIR));

// Create Router so routes work with both /api/* and /* prefixes
const router = express.Router();

// Enforce aggressive cache busting on all API routes so admin updates are immediately visible
router.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  next();
});

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

router.post('/auth/login', (req, res) => {
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

router.post('/auth/logout', (req, res) => {
  const token = req.cookies?.admin_session || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : null);
  destroySession(token);
  res.clearCookie('admin_session');
  res.json({ success: true, message: 'Logged out successfully' });
});

router.get('/auth/me', (req, res) => {
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

router.post('/auth/change-password', requireAuth, (req, res) => {
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

router.get('/debug-kvdb', async (req, res) => {
  try {
    const t0 = Date.now();
    const r = await fetch('https://kvdb.io/AybQTUpEeH2rQaAP1VYCjM/portfolio_projects');
    const text = await r.text();
    res.json({
      status: r.status,
      timeMs: Date.now() - t0,
      headers: Object.fromEntries(r.headers.entries()),
      bodyLength: text.length,
      bodyPreview: text.slice(0, 200)
    });
  } catch (e) {
    res.status(500).json({ error: e.message, stack: e.stack });
  }
});

// ==========================================
// STATS / OVERVIEW ROUTE
// ==========================================

router.get('/stats', async (req, res) => {
  try {
    const cloudProjects = await getCloudProjects();
    const projectsList = Array.isArray(cloudProjects) && cloudProjects.length > 0
      ? cloudProjects
      : db.prepare('SELECT * FROM portfolio_projects').all();

    const totalProjects = projectsList.length;
    const publishedProjects = projectsList.filter((p) => p.published).length;
    const draftProjects = totalProjects - publishedProjects;
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
      dbEngine: 'Persistent Global Cloud Storage (GitHub & SQLite WAL)'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// SITE CONTENT ROUTES (PERSISTENT CLOUD + LOCAL)
// ==========================================

router.get('/content', async (req, res) => {
  try {
    const cloudData = await getCloudContent();
    if (cloudData && Object.keys(cloudData).length > 0) {
      return res.json(cloudData);
    }

    // Fallback to local DB
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

router.get('/content/:section', async (req, res) => {
  try {
    const cloudData = await getCloudContent();
    if (cloudData && cloudData[req.params.section]) {
      return res.json(cloudData[req.params.section]);
    }

    const row = db.prepare('SELECT data_json, updated_at FROM site_content WHERE key = ?').get(req.params.section);
    if (!row) {
      return res.status(404).json({ error: `Section '${req.params.section}' not found` });
    }
    res.json(JSON.parse(row.data_json));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/content/:section', requireAuth, async (req, res) => {
  try {
    const section = req.params.section;
    const dataJson = JSON.stringify(req.body);
    const now = new Date().toISOString();

    // 1. Update local database
    try {
      db.prepare(`
        INSERT INTO site_content (key, data_json, updated_at)
        VALUES (?, ?, ?)
        ON CONFLICT(key) DO UPDATE SET
          data_json = excluded.data_json,
          updated_at = excluded.updated_at
      `).run(section, dataJson, now);
    } catch (e) {
      console.warn('[DB] Local write warning:', e.message);
    }

    // 2. Persist to cloud store across all Vercel instances
    let currentContent = (await getCloudContent(true)) || {};
    currentContent[section] = req.body;
    await saveCloudContent(currentContent);

    res.json({ success: true, section, data: req.body, updatedAt: now });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// PORTFOLIO CRUD ROUTES (PERSISTENT CLOUD + LOCAL)
// ==========================================

router.get('/portfolio', async (req, res) => {
  try {
    const isAll = req.query.all === 'true';
    const cloudProjects = await getCloudProjects();

    if (Array.isArray(cloudProjects) && cloudProjects.length > 0) {
      const normalized = cloudProjects.map((p) => ({
        id: p.id,
        title: p.title,
        category: p.category,
        year: p.year,
        location: p.location,
        description: p.description,
        coverImage: p.coverImage || p.cover_image,
        gallery: Array.isArray(p.gallery) ? p.gallery : JSON.parse(p.gallery_json || '[]'),
        videoSrc: p.videoSrc || p.video_src || undefined,
        featured: Boolean(p.featured),
        published: p.published === true || p.published === 1,
        displayOrder: Number(p.displayOrder ?? p.display_order ?? 0),
        createdAt: p.createdAt || p.created_at,
        updatedAt: p.updatedAt || p.updated_at
      }));

      let projects = isAll ? normalized : normalized.filter((p) => p.published);
      projects.sort((a, b) => a.displayOrder - b.displayOrder);
      return res.json(projects);
    }

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

router.get('/portfolio/:id', async (req, res) => {
  try {
    const cloudProjects = await getCloudProjects();
    if (Array.isArray(cloudProjects)) {
      const p = cloudProjects.find((item) => item.id === req.params.id);
      if (p) return res.json(p);
    }

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

router.post('/portfolio', requireAuth, async (req, res) => {
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

    const newProject = {
      id,
      title,
      category,
      year: year || new Date().getFullYear().toString(),
      location: location || 'Sirsa, India',
      description: description || '',
      coverImage,
      gallery,
      videoSrc: videoSrc || null,
      featured: Boolean(featured),
      published: Boolean(published),
      displayOrder: Number(displayOrder) || 0,
      createdAt: now,
      updatedAt: now
    };

    // 1. Update local DB
    try {
      db.prepare(`
        INSERT INTO portfolio_projects (
          id, title, category, year, location, description, cover_image, gallery_json, video_src, featured, published, display_order, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id,
        newProject.title,
        newProject.category,
        newProject.year,
        newProject.location,
        newProject.description,
        newProject.coverImage,
        JSON.stringify(newProject.gallery),
        newProject.videoSrc,
        newProject.featured ? 1 : 0,
        newProject.published ? 1 : 0,
        newProject.displayOrder,
        now,
        now
      );
    } catch (e) {
      console.warn('[DB] Local write warning:', e.message);
    }

    // 2. Persist to cloud store
    const projects = (await getCloudProjects(true)) || [];
    projects.push(newProject);
    await saveCloudProjects(projects);

    res.status(201).json({ success: true, id, message: 'Project created successfully', project: newProject });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/portfolio/:id', requireAuth, async (req, res) => {
  try {
    const id = req.params.id;
    const now = new Date().toISOString();
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

    // 1. Update local DB
    try {
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
    } catch (e) {
      console.warn('[DB] Local write warning:', e.message);
    }

    // 2. Persist to cloud store
    let projects = (await getCloudProjects(true)) || [];
    const index = projects.findIndex((p) => p.id === id);
    if (index !== -1) {
      projects[index] = {
        ...projects[index],
        title,
        category,
        year,
        location,
        description,
        coverImage,
        gallery,
        videoSrc: videoSrc || null,
        featured: Boolean(featured),
        published: Boolean(published),
        displayOrder: Number(displayOrder) || 0,
        updatedAt: now
      };
    } else {
      projects.push({
        id,
        title,
        category,
        year,
        location,
        description,
        coverImage,
        gallery,
        videoSrc: videoSrc || null,
        featured: Boolean(featured),
        published: Boolean(published),
        displayOrder: Number(displayOrder) || 0,
        createdAt: now,
        updatedAt: now
      });
    }
    await saveCloudProjects(projects);

    res.json({ success: true, id, message: 'Project updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/portfolio/:id', requireAuth, async (req, res) => {
  try {
    const id = req.params.id;

    // 1. Delete from local DB
    try {
      db.prepare('DELETE FROM portfolio_projects WHERE id = ?').run(id);
    } catch (e) {
      console.warn('[DB] Local delete warning:', e.message);
    }

    // 2. Delete from cloud store
    let projects = (await getCloudProjects(true)) || [];
    projects = projects.filter((p) => p.id !== id);
    await saveCloudProjects(projects);

    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/portfolio/:id/duplicate', requireAuth, async (req, res) => {
  try {
    let projects = (await getCloudProjects(true)) || [];
    let original = projects.find((p) => p.id === req.params.id);

    if (!original) {
      const r = db.prepare('SELECT * FROM portfolio_projects WHERE id = ?').get(req.params.id);
      if (r) {
        original = {
          id: r.id,
          title: r.title,
          category: r.category,
          year: r.year,
          location: r.location,
          description: r.description,
          coverImage: r.cover_image,
          gallery: JSON.parse(r.gallery_json || '[]'),
          videoSrc: r.video_src,
          featured: Boolean(r.featured),
          published: Boolean(r.published),
          displayOrder: r.display_order
        };
      }
    }

    if (!original) {
      return res.status(404).json({ error: 'Original project not found' });
    }

    const newId = `proj-${Date.now()}`;
    const now = new Date().toISOString();
    const newTitle = `${original.title} (Copy)`;

    const duplicated = {
      ...original,
      id: newId,
      title: newTitle,
      published: false,
      featured: false,
      displayOrder: (original.displayOrder || 0) + 1,
      createdAt: now,
      updatedAt: now
    };

    projects.push(duplicated);
    await saveCloudProjects(projects);

    res.status(201).json({ success: true, id: newId, title: newTitle });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/portfolio/reorder', requireAuth, async (req, res) => {
  try {
    const { order } = req.body;
    if (!Array.isArray(order)) {
      return res.status(400).json({ error: 'order array required' });
    }

    let projects = (await getCloudProjects(true)) || [];
    for (const item of order) {
      const p = projects.find((proj) => proj.id === item.id);
      if (p) p.displayOrder = item.displayOrder;
    }
    await saveCloudProjects(projects);

    try {
      const updateStmt = db.prepare('UPDATE portfolio_projects SET display_order = ? WHERE id = ?');
      for (const item of order) {
        updateStmt.run(item.displayOrder, item.id);
      }
    } catch (_) {}

    res.json({ success: true, message: 'Projects reordered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// MEDIA LIBRARY ROUTES
// ==========================================

router.get('/media', (req, res) => {
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

router.post('/media/upload', requireAuth, upload.array('files', 20), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files were uploaded' });
    }

    const registeredFiles = req.files.map((file) => registerMediaFile(file));

    // Upload to permanent cloud storage in background
    for (const file of req.files) {
      try {
        if (fs.existsSync(file.path) && file.size < 15 * 1024 * 1024) {
          const buffer = fs.readFileSync(file.path);
          await uploadMediaToCloud(file.filename, buffer);
        }
      } catch (err) {
        console.warn('[MediaUpload] Cloud backup notice:', err.message);
      }
    }

    res.status(201).json({
      success: true,
      files: registeredFiles,
      message: `Successfully uploaded ${registeredFiles.length} file(s)`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/media/upload-single', requireAuth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file was uploaded' });
    }

    const registered = registerMediaFile(req.file);

    // Upload to permanent cloud storage
    try {
      if (fs.existsSync(req.file.path) && req.file.size < 15 * 1024 * 1024) {
        const buffer = fs.readFileSync(req.file.path);
        await uploadMediaToCloud(req.file.filename, buffer);
      }
    } catch (err) {
      console.warn('[MediaUploadSingle] Cloud backup notice:', err.message);
    }

    res.status(201).json({
      success: true,
      file: registered,
      message: 'File uploaded successfully'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/media/:id', requireAuth, (req, res) => {
  try {
    const file = db.prepare('SELECT * FROM media_files WHERE id = ?').get(req.params.id);
    if (!file) {
      return res.status(404).json({ error: 'Media file not found' });
    }

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

// Mount router under /api AND root / so all rewrites work
app.use('/api', router);
app.use('/', router);

// Error handler
app.use((err, req, res, next) => {
  console.error('[API Error]:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

export default app;
export { app };
