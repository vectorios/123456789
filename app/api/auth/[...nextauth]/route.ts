// Fichier : app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // Il importe la configuration

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };