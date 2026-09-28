import type { NextConfig } from "next";

/**
 * Dutch URLs are the primary (SEO) URLs. Internally the app uses the English folder
 * names, so the Dutch paths are rewritten and the English paths under /nl redirect.
 */
const nlAliases: [string, string][] = [
  ["diensten", "services"],
  ["projecten", "projects"],
  ["over-ons", "about"],
];

/** English landing URLs → internal Dutch folder names. */
const enAliases: [string, string][] = [
  ["plastering", "stucwerk"],
  ["painting", "schilderwerk"],
];

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    // One branded 404 page for URLs that match no route at all.
    globalNotFound: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75, 85],
    localPatterns: [
      { pathname: "/media/**", search: "" },
      { pathname: "/brand/**", search: "" },
    ],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/admin/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        ...nlAliases.flatMap(([nl, internal]) => [
          { source: `/nl/${nl}`, destination: `/nl/${internal}` },
          { source: `/nl/${nl}/:path*`, destination: `/nl/${internal}/:path*` },
        ]),
        ...enAliases.map(([en, internal]) => ({ source: `/en/${en}`, destination: `/en/${internal}` })),
      ],
      afterFiles: [],
      fallback: [],
    };
  },
  async redirects() {
    return [
      ...nlAliases.flatMap(([nl, internal]) => [
        { source: `/nl/${internal}`, destination: `/nl/${nl}`, permanent: true },
        { source: `/nl/${internal}/:path*`, destination: `/nl/${nl}/:path*`, permanent: true },
      ]),
      ...enAliases.map(([en, internal]) => ({ source: `/en/${internal}`, destination: `/en/${en}`, permanent: true })),
    ];
  },
};

export default nextConfig;
