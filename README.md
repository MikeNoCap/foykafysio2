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

## Admin (`/admin`)
The clinic logs in at `/admin` with one shared password and edits prices, the notice banner and contact info.
- Edits are stored in `data/content.json` (override with `CONTENT_FILE`) and merged over the defaults in
  `src/lib/site.ts` by `src/lib/content.ts`. Server components call `getContent()`; client components get props.
- Saving calls `revalidatePath("/", "layout")`, so the static pages are rebuilt immediately.
- **The file lives on the server, not in git.** Build on the server (so `next build` sees it), and if you use
  Docker, mount `data/` as a volume. The Node user needs write access to the folder. A `.bak` of the previous
  version is kept next to it.
- Setup: `npm run admin:password` prints `ADMIN_PASSWORD_HASH` and `ADMIN_SESSION_SECRET` for `.env.local`.
  Without both, login is disabled. Changing the password logs everyone out.
- Security: scrypt hash, signed httpOnly/SameSite=Strict cookie (8 h), login throttling (5 tries / 15 min per IP),
  session re-checked in every Server Action, all input validated in `parseContent`. Serve over HTTPS and make
  sure the reverse proxy sets `X-Forwarded-For` / `X-Real-IP`.

## Two audiences
1. **Osteopat (Hege) – privat:** `/`, `/osteopati`, `/ultralyd`, `/bestill-time#osteopat`. Conversion-optimised.
2. **Fysioterapeuter – kommunal avtale:** `/allmenn-fysioterapi`, `/psykomotorisk-fysioterapi`, `/kvinnehelse`. Informational; slugs preserved from the old site.

## Online booking
Every booking button links straight to Hege's Physica booking page (default in `src/lib/site.ts`).
Set `NEXT_PUBLIC_HEGE_BOOKING_URL` to override it. Phone / SMS / e-mail remain as secondary options.
# foykafysio2
# foykafysio2
