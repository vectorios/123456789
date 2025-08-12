// app/api/user/colors/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Assurez-vous que ce chemin est correct
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const userId = session.user.id;

    const { data, error } = await supabase
      .from('colors')
      .select('id, hex_code, name, is_for_sale')
      .eq('owner_id', userId)
      .order('id', { ascending: true });

    if (error) {
      console.error("Erreur Supabase dans /api/user/colors:", error);
      throw error;
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error("Erreur interne API /user/colors:", error);
    return NextResponse.json({ error: "Une erreur interne est survenue." }, { status: 500 });
  }
}