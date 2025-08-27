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

const NavDesktop = ({
  contactMenuItems,
  publicMenuItems,
  isActive,
}: NavDataProps) => {
  const session = useSession();
  const trans = useTranslations("Header");
  return (
    <div className="hidden lg:flex gap-6 w-full items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <Logo width={32} height={32} />
          <span className="text-2xl font-bold text-gray-900">Busify</span>
        </div>
      </div>

      <NavigationMenu>
        <NavigationMenuList className="space-x-1">
          {publicMenuItems.map((item) => {
            return (
              <NavigationMenuItem key={item.href}>
                <NavigationMenuLink
                  href={item.href}
                  className={`${navigationMenuTriggerStyle()} ${
                    isActive(item.href)
                      ? "bg-green-100 text-green-700"
                      : "hover:bg-green-50 hover:text-green-700"
                  } flex items-center space-x-2`}
                >
                  {item.icon()}
                  <span>{item.label}</span>
                </NavigationMenuLink>
              </NavigationMenuItem>
            );
          })}
          <NavigationMenuItem>
            <NavigationMenuTrigger className="hover:bg-green-50 hover:text-green-700 data-[state=open]:bg-green-100 data-[state=open]:text-green-700">
              {trans("contact")}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="w-[500px] p-4">
                <div className="grid gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <h4 className="text-lg font-semibold text-green-900">
                      {trans("contact")}
                    </h4>
                    <p className="text-sm text-green-700 mt-1">
                      Connecting passengers and operators nationwide
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {contactMenuItems.map((item) => {
                      const isExternal = item.href.startsWith("http");
                      return (
                        <Link
                          aria-label={item.label}
                          key={item.href}
                          href={item.href}
                          {...(isExternal && {
                            target: "_blank",
                            rel: "noopener noreferrer",
                          })}
                          className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          {item.icon()}
                          <div>
                            <p className="font-medium text-sm flex items-center">
                              {item.label}
                              {isExternal && (
                                <span className="ml-1 text-xs">↗</span>
                              )}
                            </p>
                            <p className="text-xs text-gray-600">
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      {/* If authenticated hide this part */}
      {session.status !== "authenticated" ? (
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link
              aria-label="Sign in"
              href="/login"
              className="flex items-center space-x-2"
            >
              <User className="w-4 h-4" />
              <span>Sign In</span>
            </Link>
          </Button>
          <Button size="sm" className="bg-green-600 hover:bg-green-700" asChild>
            <Link aria-label="Sign up" href="/signup">
              Sign up
            </Link>
          </Button>
        </div>
      ) : (
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="flex items-center space-x-2 hover:bg-gray-50">
                <User className="w-4 h-4" />
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-48 p-2">
                  <div className="space-y-1">
                    <Link
                      aria-label="User Dashboard"
                      href={`/user`}
                      className="block px-3 py-2 text-sm rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      Dashboard
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={() => signOut()}
                      className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-100 transition-colors text-red-600"
                    >
                      Sign Out
                    </button>
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
