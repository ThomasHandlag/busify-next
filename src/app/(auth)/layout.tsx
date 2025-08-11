import type { Metadata } from "next";
import { Toaster } from "sonner";
import SessionProviderWrapper from "@/components/providers/SessionProvider";
import "../globals.css";

export const metadata: Metadata = {
  title: "Busify - Authentication",
  description: "Authentication pages for Busify",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col items-start w-full min-h-screen bg-gray-50">
      <div className="w-full">
        <SessionProviderWrapper>
          {children}
          <Toaster />
        </SessionProviderWrapper>
      </div>
    </div>
  );
}
