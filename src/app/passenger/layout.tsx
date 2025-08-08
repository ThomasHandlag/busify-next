import Header from "@/components/custom/header";
import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col items-start w-full min-h-screen">
      <div className="w-full">{children}</div>
    </div>
  );
};

export default Layout;
