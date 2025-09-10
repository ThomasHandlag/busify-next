"use client";

import React, { useState, useEffect } from "react";

import { Bus, HelpCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { SiFacebook, SiZalo, SiDiscord } from "react-icons/si";
import NavMobile from "./nav_mobile";
import NavDesktop from "./nav_desktop";
import { useTranslations } from "next-intl";

export interface NavItemData {
  href: string;
  label: string;
  icon: () => React.ReactElement;
  description?: string;
}

export interface MenuItemData {
  title: string;
  items: NavItemData[];
}

export interface NavDataProps {
  contactMenuItems: NavItemData[];
  publicMenuItems: NavItemData[];
  isActive: (href: string) => boolean;
}

const Header = () => {
  const [isTop, setIsTop] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [isScrollUp, setIsScrollUp] = useState(true);

  const t = useTranslations("Header");

  const publicNavigationItems: NavItemData[] = [
    {
      href: "/",
      label: t("home"),
      icon: () => <Bus className="w-4 h-4" />,
    },
    {
      href: "/about",
      label: t("about"),
      icon: () => <HelpCircle className="w-4 h-4" />,
    },
  ];

  // About section with social links
  const contactMenuItems: NavItemData[] = [
    {
      href: "https://facebook.com/busify",
      label: "facebook",
      icon: () => <SiFacebook className="w-4 h-4" />,
    },
    {
      href: "https://discord.com/invite/busify",
      label: "discord",
      icon: () => <SiDiscord className="w-4 h-4" />,
    },
    {
      href: "https://zalo.me/busify",
      label: "zalo",
      icon: () => <SiZalo className="w-4 h-4" />,
    },
  ];

  const pathname = usePathname();

  const isActive = (route: string): boolean => {
    return pathname === route || pathname.startsWith(route + "/");
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsTop(false);
      } else {
        setIsTop(true);
      }

      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop > lastScrollTop) {
        setIsScrollUp(false);
      } else {
        setIsScrollUp(true);
      }

      setLastScrollTop(scrollTop <= 0 ? 0 : scrollTop);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollTop]);

  return (
    <header
      className={`px-4 py-3 bg-white border-b border-gray-200 justify-between text-gray-900 shadow-sm top-0 inset-0 sticky z-50 w-full ${
        isTop ? "flex" : "fixed"
      } ${
        isScrollUp ? "translate-y-0" : "-translate-y-full"
      } transition-transform duration-300`}
    >
      {/* Desktop Navigation */}
      <NavDesktop
        publicMenuItems={publicNavigationItems}
        contactMenuItems={contactMenuItems}
        isActive={isActive}
      />

      {/* Mobile Navigation */}
      <NavMobile
        contactMenuItems={contactMenuItems}
        publicMenuItems={publicNavigationItems}
        isActive={isActive}
      />
    </header>
  );
};

export default Header;
