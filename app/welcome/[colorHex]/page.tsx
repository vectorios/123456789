// app/welcome/[colorHex]/page.tsx

import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import WelcomeUI from './WelcomeUI'; // On importe notre nouveau composant client !

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type Props = {
  params: {
    colorHex: string;
  };
};

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

// Le composant serveur, maintenant simple et propre.
export default async function WelcomePage({ params }: Props) {
  const colorData = await getColorData(params.colorHex);

  if (!colorData) {
    notFound();
  }

  // Il n'affiche rien lui-même, il passe juste les données au composant client.
  return <WelcomeUI colorData={colorData} />;
}