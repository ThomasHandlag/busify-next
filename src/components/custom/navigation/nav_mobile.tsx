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

import { MenuIcon, Bus, Users, User, Building2 } from "lucide-react";

const NavMobile = ({
  isPassenger,
  passengerMenuItems,
  publicMenuItems,
  operatorMenuItems,
  aboutMenuItems,
  isActive,
}: NavDataProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden flex justify-between items-center w-full">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-80">
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-gray-200">
              <SheetTitle className="flex items-center space-x-3">
                <Bus className="w-6 h-6 text-green-600" />
                <span className="text-xl font-bold">Busify</span>
              </SheetTitle>
            </div>

            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
              {/* Main Navigation */}
              <nav className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  Platform
                </h3>
                {publicMenuItems.map((item) => {
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive(item.href)
                          ? "bg-green-100 text-green-700"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.icon()}
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* About Section */}
              {!isPassenger && (
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-sm font-semibold text-green-700 mb-3 flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    About Busify
                  </h3>
                  {aboutMenuItems.map((section) => (
                    <div key={section.title} className="mb-4">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        {section.title}
                      </h4>
                      <div className="space-y-1">
                        {section.items.map((item) => {
                          const isExternal = item.href.startsWith("http");
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              {...(isExternal && {
                                target: "_blank",
                                rel: "noopener noreferrer",
                              })}
                              className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-green-50 text-gray-700 hover:text-green-700"
                              onClick={() => setIsOpen(false)}
                            >
                              {item.icon()}
                              <div>
                                <p className="text-sm font-medium flex items-center">
                                  {item.label}
                                  {isExternal && (
                                    <span className="ml-1 text-xs">↗</span>
                                  )}
                                </p>
                                <p className="text-xs text-gray-500">
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
              )}

              {/* Passenger Portal */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-sm font-semibold text-blue-700 mb-3 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  For Passengers
                </h3>
                {passengerMenuItems.map((section) => (
                  <div key={section.title} className="mb-4">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      {section.title}
                    </h4>
                    <div className="space-y-1">
                      {section.items.map((item) => {
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-700"
                            onClick={() => setIsOpen(false)}
                          >
                            {item.icon()}
                            <div>
                              <p className="text-sm font-medium">
                                {item.label}
                              </p>
                              <p className="text-xs text-gray-500">
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

              {/* Operator Portal */}
              {!isPassenger && (
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-sm font-semibold text-purple-700 mb-3 flex items-center">
                    <Building2 className="w-4 h-4 mr-2" />
                    For Bus Operators
                  </h3>
                  {operatorMenuItems.map((section) => (
                    <div key={section.title} className="mb-4">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        {section.title}
                      </h4>
                      <div className="space-y-1">
                        {section.items.map((item) => {
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-purple-50 text-gray-700 hover:text-purple-700"
                              onClick={() => setIsOpen(false)}
                            >
                              {item.icon()}
                              <div>
                                <p className="text-sm font-medium">
                                  {item.label}
                                </p>
                                <p className="text-xs text-gray-500">
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
              )}
            </div>

            <div className="p-6 border-t border-gray-200 space-y-3">
              {true ? (
                <>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link
                      href="/auth/signin"
                      className="flex items-center space-x-2"
                    >
                      <User className="w-4 h-4" />
                      <span>Sign In</span>
                    </Link>
                  </Button>
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    asChild
                  >
                    <Link href="/auth/signup">Get Started</Link>
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/auth/signin" className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Log out</span>
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex items-center space-x-2">
        <Bus className="w-6 h-6 text-green-600" />
        <span className="text-xl font-bold text-gray-900">Busify</span>
      </div>

      <Button variant="ghost" size="sm" asChild>
        <Link href="/signin">
          <User className="w-5 h-5" />
        </Link>
      </Button>
    </div>
  );
};

export default NavMobile;
