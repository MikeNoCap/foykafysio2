import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow testing the dev server via 127.0.0.1 as well as localhost.
  allowedDevOrigins: ["127.0.0.1"],
  // PostHog reverse proxy: first-party path so ad blockers don't eat the funnel data.
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://eu-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://eu.i.posthog.com/:path*",
      },
    ];
  },
  // Required so PostHog's trailing-slash API requests aren't redirected.
  skipTrailingSlashRedirect: true,

  // Old URLs / likely guesses -> canonical pages, to keep SEO equity.
  async redirects() {
    return [
      { source: "/fysioterapi", destination: "/allmenn-fysioterapi", permanent: true },
      { source: "/allmenn", destination: "/allmenn-fysioterapi", permanent: true },
      { source: "/psykomotorisk", destination: "/psykomotorisk-fysioterapi", permanent: true },
      { source: "/osteopat", destination: "/osteopati", permanent: true },
      { source: "/ultralyd-undersokelse", destination: "/ultralyd", permanent: true },
      { source: "/timebestilling", destination: "/bestill-time", permanent: true },
      { source: "/bestill", destination: "/bestill-time", permanent: true },
      { source: "/kontakt", destination: "/#kontakt-oss", permanent: true },
      { source: "/priser", destination: "/osteopati#priser", permanent: true },
    ];
  },
};

export default nextConfig;
