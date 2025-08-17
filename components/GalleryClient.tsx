// components/GalleryClient.tsx
'use client'; // Ce composant est interactif

import { useState } from 'react';
import Link from 'next/link';

// Le type est défini ici pour être partagé
export interface OwnedColor {
  id: number;
  hex_code: string;
  name: string;
  is_for_sale: boolean;
}  

// Le composant SellModal est déplacé ici
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
      <div className="bg-[#181818] p-8 rounded-lg w-full max-w-md">
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
            className="w-full p-2 bg-[#222] border border-neutral-700 rounded-md"
            required
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <div className="flex justify-end gap-4 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-neutral-700">Annuler</button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 rounded-md bg-purple-600">
              {isLoading ? 'Mise en vente...' : 'Confirmer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Le composant principal qui reçoit les couleurs en props
export default function GalleryClient({ initialColors }: { initialColors: OwnedColor[] }) {
  const [colors, setColors] = useState(initialColors);
  const [selectedColor, setSelectedColor] = useState<OwnedColor | null>(null);
  
  // Fonction pour recharger les couleurs, maintenant via une API dédiée
  const refreshColors = async () => {
      const response = await fetch('/api/user/colors');
      if(response.ok) {
          const data = await response.json();
          setColors(data);
      }
  };

  return (
    <>
      {colors.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-neutral-500">Vous ne possédez aucune couleur pour le moment.</p>
          <Link href="/marche" className="mt-4 inline-block text-purple-400">Explorer le Marché</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {colors.map((color) => (
            <div 
              key={color.id} 
              className="aspect-square rounded-lg shadow-lg flex flex-col justify-end p-4 relative group"
              style={{ backgroundColor: color.hex_code }}
            >
              <div className="bg-black/50 backdrop-blur-sm p-2 rounded-md z-10">
                <h3 className="font-bold text-white truncate">{color.name}</h3>
                <p className="text-sm text-neutral-200 font-mono">{color.hex_code}</p>
              </div>
              {!color.is_for_sale ? (
                <button 
                  onClick={() => setSelectedColor(color)}
                  className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  Vendre
                </button>
              ) : (
                <div className="absolute top-2 right-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded z-20">
                  En vente
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedColor && (
        <SellModal 
          color={selectedColor} 
          onClose={() => setSelectedColor(null)}
          onListingSuccess={refreshColors}
        />
      )}
    </>
  );
}