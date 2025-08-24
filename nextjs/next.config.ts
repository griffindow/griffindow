import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Generate a fully static export to the `out/` directory
  output: "export",
  images: {
    // Required for static export when using next/image
    unoptimized: true,
  },
};

export default nextConfig;
