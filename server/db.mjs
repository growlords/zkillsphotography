import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';

const isVercel = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const DATA_DIR = isVercel
  ? path.resolve('/tmp', 'data')
  : path.resolve(process.cwd(), 'data');

if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (err) {
    // ignore
  }
}

const DB_PATH = path.join(DATA_DIR, 'zskills.db');

// Attempt to load native node:sqlite
let nativeSqlite = null;
try {
  const mod = await import('node:sqlite');
  if (mod && mod.DatabaseSync) {
    nativeSqlite = new mod.DatabaseSync(DB_PATH);
    nativeSqlite.exec('PRAGMA journal_mode = WAL;');
    nativeSqlite.exec('PRAGMA foreign_keys = ON;');
  }
} catch (e) {
  console.log('[DB] Native node:sqlite not available in this runtime, using universal in-memory/JSON storage engine.');
}

// -------------------------------------------------------------------
// Fallback In-Memory / JSON Store (Active when node:sqlite is absent)
// -------------------------------------------------------------------
const store = {
  admin_users: [],
  sessions: [],
  site_content: {},
  portfolio_projects: [],
  media_files: [],
};

// SQLite Mock Adapter
const fallbackDb = {
  exec(sql) {
    // schema creation is handled in-memory
  },
  prepare(sql) {
    const s = sql.trim().toUpperCase();

    // 1. SELECT COUNT(*)
    if (s.startsWith('SELECT COUNT(*)')) {
      return {
        get(...params) {
          if (s.includes('PORTFOLIO_PROJECTS')) {
            if (s.includes('PUBLISHED = 1')) {
              const count = store.portfolio_projects.filter((p) => p.published === 1).length;
              return { count };
            }
            if (s.includes('PUBLISHED = 0')) {
              const count = store.portfolio_projects.filter((p) => p.published === 0).length;
              return { count };
            }
            return { count: store.portfolio_projects.length };
          }
          if (s.includes('MEDIA_FILES')) {
            if (s.includes("FILE_TYPE = 'IMAGE'")) {
              return { count: store.media_files.filter((m) => m.file_type === 'image').length };
            }
            if (s.includes("FILE_TYPE = 'VIDEO'")) {
              return { count: store.media_files.filter((m) => m.file_type === 'video').length };
            }
            return { count: store.media_files.length };
          }
          if (s.includes('ADMIN_USERS')) {
            return { count: store.admin_users.length };
          }
          return { count: 0 };
        },
      };
    }

    // 2. ADMIN USERS
    if (s.includes('ADMIN_USERS')) {
      if (s.startsWith('SELECT * FROM ADMIN_USERS WHERE USERNAME = ?')) {
        return {
          get(username) {
            return store.admin_users.find((u) => u.username === username);
          },
        };
      }
      if (s.startsWith('SELECT * FROM ADMIN_USERS WHERE ID = ?')) {
        return {
          get(id) {
            return store.admin_users.find((u) => u.id === id);
          },
        };
      }
      if (s.startsWith('INSERT INTO ADMIN_USERS')) {
        return {
          run(id, username, hash, salt, createdAt, updatedAt) {
            store.admin_users.push({
              id,
              username,
              password_hash: hash,
              salt,
              created_at: createdAt,
              updated_at: updatedAt,
            });
            return { changes: 1 };
          },
        };
      }
      if (s.startsWith('UPDATE ADMIN_USERS')) {
        return {
          run(hash, salt, updatedAt, userId) {
            const u = store.admin_users.find((user) => user.id === userId);
            if (u) {
              u.password_hash = hash;
              u.salt = salt;
              u.updated_at = updatedAt;
            }
            return { changes: 1 };
          },
        };
      }
    }

    // 3. SESSIONS
    if (s.includes('SESSIONS')) {
      if (s.startsWith('INSERT INTO SESSIONS')) {
        return {
          run(token, userId, expiresAt, createdAt) {
            store.sessions.push({ token, user_id: userId, expires_at: expiresAt, created_at: createdAt });
            return { changes: 1 };
          },
        };
      }
      if (s.startsWith('SELECT S.TOKEN')) {
        return {
          get(token) {
            const sess = store.sessions.find((s) => s.token === token);
            if (!sess) return undefined;
            const u = store.admin_users.find((user) => user.id === sess.user_id);
            if (!u) return undefined;
            return {
              token: sess.token,
              expires_at: sess.expires_at,
              user_id: u.id,
              username: u.username,
            };
          },
        };
      }
      if (s.startsWith('DELETE FROM SESSIONS WHERE TOKEN = ?')) {
        return {
          run(token) {
            store.sessions = store.sessions.filter((s) => s.token !== token);
            return { changes: 1 };
          },
        };
      }
    }

    // 4. SITE CONTENT
    if (s.includes('SITE_CONTENT')) {
      if (s.startsWith('SELECT KEY, DATA_JSON')) {
        return {
          all() {
            return Object.entries(store.site_content).map(([key, data]) => ({
              key,
              data_json: typeof data === 'string' ? data : JSON.stringify(data),
              updated_at: new Date().toISOString(),
            }));
          },
        };
      }
      if (s.startsWith('SELECT DATA_JSON')) {
        return {
          get(key) {
            const data = store.site_content[key];
            if (!data) return undefined;
            return {
              data_json: typeof data === 'string' ? data : JSON.stringify(data),
              updated_at: new Date().toISOString(),
            };
          },
        };
      }
      if (s.startsWith('INSERT INTO SITE_CONTENT')) {
        return {
          run(key, dataJson, updatedAt) {
            store.site_content[key] = JSON.parse(dataJson);
            return { changes: 1 };
          },
        };
      }
    }

    // 5. PORTFOLIO PROJECTS
    if (s.includes('PORTFOLIO_PROJECTS')) {
      if (s.startsWith('SELECT * FROM PORTFOLIO_PROJECTS WHERE ID = ?')) {
        return {
          get(id) {
            return store.portfolio_projects.find((p) => p.id === id);
          },
        };
      }
      if (s.startsWith('SELECT * FROM PORTFOLIO_PROJECTS')) {
        return {
          all() {
            let list = [...store.portfolio_projects];
            if (s.includes('WHERE PUBLISHED = 1')) {
              list = list.filter((p) => p.published === 1);
            }
            list.sort((a, b) => a.display_order - b.display_order);
            return list;
          },
        };
      }
      if (s.startsWith('INSERT INTO PORTFOLIO_PROJECTS')) {
        return {
          run(id, title, category, year, location, description, coverImage, galleryJson, videoSrc, featured, published, displayOrder, createdAt, updatedAt) {
            store.portfolio_projects.push({
              id,
              title,
              category,
              year,
              location,
              description,
              cover_image: coverImage,
              gallery_json: galleryJson,
              video_src: videoSrc,
              featured,
              published,
              display_order: displayOrder,
              created_at: createdAt,
              updated_at: updatedAt,
            });
            return { changes: 1 };
          },
        };
      }
      if (s.startsWith('UPDATE PORTFOLIO_PROJECTS SET DISPLAY_ORDER')) {
        return {
          run(displayOrder, id) {
            const p = store.portfolio_projects.find((x) => x.id === id);
            if (p) p.display_order = displayOrder;
            return { changes: 1 };
          },
        };
      }
      if (s.startsWith('UPDATE PORTFOLIO_PROJECTS SET')) {
        return {
          run(title, category, year, location, description, coverImage, galleryJson, videoSrc, featured, published, displayOrder, updatedAt, id) {
            const idx = store.portfolio_projects.findIndex((x) => x.id === id);
            if (idx !== -1) {
              store.portfolio_projects[idx] = {
                ...store.portfolio_projects[idx],
                title,
                category,
                year,
                location,
                description,
                cover_image: coverImage,
                gallery_json: galleryJson,
                video_src: videoSrc,
                featured,
                published,
                display_order: displayOrder,
                updated_at: updatedAt,
              };
            }
            return { changes: 1 };
          },
        };
      }
      if (s.startsWith('DELETE FROM PORTFOLIO_PROJECTS')) {
        return {
          run(id) {
            store.portfolio_projects = store.portfolio_projects.filter((p) => p.id !== id);
            return { changes: 1 };
          },
        };
      }
    }

    // 6. MEDIA FILES
    if (s.includes('MEDIA_FILES')) {
      if (s.startsWith('SELECT * FROM MEDIA_FILES WHERE ID = ?')) {
        return {
          get(id) {
            return store.media_files.find((m) => m.id === id);
          },
        };
      }
      if (s.startsWith('SELECT * FROM MEDIA_FILES')) {
        return {
          all(type) {
            if (type) {
              return store.media_files.filter((m) => m.file_type === type);
            }
            return store.media_files;
          },
        };
      }
      if (s.startsWith('INSERT INTO MEDIA_FILES')) {
        return {
          run(id, filename, originalName, url, fileType, mimeType, size, createdAt) {
            store.media_files.push({
              id,
              filename,
              original_name: originalName,
              url,
              file_type: fileType,
              mime_type: mimeType,
              size_bytes: size,
              created_at: createdAt,
            });
            return { changes: 1 };
          },
        };
      }
      if (s.startsWith('DELETE FROM MEDIA_FILES')) {
        return {
          run(id) {
            store.media_files = store.media_files.filter((m) => m.id !== id);
            return { changes: 1 };
          },
        };
      }
    }

    // Default fallback
    return {
      run: () => ({ changes: 0 }),
      get: () => undefined,
      all: () => [],
    };
  },
};

export const db = nativeSqlite || fallbackDb;

export function initSchema() {
  if (nativeSqlite) {
    nativeSqlite.exec(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        salt TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS site_content (
        key TEXT PRIMARY KEY,
        data_json TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS portfolio_projects (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        year TEXT NOT NULL,
        location TEXT NOT NULL,
        description TEXT NOT NULL,
        cover_image TEXT NOT NULL,
        gallery_json TEXT NOT NULL,
        video_src TEXT,
        featured INTEGER DEFAULT 0,
        published INTEGER DEFAULT 1,
        display_order INTEGER DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS media_files (
        id TEXT PRIMARY KEY,
        filename TEXT NOT NULL,
        original_name TEXT NOT NULL,
        url TEXT NOT NULL,
        file_type TEXT NOT NULL,
        mime_type TEXT NOT NULL,
        size_bytes INTEGER NOT NULL,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS sessions (
        token TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        expires_at TEXT NOT NULL,
        created_at TEXT NOT NULL
      );
    `);
  }

  seedInitialData();
}

function hashPassword(password, salt) {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

function seedInitialData() {
  const now = new Date().toISOString();

  // 1. Seed Admin User (kamaljeet / kamal@123#)
  const userCount = db.prepare('SELECT COUNT(*) as count FROM admin_users').get();
  if (!userCount || userCount.count === 0) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = hashPassword('kamal@123#', salt);
    const insertUser = db.prepare(`
      INSERT INTO admin_users (id, username, password_hash, salt, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    insertUser.run(crypto.randomUUID(), 'kamaljeet', hash, salt, now, now);
    console.log('[DB] Seeded initial admin user: kamaljeet');
  }

  // 2. Seed Default Content
  const defaultSections = {
    branding: {
      brandName: "Z SKILLS PHOTOGRAPHY",
      tagline: "Stories That Feel Like Cinema.",
      establishment: "EST. CINEMA ARCHIVE",
      location: "Sirsa, India"
    },
    hero: {
      badge: "CINEMATIC FILM & LUXURY PHOTOGRAPHY",
      headline: "Stories That Feel Like Cinema.",
      subheadline: "Wedding Films • Photography • Pre-Weddings • Events • Reels",
      description: "Z Skills Photography is an award-winning visual storytelling studio crafting high-end wedding films, editorial photography, and cinematic narratives in Sirsa and worldwide.",
      primaryCtaText: "Explore Work",
      primaryCtaLink: "#films",
      secondaryCtaText: "Book Your Dates",
      secondaryCtaLink: "#contact",
      videoSrc: "/assets/hero/hero-bg.mp4",
      posterSrc: "/assets/hero/hero-poster.jpg"
    },
    about: {
      badge: "THE CREATIVE PHILOSOPHY",
      heading: "Behind Every Lens, A Timeless Story.",
      description: "At Z Skills Photography, we believe every love story, wedding celebration, and milestone is an unrepeatable chapter of human emotion. Based in Sirsa, India, our creative team documents genuine moments with editorial precision, nuanced lighting, and timeless color grading.",
      location: "Sirsa, Haryana, India",
      image: "/assets/photos/bridal-masterpiece-4k.jpg",
      stats: [
        { label: "Events Captured", value: "100", suffix: "+" },
        { label: "Stories Delivered", value: "500", suffix: "+" },
        { label: "Moments Preserved", value: "1000", suffix: "+" },
        { label: "Client Satisfaction", value: "100", suffix: "%" }
      ]
    },
    services: [
      {
        id: "srv-1",
        title: "Wedding Cinematography",
        description: "Full-scale multi-camera 4K cinematic film capturing Anand Karaj ceremonies, lavish receptions, emotional farewells, and candid glances.",
        icon: "Camera",
        bgImage: "/assets/films/wedding-story-poster.jpg",
        bgVideo: "/assets/films/wedding-story-full.mp4",
        features: ["Multi-angle 4K Cinema Cameras", "Licensed Soundtrack Scoring", "Dedicated Drone Aerials", "Teaser & Full Film Delivery"],
        displayOrder: 1,
        published: true
      },
      {
        id: "srv-2",
        title: "Pre-Wedding Narratives",
        description: "Artistic, concept-driven romantic storytelling captured in golden hour mustard fields, heritage havelis, and scenic landscapes.",
        icon: "Film",
        bgImage: "/assets/films/mustard-fields-poster.jpg",
        bgVideo: "/assets/films/mustard-fields.mp4",
        features: ["Story Concept & Moodboard Design", "Scenic Location Direction", "Editorial Wardrobe Styling", "Social Media 4K Reels"],
        displayOrder: 2,
        published: true
      },
      {
        id: "srv-3",
        title: "Editorial Bridal Portraits",
        description: "Magazine-grade high-fashion photography focusing on intricate jewelry details, hand-embroidered lehengas, and timeless elegance.",
        icon: "Sparkles",
        bgImage: "/assets/photos/bridal-masterpiece-4k.jpg",
        features: ["High-Resolution Hasselblad Quality", "Skin Tone Color Science", "Heirloom Album Prints", "Private Cloud Gallery"],
        displayOrder: 3,
        published: true
      },
      {
        id: "srv-4",
        title: "Celebrations & Milestone Events",
        description: "Discreet and documentary-style coverage of anniversaries, royal family gatherings, and milestone lifetime moments.",
        icon: "Eye",
        bgImage: "/assets/photos/royal-vintage-1.jpg",
        features: ["Candid Documentary Style", "Same-Day Teasers", "Full Event Archival Record", "High-Resolution Cloud Download"],
        displayOrder: 4,
        published: true
      }
    ],
    process: [
      {
        step: "01",
        title: "Creative Discovery",
        description: "We meet to discuss your wedding timeline, cultural ceremonies, mood boards, and aesthetic preferences.",
        displayOrder: 1
      },
      {
        step: "02",
        title: "Cinematic Production",
        description: "On your event days, our discreet team documents authentic emotion with cinema-grade cameras and prime lenses.",
        displayOrder: 2
      },
      {
        step: "03",
        title: "Editorial Post-Production",
        description: "Color grading, sound design, licensed score integration, and frame-by-frame retouching bring your film alive.",
        displayOrder: 3
      },
      {
        step: "04",
        title: "Archive Delivery",
        description: "Receive your private high-res cloud gallery, 4K master films, customized social reels, and heirloom prints.",
        displayOrder: 4
      }
    ],
    testimonials: [
      {
        id: "test-1",
        clientName: "Gurpreet & Navjot",
        eventType: "3-Day Punjabi Wedding",
        location: "Sirsa",
        quote: "Z Skills Photography gave us something we will cherish for our entire lives. Our wedding film felt like an actual movie premier. The emotions, lighting, and candid moments were captured with pure perfection.",
        rating: 5,
        published: true,
        displayOrder: 1
      },
      {
        id: "test-2",
        clientName: "Aman & Jasmeet",
        eventType: "Destination Pre-Wedding",
        location: "Punjab",
        quote: "From our concept shoot in the golden fields to our final album, the professionalism and creative direction were unmatched. Everyone is still asking who shot our reels!",
        rating: 5,
        published: true,
        displayOrder: 2
      },
      {
        id: "test-3",
        clientName: "Harman & Simran",
        eventType: "Sacred Anand Karaj Ceremony",
        location: "Haryana",
        quote: "They were so respectful during the sacred rituals and yet captured the most breathtaking artistic angles. Hands down the finest cinematography team in the region.",
        rating: 5,
        published: true,
        displayOrder: 3
      }
    ],
    contact: {
      phone: "+91 9729371307",
      phoneRaw: "9729371307",
      phoneTel: "tel:+919729371307",
      whatsappUrl: "https://wa.me/919729371307",
      email: "kambojkamaljeet13@gmail.com",
      location: "Sirsa, India",
      schemaAddress: "Sirsa, Haryana, India",
      businessHours: "Monday - Sunday: 9:00 AM - 9:00 PM",
      ctaHeadline: "Begin Your Visual Legacy.",
      ctaDescription: "Whether you are planning an intimate Anand Karaj, a lavish multi-day Punjabi wedding celebration, or an editorial pre-wedding film, we would love to hear from you."
    },
    social: {
      instagramUrl: "https://www.instagram.com/its._kamalpreet_13?stkn=MXBmOWR3NG9wNjV3bA%3D%3D",
      instagramHandle: "@its._kamalpreet_13",
      youtubeUrl: "https://youtube.com/@zskillsphotography?si=9dr-0VvT0ZFkjrDl",
      whatsappUrl: "https://wa.me/919729371307",
      phoneTel: "tel:+919729371307"
    },
    seo: {
      title: "Z Skills Photography | Wedding Photography & Cinematic Films",
      description: "Z Skills Photography creates cinematic wedding films, photography, pre-wedding shoots, event coverage and professional reels in Sirsa, India.",
      keywords: "Z Skills Photography, wedding cinematography Sirsa, wedding photography Haryana, pre-wedding shoots Sirsa, Anand Karaj films, luxury wedding videography",
      ogTitle: "Z Skills Photography | Wedding Photography & Cinematic Films",
      ogDescription: "Stories That Feel Like Cinema. Luxury wedding films, editorial photography, and pre-wedding visual storytelling in Sirsa, India.",
      ogImage: "/assets/photos/bridal-masterpiece-4k.jpg",
      canonicalUrl: "https://zskillsphotography.com/"
    }
  };

  for (const [sectionKey, dataObj] of Object.entries(defaultSections)) {
    const existing = db.prepare('SELECT key FROM site_content WHERE key = ?').get(sectionKey);
    if (!existing) {
      db.prepare(`
        INSERT INTO site_content (key, data_json, updated_at)
        VALUES (?, ?, ?)
      `).run(sectionKey, JSON.stringify(dataObj), now);
    }
  }

  // 3. Seed Default Portfolio Projects
  const defaultProjects = [
    {
      id: "proj-1",
      title: "The Regal Bride — Royal Couture",
      category: "Weddings",
      year: "2026",
      location: "Barnala, Punjab",
      description: "A showcase of traditional Punjabi bridal elegance featuring crimson embroidery, heirloom emerald jewels, and intimate bridal expressions.",
      cover_image: "/assets/photos/bridal-masterpiece-4k.jpg",
      gallery_json: JSON.stringify([
        "/assets/photos/bridal-masterpiece-4k.jpg",
        "/assets/photos/bridal-fineart-1.webp",
        "/assets/photos/bridal-fineart-2.webp",
        "/assets/photos/bridal-fineart-3.webp",
        "/assets/photos/bridal-fineart-4.webp"
      ]),
      video_src: "/assets/films/wedding-story-full.mp4",
      featured: 1,
      published: 1,
      display_order: 1
    },
    {
      id: "proj-2",
      title: "Vintage Romance & Golden Meadows",
      category: "Pre-Weddings",
      year: "2026",
      location: "Zira, Punjab",
      description: "Rich Persian carpets framed in open blooming mustard fields, blending royal ancestral nostalgia with high-fashion editorial styling.",
      cover_image: "/assets/photos/royal-vintage-1.jpg",
      gallery_json: JSON.stringify([
        "/assets/photos/royal-vintage-1.jpg",
        "/assets/photos/royal-vintage-2.jpg",
        "/assets/photos/royal-vintage-3.jpg",
        "/assets/photos/royal-vintage-4.jpg"
      ]),
      video_src: "/assets/films/mustard-fields.mp4",
      featured: 1,
      published: 1,
      display_order: 2
    },
    {
      id: "proj-3",
      title: "Sacred Vows — The Anand Karaj",
      category: "Weddings",
      year: "2026",
      location: "Gurudwara Sahib, Punjab",
      description: "The spiritual harmony of Anand Karaj, capturing reverent rituals, blessed chants, and eternal matrimonial devotion.",
      cover_image: "/assets/photos/anand-karaj-2.jpg",
      gallery_json: JSON.stringify([
        "/assets/photos/anand-karaj-1.jpg",
        "/assets/photos/anand-karaj-2.jpg",
        "/assets/photos/anand-karaj-3.jpg",
        "/assets/photos/anand-karaj-4.jpg"
      ]),
      video_src: "/assets/films/wedding-story-full.mp4",
      featured: 1,
      published: 1,
      display_order: 3
    },
    {
      id: "proj-4",
      title: "Gagan & Jaspreet — Eternal Bonds",
      category: "Pre-Weddings",
      year: "2026",
      location: "Barnala, Punjab",
      description: "Authentic, candid connection captured amidst natural Punjab landscapes, focusing on unscripted laughter and heartfelt moments.",
      cover_image: "/assets/photos/prewedding-gagan-jaspreet-2.jpg",
      gallery_json: JSON.stringify([
        "/assets/photos/prewedding-gagan-jaspreet-1.jpg",
        "/assets/photos/prewedding-gagan-jaspreet-2.jpg",
        "/assets/photos/prewedding-gagan-jaspreet-3.jpg"
      ]),
      video_src: "/assets/films/mustard-fields.mp4",
      featured: 1,
      published: 1,
      display_order: 4
    },
    {
      id: "proj-5",
      title: "Sunlit Reverie — Fieldside Romance",
      category: "Pre-Weddings",
      year: "2026",
      location: "Ferozepur, Punjab",
      description: "A sunset pre-wedding narrative enveloped in warm amber backlighting and cinematic anamorphic flare.",
      cover_image: "/assets/photos/couple-field-1.jpg",
      gallery_json: JSON.stringify([
        "/assets/photos/couple-field-1.jpg",
        "/assets/photos/couple-field-2.jpg",
        "/assets/photos/couple-field-3.jpg"
      ]),
      video_src: "/assets/films/mustard-fields.mp4",
      featured: 1,
      published: 1,
      display_order: 5
    },
    {
      id: "proj-6",
      title: "Poetry in Monochrome",
      category: "Reels",
      year: "2026",
      location: "Sirsa, India",
      description: "Striking black and white film movement celebrating architectural beauty, fluid bridal couture, and pure cinematic minimalism.",
      cover_image: "/assets/films/monochrome-reel-poster.jpg",
      gallery_json: JSON.stringify([
        "/assets/films/monochrome-reel-poster.jpg"
      ]),
      video_src: "/assets/films/monochrome-reel.mp4",
      featured: 1,
      published: 1,
      display_order: 6
    },
    {
      id: "proj-7",
      title: "The Heritage Reception Gala",
      category: "Events",
      year: "2026",
      location: "Sirsa, Haryana",
      description: "Grand reception evening with royal chandeliers, live classical performances, and joyful family embraces.",
      cover_image: "/assets/photos/royal-vintage-3.jpg",
      gallery_json: JSON.stringify([
        "/assets/photos/royal-vintage-3.jpg",
        "/assets/photos/royal-vintage-4.jpg"
      ]),
      video_src: "/assets/films/wedding-story-full.mp4",
      featured: 0,
      published: 1,
      display_order: 7
    },
    {
      id: "proj-8",
      title: "Intimate Haldi & Mehndi Festivities",
      category: "Parties",
      year: "2026",
      location: "Sirsa, India",
      description: "Vibrant yellow marigold decor, joyous laughter, emotional maternal blessings, and lively traditional folk dances.",
      cover_image: "/assets/photos/anand-karaj-3.jpg",
      gallery_json: JSON.stringify([
        "/assets/photos/anand-karaj-3.jpg",
        "/assets/photos/anand-karaj-4.jpg"
      ]),
      video_src: "/assets/films/mustard-fields.mp4",
      featured: 0,
      published: 1,
      display_order: 8
    }
  ];

  for (const proj of defaultProjects) {
    const existing = db.prepare('SELECT id FROM portfolio_projects WHERE id = ?').get(proj.id);
    if (!existing) {
      db.prepare(`
        INSERT INTO portfolio_projects (
          id, title, category, year, location, description, cover_image, gallery_json, video_src, featured, published, display_order, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        proj.id,
        proj.title,
        proj.category,
        proj.year,
        proj.location,
        proj.description,
        proj.cover_image,
        proj.gallery_json,
        proj.video_src,
        proj.featured,
        proj.published,
        proj.display_order,
        now,
        now
      );
    }
  }

  // 4. Seed Media Index
  const initialMedia = [
    { filename: "hero-bg.mp4", original: "hero-bg.mp4", type: "video", mime: "video/mp4", size: 18450000 },
    { filename: "hero-stream.mp4", original: "hero-stream.mp4", type: "video", mime: "video/mp4", size: 9200000 },
    { filename: "hero-poster.jpg", original: "hero-poster.jpg", type: "image", mime: "image/jpeg", size: 485000 },
    { filename: "bridal-masterpiece-4k.jpg", original: "bridal-masterpiece-4k.jpg", type: "image", mime: "image/jpeg", size: 1250000 },
    { filename: "wedding-story-full.mp4", original: "wedding-story-full.mp4", type: "video", mime: "video/mp4", size: 45000000 },
    { filename: "mustard-fields.mp4", original: "mustard-fields.mp4", type: "video", mime: "video/mp4", size: 28000000 },
    { filename: "monochrome-reel.mp4", original: "monochrome-reel.mp4", type: "video", mime: "video/mp4", size: 14500000 }
  ];

  for (const m of initialMedia) {
    const existing = db.prepare('SELECT id FROM media_files WHERE filename = ?').get(m.filename);
    if (!existing) {
      const url = m.type === 'video' ? `/assets/films/${m.filename}` : `/assets/photos/${m.filename}`;
      db.prepare(`
        INSERT INTO media_files (id, filename, original_name, url, file_type, mime_type, size_bytes, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        crypto.randomUUID(),
        m.filename,
        m.original,
        url,
        m.type,
        m.mime,
        m.size,
        now
      );
    }
  }
}
