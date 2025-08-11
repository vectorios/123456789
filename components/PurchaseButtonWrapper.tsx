// components/PurchaseButtonWrapper.tsx
'use client';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ListingProps { id: string; price: number; colors: { name: string; } | null; }

export default function PurchaseButtonWrapper({ listing }: { listing: ListingProps }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID_SANDBOX || "";

  const handleApprove = async (data: any) => {
    setIsProcessing(true);
    setError(null);
    const response = await fetch('/api/market/capture-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: data.orderID, listingId: listing.id })
    });
    if (!response.ok) {
      const result = await response.json();
      setError(result.error || "La finalisation a échoué.");
      setIsProcessing(false);
    } else {
      alert(`Félicitations ! Vous êtes le nouveau gardien de ${listing.colors?.name} !`);
      router.push('/dashboard');
      router.refresh();
    }
  };

  return (
    <div>
      {isProcessing && <p>Finalisation de la transaction...</p>}
      <div style={{ display: isProcessing ? 'none' : 'block' }}>
        <PayPalScriptProvider options={{ clientId: paypalClientId, currency: "EUR", intent: "capture" }}>
          <PayPalButtons
            style={{ layout: "vertical", color: "blue" }}
            createOrder={(data, actions) => actions.order.create({
              purchase_units: [{
                amount: { value: listing.price.toString() },
                description: `Achat de la couleur ${listing.colors?.name}`,
              }],
            })}
            onApprove={handleApprove}
            onError={(err) => setError("Erreur PayPal.")}
          />
        </PayPalScriptProvider>
      </div>
      {error && <p className="text-red-400 mt-4">{error}</p>}
    </div>
  );
}