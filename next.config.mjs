/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "plaid-merchant-logos.plaid.com",
        port: "",
      },
    ],
  },
};

export default nextConfig;
