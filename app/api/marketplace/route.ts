// app/api/marketplace/route.ts

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialisation du client Supabase pour les routes API (utilise les clés sécurisées du serveur)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Important: Utilise la clé de service pour les accès serveur
);

// Interface pour la structure des données
interface Listing {
  id: string;
  price: number;
  colors: {
    hex_code: string;
    name: string;
    influence_score: number;
  } | null;
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('market_listings')
      .select(`id, price, colors ( hex_code, name, influence_score )`)
      .eq('is_active', true)
      .eq('listing_type', 'fixed_price')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Erreur Supabase dans /api/marketplace:", error);
      throw new Error(error.message);
    }

    if (!data) {
      return NextResponse.json([]);
    }
    
    // Filtre pour s'assurer qu'il n'y a pas d'annonces sans couleur associée
    const validListings = data.filter(listing => listing.colors);

    return NextResponse.json(validListings);

  } catch (error: any) {
    console.error("Erreur interne API /marketplace:", error);
    return NextResponse.json({ error: "Une erreur interne est survenue.", details: error.message }, { status: 500 });
  }
}