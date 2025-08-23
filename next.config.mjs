// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  // AJOUTEZ CETTE SECTION images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '', // Laissez vide si pas de port spécifique
        pathname: '/**', // Autorise tous les chemins sur ce domaine
      },
      // Si vous avez d'autres domaines d'images (ex: un CDN pour les images de profil réelles),
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        port: '',
        pathname: '/api/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '',
        pathname: '/**',
      },
     ],
  },
  // Fin de la section images
};

export default nextConfig;