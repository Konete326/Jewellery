import { CircularTestimonials } from '@/components/ui/circular-testimonials';

const sampleTestimonials = [
  {
    quote: "The bridal choker crafted by Khalil & Sons has the most exquisite 22K gold craftsmanship. Truly a family heirloom for generations.",
    name: "Ayesha Malik",
    designation: "Bridal Patron",
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    productTitle: "Royal Heritage Nizam Kundan Choker",
    productImage: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80"
  },
  {
    quote: "Their transparency with gold hallmarks and certificate of authenticity gives unmatched peace of mind. Exceptional boutique service in Saddar.",
    name: "Dr. Farhan Siddiqui",
    designation: "Diamond Collector",
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
    productTitle: "Artisanal Solitaire Diamond Band",
    productImage: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=400&q=80"
  },
  {
    quote: "Our customized bridal bangles were delivered well ahead of the wedding date. The delicate meenakari detailing is mesmerizing.",
    name: "Zainab Raza",
    designation: "Wedding Connoisseur",
    src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
    productTitle: "Mughal Polki Heritage Bangles",
    productImage: "https://images.unsplash.com/photo-1611591475878-a400f9152b12?auto=format&fit=crop&w=400&q=80"
  }
];

export default function CircularTestimonialsDemo() {
  return (
    <div className="py-12 bg-background">
      <CircularTestimonials testimonials={sampleTestimonials} />
    </div>
  );
}
