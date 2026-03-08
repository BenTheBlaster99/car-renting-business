import { AdminCarsManager } from "@/components/admin-cars-manager";
import { SiteHeader } from "@/components/site-header";

export default function AdminCarsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-6 py-10">
        <h1 className="text-3xl font-bold text-slate-900">Admin - Cars</h1>
        <p className="mt-2 text-slate-600">Manage cars inventory for the booking website.</p>

        <div className="mt-8">
          <AdminCarsManager />
        </div>
      </main>
    </div>
  );
}
