// app/api/user/colors/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  // 1. Sécurité : Vérifier la session de l'utilisateur qui fait la demande
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const userId = session.user.id;

    // 2. Aller chercher les couleurs dans la base de données
    const { data, error } = await supabase
      .from('colors')
      .select('id, hex_code, name, is_for_sale')
      .eq('owner_id', userId)
      .order('id', { ascending: true });

    if (error) {
      throw error;
    }

    // 3. Renvoyer les données
    return NextResponse.json(data);

  } catch (error) {
    console.error("Erreur API /user/colors:", error);
    return NextResponse.json({ error: "Une erreur interne est survenue." }, { status: 500 });
  }
}