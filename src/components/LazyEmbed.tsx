/** Third-party iframe (YouTube / Google Maps), lazy-loaded when scrolled near. */
export function LazyEmbed({
  src,
  title,
  className = "aspect-video",
}: {
  src: string;
  title: string;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-[2rem] bg-secondary ${className}`}>
      <iframe src={src} title={title} allowFullScreen loading="lazy" className="absolute inset-0 size-full border-0" allow="encrypted-media; picture-in-picture" />
    </div>
  );
}
