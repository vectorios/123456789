// app/marketplace/page.tsx

import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Interface pour définir la structure des données retournées par la fonction SQL
// Notez que les noms des colonnes ici correspondent aux alias définis dans la fonction SQL
interface Listing {
  id: string;
  price: number;
  color_hex: string; // Vient de la fonction SQL
  color_name: string; // Vient de la fonction SQL
}

// Fonction asynchrone pour récupérer les annonces en appelant la fonction SQL
async function getActiveListings(): Promise<Listing[]> {
  console.log("MARKETPLACE API: Appel de la fonction SQL get_active_market_listings...");
  const { data, error } = await supabase.rpc('get_active_market_listings'); // APPEL DE LA FONCTION SQL

  if (error || !data) {
    console.error("MARKETPLACE API: Erreur lors de l'appel SQL ou aucune donnée retournée:", error);
    return [];
  }

  console.log("MARKETPLACE API: Annonces récupérées depuis la fonction SQL:", data.length, data);
  // Aucune autre filtration n'est nécessaire ici car la fonction SQL le fait déjà
  return data;
}


// Le composant principal de la page
export default async function MarchePage() {
  const listings = await getActiveListings();

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold">L'Arène Économique</h1>
        <p className="text-neutral-400 mt-2">Là où la valeur des couleurs se révèle. Achetez, vendez, collectionnez.</p>
      </header>

      {listings.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-neutral-500">Le marché est calme pour le moment. Aucune couleur n'est en vente.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {listings.map((listing) => (
            // Note: Le lien pointe vers /marketplace/[id]
            <Link key={listing.id} href={`/marketplace/${listing.id}`} className="group">
              <div 
                className="aspect-square rounded-lg shadow-lg flex flex-col justify-end p-4 transition-transform group-hover:scale-105"
                style={{ backgroundColor: listing.color_hex }} // Utilisation de color_hex
              >
                <div className="bg-black/50 backdrop-blur-sm p-2 rounded-md">
                  <h3 className="font-bold text-white truncate">{listing.color_name}</h3> {/* Utilisation de color_name */}
                  <p className="text-sm text-green-400 font-semibold">
                    {listing.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}