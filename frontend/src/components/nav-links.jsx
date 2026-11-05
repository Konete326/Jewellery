import React from "react";
import { Sparkles, Crown, Gem, BookOpen, ShieldCheck, Landmark, Search, Calendar, Star, Compass, Phone } from "lucide-react";

export const collectionLinks = [
  {
    label: "Bridal Sets",
    href: "/collections/Bridal-Sets",
    description: "Complete 22K gold wedding and bridal sets",
    icon: <Crown className="size-4 text-amber-700 dark:text-amber-400" />
  },
  {
    label: "Gold Rings",
    href: "/collections/Rings",
    description: "Solitaires, engagement rings and gold bands",
    icon: <Gem className="size-4 text-amber-700 dark:text-amber-400" />
  },
  {
    label: "Gold Bangles & Kadas",
    href: "/collections/Bangles",
    description: "Solid gold bangles and traditional kadas",
    icon: <Sparkles className="size-4 text-amber-700 dark:text-amber-400" />
  },
  {
    label: "Custom Made Jewellery",
    href: "/contact",
    description: "Order custom designs made by master goldsmiths",
    icon: <Compass className="size-4 text-amber-700 dark:text-amber-400" />
  }
];

export const maisonLinks = [
  {
    label: "Our Story & Heritage",
    href: "/about",
    description: "Master gold jewelers in Karachi since 1992",
    icon: <BookOpen className="size-4 text-amber-700 dark:text-amber-400" />
  },
  {
    label: "Gold Purity & Hallmarks",
    href: "/about",
    description: "Certified 24K and 22K pure gold guarantee",
    icon: <ShieldCheck className="size-4 text-amber-700 dark:text-amber-400" />
  },
  {
    label: "Customer Reviews",
    href: "/reviews",
    description: "Read reviews from our verified clients",
    icon: <Star className="size-4 text-amber-700 dark:text-amber-400" />
  },
  {
    label: "Visit Our Showroom",
    href: "/contact",
    description: "Saddar Flagship Showroom, Karachi",
    icon: <Landmark className="size-4 text-amber-700 dark:text-amber-400" />
  }
];

export const clientCareLinks = [
  {
    label: "Track Your Order",
    href: "/track-order",
    description: "Check your order status and showroom pickup readiness",
    icon: <Search className="size-4 text-amber-700 dark:text-amber-400" />
  },
  {
    label: "Book an Appointment",
    href: "/contact",
    description: "Schedule a showroom visit with our jeweller",
    icon: <Calendar className="size-4 text-amber-700 dark:text-amber-400" />
  },
  {
    label: "Contact & Support",
    href: "/contact",
    description: "Get in touch by phone, WhatsApp or visit our shop",
    icon: <Phone className="size-4 text-amber-700 dark:text-amber-400" />
  }
];

export const productLinks = collectionLinks;
export const companyLinks = maisonLinks;
