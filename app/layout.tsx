// app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Importation corrigée pour le SessionProvider
// Assurez-vous que le fichier SessionProvider.tsx se trouve bien dans le dossier /components
import SessionProvider from "@/components/SessionProvider"; 

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
        {/* Le SessionProvider enveloppe toute votre application. */}
        {/* Cela permet de rendre les données de session accessibles partout. */}
        <SessionProvider>
          <main className="min-h-screen bg-[#0A0A0A] text-white">
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  );
}