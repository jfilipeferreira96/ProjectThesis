/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    NODE_ENV: process.env.NODE_ENV,
    API: process.env.API,
  }
};

module.exports = nextConfig;
