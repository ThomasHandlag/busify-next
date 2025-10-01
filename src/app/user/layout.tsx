import { UserSidebar } from "@/components/custom/navigation/user_sidebar";

const UserLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full bg-primary w-full lg:px-4 px-2 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 max-w-7xl mx-auto">
        <div className="col-span-1 hidden lg:block">
          <div className="sticky top-8">
            <UserSidebar />
          </div>
        </div>
        <div className="h-full col-span-5 bg-background rounded-lg">
          {children}
        </div>
      </div>
    </div>
  );
};

export default UserLayout;
