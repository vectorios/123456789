// app/dashboard/page.tsx
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { createClient } from '@supabase/supabase-js'
import Link from "next/link";
import { LogoutButton } from "@/components/LogoutButton";
import { authOptions } from "../api/auth/[...nextauth]/route"; // Importez les options

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface OwnedColor {
  id: number;
  hex_code: string;
  name: string;
  is_for_sale: boolean;
}

async function getUserColors(userId: string): Promise<OwnedColor[]> {
  console.log("DASHBOARD: Recherche des couleurs pour l'utilisateur ID:", userId); // Log de débogage
  const { data, error } = await supabase
    .from('colors')
    .select('id, hex_code, name, is_for_sale')
    .eq('owner_id', userId)
    .order('id', { ascending: true });
  
  if (error) {
    console.error("DASHBOARD: Erreur Supabase:", error);
    return [];
  }
  return data;
}

export default async function DashboardPage() {
  // UTILISEZ LES OPTIONS ICI
  const session = await getServerSession(authOptions); 

  if (!session || !session.user) {
    redirect('/connexion'); 
  }

  // Avec les authOptions, session.user.id est maintenant garanti d'exister si la session est valide.
  const userId = session.user.id;
  const colors = await getUserColors(userId);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">Votre Galerie</h1>
          <p className="text-neutral-400">Gardien : {session.user.name}</p>
        </div>
        <LogoutButton />
      </header>
      
      {colors.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-neutral-500">Vous ne possédez aucune couleur pour le moment.</p>
          <Link href="/marche" className="mt-4 inline-block text-purple-400 hover:text-purple-300">
            Explorer le Marché
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {colors.map((color) => (
            <div 
              key={color.id} 
              className="aspect-square rounded-lg shadow-lg flex flex-col justify-end p-4 transition-transform hover:scale-105"
              style={{ backgroundColor: color.hex_code }}
            >
              <div className="bg-black/50 backdrop-blur-sm p-2 rounded-md">
                <h3 className="font-bold text-white truncate">{color.name}</h3>
                <p className="text-sm text-neutral-200 font-mono">{color.hex_code}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}