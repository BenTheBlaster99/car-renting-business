import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl px-6 py-10">
        <h1 className="text-3xl font-bold text-slate-900">Tableau de bord admin</h1>
        <p className="mt-2 text-slate-600">Mode donnees en direct. Gere les voitures et reservations via Supabase.</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link
            href="/admin/cars"
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:border-slate-300"
          >
            <h2 className="text-lg font-semibold text-slate-900">Gestion des voitures</h2>
            <p className="mt-2 text-sm text-slate-600">
              Ajouter, modifier, supprimer et changer la disponibilite des voitures.
            </p>
          </Link>
          <Link
            href="/admin/bookings"
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:border-slate-300"
          >
            <h2 className="text-lg font-semibold text-slate-900">Demandes de reservation</h2>
            <p className="mt-2 text-sm text-slate-600">
              Voir les reservations et mettre a jour le statut: en attente, confirmee ou refusee.
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}
