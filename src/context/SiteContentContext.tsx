import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { studioInfo, StudioInfo } from '../data/studioInfo';
import { ProjectItem, FilmItem, projectsList as defaultProjects, filmsList as defaultFilms } from '../data/projects';
import { servicesList as defaultServices, ServiceItem } from '../data/services';

export interface SiteBranding {
  brandName: string;
  tagline: string;
  establishment: string;
  location: string;
}

export interface SiteHero {
  badge: string;
  headline: string;
  subheadline: string;
  description: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  videoSrc: string;
  posterSrc: string;
}

export interface SiteAbout {
  badge: string;
  heading: string;
  description: string;
  location: string;
  image: string;
  stats: { label: string; value: string; suffix?: string }[];
}

export interface SiteProcessStep {
  step: string;
  title: string;
  description: string;
  displayOrder: number;
}

export interface SiteTestimonial {
  id: string;
  clientName: string;
  eventType: string;
  location: string;
  quote: string;
  rating?: number;
  published?: boolean;
  displayOrder?: number;
}

export interface SiteContact {
  phone: string;
  phoneRaw: string;
  phoneTel: string;
  whatsappUrl: string;
  email: string;
  location: string;
  schemaAddress: string;
  businessHours: string;
  ctaHeadline: string;
  ctaDescription: string;
}

export interface SiteSocial {
  instagramUrl: string;
  instagramHandle: string;
  youtubeUrl: string;
  whatsappUrl: string;
  phoneTel: string;
}

export interface SiteSeo {
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  canonicalUrl: string;
}

export interface SiteContentState {
  branding: SiteBranding;
  hero: SiteHero;
  about: SiteAbout;
  services: ServiceItem[];
  process: SiteProcessStep[];
  testimonials: SiteTestimonial[];
  contact: SiteContact;
  social: SiteSocial;
  seo: SiteSeo;
}

interface SiteContentContextValue {
  content: SiteContentState;
  projects: ProjectItem[];
  films: FilmItem[];
  refresh: () => Promise<void>;
  loading: boolean;
}

const defaultContent: SiteContentState = {
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
    stats: studioInfo.stats
  },
  services: defaultServices,
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
    phone: studioInfo.phone,
    phoneRaw: studioInfo.phoneRaw,
    phoneTel: studioInfo.phoneTel,
    whatsappUrl: studioInfo.whatsappUrl,
    email: studioInfo.email,
    location: studioInfo.location,
    schemaAddress: "Sirsa, Haryana, India",
    businessHours: "Monday - Sunday: 9:00 AM - 9:00 PM",
    ctaHeadline: "Begin Your Visual Legacy.",
    ctaDescription: "Whether you are planning an intimate Anand Karaj, a lavish multi-day Punjabi wedding celebration, or an editorial pre-wedding film, we would love to hear from you."
  },
  social: {
    instagramUrl: studioInfo.instagramUrl,
    instagramHandle: studioInfo.instagram,
    youtubeUrl: studioInfo.youtubeUrl,
    whatsappUrl: studioInfo.whatsappUrl,
    phoneTel: studioInfo.phoneTel
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

const SiteContentContext = createContext<SiteContentContextValue>({
  content: defaultContent,
  projects: defaultProjects,
  films: defaultFilms,
  refresh: async () => {},
  loading: false
});

export const SiteContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContentState>(defaultContent);
  const [projects, setProjects] = useState<ProjectItem[]>(defaultProjects);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [contentRes, portfolioRes] = await Promise.allSettled([
        fetch('/api/content'),
        fetch('/api/portfolio')
      ]);

      if (contentRes.status === 'fulfilled' && contentRes.value.ok) {
        const liveContent = await contentRes.value.json();
        setContent((prev) => ({
          ...prev,
          ...liveContent
        }));
      }

      if (portfolioRes.status === 'fulfilled' && portfolioRes.value.ok) {
        const liveProjects = await portfolioRes.value.json();
        if (Array.isArray(liveProjects) && liveProjects.length > 0) {
          setProjects(liveProjects);
        }
      }
    } catch (err) {
      console.warn('[SiteContentProvider] Using fallback content:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Derive films (projects that have videoSrc or category is Cinematic Films / Reels)
  const films: FilmItem[] = projects
    .filter((p) => Boolean(p.videoSrc))
    .map((p) => ({
      id: p.id,
      title: p.title,
      subtitle: p.category,
      category: p.category,
      duration: "4K Master Cut",
      year: p.year,
      location: p.location,
      description: p.description,
      posterSrc: p.coverImage,
      videoSrc: p.videoSrc || '',
      aspect: 'widescreen' as const
    }));

  return (
    <SiteContentContext.Provider
      value={{
        content,
        projects,
        films: films.length > 0 ? films : defaultFilms,
        refresh: fetchData,
        loading
      }}
    >
      {children}
    </SiteContentContext.Provider>
  );
};

export const useSiteContent = () => useContext(SiteContentContext);
