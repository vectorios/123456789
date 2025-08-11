// app/marche/[listingId]/page.tsx
import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import PurchaseButtonWrapper from '@/components/PurchaseButtonWrapper';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface ListingDetails {
  id: string;
  price: number;
  seller_id: string;
  colors: {
    name: string;
    hex_code: string;
    description: string | null;
    influence_score: number;
  } | null;
}

async function getListingDetails(listingId: string): Promise<ListingDetails | null> {
  const { data } = await supabase
    .from('market_listings')
    .select(`id, price, seller_id, colors ( name, hex_code, description, influence_score )`)
    .eq('id', listingId)
    .eq('is_active', true)
    .single();
  return data as ListingDetails | null;
}

export default async function ListingDetailPage({ params }: { params: { listingId:string } }) {
  const listing = await getListingDetails(params.listingId);
  const session = await getServerSession(authOptions);

  if (!listing || !listing.colors) notFound();

  const isOwner = session?.user?.id === listing.seller_id;

  return (
    <div className="min-h-screen" style={{ backgroundColor: listing.colors.hex_code }}>
      <div className="container mx-auto p-4 md:p-8 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-2xl bg-black/60 backdrop-blur-lg rounded-xl shadow-2xl p-8 text-white">
          <header className="text-center mb-6">
            <h1 className="text-5xl font-bold">{listing.colors.name}</h1>
            <p className="text-2xl font-mono text-neutral-300 mt-2">{listing.colors.hex_code}</p>
          </header>
          <div className="my-8 border-t border-neutral-700"></div>
          <div className="text-lg space-y-4">
            <p className="text-neutral-300">{listing.colors.description || "Aucune description."}</p>
            <div className="flex justify-between items-center">
              <p><span className="font-semibold text-neutral-400">Influence :</span> <span className="font-bold text-xl ml-2 text-cyan-400">{listing.colors.influence_score}</span></p>
              <p><span className="font-semibold text-neutral-400">Prix :</span> <span className="text-2xl font-bold text-green-400 ml-2">{listing.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span></p>
            </div>
          </div>
          <div className="mt-10 text-center">
            {isOwner ? (
              <div className="p-4 bg-yellow-900/50 text-yellow-300 rounded-md">C'est votre couleur.</div>
            ) : !session ? (
              <div className="p-4 bg-blue-900/50 text-blue-300 rounded-md">
                <Link href="/connexion" className="font-bold underline">Connectez-vous</Link> pour acheter.
              </div>
            ) : (
              <PurchaseButtonWrapper listing={listing} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}