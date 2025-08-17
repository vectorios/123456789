// components/PurchaseButtonWrapper.tsx
'use client';

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import type { CreateOrderData, CreateOrderActions, OnApproveData, OnApproveActions } from "@paypal/paypal-js";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ListingProps {
  id: string;
  price: number;
  colors: { name: string } | null;
}

export default function PurchaseButtonWrapper({ listing }: { listing: ListingProps }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID_SANDBOX || "";

  const handleApprove = async (data: OnApproveData, actions: OnApproveActions) => {
    setIsProcessing(true);
    setError(null);
    try {
      await actions.order?.capture();
      const response = await fetch('/api/market/capture-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: data.orderID, listingId: listing.id })
      });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "La finalisation a échoué.");
      }
      alert(`Félicitations ! Vous êtes le nouveau gardien de ${listing.colors?.name} !`);
      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setIsProcessing(false);
    }
  };

  if (!paypalClientId) {
    return <div>Configuration de paiement invalide.</div>;
  }

  return (
    <div>
      {isProcessing && <p className="text-center text-lg">Finalisation...</p>}
      <div style={{ display: isProcessing ? 'none' : 'block' }}>
        <PayPalScriptProvider options={{ clientId: paypalClientId, currency: "EUR", intent: "capture" }}>
          <PayPalButtons
            style={{ layout: "vertical", color: "blue", shape: "rect", label: "pay" }}
            
            createOrder={(data: CreateOrderData, actions: CreateOrderActions) => {
              return actions.order.create({
                intent: 'CAPTURE',
                purchase_units: [{
                  // LA DESCRIPTION EST MAINTENANT ICI, AU MÊME NIVEAU QUE 'amount'
                  description: `Achat de la couleur ${listing.colors?.name || 'inconnue'} sur ColorVerse`, 
                  amount: {
                    value: listing.price.toString(),
                    currency_code: "EUR",
                  },
                }],
              });
            }}
            
            onApprove={handleApprove}

            onError={(err: any) => {
              console.error("Erreur PayPal:", err);
              setError("Une erreur PayPal est survenue. Veuillez réessayer.");
            }}
          />
        </PayPalScriptProvider>
      </div>
      {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
    </div>
  );
}