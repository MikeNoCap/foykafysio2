import posthog from "posthog-js";

/**
 * Event taxonomy. Keep in sync with docs/ANALYTICS.md.
 * Naming: past-tense verb + object, snake_case.
 */
export const EVENTS = {
  // --- Booking funnel (Hege: osteopati + ultralyd, private) ---
  CLICKED_BOOKING_OSTEOPATI: "clicked_booking_osteopati",
  VIEWED_OSTEOPATI_PAGE: "viewed_osteopati_page",
  VIEWED_ULTRALYD_PAGE: "viewed_ultralyd_page",
  VIEWED_BOOKING_PAGE: "viewed_booking_page",
  VIEWED_FUNNEL_STEP: "viewed_funnel_step",
  // --- Municipal physiotherapy (informational) ---
  CLICKED_BOOKING_FYSIOTERAPI: "clicked_booking_fysioterapi",
  VIEWED_ARTICLE: "viewed_article",
  // --- Generic engagement ---
  CLICKED_CTA: "clicked_cta",
  CLICKED_NAV: "clicked_nav",
  CLICKED_PHONE: "clicked_phone",
  CLICKED_SMS: "clicked_sms",
  CLICKED_EMAIL: "clicked_email",
  CLICKED_OUTBOUND_LINK: "clicked_outbound_link",
  CLICKED_SERVICE_CARD: "clicked_service_card",
  VIEWED_SECTION: "viewed_section",
  TOGGLED_FAQ: "toggled_faq",
  TOGGLED_MOBILE_MENU: "toggled_mobile_menu",
  COOKIE_CONSENT: "cookie_consent",
} as const;

export type EventName = (typeof EVENTS)[keyof typeof EVENTS];
export type EventProps = Record<string, string | number | boolean | null | undefined>;

/** Ordered steps of the osteopathy booking funnel. */
export const OSTEOPATI_FUNNEL = {
  name: "osteopati_booking",
  steps: {
    landing_viewed: 1,
    service_page_viewed: 2,
    pricing_viewed: 3,
    booking_page_viewed: 4,
    booking_clicked: 5,
  },
} as const;
export type FunnelStep = keyof typeof OSTEOPATI_FUNNEL.steps;

export function track(event: EventName, props: EventProps = {}, instant = false) {
  if (typeof window === "undefined") return;
  try {
    posthog.capture(
      event,
      { page: window.location.pathname, ...props },
      // send_instantly: flush before the browser navigates away (tel:, external booking)
      instant ? { send_instantly: true } : undefined,
    );
  } catch {
    // Analytics must never break the site.
  }
}

export function trackFunnelStep(step: FunnelStep, props: EventProps = {}) {
  track(
    EVENTS.VIEWED_FUNNEL_STEP,
    {
      funnel: OSTEOPATI_FUNNEL.name,
      step,
      step_number: OSTEOPATI_FUNNEL.steps[step],
      ...props,
    },
    step === "booking_clicked",
  );
}

// --- Cookie consent -------------------------------------------------------
// Until the visitor accepts, PostHog runs with in-memory persistence only:
// nothing is stored on the device, no session replay. Events are still
// captured anonymously so the funnel stays measurable.

export const CONSENT_KEY = "ff_cookie_consent";
export type Consent = "granted" | "denied";

export function getConsent(): Consent | null {
  try {
    const v = window.localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

export function setConsent(choice: Consent) {
  try {
    window.localStorage.setItem(CONSENT_KEY, choice);
  } catch {}
  try {
    if (choice === "granted") {
      posthog.set_config({ persistence: "localStorage+cookie" });
      posthog.startSessionRecording();
    } else {
      posthog.set_config({ persistence: "memory" });
      posthog.stopSessionRecording();
    }
  } catch {}
  track(EVENTS.COOKIE_CONSENT, { choice });
}
