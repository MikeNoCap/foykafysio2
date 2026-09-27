import type { Notice } from "@/lib/content";

/** Site-wide notice (holiday closures etc.). Text and on/off are edited in /admin. */
export function NoticeBanner({ notice }: { notice: Notice }) {
  if (!notice.enabled || !notice.text) return null;
  return (
    <div role="status" className="bg-primary text-secondary">
      <p className="container-page py-2.5 text-center font-semibold">{notice.text}</p>
    </div>
  );
}
