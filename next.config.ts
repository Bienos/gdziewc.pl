import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { resolveMapStyleUrl } from "./lib/map/config";

const projectDirectory = path.dirname(fileURLToPath(import.meta.url));
const scriptPolicy = process.env.NODE_ENV === "development"
  ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
  : "script-src 'self' 'unsafe-inline'";
const mapProviderOrigin = new URL(resolveMapStyleUrl(process.env.NEXT_PUBLIC_MAP_STYLE_URL)).origin;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  distDir: process.env.NEXT_DIST_DIR || ".next",
  outputFileTracingRoot: projectDirectory,
  poweredByHeader: false,
  async headers() {
    return [{
      source: "/:path*",
      headers: [
        { key: "Content-Security-Policy", value: `default-src 'self'; base-uri 'self'; connect-src 'self' ${mapProviderOrigin}; font-src 'self' data: ${mapProviderOrigin}; form-action 'self'; frame-ancestors 'none'; img-src 'self' data: blob: ${mapProviderOrigin}; object-src 'none'; ${scriptPolicy}; style-src 'self' 'unsafe-inline'; worker-src 'self'` },
        { key: "Permissions-Policy", value: "camera=(), geolocation=(self), microphone=()" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Strict-Transport-Security", value: "max-age=31536000" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
      ],
    }];
  },
};

export default nextConfig;
