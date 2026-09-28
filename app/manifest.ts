import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Oynur Bouw B.V.",
    short_name: "Oynur Bouw",
    description: "Renovatiebedrijf: badkamerrenovatie, vloeren, tegelwerk, stucwerk en schilderwerk.",
    start_url: "/nl",
    display: "standalone",
    background_color: "#faf7f3",
    theme_color: "#ffffff",
    lang: "nl",
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
