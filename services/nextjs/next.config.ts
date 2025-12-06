import type { NextConfig } from "next";
import { config } from "dotenv";
import { resolve } from "path";

// Load .env file from the parent directory (todo folder)
config({ path: resolve(__dirname, "../../.env") });

const nextConfig: NextConfig = {
  output: 'standalone',
};

export default nextConfig;
