// app/marketplace/page.tsx

import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

// Initialisation du client Supabase pour les Server Components publics
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Interface pour définir la structure des données d'une annonce
// Cette structure correspondra à ce que nous attendons après le traitement.
interface Listing {
  id: string;
  price: number;
  colors: { // Les données de la couleur associée
    hex_code: string;
    name: string;
    influence_score: number; // Assurez-vous que cette colonne existe dans votre table 'colors'
  } | null; // 'null' est possible avant le filtrage
}

// Fonction asynchrone pour récupérer les annonces actives du marché
async function getActiveListings(): Promise<Listing[]> {
  console.log("MARKETPLACE API: Tentative de récupération directe des annonces...");
  const { data, error } = await supabase
    .from('market_listings') // Accède directement à la table des annonces
    .select(`
      id,
      price,
      colors ( hex_code, name, influence_score )
    `) // Demande les données de l'annonce et joint les données de la couleur associée
    .eq('is_active', true) // Filtre les annonces actives
    .eq('listing_type', 'fixed_price') // Filtre les annonces à prix fixe
    .order('created_at', { ascending: false }); // Trie par date de création (les plus récentes en premier)

  // Gère le cas d'une erreur de communication avec Supabase ou si aucune donnée n'est retournée
  if (error || !data) {
    console.error("MARKETPLACE API: Erreur de récupération des annonces ou aucune donnée retournée:", error);
    return []; // Retourne un tableau vide en cas de problème
  }

  // === CORRECTION FINALE DU TYPE : Traitement des données pour correspondre à l'interface ===
  // Map sur les données brutes reçues de Supabase.
  // TypeScript perçoit initialement 'colors' comme un tableau d'objets ou 'null' car il s'agit d'une jointure.
  // Nous le transformons explicitement en un seul objet 'colors' ou 'null'.
  const typedListings: Listing[] = data.map((item: any) => ({
    id: item.id,
    price: item.price,
    // Conditionnellement, crée l'objet 'colors' si 'item.colors' n'est pas null
    // (item.colors peut être un tableau ici en interne pour TS, ou l'objet attendu par notre logique)
    colors: item.colors ? {
      hex_code: item.colors.hex_code,
      name: item.colors.name,
      influence_score: item.colors.influence_score
    } : null // Définit 'colors' à null si la jointure n'a pas trouvé de couleur ou si elle est vide
  // Filtre les éléments où 'colors' est explicitement null.
  // Le 'as Listing[]' final rassure TypeScript sur le type du tableau résultant.
  })).filter(listing => listing.colors !== null) as Listing[];

  console.log("MARKETPLACE API: Annonces récupérées et filtrées:", typedListings.length, typedListings);
  return typedListings;
}


// Le composant principal de la page du marché
// Renommé 'MarketplacePage' pour correspondre au dossier '/marketplace' et éviter toute confusion.
export default async function MarketplacePage() {
  const listings = await getActiveListings(); // Récupère les annonces

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold">L'Arène Économique</h1>
        <p className="text-neutral-400 mt-2">Là où la valeur des couleurs se révèle. Achetez, vendez, collectionnez.</p>
      </header>

      {listings.length === 0 ? ( // Condition si aucune annonce n'est disponible
        <div className="text-center py-20">
          <p className="text-xl text-neutral-500">Le marché est calme pour le moment. Aucune couleur n'est en vente.</p>
        </div>
      ) : ( // Affichage de la grille des annonces si des couleurs sont en vente
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {listings.map((listing) => (
            // Lien vers la page de détail de l'annonce.
            // Le '!' après 'colors' est sûr car nous avons filtré les 'null' précédemment.
            <Link key={listing.id} href={`/marketplace/${listing.id}`} className="group">
              <div 
                className="aspect-square rounded-lg shadow-lg flex flex-col justify-end p-4 transition-transform group-hover:scale-105"
                style={{ backgroundColor: listing.colors!.hex_code }} // Affiche la couleur de l'annonce
              >
                <div className="bg-black/50 backdrop-blur-sm p-2 rounded-md">
                  <h3 className="font-bold text-white truncate">{listing.colors!.name}</h3>
                  <p className="text-sm text-green-400 font-semibold">
                    {listing.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                  </p>
                  {/* Affiche le score d'influence si la propriété existe et n'est pas undefined */}
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