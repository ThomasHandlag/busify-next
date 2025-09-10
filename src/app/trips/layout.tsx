import { ReactNode } from "react";

const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex lg:flex-row flex-col md:flex-col items-start w-full h-[90vh]">
      <div className="w-full max-h-[90vh] flex flex-col justify-between">
        {children}
      </div>
    </div>
  );
};

export default AppLayout;
