/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ["tsx"],
  experimental: {
    scrollRestoration: true,
  },
};

export default nextConfig;
