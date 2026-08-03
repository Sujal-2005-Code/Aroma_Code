import type { NextConfig } from "next";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost", "192.168.137.1"],
  images: {
    unoptimized: true,
  },
  // Support deploying under a sub-path by reading NEXT_PUBLIC_BASE_PATH
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || "",
};

export default nextConfig;
