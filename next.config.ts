import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "blogger.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "d54-invdn-com.investing.com",
      },
      {
        protocol: "https",
        hostname: "magelangekspres.disway.id",
      },
      {
        protocol: "https",
        hostname: "satriadharma.com",
      },
      {
        protocol: "https",
        hostname: "*.disway.id",
      },
    ],
  },
};

export default nextConfig;
