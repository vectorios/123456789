// app/api/auth/[...nextauth]/route.ts

import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';

// Initialisation du client Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Configuration exportable pour NextAuth, réutilisable dans d'autres parties de l'application
export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Chercher l'utilisateur
        const { data: user } = await supabase
          .from('users')
          .select('*')
          .eq('email', credentials.email)
          .single();

        if (!user) {
          return null;
        }

        // Vérifier le mot de passe
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password_hash);

        if (!isPasswordValid) {
          return null;
        }

        // Renvoyer l'objet utilisateur si tout est correct
        return {
          id: user.id,
          email: user.email,
          name: user.username,
        };
      }
    })
  ],
  callbacks: {
    // Ce callback enrichit le token JWT avec l'ID de l'utilisateur
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    // Ce callback enrichit la session (accessible côté client) avec l'ID du token
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    // Redirige les utilisateurs vers notre page de connexion personnalisée
    signIn: '/connexion',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Création du handler NextAuth à partir des options
const handler = NextAuth(authOptions);

// Exportation du handler pour les méthodes GET et POST
export { handler as GET, handler as POST };