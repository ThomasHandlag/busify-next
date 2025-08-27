import { UserSidebar } from "@/components/custom/navigation/user_sidebar";
import { auth } from "@/lib/data/auth";
import { signOut } from "next-auth/react";

const UserLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  if (!session?.user) {
    signOut();
  }
  return (
    <main className="flex lg:flex-row flex-col items-start justify-center w-full lg:p-4">
      <UserSidebar />
      <div className="lg:h-[85vh] h-full overflow-auto">{children}</div>
    </main>
  );
};

export default UserLayout;
