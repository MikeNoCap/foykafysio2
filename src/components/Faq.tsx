"use client";

import { Chevron } from "@/components/Icons";
import { EVENTS, track } from "@/lib/analytics";

export type FaqItem = { q: string; a: string };

/** Native <details> accordion: accessible by default, tracked on toggle. */
export function Faq({ items, location }: { items: FaqItem[]; location: string }) {
  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <details
          key={item.q}
          className="group rounded-3xl bg-white px-6 shadow-soft open:pb-5"
          onToggle={(e) =>
            track(EVENTS.TOGGLED_FAQ, { question: item.q, open: e.currentTarget.open, location })
          }
        >
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 font-display text-lg font-bold text-secondary [&::-webkit-details-marker]:hidden">
            {item.q}
            <Chevron className="shrink-0 transition-transform group-open:rotate-180" />
          </summary>
          <p>{item.a}</p>
        </details>
      ))}
    </div>
  );
}
