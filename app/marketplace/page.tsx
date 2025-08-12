// app/marketplace/page.tsx

import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Interface pour définir la structure des données d'une annonce (comme avant)
interface Listing {
  id: string;
  price: number;
  colors: { // Les données de la couleur associée, jointes par Supabase
    hex_code: string;
    name: string;
    influence_score: number; // Ajouté si vous voulez l'afficher
  } | null;
}

// Fonction asynchrone pour récupérer les annonces actives (REVUE SANS FONCTION SQL)
async function getActiveListings(): Promise<Listing[]> {
  console.log("MARKETPLACE API: Tentative de récupération directe des annonces...");
  const { data, error } = await supabase
    .from('market_listings') // Directement de la table des annonces
    .select(`
      id,
      price,
      colors ( hex_code, name, influence_score )
    `) // On sélectionne les champs et on demande à joindre les données de la table 'colors'
    .eq('is_active', true) // Uniquement les annonces actives
    .eq('listing_type', 'fixed_price') // Uniquement les ventes à prix fixe
    .order('created_at', { ascending: false }); // On trie par les plus récentes

  if (error || !data) {
    console.error("MARKETPLACE API: Erreur de récupération directe des annonces ou aucune donnée:", error);
    return [];
  }

  // Filtrage pour s'assurer que chaque annonce a bien des données de couleur
  const filteredData = data.filter((listing): listing is Listing => listing.colors !== null);
  console.log("MARKETPLACE API: Annonces récupérées et filtrées (directe):", filteredData.length, filteredData);
  return filteredData;
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
            <Link key={listing.id} href={`/marketplace/${listing.id}`} className="group">
              <div 
                className="aspect-square rounded-lg shadow-lg flex flex-col justify-end p-4 transition-transform group-hover:scale-105"
                style={{ backgroundColor: listing.colors!.hex_code }}
              >
                <div className="bg-black/50 backdrop-blur-sm p-2 rounded-md">
                  <h3 className="font-bold text-white truncate">{listing.colors!.name}</h3>
                  <p className="text-sm text-green-400 font-semibold">
                    {listing.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                  </p>
                  {listing.colors!.influence_score !== undefined && (
                    <p className="text-xs text-cyan-300">Influence: {listing.colors!.influence_score}</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}