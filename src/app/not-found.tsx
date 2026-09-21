import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page py-24 text-center">
      <p className="eyebrow">404</p>
      <h1 className="h1 mt-3">Fant ikke siden</h1>
      <p className="lead mt-4">Siden du leter etter finnes ikke eller er flyttet.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn btn-dark">Til forsiden</Link>
        <Link href="/bestill-time" className="btn btn-outline">Bestill time</Link>
      </div>
    </div>
  );
}
