// app/bienvenue/[colorHex]/page.tsx
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// On peut utiliser le client Supabase directement dans les Server Components
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type Props = {
  params: {
    colorHex: string;
  };
};

// Fonction pour récupérer les données de la couleur
async function getColorData(hex: string) {
  const { data, error } = await supabase
    .from('colors')
    .select('name, hex_code')
    .eq('hex_code', `#${hex}`)
    .single();
  
  if (error || !data) {
    return null;
  }
  return data;
}

export default async function BienvenuePage({ params }: Props) {
  const colorData = await getColorData(params.colorHex);

  if (!colorData) {
    notFound(); // Affiche une page 404 si la couleur n'existe pas
  }

  const backgroundColor = colorData.hex_code;

  // Calculer si le texte doit être noir ou blanc pour une bonne lisibilité
  const getTextColor = (hex: string) => {
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? 'text-black' : 'text-white';
  };

  const textColorClass = getTextColor(backgroundColor);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-8 text-center transition-colors duration-500"
      style={{ backgroundColor: backgroundColor }}
    >
      <div className={`z-10 p-10 rounded-lg bg-black/20 backdrop-blur-sm`}>
        <p className={`${textColorClass} text-2xl`}>Bienvenue, Gardien.</p>
        <h1 className={`${textColorClass} text-6xl md:text-8xl font-bold my-4`}>
          {colorData.name}
        </h1>
        <p className={`${textColorClass} text-3xl font-mono`}>{colorData.hex_code}</p>

        <div className="mt-12">
          <Link
            href="/dashboard" // L'utilisateur ira ensuite sur son profil/dashboard
            className={`px-8 py-4 font-semibold rounded-lg transition-transform transform hover:scale-105 ${
              textColorClass === 'text-white' ? 'bg-white text-black' : 'bg-black text-white'
            }`}
          >
            Découvrir ma Galerie
          </Link>
        </div>
      </div>
    </div>
  );
}