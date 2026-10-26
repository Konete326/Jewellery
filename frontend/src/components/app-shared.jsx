import {
  LayoutGridIcon,
  ImageIcon,
  MessageSquareIcon,
  UsersIcon,
  StarIcon,
  TrendingUpIcon
} from "lucide-react";

export const navGroups = [
  {
    label: "Atelier",
    items: [
      {
        title: "Dashboard",
        path: "/admin",
        key: "dashboard",
        icon: <LayoutGridIcon className="size-4" />
      },
      {
        title: "Gallery Masterpieces",
        path: "/admin/gallery",
        key: "gallery",
        icon: <ImageIcon className="size-4" />
      },
      {
        title: "Inquiries & Consultations",
        path: "/admin/inquiries",
        key: "inquiries",
        icon: <MessageSquareIcon className="size-4" />
      },
      {
        title: "Client Reviews",
        path: "/admin/reviews",
        key: "reviews",
        icon: <StarIcon className="size-4" />
      },
      {
        title: "Gold & Silver Rates",
        path: "/admin/rates",
        key: "rates",
        icon: <TrendingUpIcon className="size-4" />
      }
    ]
  },
  {
    label: "Clientele",
    items: [
      {
        title: "Users & Accounts",
        path: "/admin/customers",
        key: "customers",
        icon: <UsersIcon className="size-4" />
      }
    ]
  }
];

export const footerNavLinks = [];

export const navLinks = navGroups.flatMap((group) => group.items);
