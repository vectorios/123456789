// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcrypt'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // 1. Chercher l'utilisateur dans la base de données
        const { data: user, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', credentials.email)
          .single();

        if (!user) {
          return null; // Utilisateur non trouvé
        }

        // 2. Vérifier le mot de passe
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password_hash);

        if (!isPasswordValid) {
          return null; // Mot de passe incorrect
        }

        // 3. Renvoyer l'objet utilisateur (sans le hash du mot de passe)
        return {
          id: user.id,
          email: user.email,
          name: user.username,
        };
      }
    })
  ],
  callbacks: {
    // Le callback 'jwt' est appelé avant le callback 'session'
    jwt: async ({ token, user }) => {
      // Si l'objet 'user' existe (il n'existe que lors de la connexion initiale),
      // on ajoute son ID au token.
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    // Le callback 'session' est appelé pour construire l'objet session
    // qui sera accessible côté client.
    session: async ({ session, token }) => {
      // On ajoute l'ID du token (que nous avons défini dans le callback 'jwt')
      // à l'objet session.
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/connexion', // On créera cette page plus tard
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST }