"use client";

import React, { useState, useEffect } from "react";

import { Bus, HelpCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import NavMobile from "./nav_mobile";
import NavDesktop from "./nav_desktop";
import { useTranslations } from "next-intl";
import { FaBlog } from "react-icons/fa";

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
    {
      href: "/blog",
      label: t("blog"),
      icon: () => <FaBlog className="w-4 h-4" />,
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

  const  isHomePage = pathname === "/";

  return (
    <header
      className={`px-4 py-3 justify-between top-0 
        ${isHomePage ? "fixed" : "sticky"} z-50 w-full ${
        isTop
          ? "bg-transparent"
          : "backdrop-blur-md bg-primary/90 shadow-md"
      } ${
        isScrollUp ? "translate-y-0" : "-translate-y-full"
      } transition-transform duration-300`}
    >
      {/* Desktop Navigation */}
      <NavDesktop publicMenuItems={publicNavigationItems} isActive={isActive} />

      {/* Mobile Navigation */}
      <NavMobile publicMenuItems={publicNavigationItems} isActive={isActive} />
    </header>
  );
};

export default Header;
