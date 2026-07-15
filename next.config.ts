import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["maplibre-gl", "@neondatabase/auth", "@neondatabase/auth-ui"],
};

export default nextConfig;
