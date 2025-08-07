import BottomBar from "@/components/custom/bottom_bar";
import TripFilterProvider from "@/components/providers/TripFilterProvider";
import { ReactNode } from "react";

const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <TripFilterProvider>
      <div className="flex flex-col items-start w-full min-h-screen">
        <div className="w-full">{children}</div>
        <BottomBar />
      </div>
    </TripFilterProvider>
  );
};

export default AppLayout;
