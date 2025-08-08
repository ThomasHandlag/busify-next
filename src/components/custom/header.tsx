"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MenuIcon, LogOut, User } from "lucide-react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();

  const isActive = (route: string): boolean => {
    const routeName = pathname;
    return routeName.split("/").pop() === route.split("/").pop() || false;
  };

  const [isTop, setIsTop] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [isScrollUp, setIsScrollUp] = useState(true);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop > 0) {
        setIsTop(false);
      } else {
        setIsTop(true);
      }

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

  useEffect(() => {
    const emailFromSession = session?.user?.email || "";
    setEmail(emailFromSession);
  }, [session]);

  const linkBaseClass =
    "px-4 py-2 transition-all duration-200 rounded-lg hover:bg-primary hover:text-background font-medium relative overflow-hidden group";
  const activeClass = "bg-primary text-background shadow-md";

  return (
    <header
      className={`px-6 py-4 bg-background/80 backdrop-blur-md justify-between text-primary border-b border-gray-200/50 top-0 inset-0 sticky z-50 ${
        isTop ? "flex shadow-sm" : "fixed shadow-lg"
      } ${
        isScrollUp ? "translate-y-0" : "-translate-y-full"
      } transition-all duration-300`}
    >
      {/* Desktop Navigation */}
      <div className="hidden md:grid grid-cols-3 w-full items-center">
        {/* Logo Section */}
        <div className="flex justify-start">
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/logo.svg"
              width={46}
              height={46}
              alt="Busify Logo"
              className="transition-transform group-hover:scale-105"
            />
            <span className="flex flex-col italic text-primary uppercase">
              <h1 className="text-xl font-bold tracking-wide">Busify</h1>
              <p className="text-xs opacity-80 -mt-1">Be your companion</p>
            </span>
          </Link>
        </div>

        {/* Navigation Section - Center */}
        <div className="flex justify-center">
          <nav className="flex gap-1 bg-gray-50 rounded-full p-1">
            <Link
              href="/"
              className={`${linkBaseClass} ${
                isActive("/") ? activeClass : "hover:bg-gray-100"
              }`}
            >
              Home
            </Link>
            <Link
              href="/passenger"
              className={`${linkBaseClass} ${
                isActive("/passenger") ? activeClass : "hover:bg-gray-100"
              }`}
            >
              Passengers
            </Link>
            <Link
              href="/operator"
              className={`${linkBaseClass} ${
                isActive("/operator") ? activeClass : "hover:bg-gray-100"
              }`}
            >
              Bus Operators
            </Link>
          </nav>
        </div>

        {/* Auth Section - Right */}
        <div className="flex justify-end">
          <div className="flex gap-3 items-center">
            {session ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
                  <User size={18} className="text-primary" />
                  <span className="text-sm font-medium text-primary">
                    {email}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut()}
                  className="flex items-center gap-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
                >
                  <LogOut size={16} />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link href="/passenger/login">
                  <Button variant="ghost" size="sm" className="font-medium">
                    Sign In
                  </Button>
                </Link>
                <Link href="/passenger/register">
                  <Button
                    variant="default"
                    size="sm"
                    className="font-medium px-4"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Mobile Navigation */}
      <div className="md:hidden flex justify-between items-center w-full">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="hover:bg-primary/10">
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
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/passenger"
                  className={`${linkBaseClass} ${
                    isActive("/passenger") ? activeClass : ""
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Passengers
                </Link>
                <Link
                  href="/operator"
                  className={`${linkBaseClass} ${
                    isActive("/operator") ? activeClass : ""
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Bus Operators
                </Link>
              </ul>
              <div className="bg-gray-300 w-full h-[1px]"></div>
              {/* Auth Section Mobile */}
              {session ? (
                <div className="flex flex-col gap-3 pt-2">
                  <div className="flex items-center gap-3 px-4 py-3 bg-primary/10 border border-primary/20 rounded-lg">
                    <User size={18} className="text-primary" />
                    <span className="text-sm font-medium text-primary">
                      {session.user?.email}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      signOut();
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-2 justify-start hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 pt-2">
                  <Link
                    href="/passenger/login"
                    onClick={() => setIsOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start font-medium"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link
                    href="/passenger/register"
                    onClick={() => setIsOpen(false)}
                  >
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full justify-start font-medium"
                    >
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>

        {/* Mobile Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/logo.svg"
            width={32}
            height={32}
            alt="Busify Logo"
            className="transition-transform group-hover:scale-105"
          />
          <span className="flex flex-col italic text-primary uppercase">
            <h1 className="text-lg font-bold tracking-wide">Busify</h1>
            <p className="text-xs opacity-80 -mt-1 hidden sm:block">
              Be your companion
            </p>
          </span>
        </Link>
      </div>
    </header>
  );
};

export default Header;
