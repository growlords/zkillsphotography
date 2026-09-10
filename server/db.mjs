import { DatabaseSync } from 'node:sqlite';
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
    console.warn('[DB] Directory warning:', err.message);
  }
}

const DB_PATH = path.join(DATA_DIR, 'zskills.db');
export const db = new DatabaseSync(DB_PATH);

// Enable WAL mode and foreign keys
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

// Initialize Database Schema
export function initSchema() {
  db.exec(`
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

  seedInitialData();
}

function hashPassword(password, salt) {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

function seedInitialData() {
  const now = new Date().toISOString();

  // 1. Seed Admin User (kamaljeet / kamal@123#)
  const userCount = db.prepare('SELECT COUNT(*) as count FROM admin_users').get();
  if (userCount.count === 0) {
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
        title: "Editorial & Fine-Art Photography",
        description: "Vogue-inspired couple portraits, documentary candid moments, and rich family heirlooms graded with timeless depth and rich contrast.",
        icon: "Sparkles",
        bgImage: "/assets/photos/bridal-masterpiece-4k.jpg",
        features: ["High-Resolution Raw Retouching", "Custom Editorial Color Grade", "Curated Heirloom Photo Album", "Full Resolution Cloud Gallery"],
        displayOrder: 2,
        published: true
      },
      {
        id: "srv-3",
        title: "Pre-Wedding Cinematic Visuals",
        description: "Concept-driven narrative pre-wedding shoots across scenic outdoor landscapes, heritage havelis, and mustard fields with high-fashion styling.",
        icon: "Film",
        bgImage: "/assets/films/mustard-fields-poster.jpg",
        bgVideo: "/assets/films/mustard-fields.mp4",
        features: ["Creative Storyboard & Concepts", "Scenic Punjab & Destination Locations", "Cinematic 4K Short Film", "Styling & Mood Consultation"],
        displayOrder: 3,
        published: true
      },
      {
        id: "srv-4",
        title: "Social & Reels Production",
        description: "Punchy, trend-setting 9:16 vertical reels and promotional video shorts engineered for Instagram and viral social reach with snappy rhythm and color.",
        icon: "Video",
        bgImage: "/assets/films/monochrome-reel-poster.jpg",
        bgVideo: "/assets/films/monochrome-reel.mp4",
        features: ["Same-Day / Next-Day Delivery", "Vertical 9:16 Format Optimization", "Trending Audio Synchronization", "High-Impact Cinematic Cuts"],
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
      phoneRaw: "919729371307",
      phoneTel: "tel:+919729371307",
      whatsappUrl: "https://wa.me/919729371307",
      email: "bookings@zskillsphotography.com",
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

  const insertContent = db.prepare(`
    INSERT OR IGNORE INTO site_content (key, data_json, updated_at)
    VALUES (?, ?, ?)
  `);

  for (const [key, val] of Object.entries(defaultSections)) {
    insertContent.run(key, JSON.stringify(val), now);
  }

  // 3. Seed Portfolio Projects
  const projectCount = db.prepare('SELECT COUNT(*) as count FROM portfolio_projects').get();
  if (projectCount.count === 0) {
    const initialProjects = [
      {
        id: "proj-1",
        title: "The Royal Anand Karaj",
        category: "Weddings",
        year: "2026",
        location: "Sirsa, India",
        description: "An emotionally resonant 3-day royal Sikh wedding ceremony documented with cinematic elegance and deep sacred reverence.",
        cover_image: "/assets/photos/anand-karaj-1.jpg",
        gallery_json: JSON.stringify([
          "/assets/photos/anand-karaj-1.jpg",
          "/assets/photos/anand-karaj-2.jpg",
          "/assets/photos/anand-karaj-3.jpg",
          "/assets/photos/anand-karaj-4.jpg"
        ]),
        video_src: "/assets/films/wedding-story-full.mp4",
        featured: 1,
        published: 1,
        display_order: 1
      },
      {
        id: "proj-2",
        title: "Golden Hour Fields",
        category: "Pre-Weddings",
        year: "2026",
        location: "Sirsa, Haryana",
        description: "Intimate romantic portraiture captured against vast blooming mustard fields at sundown with natural atmospheric warmth.",
        cover_image: "/assets/films/mustard-fields-poster.jpg",
        gallery_json: JSON.stringify([
          "/assets/films/mustard-fields-poster.jpg",
          "/assets/photos/prewedding-gagan-jaspreet-1.jpg",
          "/assets/photos/prewedding-gagan-jaspreet-2.jpg",
          "/assets/photos/prewedding-gagan-jaspreet-3.jpg"
        ]),
        video_src: "/assets/films/mustard-fields.mp4",
        featured: 1,
        published: 1,
        display_order: 2
      },
      {
        id: "proj-3",
        title: "Studio Creative Visuals",
        category: "Photography",
        year: "2026",
        location: "Sirsa, India",
        description: "High-contrast studio session combining dramatic softbox rim-lighting with contemporary fine art posing.",
        cover_image: "/assets/photos/studio-promo-1.jpg",
        gallery_json: JSON.stringify([
          "/assets/photos/studio-promo-1.jpg",
          "/assets/photos/studio-promo-2.jpg"
        ]),
        video_src: null,
        featured: 0,
        published: 1,
        display_order: 3
      },
      {
        id: "proj-4",
        title: "Mehendi & Vibrant Festivities",
        category: "Events",
        year: "2026",
        location: "Sirsa, India",
        description: "Joyful daytime celebration of music, intricate henna art, laughter, and family dance traditions.",
        cover_image: "/assets/photos/mehendi-1.jpg",
        gallery_json: JSON.stringify([
          "/assets/photos/mehendi-1.jpg",
          "/assets/photos/mehendi-2.jpg",
          "/assets/photos/mehendi-3.jpg",
          "/assets/photos/mehendi-4.jpg",
          "/assets/photos/mehendi-5.jpg"
        ]),
        video_src: null,
        featured: 0,
        published: 1,
        display_order: 4
      },
      {
        id: "proj-5",
        title: "Timeless Royal Portraiture",
        category: "Photography",
        year: "2026",
        location: "Sirsa, India",
        description: "Fine-art portrait collection honoring vintage Indian royal studio aesthetics and intricate embroidery detailing.",
        cover_image: "/assets/photos/royal-vintage-1.jpg",
        gallery_json: JSON.stringify([
          "/assets/photos/royal-vintage-1.jpg",
          "/assets/photos/royal-vintage-2.jpg",
          "/assets/photos/royal-vintage-3.jpg",
          "/assets/photos/royal-vintage-4.jpg"
        ]),
        video_src: null,
        featured: 1,
        published: 1,
        display_order: 5
      },
      {
        id: "proj-6",
        title: "Editorial Bridal Masterpiece",
        category: "Weddings",
        year: "2026",
        location: "Sirsa, India",
        description: "A breathtaking high-definition bridal portrait framed in ambient window light highlighting raw emotion and bespoke attire.",
        cover_image: "/assets/photos/bridal-masterpiece-4k.jpg",
        gallery_json: JSON.stringify([
          "/assets/photos/bridal-masterpiece-4k.jpg",
          "/assets/photos/bridal-fineart-1.webp",
          "/assets/photos/bridal-fineart-2.webp",
          "/assets/photos/bridal-fineart-3.webp",
          "/assets/photos/bridal-fineart-4.webp"
        ]),
        video_src: null,
        featured: 1,
        published: 1,
        display_order: 6
      },
      {
        id: "film-1",
        title: "The Eternal Vows: Wedding Film",
        category: "Cinematic Films",
        year: "2026",
        location: "Sirsa, India",
        description: "Full cinematic wedding highlight film crafted with rich color harmony, original sound design, and narrative pacing.",
        cover_image: "/assets/films/wedding-story-poster.jpg",
        gallery_json: JSON.stringify(["/assets/films/wedding-story-poster.jpg"]),
        video_src: "/assets/films/wedding-story-full.mp4",
        featured: 1,
        published: 1,
        display_order: 7
      },
      {
        id: "film-2",
        title: "Monochrome Vintage Reel",
        category: "Reels",
        year: "2026",
        location: "Sirsa, India",
        description: "Moody, high-grain 9:16 vertical short film capturing raw behind-the-scenes moments and vintage bridal portraits.",
        cover_image: "/assets/films/monochrome-reel-poster.jpg",
        gallery_json: JSON.stringify(["/assets/films/monochrome-reel-poster.jpg"]),
        video_src: "/assets/films/monochrome-reel.mp4",
        featured: 0,
        published: 1,
        display_order: 8
      }
    ];

    const insertProj = db.prepare(`
      INSERT INTO portfolio_projects (
        id, title, category, year, location, description, cover_image, gallery_json, video_src, featured, published, display_order, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const p of initialProjects) {
      insertProj.run(
        p.id, p.title, p.category, p.year, p.location, p.description,
        p.cover_image, p.gallery_json, p.video_src, p.featured, p.published, p.display_order,
        now, now
      );
    }
    console.log(`[DB] Seeded ${initialProjects.length} portfolio projects`);
  }

  // 4. Index initial files from public/assets into media_files
  const mediaCount = db.prepare('SELECT COUNT(*) as count FROM media_files').get();
  if (mediaCount.count === 0) {
    const assetsDir = path.resolve(process.cwd(), 'public/assets');
    const insertMedia = db.prepare(`
      INSERT OR IGNORE INTO media_files (id, filename, original_name, url, file_type, mime_type, size_bytes, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    function scanDir(dir, relativePrefix) {
      if (!fs.existsSync(dir)) return;
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          scanDir(fullPath, `${relativePrefix}/${entry.name}`);
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase();
          const isVideo = ['.mp4', '.webm', '.mov'].includes(ext);
          const isImage = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'].includes(ext);
          if (isVideo || isImage) {
            const stats = fs.statSync(fullPath);
            const url = `/assets${relativePrefix}/${entry.name}`;
            const mimeType = isVideo ? `video/${ext.replace('.', '')}` : `image/${ext.replace('.', '').replace('jpg', 'jpeg')}`;
            insertMedia.run(
              crypto.randomUUID(),
              entry.name,
              entry.name,
              url,
              isVideo ? 'video' : 'image',
              mimeType,
              stats.size,
              now
            );
          }
        }
      }
    }

    scanDir(assetsDir, '');
    console.log('[DB] Indexed existing media library files');
  }
}

initSchema();
