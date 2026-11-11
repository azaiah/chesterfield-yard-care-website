import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A pnpm-lock.yaml in the user folder otherwise makes Next guess the wrong workspace root.
  turbopack: { root: path.resolve(__dirname) },
  outputFileTracingRoot: path.resolve(__dirname),
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 828, 1080, 1280, 1600, 1920, 2400],
  },
  poweredByHeader: false,
  // Low-memory machines: BUILD_CPUS=1 renders pages one worker at a time.
  ...(process.env.BUILD_CPUS ? { experimental: { cpus: Number(process.env.BUILD_CPUS) } } : {}),
  async headers() {
    return [
      {
        source: "/media/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
        ],
      },
    ];
  },
};

export default nextConfig;
