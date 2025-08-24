// app/welcome/[colorHex]/page.tsx

import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import WelcomeUI from './WelcomeUI';

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

// CORRECTION : La fonction est maintenant explicitement 'async'
// et renvoie un type que Next.js/Vercel comprendra à coup sûr.
export default async function WelcomePage({ params }: Props) {
  const colorData = await getColorData(params.colorHex);

  if (!colorData) {
    notFound();
  }

  // On renvoie simplement le composant UI avec les données.
  return <WelcomeUI colorData={colorData} />;
}