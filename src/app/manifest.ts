import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Chesterfield Yard Care",
    short_name: "CYC",
    description: "Chesterfield Yard Care — owner portal and website",
    start_url: "/portal",
    display: "standalone",
    background_color: "#07142B",
    theme_color: "#07142B",
    icons: [
      { src: "/media/brand/logo/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/media/brand/logo/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/media/brand/logo/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
