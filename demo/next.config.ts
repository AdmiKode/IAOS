import type { NextConfig } from "next";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "google-fonts-cache",
        expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
      },
    },
  ],
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "api.al-eon.com" }],
  },
};

module.exports = withPWA(nextConfig);
