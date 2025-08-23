// app/marketplace/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/translations';

// --- Composant "Squelette" pour l'effet de chargement ---
const ListingCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-md border border-slate-200 animate-pulse">
    <div className="bg-slate-200 h-32 rounded-t-xl"></div>
    <div className="p-4 space-y-3">
      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
      <div className="h-3 bg-slate-200 rounded w-1/2"></div>
      <div className="h-5 bg-slate-200 rounded w-1/4"></div>
    </div>
  </div>
);

// --- Le Composant de la Page ---
export default function MarketplacePage() {
  const { currentLang } = useLanguage();
  const t = translations[currentLang] || translations.en;

  const [listings, setListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/marketplace');
        if (!response.ok) {
          throw new Error('Failed to fetch listings from the server.');
        }
        const data = await response.json();
        setListings(data);
      } catch (err: any) {
        setError(err.message);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchListings();
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50" dir={currentLang === 'ar' ? 'rtl' : 'ltr'}>
      <Navbar t={t} />

      <main className="container mx-auto p-4 md:p-8 flex-grow">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            {t.marketTitle}
          </h1>
          <p className="text-slate-500 mt-2">{t.marketSubtitle}</p>
        </motion.header>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {Array.from({ length: 10 }).map((_, index) => <ListingCardSkeleton key={index} />)}
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500 font-semibold">{t.errorMarket}</div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-slate-500">{t.marketEmpty}</p>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
          >
            {listings.map((listing) => (
              <motion.div key={listing.id} variants={cardVariants}>
                <Link href={`/marketplace/${listing.id}`} className="group block bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden h-full hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                  <div 
                    className="h-32 w-full border-b"
                    style={{ backgroundColor: listing.colors.hex_code }}
                  ></div>
                  <div className="p-4 flex flex-col justify-between flex-grow">
                    <div>
                      <h3 className="font-bold text-slate-800 truncate">{listing.colors.name}</h3>
                      <p className="font-mono text-sm text-slate-500">{listing.colors.hex_code}</p>
                    </div>
                    <div className="mt-4">
                      {listing.colors.influence_score !== undefined && (
                        <div className="text-xs text-cyan-600 flex items-center mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1"><path fillRule="evenodd" d="M10.868 2.884c.321.64.321 1.393 0 2.034l-3.33 6.66a1.25 1.25 0 102.234 1.118l3.33-6.661a1.25 1.25 0 00-2.234-1.118zM12.5 11.25a.75.75 0 110-1.5.75.75 0 010 1.5z" clipRule="evenodd" /></svg>
                          <span>{t.influence}: {listing.colors.influence_score}</span>
                        </div>
                      )}
                      <p className="text-lg text-green-600 font-bold">
                        {listing.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      <Footer t={t} />
    </div>
  );
}