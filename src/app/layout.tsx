import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/custom/navigation/header";
import { Toaster } from "sonner";
import SessionProviderWrapper from "@/components/providers/SessionProvider";
import "./globals.css";
import PreferencesProvider from "@/components/providers/PreferencesProvider";
import { NextIntlClientProvider } from "next-intl";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Busify",
  description: "All in one platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PreferencesProvider>
          <NextIntlClientProvider>
            <SessionProviderWrapper>
              <Header />
              <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
                {children}
              </main>
              <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
              <Toaster />
            </SessionProviderWrapper>
          </NextIntlClientProvider>
        </PreferencesProvider>
      </body>
    </html>
  );
}
