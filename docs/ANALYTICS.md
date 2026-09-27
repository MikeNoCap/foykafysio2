# Analytics (PostHog) – event taxonomy & funnel guide

Written for whoever (human or Claude) analyses the traffic later. Source of truth in code:
`src/lib/analytics.ts`. If you add an event, add it here.

## Setup
- Init: `src/instrumentation-client.ts` (EU cloud, reverse-proxied through `/ingest`, see `next.config.ts`).
- Provider: `src/components/analytics/PostHogProvider.tsx` (wraps the app in `layout.tsx`).
- `$pageview` / `$pageleave` are automatic on every App Router navigation (`defaults: "2025-05-24"`).
  `$pageleave` carries scroll depth (`$prev_pageview_max_scroll_percentage`).
- Autocapture is on. CTAs also carry `data-ph-capture-attribute-event|location`.
- Super property on every event: `site_version = "2026-redesign"`. Custom events also carry `page` (pathname).
- Consent: before "Godta" PostHog uses `persistence: "memory"` (no cookies, no replay). Consequence:
  **returning-visitor and cross-reload identity only exists for consenting users.** Within a single
  visit (SPA navigation) the funnel is intact for everyone. `cookie_consent {choice}` records the choice.

## Two audiences
| | Hege – osteopati/ultralyd (private) | Physiotherapists (municipal) |
|---|---|---|
| Goal | Bookings | Information |
| Conversion event | `clicked_booking_osteopati` | `clicked_phone` / `clicked_email` with `therapist` = katrine/sam/havard/clinic |
| Soft intent | `clicked_phone`/`clicked_sms`/`clicked_email` with `therapist: "hege"` | `clicked_booking_fysioterapi` (goes to /bestill-time#fysioterapi) |

## Events
| Event | Properties | Fired when |
|---|---|---|
| `clicked_booking_osteopati` | `location`, `service` (osteopati\|ultralyd), `label`, `destination` (online_booking\|booking_page), `href` | Any Hege booking CTA |
| `viewed_funnel_step` | `funnel: "osteopati_booking"`, `step`, `step_number`, (+`service`/`section`/`location`) | See funnel below |
| `viewed_osteopati_page` / `viewed_ultralyd_page` / `viewed_booking_page` | `service` | Page mount |
| `viewed_article` | `article` (slug) | Municipal article mount |
| `clicked_booking_fysioterapi` | `location` | "Kontakt en fysioterapeut" style CTAs |
| `clicked_cta` | `cta`, `location`, `href` | Secondary CTAs (les_mer_osteopati, se_priser, bestill_time header …) |
| `clicked_service_card` | `service` | Service grid on landing |
| `clicked_nav` | `label`, `location` (header\|mobile_menu\|footer) | Navigation |
| `clicked_phone` / `clicked_sms` / `clicked_email` | `therapist`, `location` | tel:/sms:/mailto: links |
| `clicked_outbound_link` | `href`, `location` | External links |
| `viewed_section` | `section` | Section ≥40% in viewport (once per page view) |
| `toggled_faq` | `question`, `open`, `location` | FAQ accordion |
| `toggled_mobile_menu` | `open` | Hamburger |
| `cookie_consent` | `choice` | Banner |

### `location` values for `clicked_booking_osteopati`
Landing page: `landing_osteopat_band` (the private card in the "two offers" section), `landing_behandlere_therapist_card`.
Header "Bestill time" menu (two choices, all pages): `header_menu`, and `mobile_menu` in the mobile menu. Opening the
menu fires `clicked_cta` (`cta: bestill_time`, `location: header`); the municipal choice fires `clicked_booking_fysioterapi`.
The hero's private CTA fires `clicked_cta` (`cta: kontakt_privat_tilbud`) and leads to `/bestill-time#osteopat`.
Funnel pages: `hero`, `hero_therapist_card`, `header`, `mobile_menu`, `mobile_sticky_bar`, `plager`, `pricing`,
`osteopati_bottom`, `ultralyd_bottom`. Elsewhere: `article_sidebar`, `booking_page`.

> **Customer constraint (2026-09):** the clinic is primarily a physiotherapy institute with
> driftsavtale with Asker kommune. The landing page must lead with allmenn + psykomotorisk
> fysioterapi; osteopathy gets one compact band there. Optimise Hege's funnel on `/osteopati`,
> `/ultralyd` and `/bestill-time` – do not propose making the landing page osteopathy-first again.

## The booking funnel (`funnel = osteopati_booking`)
1. `landing_viewed` – `/` mounted
2. `service_page_viewed` – `/osteopati` or `/ultralyd` (`service` prop)
3. `pricing_viewed` – price block scrolled into view (osteopati, ultralyd)
4. `booking_page_viewed` – `/bestill-time`
5. `booking_clicked` – click that hands off to the **external** online booking
   (Hege's Physica page; see `HEGE_BOOKING_URL` in `src/lib/site.ts`)

Steps are not strictly sequential (a visitor can book from the hero). Recommended PostHog funnels:
- **Main:** `$pageview` → `clicked_booking_osteopati` (break down by `location`).
- **Considered:** `viewed_osteopati_page` → `viewed_funnel_step[step=pricing_viewed]` → `clicked_booking_osteopati`.
- **While no online booking URL is set:** final conversion = `clicked_phone|clicked_sms|clicked_email`
  where `therapist = hege`.

The true conversion (completed booking) happens in the external booking system and is not visible
here. Compare `clicked_booking_osteopati[destination=online_booking]` with actual bookings.

## Questions worth asking the data
- Which `location` produces most booking clicks per view? (hero vs sticky bar vs pricing)
- Drop-off between `pricing_viewed` and booking click → price presentation problem?
- Which FAQ questions get opened most → move the answer higher up the page.
- Do visitors on municipal articles click the sidebar osteopat CTA (`location=article_sidebar`)?
- Mobile vs desktop conversion (`$device_type`).
