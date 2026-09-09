export interface StudioInfo {
  name: string;
  tagline: string;
  heroHeadline: string;
  subheadline: string;
  description: string;
  phone: string;
  phoneRaw: string;
  whatsappUrl: string;
  email: string;
  location: string;
  instagram: string;
  instagramUrl: string;
  youtubeUrl: string;
  stats: {
    label: string;
    value: string;
    suffix?: string;
  }[];
}

export const studioInfo: StudioInfo = {
  name: "Preet Cinematography",
  tagline: "Stories That Feel Like Cinema.",
  heroHeadline: "Stories That Feel Like Cinema.",
  subheadline: "Wedding Films • Photography • Pre-Weddings • Events • Reels",
  description: "Preet Cinematography is an award-winning visual storytelling studio crafting high-end wedding films, editorial photography, and cinematic narratives across Punjab and globally.",
  phone: "+91 99883 89012",
  phoneRaw: "919988389012",
  whatsappUrl: "https://wa.me/919988389012?text=Hello%20Preet%20Cinematography%2C%20I%20would%20like%20to%20check%20availability%20for%20an%20upcoming%20shoot.",
  email: "bookings@preetcinematography.com",
  location: "Barnala & Zira, Punjab, India • Available Worldwide",
  instagram: "@preetcinematography",
  instagramUrl: "https://instagram.com/preetcinematography",
  youtubeUrl: "https://youtube.com/@preetcinematography",
  stats: [
    { label: "Events Captured", value: "100", suffix: "+" },
    { label: "Stories Delivered", value: "500", suffix: "+" },
    { label: "Moments Preserved", value: "1000", suffix: "+" },
    { label: "Client Satisfaction", value: "100", suffix: "%" },
  ]
};
