import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async rewrites() {
    return [
      {
        source: "/it-outsourcing",
        destination: "https://upscalix.com.au/it-outsourcing",
      },
      {
        source: "/offshore-developers",
        destination: "https://upscalix.com.au/offshore-developers",
      },
      {
        source: "/custom-software-development",
        destination: "https://upscalix.com.au/custom-software-development",
      },
    ];
  },
};

export default nextConfig;
