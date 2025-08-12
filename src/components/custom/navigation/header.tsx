"use client";

import React, { useState, useEffect } from "react";

import {
  Bus,
  Users,
  Phone,
  User,
  Search,
  Calendar,
  Building2,
  HelpCircle,
  Ticket,
  CreditCard,
  BarChart3,
  Settings,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { SiFacebook, SiZalo, SiDiscord } from "react-icons/si";
import NavMobile from "./nav_mobile";
import NavDesktop from "./nav_desktop";

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
  isPassenger: boolean;
  passengerMenuItems: MenuItemData[];
  publicMenuItems: NavItemData[];
  operatorMenuItems: MenuItemData[];
  aboutMenuItems: MenuItemData[];
  isActive: (href: string) => boolean;
}

const publicNavigationItems: NavItemData[] = [
  { href: "/", label: "Home", icon: () => <Bus className="w-4 h-4" /> },
  {
    href: "/help",
    label: "Help",
    icon: () => <HelpCircle className="w-4 h-4" />,
  },
];

// About section with social links
const aboutMenuItems: MenuItemData[] = [
  {
    title: "Company",
    items: [
      {
        href: "/about",
        label: "About Us",
        icon: () => <Users className="w-4 h-4" />,
        description: "Learn more about our mission and team",
      },
      {
        href: "/about/careers",
        label: "Careers",
        icon: () => <Building2 className="w-4 h-4" />,
        description: "Join our growing team",
      },
      {
        href: "/about/contact",
        label: "Contact",
        icon: () => <Phone className="w-4 h-4" />,
        description: "Get in touch with us",
      },
    ],
  },
  {
    title: "Connect With Us",
    items: [
      {
        href: "https://facebook.com/busify",
        label: "Facebook",
        icon: () => <SiFacebook className="w-4 h-4" />,
        description: "Follow us on Facebook",
      },
      {
        href: "https://discord.com/invite/busify",
        label: "Discord",
        icon: () => <SiDiscord className="w-4 h-4" />,
        description: "Join our community",
      },
      {
        href: "https://zalo.me/busify",
        label: "Zalo",
        icon: () => <SiZalo className="w-4 h-4" />,
        description: "Connect on Zalo",
      },
    ],
  },
];

// Passenger portal navigation
const passengerMenuItems: MenuItemData[] = [
  {
    title: "Book & Travel",
    items: [
      {
        href: "/trips",
        label: "Search Trips",
        icon: () => <Search className="w-4 h-4" />,
        description: "Find and book your next journey",
      },
      {
        href: "/user/my-tickets",
        label: "My Bookings",
        icon: () => <Ticket className="w-4 h-4" />,
        description: "View and manage your tickets",
      },
      {
        href: "/user/redeem",
        label: "Travel History",
        icon: () => <Calendar className="w-4 h-4" />,
        description: "Your past trips and experiences",
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        href: `/user/profile`,
        label: "Profile",
        icon: () => <User className="w-4 h-4" />,
        description: "Manage your personal information",
      },
      {
        href: "/user/payments",
        label: "Payment Methods",
        icon: () => <CreditCard className="w-4 h-4" />,
        description: "Saved cards and payment history",
      },
      {
        href: "/user/preferences",
        label: "Preferences",
        icon: () => <Settings className="w-4 h-4" />,
        description: "Travel preferences and notifications",
      },
    ],
  },
];

// Operator portal navigation
const operatorMenuItems: MenuItemData[] = [
  {
    title: "Business Management",
    items: [
      {
        href: "/operator/dashboard",
        label: "Dashboard",
        icon: () => <BarChart3 className="w-4 h-4" />,
        description: "Overview of your business metrics",
      },
      {
        href: "/operator/trips",
        label: "Manage Trips",
        icon: () => <Bus className="w-4 h-4" />,
        description: "Create and manage your bus routes",
      },
      {
        href: "/operator/passengers",
        label: "Passengers",
        icon: () => <Users className="w-4 h-4" />,
        description: "View and manage passenger bookings",
      },
    ],
  },
  {
    title: "Fleet & Settings",
    items: [
      {
        href: "/operator/fleets",
        label: "Fleet Management",
        icon: () => <Building2 className="w-4 h-4" />,
        description: "Manage your buses and drivers",
      },
      {
        href: "/operator/analytics",
        label: "Analytics",
        icon: () => <BarChart3 className="w-4 h-4" />,
        description: "Revenue and performance insights",
      },
      {
        href: "/operator/profile",
        label: "Company Profile",
        icon: () => <Settings className="w-4 h-4" />,
        description: "Business information and settings",
      },
    ],
  },
];

const Header = () => {
  const [isTop, setIsTop] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [isScrollUp, setIsScrollUp] = useState(true);

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

  // Main navigation items

  const isPassenger = pathname.startsWith("/trips");

  return (
    <header
      className={`px-4 py-3 bg-white border-b border-gray-200 justify-between text-gray-900 shadow-sm top-0 inset-0 sticky z-50 ${
        isTop ? "flex" : "fixed w-full"
      } ${
        isScrollUp ? "translate-y-0" : "-translate-y-full"
      } transition-transform duration-300`}
    >
      {/* Desktop Navigation */}
      <NavDesktop
        isPassenger={isPassenger}
        passengerMenuItems={passengerMenuItems}
        publicMenuItems={publicNavigationItems}
        operatorMenuItems={operatorMenuItems}
        aboutMenuItems={aboutMenuItems}
        isActive={isActive}
      />

      {/* Mobile Navigation */}
      <NavMobile
        isPassenger={isPassenger}
        passengerMenuItems={passengerMenuItems}
        publicMenuItems={publicNavigationItems}
        operatorMenuItems={operatorMenuItems}
        aboutMenuItems={aboutMenuItems}
        isActive={isActive}
      />
    </header>
  );
};

export default Header;
