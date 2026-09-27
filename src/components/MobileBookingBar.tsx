"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BookingButton } from "@/components/BookingButton";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { Phone } from "@/components/Icons";
import { EVENTS } from "@/lib/analytics";

/** Sticky bottom CTA on mobile. Only on Hege's funnel pages – not on the landing page or the municipal info pages. */
const PATHS = ["/osteopati", "/ultralyd"];

export function MobileBookingBar({ hege }: { hege: { name: string; phoneHref: string } }) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!PATHS.includes(pathname)) return null;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-mint-200 bg-white/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_-12px_rgb(2_53_53/0.3)] backdrop-blur transition-transform duration-300 md:hidden ${visible ? "translate-y-0" : "translate-y-full"}`}
      // Hidden from keyboard/AT while off-screen
      inert={!visible}
    >
      <div className="flex items-center gap-2">
        <BookingButton
          location="mobile_sticky_bar"
          service={pathname === "/ultralyd" ? "ultralyd" : "osteopati"}
          label="Bestill time hos osteopat"
          className="flex-1"
        />
        <TrackedLink
          href={hege.phoneHref}
          event={EVENTS.CLICKED_PHONE}
          eventProps={{ location: "mobile_sticky_bar", therapist: "hege" }}
          aria-label={`Ring osteopat ${hege.name}`}
          className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-secondary text-white"
        >
          <Phone width={22} height={22} />
        </TrackedLink>
      </div>
    </div>
  );
}
