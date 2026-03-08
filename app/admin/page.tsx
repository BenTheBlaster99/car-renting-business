import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl px-6 py-10">
        <h1 className="text-3xl font-bold text-slate-900">Admin dashboard</h1>
        <p className="mt-2 text-slate-600">Live data mode. Manage cars and booking requests from Supabase.</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link
            href="/admin/cars"
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:border-slate-300"
          >
            <h2 className="text-lg font-semibold text-slate-900">Cars CRUD</h2>
            <p className="mt-2 text-sm text-slate-600">
              Add, edit, delete, and mark cars as available or rented.
            </p>
          </Link>
          <Link
            href="/admin/bookings"
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:border-slate-300"
          >
            <h2 className="text-lg font-semibold text-slate-900">Booking requests</h2>
            <p className="mt-2 text-sm text-slate-600">
              View booking table and update status to pending, confirmed, or rejected.
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}
