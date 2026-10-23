import { Sparkles, Gem, Crown, Compass, BookOpen, ShieldCheck, HeartHandshake, Mail } from "lucide-react";

export const productLinks = [
  {
    label: "Aurelian Sigils",
    href: "#collections",
    description: "18K hammered gold with raw diamonds",
    icon: <Sparkles className="size-5 text-amber-600" />
  },
  {
    label: "Tuscan Mist Pearls",
    href: "#collections",
    description: "South Sea pearls on Venetian gold wire",
    icon: <Gem className="size-5 text-amber-600" />
  },
  {
    label: "Etruscan Bangles",
    href: "#collections",
    description: "Engraved 22K solid gold masterworks",
    icon: <Crown className="size-5 text-amber-600" />
  },
  {
    label: "Bespoke Commissions",
    href: "#atelier",
    description: "Private consultations for custom designs",
    icon: <Compass className="size-5 text-amber-600" />
  }
];

export const companyLinks = [
  {
    label: "The Heritage Story",
    href: "#heritage",
    description: "A century of unseen Florentine details",
    icon: <BookOpen className="size-5 text-amber-600" />
  },
  {
    label: "Ethical Gold Standards",
    href: "#heritage",
    description: "Conflict-free alloys and certified provenance",
    icon: <ShieldCheck className="size-5 text-amber-600" />
  },
  {
    label: "Historic Atelier Visit",
    href: "#atelier",
    description: "Via de' Tornabuoni showroom in Florence",
    icon: <HeartHandshake className="size-5 text-amber-600" />
  }
];

export const companyLinks2 = [
  {
    label: "Book Appointment",
    href: "#atelier",
    icon: <Mail className="size-4" />
  },
  {
    label: "Heritage Archives",
    href: "#heritage",
    icon: <BookOpen className="size-4" />
  },
  {
    label: "Atelier Journal",
    href: "#heritage",
    icon: <Compass className="size-4" />
  }
];
