import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import KeyboardShortcuts from "@/components/KeyboardShortcuts";
import { LangProvider } from "@/lib/lang";

export const metadata: Metadata = {
  title: "Hayastan Atlas",
  description: "Interactive historical map of Armenia",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-stone-950 text-stone-100 min-h-screen flex flex-col">
        <LangProvider>
          <Navbar />
          <main className="flex-1 flex flex-col pb-16 md:pb-0">{children}</main>
          <KeyboardShortcuts />
        </LangProvider>
      </body>
    </html>
  );
}
