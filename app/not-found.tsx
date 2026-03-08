import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-3xl flex-col items-center px-6 py-20 text-center">
        <h1 className="text-4xl font-bold text-slate-900">Voiture introuvable</h1>
        <p className="mt-3 text-slate-600">La voiture demandee n existe pas dans cet inventaire.</p>
        <Link
          href="/cars"
          className="mt-6 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        >
          Retour aux voitures
        </Link>
      </main>
    </div>
  );
}
