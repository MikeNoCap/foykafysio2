"use client";

import { useEffect, useRef } from "react";
import {
  EVENTS,
  track,
  trackFunnelStep,
  type EventName,
  type EventProps,
  type FunnelStep,
} from "@/lib/analytics";

/** Fires once on mount. Use for page-level funnel events. */
export function TrackPageView({
  event,
  eventProps,
  funnelStep,
}: {
  event?: EventName;
  eventProps?: EventProps;
  funnelStep?: FunnelStep;
}) {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    if (event) track(event, eventProps);
    if (funnelStep) trackFunnelStep(funnelStep, eventProps);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

/** Fires `viewed_section` once when the wrapped section scrolls into view. */
export function TrackSection({
  section,
  funnelStep,
  children,
  ...rest
}: {
  section: string;
  funnelStep?: FunnelStep;
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<"div">) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          track(EVENTS.VIEWED_SECTION, { section });
          if (funnelStep) trackFunnelStep(funnelStep, { section });
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [section, funnelStep]);
  return (
    <div ref={ref} {...rest}>
      {children}
    </div>
  );
}
