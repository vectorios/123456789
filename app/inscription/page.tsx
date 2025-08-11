// app/inscription/page.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react'; // Importez la fonction signIn

// Schéma de validation avec Zod
const formSchema = z.object({
  username: z.string().min(3, "Le nom d'utilisateur doit faire au moins 3 caractères.").max(20),
  email: z.string().email("L'adresse email est invalide."),
  password: z.string().min(8, "Le mot de passe doit faire au moins 8 caractères."),
});

type FormData = z.infer<typeof formSchema>;

export default function InscriptionPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Étape 1 : Créer l'utilisateur via notre API
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Une erreur s'est produite lors de la création.");
      }
      
      // Étape 2 : Connecter l'utilisateur automatiquement !
      const signInResponse = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false, // Très important : on gère la redirection nous-mêmes
      });

      if (signInResponse?.error) {
        // Si la connexion échoue (très peu probable si l'inscription a réussi)
        throw new Error("Erreur lors de la connexion automatique après inscription.");
      }

      // Étape 3 : Rediriger vers la page de bienvenue
      const colorHex = result.color_hex.replace('#', '');
      router.push(`/bienvenue/${colorHex}`);

    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-[#0A0A0A]">
      <div className="w-full max-w-md p-8 space-y-6 bg-[#181818] rounded-lg shadow-2xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Le Rituel d'Attribution</h1>
          <p className="text-neutral-400">Préparez-vous à recevoir votre couleur.</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-neutral-300">Nom de Gardien</label>
            <input type="text" {...register('username')} className="w-full px-3 py-2 mt-1 bg-[#222] border border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
          </div>
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
          
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          
          <button type="submit" disabled={isLoading} className="w-full py-3 font-semibold bg-purple-600 rounded-md hover:bg-purple-700 disabled:bg-neutral-600 disabled:cursor-not-allowed transition-colors">
            {isLoading ? 'Attribution en cours...' : 'Dévoiler ma Couleur'}
          </button>
        </form>
      </div>
    </div>
  );
}