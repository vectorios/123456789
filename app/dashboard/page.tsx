// app/dashboard/page.tsx (MAINTENANT UN SERVER COMPONENT)

import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { createClient } from '@supabase/supabase-js'
import { authOptions } from "@/lib/auth";
import GalleryClient, { OwnedColor } from "@/components/GalleryClient"; // On importe notre nouveau composant
import { LogoutButton } from "@/components/LogoutButton";

// Ce client est maintenant sûr car il n'est utilisé que sur le serveur
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// La fonction de récupération des données est maintenant ici, sur le serveur
async function getUserColors(userId: string): Promise<OwnedColor[]> {
  const { data, error } = await supabase
    .from('colors')
    .select('id, hex_code, name, is_for_sale')
    .eq('owner_id', userId)
    .order('id', { ascending: true });
  
  if (error) {
    console.error("Erreur serveur de récupération des couleurs:", error);
    return [];
  }
  return data;
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions); 

  if (!session || !session.user) {
    redirect('/connexion'); 
  }

  const userId = session.user.id;
  const initialColors = await getUserColors(userId);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">Votre Galerie</h1>
          <p className="text-neutral-400">Gardien : {session.user.name}</p>
        </div>
        <LogoutButton />
      </header>
      
      {/* On passe les données initiales à notre composant client */}
      <GalleryClient initialColors={initialColors} />
    </div>
  );
}