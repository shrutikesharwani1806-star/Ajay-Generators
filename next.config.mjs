/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      }
    ],
    unoptimized: false,
  },
  // No rewrites needed as APIs are now part of the Next.js app
};

export default nextConfig;
