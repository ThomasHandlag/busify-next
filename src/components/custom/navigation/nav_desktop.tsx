import { NavDataProps } from "./header";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
  NavigationMenuContent,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Badge } from "@/components/ui/badge";
import { Bus, Users, User, Building2, FileText } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import RegisterContractModal from "@/components/custom/contract/register_contract_modal";

const NavDesktop = ({
  isPassenger,
  passengerMenuItems,
  publicMenuItems,
  operatorMenuItems,
  aboutMenuItems,
  isActive,
}: NavDataProps) => {
  const session = useSession();

  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="hidden lg:flex gap-6 w-full items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <Bus className="w-8 h-8 text-green-600" />
          <span className="text-2xl font-bold text-gray-900">Busify</span>
        </div>
        <Badge variant="secondary" className="text-xs">
          {isPassenger ? "Booking Platform" : "Travel & Transport Platform"}
        </Badge>
      </div>

      <NavigationMenu>
        <NavigationMenuList className="space-x-1">
          {/* Public Navigation */}
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

          {/* About Dropdown */}
          {!isPassenger && (
            <NavigationMenuItem>
              <NavigationMenuTrigger className="hover:bg-green-50 hover:text-green-700 data-[state=open]:bg-green-100 data-[state=open]:text-green-700">
                <Users className="w-4 h-4 mr-2" />
                About
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-[500px] p-4">
                  <div className="grid gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <h4 className="text-lg font-semibold text-green-900">
                        About Busify
                      </h4>
                      <p className="text-sm text-green-700 mt-1">
                        Connecting passengers and operators nationwide
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {aboutMenuItems.map((section) => (
                        <div key={section.title}>
                          <h5 className="font-medium text-gray-900 mb-2">
                            {section.title}
                          </h5>
                          <div className="space-y-1">
                            {section.items.map((item) => {
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
                      ))}
                    </div>
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          )}

          {/* Passenger Portal Dropdown */}
          <NavigationMenuItem>
            <NavigationMenuTrigger className="hover:bg-blue-50 hover:text-blue-700 data-[state=open]:bg-blue-100 data-[state=open]:text-blue-700">
              <User className="w-4 h-4 mr-2" />
              For Passengers
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="w-[500px] p-4">
                <div className="grid gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <h4 className="text-lg font-semibold text-blue-900">
                      Passenger Portal
                    </h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Book tickets and manage your journeys
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {passengerMenuItems.map((section) => (
                      <div key={section.title}>
                        <h5 className="font-medium text-gray-900 mb-2">
                          {section.title}
                        </h5>
                        <div className="space-y-1">
                          {section.items.map((item) => {
                            return (
                              <Link
                                aria-label={item.label}
                                key={item.href}
                                href={item.href}
                                className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                {item.icon()}
                                <div>
                                  <p className="font-medium text-sm">
                                    {item.label}
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
                    ))}
                  </div>
                </div>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>

          {/* Operator Portal Dropdown */}
          {!isPassenger && (
            <NavigationMenuItem>
              <NavigationMenuTrigger className="hover:bg-purple-50 hover:text-purple-700 data-[state=open]:bg-purple-100 data-[state=open]:text-purple-700">
                <Building2 className="w-4 h-4 mr-2" />
                For Operators
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-[500px] p-4">
                  <div className="grid gap-4">
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <h4 className="text-lg font-semibold text-purple-900">
                        Operator Portal
                      </h4>
                      <p className="text-sm text-purple-700 mt-1">
                        Manage your bus business and passengers
                      </p>
                      <div className="mt-3">
                        <RegisterContractModal />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {operatorMenuItems.map((section) => (
                        <div key={section.title}>
                          <h5 className="font-medium text-gray-900 mb-2">
                            {section.title}
                          </h5>
                          <div className="space-y-1">
                            {section.items.map((item) => {
                              return (
                                <Link
                                  aria-label={item.label}
                                  key={item.href}
                                  href={item.href}
                                  className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                  <div>
                                    {item.icon()}
                                    <p className="font-medium text-sm">
                                      {item.label}
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
                      ))}
                    </div>
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          )}
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
                <span>{session.data?.user?.email || "User"}</span>
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-48 p-2">
                  <div className="space-y-1">
                    <Link
                      aria-label="User profile"
                      href={`/user/profile`}
                      className="block px-3 py-2 text-sm rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      Profile
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
