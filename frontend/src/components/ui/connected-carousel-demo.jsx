import React from "react";
import { CalendlyCarousel } from "@/components/ui/connected-carousel";

const STORIES_DATA = [
  {
    id: "bridal-polki",
    stat: "5.0 ★ Heirloom Choker",
    quote: "The intricate 22K polki craftsmanship exceeded our expectations for our wedding in Karachi.",
    author: "Elena Rostova",
    role: "Verified Collector • Bridal Chokers",
    defaultImage: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    selectedImage: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    alt: "Elena Rostova bridal heirloom choker",
  },
  {
    id: "solitaire-kada",
    stat: "5.0 ★ Bespoke Gold Kada",
    quote: "Hallmarked purity and lifetime polish guarantee give complete peace of mind.",
    author: "Julian Chen",
    role: "Verified Collector • Kadas & Bangles",
    defaultImage: "https://images.unsplash.com/photo-1611591475819-79b7b917ee96?auto=format&fit=crop&w=800&q=80",
    selectedImage: "https://images.unsplash.com/photo-1611591475819-79b7b917ee96?auto=format&fit=crop&w=800&q=80",
    alt: "Julian Chen bespoke gold kada",
  },
  {
    id: "zircon-earrings",
    stat: "5.0 ★ Royal Jhumkas",
    quote: "Authentic artisanal goldsmithing from Murshid Sunaar Tower, Saddar.",
    author: "Dr. Amara Okafor",
    role: "Verified Collector • Royal Jhumkas",
    defaultImage: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
    selectedImage: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
    alt: "Dr. Amara Okafor royal jhumkas",
  }
];

export default function CarouselDemo() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-8 bg-background">
      <CalendlyCarousel
        items={STORIES_DATA}
        autoPlayInterval={6000}
        pauseOnHover={false}
      />
    </main>
  );
}
