import { UserSidebar } from "@/components/custom/navigation/user_sidebar";

const UserLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex lg:flex-row flex-col items-start justify-center w-full lg:p-4">
      <UserSidebar />
      <div className="lg:h-[85vh] h-full w-full overflow-auto border-l border-primary">{children}</div>
    </main>
  );
};

export default UserLayout;
