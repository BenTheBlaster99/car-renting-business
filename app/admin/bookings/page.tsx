import { AdminBookingsTable } from "@/components/admin-bookings-table";
import { SiteHeader } from "@/components/site-header";

export default function AdminBookingsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-6 py-10">
        <h1 className="text-3xl font-bold text-slate-900">Admin - Booking Requests</h1>
        <p className="mt-2 text-slate-600">Track incoming requests and update their status.</p>

        <div className="mt-8">
          <AdminBookingsTable />
        </div>
      </main>
    </div>
  );
}
