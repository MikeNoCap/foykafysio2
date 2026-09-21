"use client";

import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { track, type EventName, type EventProps } from "@/lib/analytics";

type Props = Omit<ComponentPropsWithoutRef<"a">, "href"> & {
  href: string;
  event: EventName;
  eventProps?: EventProps;
  /** Extra side effect after tracking (e.g. funnel step). */
  onTracked?: () => void;
};

const isInternal = (href: string) => href.startsWith("/") || href.startsWith("#");

/** A link that fires a PostHog event on click. Works for internal, external, tel: and mailto:. */
export function TrackedLink({ href, event, eventProps, onTracked, onClick, children, ...rest }: Props) {
  const internal = isInternal(href);
  const handle = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Leaving the page (external / tel / mailto) -> flush immediately.
    track(event, { href, ...eventProps }, !internal);
    onTracked?.();
    onClick?.(e);
  };
  // Mirror key props as data attributes so PostHog autocapture/heatmaps see them too.
  const data = {
    "data-ph-capture-attribute-event": event,
    "data-ph-capture-attribute-location": eventProps?.location as string | undefined,
  };

  if (internal) {
    return (
      <Link href={href} onClick={handle} {...data} {...rest}>
        {children}
      </Link>
    );
  }
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      onClick={handle}
      {...(external ? { rel: "noopener noreferrer" } : {})}
      {...data}
      {...rest}
    >
      {children}
    </a>
  );
}
