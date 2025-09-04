"use client";

import { Calendar, Home, Ticket, User } from "lucide-react";
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
    icon: Ticket,
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
    <div className="lg:flex lg:flex-col flex-row sticky gap-2 hidden w-64 p-4 bg-white ">
      {userMenuItems.map((item) => (
        <Link
          key={item.title}
          href={item.url}
          className={`flex items-center p-3 text-sm font-medium rounded-md transition-colors ${
            isActive(item.url)
              ? "bg-green-100 text-green-900 border border-green-200"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          <item.icon className="w-5 h-5 mr-3" />
          {item.title}
        </Link>
      ))}
    </div>
  );
}
