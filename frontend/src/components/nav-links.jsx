import { Diamond, Gem, Crown, Compass, BookOpen, ShieldCheck, Landmark, Calendar, Clock } from "lucide-react";

export const productLinks = [
  {
    label: "Gold Rings",
    href: "/#collections",
    description: "18K handmade gold with real diamonds",
    icon: <Diamond className="size-4" />
  },
  {
    label: "Pearl Jewellery",
    href: "/#collections",
    description: "Natural pearls crafted on gold wire",
    icon: <Gem className="size-4" />
  },
  {
    label: "Gold Bangles",
    href: "/#collections",
    description: "Solid 22K pure gold handcrafted bangles",
    icon: <Crown className="size-4" />
  },
  {
    label: "Custom Design",
    href: "/#atelier",
    description: "Personal designs made just for you",
    icon: <Compass className="size-4" />
  }
];

export const companyLinks = [
  {
    label: "About Us",
    href: "/about",
    description: "Our story, heritage & master jewelers since 1992",
    icon: <BookOpen className="size-4" />
  },
  {
    label: "Pure Gold Quality",
    href: "/#heritage",
    description: "Certified pure gold and conflict-free stones",
    icon: <ShieldCheck className="size-4" />
  },
  {
    label: "Karachi Boutique",
    href: "/#atelier",
    description: "Our showroom and boutique in Saddar, Karachi",
    icon: <Landmark className="size-4" />
  }
];

export const companyLinks2 = [
  {
    label: "Our Story & Vision",
    href: "/about",
    icon: <BookOpen className="size-3.5" />
  },
  {
    label: "Book Appointment",
    href: "/#atelier",
    icon: <Calendar className="size-3.5" />
  },
  {
    label: "Atelier Archives",
    href: "/#heritage",
    icon: <Clock className="size-3.5" />
  }
];
