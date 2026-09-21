import posthog from "posthog-js";

// Runs once in the browser before the app becomes interactive (Next.js 15.3+).
// Pageviews ($pageview) and page leaves ($pageleave, incl. scroll depth) are
// captured automatically on every App Router navigation via `defaults`
// (capture_pageview: "history_change").

const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;

if (key) {
  let consent: string | null = null;
  try {
    consent = window.localStorage.getItem("ff_cookie_consent");
  } catch {}
  const granted = consent === "granted";

  posthog.init(key, {
    api_host: "/ingest", // reverse proxy, see next.config.ts
    ui_host: "https://eu.posthog.com",
    defaults: "2025-05-24",
    capture_pageleave: true,
    person_profiles: "identified_only",
    // No cookies / localStorage until the visitor accepts (see lib/analytics.ts).
    persistence: granted ? "localStorage+cookie" : "memory",
    disable_session_recording: !granted,
    session_recording: { maskAllInputs: true },
    loaded: (ph) => {
      if (process.env.NODE_ENV === "development") ph.debug(false);
      ph.register({ site_version: "2026-redesign" });
    },
  });
}
