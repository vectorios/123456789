// app/marche/page.tsx

import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// L'interface reste la même, car c'est la structure que nous voulons.
interface Listing {
  id: string;
  price: number;
  colors: {
    hex_code: string;
    name: string;
  } | null;
}

// Fonction asynchrone pour récupérer les annonces actives de la base de données
async function getActiveListings(): Promise<Listing[]> {
  const { data, error } = await supabase
    .from('market_listings')
    .select(`id, price, colors ( hex_code, name )`)
    .eq('is_active', true)
    .eq('listing_type', 'fixed_price')
    .order('created_at', { ascending: false });

  if (error || !data) {
    console.error("Erreur de récupération des annonces du marché:", error);
    return [];
  }

  // === CORRECTION FINALE ===
  // On "cast" les données pour dire à TypeScript de faire confiance à notre interface `Listing`.
  // L'erreur de type va disparaître.
  const typedData = data as any as Listing[];

  // On peut maintenant filtrer en toute sécurité.
  return typedData.filter(listing => listing.colors);
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
            <Link key={listing.id} href={`/marche/${listing.id}`} className="group">
              <div 
                className="aspect-square rounded-lg shadow-lg flex flex-col justify-end p-4 transition-transform group-hover:scale-105"
                style={{ backgroundColor: listing.colors!.hex_code }}
              >
                <div className="bg-black/50 backdrop-blur-sm p-2 rounded-md">
                  <h3 className="font-bold text-white truncate">{listing.colors!.name}</h3>
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