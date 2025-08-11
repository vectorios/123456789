// app/actions/dashboardActions.ts
'use server'; // Magie ! Cette ligne déclare que toutes les fonctions ici sont des Server Actions

import { createClient } from '@supabase/supabase-js';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// On ne peut créer le client Supabase que dans des fonctions serveur, pas au niveau global.
function createSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// Interface pour typer les données que nous allons renvoyer
export interface OwnedColor {
  id: number;
  hex_code: string;
  name: string;
  is_for_sale: boolean;
}

export async function getMyColors(): Promise<OwnedColor[]> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    console.error("getMyColors Action: Non autorisé ou session invalide.");
    return [];
  }

  const supabase = createSupabaseClient();
  const userId = session.user.id;

  const { data, error } = await supabase
    .from('colors')
    .select('id, hex_code, name, is_for_sale')
    .eq('owner_id', userId)
    .order('id', { ascending: true });

  if (error) {
    console.error("Erreur dans getMyColors Action:", error);
    return [];
  }

  return data;
}