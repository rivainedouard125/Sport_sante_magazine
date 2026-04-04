/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',  // Allow large PDF + image uploads
    },
  },
};

export default nextConfig;
