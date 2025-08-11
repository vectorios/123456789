// Fichier : app/api/auth/[...nextauth]/route.ts (C'EST LE FICHIER À REMPLACER)

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // On importe la grosse configuration

// Ce fichier ne fait plus qu'une seule chose : créer le handler. C'est ce que Vercel veut.
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };