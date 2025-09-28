import { NavDataProps } from "./header";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/custom/logo";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

const NavDesktop = ({ publicMenuItems, isActive }: NavDataProps) => {
  const session = useSession();
  const t = useTranslations();
  return (
    <div className="hidden lg:flex gap-6 w-full items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <Logo width={32} height={32} />
          <span className="text-2xl font-bold text-white">Busify</span>
        </div>
      </div>

      <NavigationMenu>
        <NavigationMenuList className="space-x-1">
          {publicMenuItems.map((item) => {
            return (
              <NavigationMenuItem key={item.href} className="bg-transparent">
                <NavigationMenuLink asChild>
                  <Link
                    href={item.href}
                    className={`${navigationMenuTriggerStyle()} bg-transparent hover:after:w-full text-white ${
                      isActive(item.href)
                        ? "bg-transparent  after:w-full"
                        : "after:w-0"
                    } relative after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:bg-background after:transition-all after:duration-300 after:-translate-x-1/2 flex items-center space-x-2`}
                  >
                    {item.icon()}
                    <span>{item.label}</span>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            );
          })}
        </NavigationMenuList>
      </NavigationMenu>
      {/* If authenticated hide this part */}
      {session.status !== "authenticated" ? (
        <div className="flex items-center space-x-4">
          <Button aria-label="Sign In" variant="outline" size="sm" asChild>
            <Link
              aria-label={t("Header.signIn")}
              href="/login"
              className="flex items-center space-x-2"
            >
              <User className="w-4 h-4" />
              <span>{t("Header.signIn")}</span>
            </Link>
          </Button>
          <Button
            aria-label="Sign Up"
            size="sm"
            className="bg-primary hover:bg-primary/90"
            asChild
          >
            <Link aria-label={t("Header.signUp")} href="/signup">
              {t("Header.signUp")}
            </Link>
          </Button>
        </div>
      ) : (
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                {session.data.user?.email}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-48 p-2">
                  <div className="space-y-1">
                    <Link
                      aria-label={t("Header.dashboard")}
                      href={`/user`}
                      className="block px-3 py-2 text-sm rounded-lg hover:bg-accent transition-colors"
                    >
                      {t("Header.dashboard")}
                    </Link>
                    <hr className="my-1" />
                    <Button
                      onClick={() => signOut()}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                    >
                      {t("Profile.logout")}
                    </Button>
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      )}
    </div>
  );
};

export default NavDesktop;
