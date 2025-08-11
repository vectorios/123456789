// app/api/market/capture-order/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";
import * as z from 'zod';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const { PAYPAL_CLIENT_ID_SANDBOX, PAYPAL_SECRET_KEY_SANDBOX } = process.env;
const PAYPAL_API_BASE = "https://api-m.sandbox.paypal.com";

async function getPayPalAccessToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID_SANDBOX}:${PAYPAL_SECRET_KEY_SANDBOX}`).toString("base64");
  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: { "Authorization": `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials",
  });
  const data = await response.json();
  return data.access_token;
}

const captureSchema = z.object({ orderId: z.string(), listingId: z.string().uuid() });

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const { orderId, listingId } = captureSchema.parse(await req.json());
    const accessToken = await getPayPalAccessToken();
    const captureResponse = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${accessToken}`, "Content-Type": "application/json" },
    });
    const paypalData = await captureResponse.json();

    if (paypalData.status !== 'COMPLETED') {
      return NextResponse.json({ error: "Paiement PayPal non finalisé." }, { status: 400 });
    }

    const paidAmount = parseFloat(paypalData.purchase_units[0].payments.captures[0].amount.value);
    const { error } = await supabase.rpc('transfer_color_ownership', {
      p_listing_id: listingId,
      p_buyer_id: session.user.id,
      p_price: paidAmount,
      p_paypal_order_id: orderId,
    });
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Erreur interne." }, { status: 500 });
  }
}