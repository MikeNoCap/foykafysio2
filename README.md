# Føyka Fysioterapi og Osteopati – nettside

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · PostHog.

```bash
cp .env.example .env.local   # fill in values
npm run dev
```

## Where things live
- `src/lib/site.ts` – **all clinic facts** (contact, therapists, prices, nav). Edit content here.
- `src/lib/analytics.ts` + `docs/ANALYTICS.md` – event taxonomy and funnel definition.
- `src/instrumentation-client.ts` – PostHog init. `next.config.ts` – `/ingest` proxy + SEO redirects.
- `src/components/BookingButton.tsx` – THE conversion CTA (Hege). Always pass a unique `location`.
- `src/app/globals.css` – design tokens (brand colours, fonts, blob shapes, buttons).

## Two audiences
1. **Osteopat (Hege) – privat:** `/`, `/osteopati`, `/ultralyd`, `/bestill-time#osteopat`. Conversion-optimised.
2. **Fysioterapeuter – kommunal avtale:** `/allmenn-fysioterapi`, `/psykomotorisk-fysioterapi`, `/kvinnehelse`. Informational; slugs preserved from the old site.

## Online booking
Every booking button links straight to Hege's Physica booking page (default in `src/lib/site.ts`).
Set `NEXT_PUBLIC_HEGE_BOOKING_URL` to override it. Phone / SMS / e-mail remain as secondary options.
# foykafysio2
# foykafysio2
