// components/LogoutButton.tsx
'use client';

import { signOut } from 'next-auth/react';

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })} // Déconnecte et redirige vers l'accueil
      className="px-4 py-2 bg-neutral-800 text-white font-semibold rounded-lg hover:bg-neutral-700 transition-colors"
    >
      Déconnexion
    </button>
  );
}