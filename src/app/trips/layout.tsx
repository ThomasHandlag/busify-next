import Pager from "@/components/custom/trip/pager";
import { ReactNode } from "react";

const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
      <div className="flex flex-col items-start w-full min-h-screen">
        <div className="w-full">{children}</div>
        <Pager/>
      </div>
  );
};

export default AppLayout;
