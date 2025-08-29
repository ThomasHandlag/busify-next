"use client";

import { Calendar, Home, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const userMenuItems = [
  {
    title: "Profile",
    url: "/user",
    icon: User,
  },
  {
    title: "Tickets",
    url: "/user/my-tickets",
    icon: Home,
  },
  {
    title: "Redeem",
    url: "/user/redeem",
    icon: Calendar,
  },
];

export function UserSidebar() {
  const path = usePathname();
  const isActive = (url: string): boolean => {
    return path === url;
  };
  return (
    <div className="lg:flex lg:flex-col flex-row sticky gap-2 hidden">
      {userMenuItems.map((item) => (
        <Link
          key={item.title}
          href={item.url}
          className={`flex items-center p-2 text-sm font-medium rounded-md ${
            isActive(item.url) ? "bg-gray-100 text-gray-900" : "text-gray-600"
          }`}
        >
          <item.icon className="w-4 h-4 mr-2" />
          {item.title}
        </Link>
      ))}
    </div>
  );
}
