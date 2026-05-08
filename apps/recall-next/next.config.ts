import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // typed routes at top-level in Next 16
  typedRoutes: true,
  headers: async () => {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "font-src 'self' fonts.gstatic.com",
              "img-src 'self' data: blob: https://*",
              "connect-src 'self' https://*.supabase.co https://generativelanguage.googleapis.com",
            ].join('; ')
          },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.twimg.com" },
      { protocol: "https", hostname: "pbs.twimg.com" },
      { protocol: "https", hostname: "**.vercel.app" },
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "**.unsplash.com" },
    ],
  },
  turbopack: {
    // Ensure correct root to avoid lockfile heuristics
    root: __dirname,
  },
};

export default nextConfig;
