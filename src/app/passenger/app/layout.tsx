"use client";

import BottomBar from "@/components/custom/bottom_bar";
import TripFilterProvider from "@/components/providers/TripFilterProvider";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";

const AppLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const hideBottomBar = pathname.startsWith("/passenger/app/my-tickets");

  return (
    <TripFilterProvider>
      <div className="flex flex-col items-start w-full min-h-screen">
        <div className="w-full">{children}</div>
        {!hideBottomBar && <BottomBar />}
      </div>
    </TripFilterProvider>
  );
};

export default AppLayout;
