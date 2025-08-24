// app/inscription/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
// CHANGEMENT : framer-motion a été retiré

const getRandomHexColor = () => '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');

const Shape = ({ shape, color, size }: { shape: string; color: string; size: number }) => {
  const style = { width: size, height: size };
  switch (shape) {
    case 'square': return <div style={{ ...style, backgroundColor: color }} />;
    case 'circle': return <div style={{ ...style, backgroundColor: color, borderRadius: '50%' }} />;
    case 'triangle': return <div style={{ width: 0, height: 0, borderLeft: `${size / 2}px solid transparent`, borderRight: `${size / 2}px solid transparent`, borderBottom: `${size}px solid ${color}` }} />;
    default: return null;
  }
};

// CHANGEMENT : L'animation des particules a été retirée pour garantir la compilation
const ParticleBackground = ({ count = 150 }) => {
  const particles = useMemo(() => {
    const shapes = ['square', 'circle', 'triangle'];
    const uniqueColors = new Set<string>();
    while (uniqueColors.size < count) { uniqueColors.add(getRandomHexColor()); }
    const colors = Array.from(uniqueColors);

    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      color: colors[i],
      size: Math.random() * 6 + 4,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
    }));
  }, [count]);

  return (
    <div className="absolute inset-0 z-0 h-full w-full overflow-hidden opacity-50">
      {particles.map(p => (
        <div key={p.id} className="absolute" style={{ top: p.top, left: p.left }}>
          <Shape shape={p.shape} color={p.color} size={p.size} />
        </div>
      ))}
    </div>
  );
};

const formSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters.").max(20, "Username must be 20 characters or less."),
  email: z.string().email("Invalid email address."),
  password: z.string().min(8, "Password must be at least 8 characters long."),
});

type FormData = z.infer<typeof formSchema>;

export default function SignUpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "An error occurred during creation.");
      }
      const signInResponse = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (signInResponse?.error) {
        throw new Error("Error during automatic sign-in after registration.");
      }
      const colorHex = result.color_hex.replace('#', '');
      router.push(`/welcome/${colorHex}`);
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 sm-p-6 lg:p-8">
      {/* CHANGEMENT : <motion.div> remplacé par <div> */}
      <div className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl grid grid-cols-1 md:grid-cols-2">
        <div className="relative hidden flex-col justify-center bg-slate-900 p-12 text-white md:flex">
          <ParticleBackground />
          <div className="relative z-10">
            <h2 className="text-4xl font-bold tracking-tight">Your Universe Awaits.</h2>
            <p className="mt-4 text-lg text-slate-300">Complete the ritual to be granted your unique, foundational color.</p>
          </div>
        </div>
        <div className="flex flex-col justify-center p-8 sm:p-12">
          <div className="text-left">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Become a Guardian</h1>
            <p className="mt-2 text-slate-600">Claim your first color and start your collection.</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <div>
              <label className="text-sm font-medium text-slate-700">Guardian Name</label>
              <input 
                type="text" 
                {...register('username')} 
                className="w-full px-4 py-3 mt-1 bg-slate-100 border border-slate-200 rounded-lg text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                placeholder="e.g., Chromatic_King"
              />
              {errors.username && <p className="text-red-600 text-xs mt-1">{errors.username.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Email</label>
              <input 
                type="email" 
                {...register('email')} 
                className="w-full px-4 py-3 mt-1 bg-slate-100 border border-slate-200 rounded-lg text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')} 
                  className="w-full px-4 py-3 mt-1 bg-slate-100 border border-slate-200 rounded-lg text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 transition pr-12"
                  placeholder="8+ characters"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 hover:text-purple-600">
                  {showPassword ? (
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a9.97 9.97 0 01-1.563 3.029m0 0l-2.147-2.147" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
              {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password.message}</p>}
            </div>
            {error && <p className="bg-red-100 text-red-700 text-sm text-center p-3 rounded-lg">{error}</p>}
            <button type="submit" disabled={isLoading} className="w-full py-3 font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900">
              {isLoading ? 'Attribution in Progress...' : 'Reveal My Color'}
            </button>
          </form>
          <p className="mt-8 text-center text-sm text-slate-600">
            Already a Guardian?{' '}
            <Link href="/connexion" className="font-medium text-purple-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}