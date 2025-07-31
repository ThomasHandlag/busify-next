"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { SiFacebook, SiZalo, SiDiscord } from "react-icons/si";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const pathname = usePathname();

  const isActive = (route: string): boolean => {
    const routeName = pathname;
    return routeName.split("/").pop() === route.split("/").pop() || false;
  };

  const [isTop, setIsTop] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [isScrollUp, setIsScrollUp] = useState(true);

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
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

      setLastScrollTop(scrollTop <= 0 ? 0 : scrollTop); // Avoid negative values
    });
  }

  const linkBaseClass =
    "p-2 transition-colors rounded hover:bg-primary hover:text-background";
  const activeClass = "bg-primary text-background";

  return (
    <header
      className={`p-4 bg-background justify-between text-primary scrollbar shadow top-0 inset-0 sticky z-50 ${
        isTop ? "flex" : "fixed"
      } ${
        isScrollUp ? "translate-y-0" : "-translate-y-full"
      } transition-transform duration-300`}
    >
      {/* Desktop Navigation */}
      <div className="hidden md:flex gap-4 w-full items-center justify-between">
        <div className="flex items-center">
          <Image src="/logo.svg" width={46} height={46} alt="Logo" />
          <span className="flex flex-col italic text-primary uppercase">
            <h1 className="text-xl font-bold">usify</h1>
            <p>e your companion</p>
          </span>
        </div>

        <ul className="flex gap-2">
          <Link
            href="/"
            className={`${linkBaseClass} ${isActive("/") ? activeClass : ""}`}
          >
            Home
          </Link>
          <Link
            href="/passenger"
            className={`${linkBaseClass} ${
              isActive("/passenger") ? activeClass : ""
            }`}
          >
            Passengers
          </Link>
          <Link
            href="/operator"
            className={`${linkBaseClass} ${
              isActive("/operator") ? activeClass : ""
            }`}
          >
            Bus Operators
          </Link>
        </ul>
        <ul className="flex gap-2">
          <Link href="" className={`${linkBaseClass} text-primary`}>
            <SiFacebook size={24} />
          </Link>
          <Link href="" className={`${linkBaseClass} text-primary`}>
            <SiDiscord size={24} />
          </Link>
          <Link href="" className={`${linkBaseClass} text-primary`}>
            <SiZalo size={24} />
          </Link>
        </ul>
      </div>
      {/* Mobile Navigation */}
      <div className="md:hidden flex justify-between items-center w-full h-1">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-4">
            <SheetTitle>Navigation</SheetTitle>
            <div className="flex flex-col space-y-4 pt-8 overflow-y-scroll scrollbar">
              <ul className="flex flex-col gap-2">
                <Link
                  href="/"
                  className={`${linkBaseClass} ${
                    isActive("/") ? activeClass : ""
                  }`}
                >
                  Home
                </Link>
                <Link
                  href="/passenger"
                  className={`${linkBaseClass} ${
                    isActive("/passenger") ? activeClass : ""
                  }`}
                >
                  Passengers
                </Link>
                <Link
                  href="/operator"
                  className={`${linkBaseClass} ${
                    isActive("/operator") ? activeClass : ""
                  }`}
                >
                  Bus Operators
                </Link>
              </ul>
              <div className="bg-gray-300 w-full h-[1px]"></div>
              <ul className="flex gap-2 flex-col">
                <Link
                  href=""
                  className={`${linkBaseClass} text-primary flex gap-2`}
                >
                  <SiFacebook size={24} /> Facebook
                </Link>
                <Link
                  href=""
                  className={`${linkBaseClass} text-primary flex gap-2`}
                >
                  <SiDiscord size={24} /> Discord
                </Link>
                <Link
                  href=""
                  className={`${linkBaseClass} text-primary flex gap-2`}
                >
                  <SiZalo size={24} /> Zalo
                </Link>
              </ul>
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex items-center">
          <span className="flex flex-col italic text-primary uppercase">
            <h1 className="text-xl font-bold">busify</h1>
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
