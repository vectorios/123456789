// app/page.tsx
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-gradient-to-br from-[#121212] via-[#0A0A0A] to-[#1a1a2e]">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <div className="z-10">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
          Devenez le gardien unique d'une couleur.
        </h1>
        <p className="mt-6 text-lg md:text-xl max-w-2xl mx-auto text-neutral-300">
          Dans ColorVerse, chacune des 16,7 millions de couleurs est un actif numérique unique. La vôtre vous attend.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4">
          <Link
            href="/inscription"
            className="px-8 py-4 bg-white text-black font-semibold rounded-lg shadow-lg hover:bg-neutral-200 transition-transform transform hover:scale-105"
          >
            Devenir Gardien - C'est Gratuit
          </Link>
          <div className="flex gap-6">
            <Link href="/connexion" className="text-neutral-400 hover:text-white transition-colors">
              Déjà Gardien ? Se connecter
            </Link>
            
            {/* AJOUTEZ CE LIEN CI-DESSOUS */}
            <Link href="/marche" className="text-purple-400 font-semibold hover:text-purple-300 transition-colors">
              Explorer le Marché
            </Link>
          </div>
        </div>
        <p className="mt-4 text-sm text-neutral-500">Pour toujours.</p>
      </div>
    </div>
  );
}