// Cette route génère un lien d'inscription unique pour l'utilisateur.
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Le `tracking_id` est crucial. C'est comme ça qu'on saura à quel utilisateur
  // appartient la connexion quand PayPal nous renverra l'information.
  const trackingId = session.user.id;

  const partnerId = process.env.PAYPAL_PARTNER_ID_SANDBOX;
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID_SANDBOX;
  const returnUrl = `${process.env.NEXTAUTH_URL}/api/paypal/callback`;
  
  const actionRenewalUrl = new URL('https://www.sandbox.paypal.com/bizsignup/partner/entry');
  actionRenewalUrl.searchParams.set('partnerId', partnerId!);
  actionRenewalUrl.searchParams.set('partnerClientId', clientId!);
  actionRenewalUrl.searchParams.set('returnToPartnerUrl', returnUrl);
  actionRenewalUrl.searchParams.set('integrationType', 'FO');
  actionRenewalUrl.searchParams.set('features', 'PAYMENT,REFUND');
  actionRenewalUrl.searchParams.set('partnerMemo', 'Connect your account to receive payouts from ColorVerse.');
  actionRenewalUrl.searchParams.set('displayMode', 'minibrowser');
  actionRenewalUrl.searchParams.set('tracking_id', trackingId);

  return NextResponse.json({ connectUrl: actionRenewalUrl.href });
}