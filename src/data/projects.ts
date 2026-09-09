export interface FilmItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  duration: string;
  year: string;
  location: string;
  videoSrc: string;
  posterSrc: string;
  aspect: 'widescreen' | 'vertical';
  description: string;
  featured?: boolean;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: 'Weddings' | 'Pre-Weddings' | 'Events' | 'Portraits' | 'Reels' | 'Cinematic Films';
  year: string;
  location: string;
  coverImage: string;
  gallery: string[];
  videoSrc?: string;
  description: string;
  featured?: boolean;
  aspectRatio?: 'portrait' | 'landscape' | 'square';
}

export const filmsList: FilmItem[] = [
  {
    id: "film-hero",
    title: "Echoes of Eternity",
    subtitle: "A Pre-Wedding Cinematic Odyssey",
    category: "Cinematic Pre-Wedding Film",
    duration: "01:42",
    year: "2026",
    location: "Punjab, India",
    videoSrc: "/assets/films/mustard-fields.mp4",
    posterSrc: "/assets/films/mustard-fields-poster.jpg",
    aspect: "widescreen",
    description: "Bathed in golden hour light across the sprawling fields, capturing an intimate walk through timeless love and emotional serenity.",
    featured: true
  },
  {
    id: "film-wedding-feature",
    title: "A Wedding to Remember",
    subtitle: "Complete Cinematic Wedding Film",
    category: "Luxury Wedding Cinematography",
    duration: "06:45",
    year: "2026",
    location: "Punjab, India",
    videoSrc: "/assets/films/wedding-story-full.mp4",
    posterSrc: "/assets/films/wedding-story-poster.jpg",
    aspect: "widescreen",
    description: "An evocative feature-length narrative documenting sacred Anand Karaj vows, tender glances, family celebrations, and royal bridal grandeur.",
    featured: true
  },
  {
    id: "film-monochrome-reel",
    title: "Poetry in Monochrome",
    subtitle: "Editorial Portrait Motion",
    category: "Fine-Art Reel & Teaser",
    duration: "00:43",
    year: "2026",
    location: "Heritage Haveli, Punjab",
    videoSrc: "/assets/films/monochrome-reel.mp4",
    posterSrc: "/assets/films/monochrome-reel-poster.jpg",
    aspect: "vertical",
    description: "Striking black and white film movement celebrating architectural beauty, fluid bridal couture, and pure cinematic minimalism.",
    featured: true
  }
];

export const projectsList: ProjectItem[] = [
  {
    id: "proj-regal-bride",
    title: "The Regal Bride — Royal Couture",
    category: "Portraits",
    year: "2026",
    location: "Barnala, Punjab",
    coverImage: "/assets/photos/bridal-masterpiece-4k.jpg",
    gallery: [
      "/assets/photos/bridal-masterpiece-4k.jpg",
      "/assets/photos/bridal-fineart-1.webp",
      "/assets/photos/bridal-fineart-2.webp",
      "/assets/photos/bridal-fineart-3.webp",
      "/assets/photos/bridal-fineart-4.webp"
    ],
    description: "A showcase of traditional Punjabi bridal elegance featuring crimson embroidery, heirloom emerald jewels, and intimate bridal expressions.",
    featured: true,
    aspectRatio: "portrait"
  },
  {
    id: "proj-royal-vintage",
    title: "Vintage Romance & Golden Meadows",
    category: "Pre-Weddings",
    year: "2026",
    location: "Zira, Punjab",
    coverImage: "/assets/photos/royal-vintage-1.jpg",
    gallery: [
      "/assets/photos/royal-vintage-1.jpg",
      "/assets/photos/royal-vintage-2.jpg",
      "/assets/photos/royal-vintage-3.jpg",
      "/assets/photos/royal-vintage-4.jpg"
    ],
    description: "Rich Persian carpets framed in open blooming mustard fields, blending royal ancestral nostalgia with high-fashion editorial styling.",
    featured: true,
    aspectRatio: "portrait"
  },
  {
    id: "proj-anand-karaj",
    title: "Sacred Vows — The Anand Karaj",
    category: "Weddings",
    year: "2026",
    location: "Gurudwara Sahib, Punjab",
    coverImage: "/assets/photos/anand-karaj-2.jpg",
    gallery: [
      "/assets/photos/anand-karaj-1.jpg",
      "/assets/photos/anand-karaj-2.jpg",
      "/assets/photos/anand-karaj-3.jpg",
      "/assets/photos/anand-karaj-4.jpg"
    ],
    description: "The spiritual harmony of Anand Karaj, capturing reverent rituals, blessed chants, and eternal matrimonial devotion.",
    featured: true,
    aspectRatio: "portrait"
  },
  {
    id: "proj-gagan-jaspreet",
    title: "Gagan & Jaspreet — Eternal Bonds",
    category: "Pre-Weddings",
    year: "2026",
    location: "Barnala, Punjab",
    coverImage: "/assets/photos/prewedding-gagan-jaspreet-2.jpg",
    gallery: [
      "/assets/photos/prewedding-gagan-jaspreet-1.jpg",
      "/assets/photos/prewedding-gagan-jaspreet-2.jpg",
      "/assets/photos/prewedding-gagan-jaspreet-3.jpg"
    ],
    description: "Authentic, candid connection captured amidst natural Punjab landscapes, focusing on unscripted laughter and heartfelt moments.",
    featured: true,
    aspectRatio: "portrait"
  },
  {
    id: "proj-mehendi",
    title: "The Mehendi Symphony",
    category: "Events",
    year: "2026",
    location: "Private Villa, Punjab",
    coverImage: "/assets/photos/mehendi-3.jpg",
    gallery: [
      "/assets/photos/mehendi-3.jpg",
      "/assets/photos/mehendi-1.jpg",
      "/assets/photos/mehendi-2.jpg",
      "/assets/photos/mehendi-4.jpg",
      "/assets/photos/mehendi-5.jpg"
    ],
    description: "Floral jewelry, shimmering emerald tones, intricate henna artistry, and the effervescent laughter of celebration.",
    featured: true,
    aspectRatio: "portrait"
  },
  {
    id: "proj-film-mustard",
    title: "Echoes in the Fields",
    category: "Cinematic Films",
    year: "2026",
    location: "Punjab Meadows",
    coverImage: "/assets/films/mustard-fields-poster.jpg",
    gallery: ["/assets/films/mustard-fields-poster.jpg"],
    videoSrc: "/assets/films/mustard-fields.mp4",
    description: "A panoramic cinematic love story filmed with anamorphic lenses and warm golden hour color grading.",
    featured: true,
    aspectRatio: "landscape"
  },
  {
    id: "proj-film-wedding",
    title: "A Wedding to Remember",
    category: "Cinematic Films",
    year: "2026",
    location: "Punjab, India",
    coverImage: "/assets/films/wedding-story-poster.jpg",
    gallery: ["/assets/films/wedding-story-poster.jpg"],
    videoSrc: "/assets/films/wedding-story-full.mp4",
    description: "Full cinematic wedding feature film capturing soundscapes, family emotions, and unforgettable celebration.",
    featured: true,
    aspectRatio: "landscape"
  },
  {
    id: "proj-monochrome-reel",
    title: "Poetry in Monochrome",
    category: "Reels",
    year: "2026",
    location: "Punjab",
    coverImage: "/assets/films/monochrome-reel-poster.jpg",
    gallery: ["/assets/films/monochrome-reel-poster.jpg"],
    videoSrc: "/assets/films/monochrome-reel.mp4",
    description: "Short-form high impact reel featuring fluid black-and-white cinematography optimized for modern digital screens.",
    featured: true,
    aspectRatio: "portrait"
  }
];

export const projectCategories = [
  "All",
  "Weddings",
  "Pre-Weddings",
  "Cinematic Films",
  "Portraits",
  "Events",
  "Reels"
] as const;
