// app/api/market/sell/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";
import * as z from 'zod';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const sellSchema = z.object({
  colorId: z.number(),
  price: z.number().min(0.50),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const body = await req.json();
    const { colorId, price } = sellSchema.parse(body);
    const { data, error } = await supabase.rpc('create_market_listing', {
      p_color_id: colorId,
      p_seller_id: session.user.id,
      p_price: price,
    });
    if (error) throw error;
    return NextResponse.json({ success: true, listing: data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Erreur interne." }, { status: 500 });
  }
}