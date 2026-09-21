"use client";

import { TrackedLink } from "@/components/analytics/TrackedLink";
import { Calendar } from "@/components/Icons";
import { EVENTS, trackFunnelStep } from "@/lib/analytics";
import { HAS_ONLINE_BOOKING, HEGE_BOOKING_HREF } from "@/lib/site";

type Props = {
  /** Where on the site the button sits, e.g. "hero", "header", "pricing". Required for funnel analysis. */
  location: string;
  service?: "osteopati" | "ultralyd";
  label?: string;
  size?: "md" | "lg";
  className?: string;
  icon?: boolean;
};

/**
 * The primary conversion CTA: book an appointment with Hege (osteopati / ultralyd).
 * Fires `clicked_booking_osteopati` + the final funnel step.
 */
export function BookingButton({
  location,
  service = "osteopati",
  label = "Bestill time hos osteopat",
  size = "md",
  className = "",
  icon = true,
}: Props) {
  return (
    <TrackedLink
      href={HEGE_BOOKING_HREF}
      event={EVENTS.CLICKED_BOOKING_OSTEOPATI}
      eventProps={{
        location,
        service,
        label,
        destination: HAS_ONLINE_BOOKING ? "online_booking" : "booking_page",
      }}
      onTracked={() => {
        // Only an actual hand-off to the booking system completes the funnel.
        if (HAS_ONLINE_BOOKING) trackFunnelStep("booking_clicked", { location, service });
      }}
      className={`btn btn-book ${size === "lg" ? "btn-lg" : ""} ${className}`}
    >
      {icon && <Calendar width={size === "lg" ? 24 : 20} height={size === "lg" ? 24 : 20} />}
      {label}
    </TrackedLink>
  );
}
