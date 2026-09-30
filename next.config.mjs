/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  // Don't fail the production build on lint warnings; run `npm run lint`
  // separately during development.
  eslint: { ignoreDuringBuilds: true },
  // Gallery image uploads go through a server action; raise the default
  // 1 MB request limit so photos and flyers can be uploaded.
  experimental: {
    serverActions: { bodySizeLimit: "10mb" },
  },
};

export default nextConfig;
