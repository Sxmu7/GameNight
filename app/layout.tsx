import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppStateProvider } from "@/lib/i18n/LanguageProvider";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import AgeGate from "@/components/AgeGate";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "PartyRound",
  description: "Der kategorisierte Trinkspiel-Katalog – DE/EN/ES, mit Stats und Online-Modus.",
};

export const viewport: Viewport = {
  themeColor: "#0b0b10",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={inter.variable}>
      <body className="font-sans bg-bg text-white min-h-screen">
        <AppStateProvider>
          <Header />
          <main className="mx-auto max-w-md px-4 pb-24 pt-4 min-h-[70vh]">{children}</main>
          <BottomNav />
          <AgeGate />
        </AppStateProvider>
      </body>
    </html>
  );
}
