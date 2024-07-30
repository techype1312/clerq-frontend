/** @type {import('next').NextConfig} */
const nextConfig = {
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
