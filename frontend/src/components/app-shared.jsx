import {
  LayoutGridIcon,
  ImageIcon,
  MessageSquareIcon,
  PackageIcon,
  ShoppingBagIcon,
  UsersIcon,
  UserCheckIcon,
  SettingsIcon
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
        title: "Inquiries",
        path: "/admin/inquiries",
        key: "inquiries",
        icon: <MessageSquareIcon className="size-4" />
      },
      {
        title: "Gallery",
        path: "/admin/gallery",
        key: "gallery",
        icon: <ImageIcon className="size-4" />
      }
    ]
  },
  {
    label: "Management",
    items: [
      {
        title: "Products",
        path: "/admin/products",
        key: "products",
        icon: <PackageIcon className="size-4" />
      },
      {
        title: "Orders",
        path: "/admin/orders",
        key: "orders",
        icon: <ShoppingBagIcon className="size-4" />
      },
      {
        title: "Users & Clientele",
        path: "/admin/customers",
        key: "customers",
        icon: <UsersIcon className="size-4" />
      }
    ]
  },
  {
    label: "Preferences",
    items: [
      {
        title: "Profile",
        path: "/admin/profile",
        key: "profile",
        icon: <UserCheckIcon className="size-4" />
      },
      {
        title: "Settings",
        path: "/admin/settings",
        key: "settings",
        icon: <SettingsIcon className="size-4" />
      }
    ]
  }
];

export const footerNavLinks = [];

export const navLinks = navGroups.flatMap((group) => group.items);
