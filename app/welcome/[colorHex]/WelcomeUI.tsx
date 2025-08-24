// app/welcome/[colorHex]/WelcomeUI.tsx
'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

// Définition claire du type des props
type ColorData = {
  name: string;
  hex_code: string;
};

// Ce composant client reçoit les données du serveur
export default function WelcomeUI({ colorData }: { colorData: ColorData }) {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-gray-900" style={{ backgroundColor: colorData.hex_code }}>
      {/* Conteneur principal avec une transition CSS simple */}
      <div className="relative p-8 space-y-6 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl max-w-2xl border border-white/20">
        <div 
          className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full border-4 border-white shadow-lg" 
          style={{ backgroundColor: colorData.hex_code }}
        ></div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-white pt-10">
          Welcome, {session?.user?.name || 'Guardian'}!
        </h1>
        
        <p className="text-xl text-white/80">
          You have been bestowed with your first color:
        </p>
        
        <div className="py-4">
          <h2 className="text-6xl font-black text-white tracking-tight" style={{ textShadow: '2px 2px 10px rgba(0,0,0,0.5)' }}>
            {colorData.name}
          </h2>
          <p className="font-mono text-2xl text-white/70 mt-2">{colorData.hex_code}</p>
        </div>
        
        <p className="text-md text-white/80">
          This color is now yours. It marks the beginning of your journey in ColorVerse.
        </p>
        
        <Link href="/dashboard" className="inline-block px-8 py-3 text-lg font-semibold text-white bg-purple-600 rounded-full hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105">
          Go to Your Dashboard
        </Link>
      </div>
    </div>
  );
}