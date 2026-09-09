export interface StudioInfo {
  name: string;
  tagline: string;
  heroHeadline: string;
  subheadline: string;
  description: string;
  phone: string;
  phoneRaw: string;
  phoneTel: string;
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
  phone: "+91 9729371307",
  phoneRaw: "919729371307",
  phoneTel: "tel:+919729371307",
  whatsappUrl: "https://wa.me/919729371307",
  email: "bookings@preetcinematography.com",
  location: "Barnala & Zira, Punjab, India • Available Worldwide",
  instagram: "@its._kamalpreet_13",
  instagramUrl: "https://www.instagram.com/its._kamalpreet_13?stkn=MXBmOWR3NG9wNjV3bA%3D%3D",
  youtubeUrl: "https://youtube.com/@zskillsphotography?si=9dr-0VvT0ZFkjrDl",
  stats: [
    { label: "Events Captured", value: "100", suffix: "+" },
    { label: "Stories Delivered", value: "500", suffix: "+" },
    { label: "Moments Preserved", value: "1000", suffix: "+" },
    { label: "Client Satisfaction", value: "100", suffix: "%" },
  ]
};
