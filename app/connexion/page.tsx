// app/connexion/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

// Schéma de validation pour le formulaire de connexion
const formSchema = z.object({
  email: z.string().email("L'adresse email est invalide."),
  password: z.string().min(1, "Le mot de passe est requis."), // On ne vérifie pas la longueur ici, juste la présence
});

type FormData = z.infer<typeof formSchema>;

export default function ConnexionPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);

    // On utilise la fonction signIn de NextAuth
    const result = await signIn('credentials', {
      ...data,
      redirect: false, // On gère la redirection nous-mêmes pour afficher les erreurs
    });

    setIsLoading(false);

    if (result?.error) {
      // Si NextAuth renvoie une erreur (ex: "CredentialsSignin")
      setError("Email ou mot de passe incorrect.");
    } else if (result?.ok) {
      // Si la connexion réussit, on redirige vers le dashboard
      router.push('/dashboard');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-[#0A0A0A]">
      <div className="w-full max-w-md p-8 space-y-6 bg-[#181818] rounded-lg shadow-2xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Connexion du Gardien</h1>
          <p className="text-neutral-400">Accédez à votre galerie personnelle.</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-neutral-300">Email</label>
            <input type="email" {...register('email')} className="w-full px-3 py-2 mt-1 bg-[#222] border border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-300">Mot de Passe</label>
            <input type="password" {...register('password')} className="w-full px-3 py-2 mt-1 bg-[#222] border border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          
          {error && <p className="bg-red-900/50 text-red-300 text-sm text-center p-2 rounded-md">{error}</p>}
          
          <button type="submit" disabled={isLoading} className="w-full py-3 font-semibold bg-purple-600 rounded-md hover:bg-purple-700 disabled:bg-neutral-600 disabled:cursor-not-allowed transition-colors">
            {isLoading ? 'Connexion en cours...' : 'Entrer dans la Galerie'}
          </button>
        </form>

        <p className="text-center text-sm text-neutral-400">
          Pas encore Gardien ?{' '}
          <Link href="/inscription" className="font-medium text-purple-400 hover:underline">
            Recevez votre couleur
          </Link>
        </p>
      </div>
    </div>
  );
}