import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["hyperconfident-jayne-greasily.ngrok-free.dev"],
  reactCompiler: true,
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
