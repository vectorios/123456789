// app/dashboard/page.tsx
'use client'; 

import { useState, useEffect, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Le type est maintenant local car l'action a été supprimée
interface OwnedColor {
  id: number;
  hex_code: string;
  name: string;
  is_for_sale: boolean;
}

// Le composant SellModal ne change pas
function SellModal({ color, onClose, onListingSuccess }: { color: OwnedColor, onClose: () => void, onListingSuccess: () => void }) {
  const [price, setPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const response = await fetch('/api/market/sell', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ colorId: color.id, price: parseFloat(price) })
    });

    const result = await response.json();
    setIsLoading(false);

    if (!response.ok) {
      setError(result.error || "Une erreur est survenue.");
    } else {
      onListingSuccess(); 
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-[#181818] p-8 rounded-lg w-full max-w-md animate-fade-in">
        <h2 className="text-2xl font-bold mb-2">Mettre en Vente</h2>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded" style={{ backgroundColor: color.hex_code }}></div>
          <div>
            <h3 className="font-semibold">{color.name}</h3>
            <p className="font-mono text-sm text-neutral-400">{color.hex_code}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-medium">Prix de vente (EUR)</label>
          <input 
            type="number" step="0.01" min="0.50" value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 bg-[#222] border border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            required placeholder="Ex: 10.50"
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <div className="flex justify-end gap-4 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-neutral-700 hover:bg-neutral-600 transition-colors">Annuler</button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-700 disabled:opacity-50 transition-colors">
              {isLoading ? 'Mise en vente...' : 'Confirmer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// === COMPOSANT PRINCIPAL : La page du Dashboard (version API Route) ===
export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [colors, setColors] = useState<OwnedColor[]>([]);
  const [isLoadingColors, setIsLoadingColors] = useState(true);
  const [selectedColor, setSelectedColor] = useState<OwnedColor | null>(null);

  // Utilisation de useCallback pour que la fonction ne soit pas recréée à chaque render
  const fetchColors = useCallback(async () => {
    setIsLoadingColors(true);
    try {
      const response = await fetch('/api/user/colors');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des couleurs');
      }
      const data = await response.json();
      setColors(data);
    } catch (error) {
      console.error(error);
      setColors([]); // En cas d'erreur, on vide le tableau
    } finally {
      setIsLoadingColors(false);
    }
  }, []); // La fonction n'a pas de dépendances

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/connexion');
      return;
    }
    // Si la session est prête, on lance la récupération
    fetchColors();
  }, [session, status, router, fetchColors]);

  if (status === 'loading' || !session) {
    return <div className="flex items-center justify-center min-h-screen">Vérification de la session...</div>;
  }
  
  return (
    <>
      <div className="container mx-auto p-4 md:p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">Votre Galerie</h1>
            <p className="text-neutral-400">Gardien : {session.user.name}</p>
          </div>
          <button onClick={() => signOut({ callbackUrl: '/' })} className="px-4 py-2 bg-neutral-800 text-white font-semibold rounded-lg hover:bg-neutral-700 transition-colors">
            Déconnexion
          </button>
        </header>
        
        {isLoadingColors ? (
          <div className="text-center py-20">Chargement de vos couleurs...</div>
        ) : colors.length === 0 ? (
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
                className="aspect-square rounded-lg shadow-lg flex flex-col justify-end p-4 relative overflow-hidden group"
                style={{ backgroundColor: color.hex_code }}
              >
                <div className="bg-black/50 backdrop-blur-sm p-2 rounded-md z-10">
                  <h3 className="font-bold text-white truncate">{color.name}</h3>
                  <p className="text-sm text-neutral-200 font-mono">{color.hex_code}</p>
                </div>
                {!color.is_for_sale ? (
                  <button onClick={() => setSelectedColor(color)} className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-20">Vendre</button>
                ) : (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded z-20">En vente</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedColor && (
        <SellModal 
          color={selectedColor} 
          onClose={() => setSelectedColor(null)}
          onListingSuccess={fetchColors} // Rafraîchit la liste après une vente réussie
        />
      )}
    </>
  );
}