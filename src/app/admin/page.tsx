import type { Metadata } from "next";
import { AdminEditor } from "./AdminEditor";
import { LoginForm } from "./LoginForm";
import { logout } from "./actions";
import { isAdminConfigured, isAuthenticated } from "@/lib/admin/auth";
import { readEditableContent } from "@/lib/content";
import { therapists } from "@/lib/site";

export const metadata: Metadata = {
  title: "Administrasjon",
  robots: { index: false, follow: false },
  alternates: { canonical: null },
};

export default async function AdminPage() {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    return (
      <section className="container-page max-w-md py-16">
        <h1 className="h2">Logg inn</h1>
        {isAdminConfigured() ? (
          <LoginForm />
        ) : (
          <p className="mt-4">Administrasjonen er ikke satt opp på serveren ennå.</p>
        )}
      </section>
    );
  }

  const content = readEditableContent();
  return (
    <section className="container-page max-w-3xl py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Administrasjon</p>
          <h1 className="h2 mt-1">Oppdater nettsiden</h1>
        </div>
        <form action={logout}>
          <button type="submit" className="btn btn-outline min-h-10 px-5 py-2 text-sm">Logg ut</button>
        </form>
      </div>
      <p className="mt-4">
        Endringene vises på nettsiden med en gang du trykker «Lagre».
        {content.updatedAt && (
          <> Sist lagret {new Date(content.updatedAt).toLocaleString("nb-NO", { dateStyle: "long", timeStyle: "short", timeZone: "Europe/Oslo" })}.</>
        )}
      </p>
      <AdminEditor
        initial={content}
        therapistNames={Object.fromEntries(therapists.map((t) => [t.id, t.name]))}
      />
    </section>
  );
}
