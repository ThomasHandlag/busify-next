import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/custom/navigation/header";
import { Toaster } from "sonner";
import SessionProviderWrapper from "@/components/providers/SessionProvider";
import "./globals.css";
import PreferencesProvider from "@/components/providers/PreferencesProvider";
import { NextIntlClientProvider } from "next-intl";
import TripFilterProvider from "@/components/providers/TripFilterProvider";
import { ThemeProvider } from "next-themes";

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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PreferencesProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            storageKey="theme"
            disableTransitionOnChange
          >
            <NextIntlClientProvider>
              <TripFilterProvider>
                <SessionProviderWrapper>
                  <Header />
                  <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
                    {children}
                  </main>
                  <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
                  <Toaster />
                </SessionProviderWrapper>
              </TripFilterProvider>
            </NextIntlClientProvider>
          </ThemeProvider>
        </PreferencesProvider>
      </body>
    </html>
  );
}
