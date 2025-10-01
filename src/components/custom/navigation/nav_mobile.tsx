import { NavDataProps } from "./header";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { MenuIcon, Users, User, Calendar, Ticket } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Logo from "@/components/custom/logo";
import { useTranslations } from "next-intl";

const NavMobile = ({ publicMenuItems, isActive }: NavDataProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const session = useSession();
  const t = useTranslations();

  const userMenuItems = [
    {
      title: t("UserDashboard.profile"),
      url: "/user",
      icon: User,
    },
    {
      title: t("UserDashboard.tickets"),
      url: "/user/my-tickets",
      icon: Ticket,
    },
    {
      title: t("UserDashboard.redeem"),
      url: "/user/redeem",
      icon: Calendar,
    },
  ];

  return (
    <div className="lg:hidden flex justify-between items-center w-full">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button aria-label="Open navigation menu" variant="ghost" size="icon">
            <MenuIcon className="h-6 w-6 text-white" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-80">
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-border">
              <SheetTitle className="flex items-center space-x-3">
                <Logo width={24} height={24} />
                <span className="text-xl font-bold">Busify</span>
              </SheetTitle>
            </div>

            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
              {/* Main Navigation */}
              <nav className="space-y-2">
                <h3 className="text-sm font-semibold text-white mb-2">
                  {"Platform"}
                </h3>
                {publicMenuItems.map((item) => {
                  return (
                    <Link
                      aria-label={item.label}
                      key={item.href}
                      href={item.href}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive(item.href)
                          ? "bg-accent/10 text-accent"
                          : "hover:bg-muted text-muted-foreground"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.icon()}
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="border-t border-border pt-4">
                <h3 className="text-sm font-semibold text-primary mb-3 flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  {t("Header.contact")}
                </h3>
              </div>
              <div className="border-t border-border pt-4 block lg:hidden">
                <h3 className="text-sm font-semibold text-primary mb-3 flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  {t("Footer.usefulLinks")}
                </h3>
                {session.status === "authenticated" &&
                  userMenuItems.map((item) => (
                    <Link
                      key={item.title}
                      href={item.url}
                      className={`flex items-center p-2 text-sm font-medium rounded-md ${
                        isActive(item.url)
                          ? "bg-background text-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      <item.icon className="w-4 h-4 mr-2" />
                      {item.title}
                    </Link>
                  ))}
              </div>
            </div>
            <div className="p-6 border-t border-border space-y-3">
              {session.status !== "authenticated" ? (
                <>
                  <Button
                    aria-label="Sign In"
                    variant="outline"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link
                      aria-label={t("Header.signIn")}
                      href="/login"
                      className="flex items-center space-x-2 "
                    >
                      <User className="w-4 h-4" />
                      <span>{t("Header.signIn")}</span>
                    </Link>
                  </Button>
                  <Button
                    aria-label="Sign Up"
                    className="w-full bg-accent hover:bg-accent/90"
                    asChild
                  >
                    <Link aria-label={t("Header.signUp")} href="/signup">
                      {t("Header.signUp")}
                    </Link>
                  </Button>
                </>
              ) : (
                <Button
                  aria-label="Sign Out"
                  variant="outline"
                  onClick={() => signOut()}
                  className="flex items-center space-x-2"
                >
                  <User className="w-4 h-4" />
                  <span>{t("Profile.logout")}</span>
                </Button>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex items-center space-x-2">
        <span className="text-xl font-bold text-white">Busify</span>
      </div>

      {session.status === "authenticated" ? (
        <Button
          aria-label="Open user dashboard"
          variant="ghost"
          size="sm"
          asChild
        >
          <Link aria-label={t("Header.dashboard")} href={`/user`}>
            <User className="w-5 h-5" />
          </Link>
        </Button>
      ) : (
        <Button aria-label="Open login page" variant="ghost" size="sm" asChild className="text-white">
          <Link aria-label={t("Auth.login.title")} href="/login">
            {t("Auth.login.title")}
          </Link>
        </Button>
      )}
    </div>
  );
};

export default NavMobile;
