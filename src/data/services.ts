export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  deliverables: string[];
  bgImage: string;
  bgVideo?: string;
}

export const servicesList: ServiceItem[] = [
  {
    id: "wedding-cinematography",
    number: "01",
    title: "Wedding Cinematography",
    tagline: "Emotion In 24 Frames Per Second",
    description: "Cinematic wedding films crafted like cinema features with multi-camera 4K cinematography, master color grading, and intimate audio design that lets you relive your sacred vows forever.",
    deliverables: ["Full-Length Feature Film", "Cinematic Teaser / Trailer", "Multi-Angle Vow Coverage", "Drone Aerial Cinematography"],
    bgImage: "/assets/films/wedding-story-poster.jpg",
    bgVideo: "/assets/films/wedding-story-full.mp4"
  },
  {
    id: "wedding-photography",
    number: "02",
    title: "Wedding Photography",
    tagline: "Vogue-Inspired Editorial Romance",
    description: "Editorial-style wedding photography capturing unscripted tears, joyful smiles, intricate bridal adornments, and authentic ceremonies with timeless fine-art framing.",
    deliverables: ["Curated High-Res Gallery", "Fine-Art Couple Portraits", "Ceremony & Rituals Coverage", "Luxe Hardcover Photo Album"],
    bgImage: "/assets/photos/bridal-masterpiece-4k.jpg"
  },
  {
    id: "pre-wedding-shoots",
    number: "03",
    title: "Pre-Wedding Shoots",
    tagline: "Cinematic Concepts & Landscapes",
    description: "Creative storytelling shoots tailored to your love story. From golden mustard meadows to ancestral heritage havelis, we create cinematic vignettes before your big day.",
    deliverables: ["Location Scouting & Concept Direction", "Cinematic Concept Video Teaser", "Editorial High-Fashion Stills", "Story-Driven Motion Short"],
    bgImage: "/assets/photos/royal-vintage-1.jpg",
    bgVideo: "/assets/films/mustard-fields.mp4"
  },
  {
    id: "event-party-coverage",
    number: "04",
    title: "Event & Party Coverage",
    tagline: "Vibrant Energy & Candid Memories",
    description: "Complete photography and video coverage for milestone celebrations, sangeet nights, cocktail galas, and anniversary banquets with dynamic low-light mastery.",
    deliverables: ["Full Night Video Highlights", "Candid Party Stills", "Instant Social Media Cuts", "Audio Recording of Speeches"],
    bgImage: "/assets/photos/royal-vintage-2.jpg"
  },
  {
    id: "retirement-special-events",
    number: "05",
    title: "Retirement & Special Events",
    tagline: "Honoring Milestones & Legacies",
    description: "Respectful, comprehensive documentation of retirement honors, family milestones, and legacy celebrations preserving your lifetime achievements with dignity.",
    deliverables: ["Commemorative Video Documentary", "Honoree Portrait Session", "Speech & Felicitation Archive", "Full Digital Delivery"],
    bgImage: "/assets/photos/studio-promo-1.jpg"
  },
  {
    id: "reels-social-content",
    number: "06",
    title: "Reels & Social Content",
    tagline: "High-Impact Vertical Cinema",
    description: "Punchy, trend-setting 9:16 vertical reels and promotional video shorts engineered for Instagram, TikTok, and viral social reach with snappy rhythm and color.",
    deliverables: ["24-Hour Same-Day Edit Reels", "Optimized 9:16 4K Formats", "Licensed Audio Sync", "Viral Story Cuts"],
    bgImage: "/assets/films/monochrome-reel-poster.jpg",
    bgVideo: "/assets/films/monochrome-reel.mp4"
  },
  {
    id: "photography",
    number: "07",
    title: "Fine Art Photography",
    tagline: "Portraits with Soul and Contrast",
    description: "Timeless solo portraits, bridal editorial sessions, and family heirlooms using studio lighting mastery, Rembrandt chiaroscuro, and gentle natural light.",
    deliverables: ["Studio Lighting Setup", "Magazine-Grade Retouching", "Print-Ready 4K+ Deliverables", "Private Online Proofing"],
    bgImage: "/assets/photos/mehendi-3.jpg"
  },
  {
    id: "video-production",
    number: "08",
    title: "Commercial Video Production",
    tagline: "Commercial Vision & Brand Narratives",
    description: "End-to-end commercial filmmaking, brand narratives, and promotional campaigns backed by professional lighting rigs, cinema optics, and broadcast sound.",
    deliverables: ["Scripting & Storyboarding", "Cinema Camera Equipment", "Professional Colorist Grading", "Multi-Platform Deliverables"],
    bgImage: "/assets/films/mustard-fields-poster.jpg",
    bgVideo: "/assets/films/mustard-fields.mp4"
  }
];
