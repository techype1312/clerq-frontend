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
      {
        protocol: "https",
        hostname: "stage-public.joinotto.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "public.joinotto.com",
        port: "",
      }
    ],
  },
};

export default nextConfig;
