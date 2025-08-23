// app/api/paypal/connect/route.ts
import { NextResponse } from 'next/server';

// Cette route génère un lien de connexion spécial et y redirige l'utilisateur.
// Dans une vraie application, on utiliserait le SDK PayPal pour générer un lien plus complexe.
export async function GET() {
  // Ceci est un exemple. Le vrai lien de connexion PayPal est plus complexe
  // et nécessite de spécifier une `redirect_uri` qui pointe vers votre callback.
  const payPalConnectUrl = `https://www.sandbox.paypal.com/bizsignup/partner/entry?partnerId=VOTRE_PARTNER_ID&partnerClientId=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID_SANDBOX}&returnToPartnerUrl=${process.env.NEXTAUTH_URL}/dashboard`;

  // On redirige l'utilisateur vers la page d'autorisation de PayPal
  return NextResponse.redirect(payPalConnectUrl);
}