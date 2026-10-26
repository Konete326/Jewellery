import {
  LayoutGridIcon,
  ImageIcon,
  MessageSquareIcon,
  UsersIcon
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
        title: "Inquiries & Appraisals",
        path: "/admin/inquiries",
        key: "inquiries",
        icon: <MessageSquareIcon className="size-4" />
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
