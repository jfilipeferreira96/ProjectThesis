/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV,
    API: process.env.API,
    NEXT_PUBLIC_API: process.env.NEXT_PUBLIC_API,
  }
};

module.exports = nextConfig;
