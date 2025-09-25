"use client";

import { Calendar, Gift, Ticket, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

export function UserSidebar() {
  const path = usePathname();
  const t = useTranslations("UserDashboard");
  const isActive = (url: string): boolean => {
    return path === url;
  };

  const userMenuItems = [
    {
      title: t("profile"),
      url: "/user",
      icon: User,
    },
    {
      title: t("tickets"),
      url: "/user/my-tickets",
      icon: Ticket,
    },
    {
      title: t("redeem"),
      url: "/user/redeem",
      icon: Calendar,
    },
    {
      title: t("promotions"),
      url: "/user/my-promotions",
      icon: Gift,
    },
  ];
  return (
    <div className="lg:flex lg:flex-col flex-row sticky gap-2 hidden w-64 p-4">
      {userMenuItems.map((item) => (
        <Link
          key={item.title}
          href={item.url}
          className={`flex items-center p-3 text-sm font-medium rounded-md transition-colors hover:bg-gray-100 hover:text-green-700 ${
            isActive(item.url)
              ? "bg-green-100 text-green-900 border border-green-200"
              : ""
          }`}
        >
          <item.icon className="w-5 h-5 mr-3" />
          {item.title}
        </Link>
      ))}
    </div>
  );
}
