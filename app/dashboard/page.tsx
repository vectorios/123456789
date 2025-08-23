// app/dashboard/page.tsx
'use client'; 

import { useState, useEffect, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { getMyColors, OwnedColor } from '@/app/actions/dashboardActions';
// NOUVEAUX IMPORTS
import { getUserStatus } from '@/app/actions/userActions'; 
import { LayoutGrid, Wallet, Brush, Settings, LogOut, ArrowRight, ExternalLink, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

// --- MODALE DE VENTE ENTIÈREMENT REDESSINÉE ---
function SellModal({ color, onClose, onListingSuccess }: { color: OwnedColor, onClose: () => void, onListingSuccess: () => void }) {
  const [price, setPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (parseFloat(price) < 0.5) {
      setError("Price must be at least €0.50.");
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/market/sell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ colorId: color.id, price: parseFloat(price) })
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "An error occurred while listing the item.");
      }
      onListingSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        <h2 className="text-2xl font-bold mb-2 text-slate-900">List Your Color for Sale</h2>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-lg" style={{ backgroundColor: color.hex_code }}></div>
          <div>
            <h3 className="font-semibold text-slate-800">{color.name}</h3>
            <p className="font-mono text-sm text-slate-500">{color.hex_code}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="price-input" className="block mb-2 font-medium text-slate-700">Set Price (EUR)</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">€</span>
            <input 
              id="price-input"
              type="number" step="0.01" min="0.50" value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full pl-7 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-lg text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              required placeholder="7.00"
            />
          </div>
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          <div className="flex justify-end gap-4 mt-6">
            <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors">Cancel</button>
            <button type="submit" disabled={isLoading} className="px-5 py-2 rounded-lg font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 transition-colors">
              {isLoading ? 'Listing...' : 'Confirm Sale'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// --- BARRE DE NAVIGATION LATÉRALE (SIDEBAR) ---
function Sidebar({ activeView, setActiveView, userName }: { activeView: string, setActiveView: (view: string) => void, userName: string }) {
  const navItems = [
    { id: 'gallery', label: 'My Gallery', icon: LayoutGrid },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'creator', label: 'Creator Studio', icon: Brush },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 p-4">
      <div className="font-bold text-xl mb-8">ColorVerse</div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-purple-700">
          {userName.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-slate-800">{userName}</p>
          <p className="text-sm text-slate-500">Guardian</p>
        </div>
      </div>
      <nav className="flex-grow">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg text-left font-semibold transition-colors ${
              activeView === item.id 
                ? 'bg-purple-100 text-purple-700' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <item.icon size={20} />
            {item.label}
          </button>
        ))}
      </nav>
      <button onClick={() => signOut({ callbackUrl: '/' })} className="w-full flex items-center gap-3 p-3 rounded-lg text-left font-semibold text-slate-600 hover:bg-slate-100 transition-colors">
        <LogOut size={20} />
        Sign Out
      </button>
    </div>
  );
}

// --- VUE : GALERIE DE COULEURS ---
function GalleryView({ colors, onSellClick }: { colors: OwnedColor[], onSellClick: (color: OwnedColor) => void }) {
  if (colors.length === 0) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800">Your Gallery is Empty</h2>
        <p className="mt-2 text-slate-500">Acquire new colors to start your collection.</p>
        <Link href="/marketplace" className="mt-6 inline-flex items-center gap-2 font-semibold text-white bg-slate-900 px-6 py-3 rounded-lg hover:bg-slate-800 transition-colors">
          Explore Marketplace <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-slate-900 mb-8">My Gallery</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {colors.map((color) => (
          <motion.div 
            key={color.id} 
            className="rounded-2xl shadow-lg overflow-hidden bg-white group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="aspect-square w-full" style={{ backgroundColor: color.hex_code }}></div>
            <div className="p-4">
              <h3 className="font-bold text-slate-800 truncate">{color.name}</h3>
              <p className="text-sm text-slate-500 font-mono">{color.hex_code}</p>
              <div className="mt-4">
                {color.is_for_sale ? (
                  <div className="w-full text-center py-2 text-sm font-semibold rounded-lg bg-yellow-100 text-yellow-800">
                    Listed for Sale
                  </div>
                ) : (
                  <button 
                    onClick={() => onSellClick(color)}
                    className="w-full py-2 text-sm font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
                    Sell
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// --- VUE : PORTEFEUILLE (WALLET) - MISE À JOUR AVEC LA LOGIQUE API ---
function WalletView({ isPayPalConnected, isConnecting }: { isPayPalConnected: boolean, isConnecting: boolean }) {
  const handleConnect = async () => {
    const response = await fetch('/api/paypal/connect-url');
    const data = await response.json();
    if (data.connectUrl) {
      window.location.href = data.connectUrl;
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold text-slate-900 mb-2">Wallet</h1>
      <p className="text-slate-500 mb-8">Manage your earnings and transactions.</p>
      
      {isPayPalConnected ? (
        <div className="p-8 rounded-2xl bg-green-50 border-2 border-green-200 text-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-800">PayPal Account Connected</h2>
          <p className="mt-2 text-green-700 max-w-md mx-auto">You are ready to receive payments from your color sales. Payouts will be sent to your connected PayPal account.</p>
        </div>
      ) : (
        <div className="p-8 rounded-2xl bg-white shadow-lg text-center">
          <h2 className="text-2xl font-bold text-slate-800">Connect your PayPal Account</h2>
          <p className="mt-2 text-slate-500 max-w-md mx-auto">To receive payments from your color sales, connect your PayPal account. Payouts are secure and handled directly by PayPal.</p>
          <button 
            onClick={handleConnect} 
            disabled={isConnecting}
            className="mt-6 inline-flex items-center justify-center gap-2 font-semibold text-white bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 w-64"
          >
            {isConnecting ? <Loader2 className="animate-spin" /> : <>Connect with PayPal <ExternalLink size={16} /></>}
          </button>
        </div>
      )}
    </div>
  );
}


// --- VUE : STUDIO CRÉATEUR ---
function CreatorStudioView() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-slate-900 mb-2">Creator Studio</h1>
      <p className="text-slate-500 mb-8">Bring your colors to life.</p>
      <div className="p-8 rounded-2xl bg-white shadow-lg text-center">
        <h2 className="text-2xl font-bold text-slate-800">Physical Merchandise with Printful</h2>
        <p className="mt-2 text-slate-500 max-w-md mx-auto">Turn your unique colors and palettes into real-world products like t-shirts, posters, and mugs. Powered by Printful.</p>
        <a href="https://www.printful.com" target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 font-semibold text-white bg-slate-900 px-6 py-3 rounded-lg hover:bg-slate-800 transition-colors">
          Explore Printful Integration <ExternalLink size={16} />
        </a>
         <p className="mt-4 text-xs text-slate-400">This feature is coming soon.</p>
      </div>
    </div>
  );
}

// --- VUE : PARAMÈTRES ---
function SettingsView() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-slate-900 mb-8">Settings</h1>
       <div className="p-8 rounded-2xl bg-white shadow-lg text-center">
        <h2 className="text-2xl font-bold text-slate-800">Account Management</h2>
        <p className="mt-2 text-slate-500">This section is under construction.</p>
      </div>
    </div>
  );
}

// --- COMPOSANT PRINCIPAL DU DASHBOARD ---
export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [colors, setColors] = useState<OwnedColor[]>([]);
  const [isLoadingColors, setIsLoadingColors] = useState(true);
  const [selectedColor, setSelectedColor] = useState<OwnedColor | null>(null);
  const [activeView, setActiveView] = useState('gallery');

  // NOUVEAUX ÉTATS POUR LE PORTEFEUILLE
  const [isPayPalConnected, setIsPayPalConnected] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);

  const fetchColors = useCallback(async () => {
    setIsLoadingColors(true);
    try {
      const data = await getMyColors();
      setColors(data);
    } catch (error) {
      console.error("Error fetching colors:", error);
      setColors([]);
    } finally {
      setIsLoadingColors(false);
    }
  }, []);

  // NOUVELLE FONCTION POUR VÉRIFIER LE STATUT DE L'UTILISATEUR
  const fetchUserData = useCallback(async () => {
    setIsCheckingStatus(true);
    try {
      const { paypalConnected } = await getUserStatus();
      setIsPayPalConnected(paypalConnected);
    } catch (error) {
      console.error("Error fetching user status:", error);
    } finally {
      setIsCheckingStatus(false);
    }
  }, []);


  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/connexion');
      return;
    }
    fetchColors();
    fetchUserData();
  }, [session, status, router, fetchColors, fetchUserData]);

  if (status === 'loading' || !session || isCheckingStatus) {
    return <div className="flex items-center justify-center min-h-screen bg-slate-50 text-slate-500">Loading Guardian data...</div>;
  }

  const renderContent = () => {
    if (isLoadingColors && activeView === 'gallery') {
      return <div className="text-center text-slate-500">Loading your gallery...</div>;
    }
    switch (activeView) {
      case 'gallery':
        return <GalleryView colors={colors} onSellClick={setSelectedColor} />;
      case 'wallet':
        return <WalletView isPayPalConnected={isPayPalConnected} isConnecting={isConnecting} />;
      case 'creator':
        return <CreatorStudioView />;
      case 'settings':
        return <SettingsView />;
      default:
        return null;
    }
  };
  
  return (
    <>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar activeView={activeView} setActiveView={setActiveView} userName={session.user.name || 'User'}/>
        <main className="flex-grow p-8">
          <div className="w-full max-w-7xl mx-auto flex items-center justify-center">
            {renderContent()}
          </div>
        </main>
      </div>

      <AnimatePresence>
        {selectedColor && (
          <SellModal 
            color={selectedColor} 
            onClose={() => setSelectedColor(null)}
            onListingSuccess={() => {
              fetchColors();
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}