import {
  LayoutGridIcon,
  ImageIcon,
  LayersIcon,
  ShoppingBagIcon,
  MessageSquareIcon,
  UsersIcon,
  StarIcon,
  TrendingUpIcon,
  LandmarkIcon,
  UserCheckIcon
} from "lucide-react";

export const navGroups = [
  {
    label: "Menu",
    items: [
      {
        title: "Dashboard",
        path: "/admin",
        key: "dashboard",
        icon: <LayoutGridIcon className="size-4" />
      },
      {
        title: "Gallery",
        path: "/admin/gallery",
        key: "gallery",
        icon: <ImageIcon className="size-4" />
      },
      {
        title: "Categories",
        path: "/admin/categories",
        key: "categories",
        icon: <LayersIcon className="size-4" />
      },
      {
        title: "Products",
        path: "/admin/products",
        key: "products",
        icon: <ShoppingBagIcon className="size-4" />
      },
      {
        title: "Inquiries",
        path: "/admin/inquiries",
        key: "inquiries",
        icon: <MessageSquareIcon className="size-4" />
      },
      {
        title: "Reviews",
        path: "/admin/reviews",
        key: "reviews",
        icon: <StarIcon className="size-4" />
      },
      {
        title: "Gold Rates",
        path: "/admin/rates",
        key: "rates",
        icon: <TrendingUpIcon className="size-4" />
      },
      {
        title: "Bank Accounts",
        path: "/admin/accounts",
        key: "accounts",
        icon: <LandmarkIcon className="size-4" />
      },
      {
        title: "Users",
        path: "/admin/customers",
        key: "customers",
        icon: <UsersIcon className="size-4" />
      },
      {
        title: "Profile",
        path: "/admin/profile",
        key: "profile",
        icon: <UserCheckIcon className="size-4" />
      }
    ]
  }
];

export const footerNavLinks = [];

export const navLinks = navGroups.flatMap((group) => group.items);
