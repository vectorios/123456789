// app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import SessionProvider from "@/components/SessionProvider"; 
import { LanguageProvider } from "@/contexts/LanguageContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ColorVerse - Own a Color",
  description: "A digital society and economic simulation based on the unique ownership of 16.7 million colors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <SessionProvider>
          <LanguageProvider>
            {/* Il n'y a plus de <main> ici. Les pages géreront leur propre balise <main>. */}
            {children}
          </LanguageProvider>
        </SessionProvider>
      </body>
    </html>
  );
}