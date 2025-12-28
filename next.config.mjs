// next.config.mjs
const nextConfig = {
  experimental: {
    serverActions: {
      // Configuración específica para server actions
      bodySizeLimit: '2mb',
      allowedOrigins: ['localhost:3000']
    }
  },
  // Configuración para paquetes externos
  transpilePackages: ['mysql2'],
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Permite todas las fuentes de imágenes
      },
      // O más específico para tus dominios:
      {
        protocol: 'https',
        hostname: '*.flickr.com',
      },
      {
        protocol: 'https',
        hostname: 'tudominio.com',
      }
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384]
  },
  // ... resto de tu configuración
};

export default nextConfig;