import BottomBar from "@/components/custom/bottom_bar";
import { ReactNode } from "react";

const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col items-start w-full min-h-screen">
      <div className="w-full">{children}</div>
      <BottomBar />
    </div>
  );
};

export default AppLayout;
