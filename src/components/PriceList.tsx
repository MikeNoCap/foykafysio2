import { formatPrice, prices, type Price } from "@/lib/site";

export function PriceList({
  groups = ["osteopati", "ultralyd"],
  dark = false,
}: {
  groups?: Price["group"][];
  dark?: boolean;
}) {
  const rows = prices.filter((p) => groups.includes(p.group));
  return (
    <dl className={`divide-y ${dark ? "divide-white/15" : "divide-mint-200"}`}>
      {rows.map((p) => (
        <div key={p.id} className="flex items-baseline justify-between gap-4 py-3.5">
          <dt>
            <span className={`font-display text-lg font-bold ${dark ? "text-white" : "text-secondary"}`}>{p.label}</span>
            {p.detail && <span className={`block text-[0.95rem] ${dark ? "text-white/75" : ""}`}>{p.detail}</span>}
          </dt>
          <dd className={`shrink-0 font-display text-2xl font-extrabold ${dark ? "text-primary" : "text-secondary"}`}>
            {formatPrice(p.price)}
          </dd>
        </div>
      ))}
    </dl>
  );
}
