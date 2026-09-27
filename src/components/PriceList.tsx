import { getContent } from "@/lib/content";
import { formatPrice, type Price } from "@/lib/site";

export function PriceList({
  groups = ["osteopati", "ultralyd"],
  dark = false,
}: {
  groups?: Price["group"][];
  dark?: boolean;
}) {
  const rows = getContent().prices.filter((p) => groups.includes(p.group));
  return (
    <dl className={`divide-y ${dark ? "divide-white/15" : "divide-mint-200"}`}>
      {rows.map((p) => (
        <div key={p.id} className="flex flex-wrap items-baseline justify-between gap-x-4 py-3.5">
          {/* The label never breaks inside a word: when it cannot sit next to the price, the price drops to its own line */}
          <dt className="max-w-full min-w-[min-content] flex-1 break-words">
            <span className={`font-display text-lg font-bold ${dark ? "text-white" : "text-secondary"}`}>{p.label}</span>
            {p.detail && <span className={`block text-[0.95rem] ${dark ? "text-white/75" : ""}`}>{p.detail}</span>}
          </dt>
          <dd className={`ml-auto shrink-0 whitespace-nowrap font-display text-2xl font-extrabold ${dark ? "text-primary" : "text-secondary"}`}>
            {formatPrice(p.price)}
          </dd>
        </div>
      ))}
    </dl>
  );
}
