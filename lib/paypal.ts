// Ce fichier gère la communication directe et sécurisée avec l'API PayPal.
// Il ne doit être utilisé que côté serveur.

// Fonction pour obtenir un jeton d'accès de base pour PayPal
async function getPayPalAccessToken() {
  const auth = Buffer.from(
    `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID_SANDBOX}:${process.env.PAYPAL_SECRET_KEY_SANDBOX}`
  ).toString('base64');
  
  const response = await fetch(`${process.env.PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  return data.access_token;
}

// Fonction pour obtenir les informations d'un marchand à partir d'un tracking ID
export async function getSellerInfo(trackingId: string) {
  const accessToken = await getPayPalAccessToken();

  const response = await fetch(`${process.env.PAYPAL_API_BASE}/v1/customer/partners/${process.env.PAYPAL_PARTNER_ID_SANDBOX}/merchant-integrations?tracking_id=${trackingId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    }
  });

  if (!response.ok) {
    throw new Error('Failed to retrieve merchant information from PayPal.');
  }
  
  const data = await response.json();
  return data;
}

// URL de base de l'API PayPal (Sandbox)
process.env.PAYPAL_API_BASE = 'https://api-m.sandbox.paypal.com';
// Votre ID de Partenaire (à obtenir sur votre dashboard développeur PayPal)
process.env.PAYPAL_PARTNER_ID_SANDBOX = 'YOUR_PARTNER_ID'; // Remplacez par votre vrai Partner ID