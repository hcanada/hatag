import type { NextConfig } from "next";

// Derive the image host from the Supabase URL so dev and prod each allow
// their own project's storage without hardcoding project refs.
const supabaseHost = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).hostname;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: supabaseHost,
        port: "",
        pathname: "/storage/v1/object/public/items/**",
      },
    ],
  },
};

export default nextConfig;
