import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-3xl flex-col items-center px-6 py-20 text-center">
        <h1 className="text-4xl font-bold text-slate-900">Car not found</h1>
        <p className="mt-3 text-slate-600">The car you requested does not exist in this demo inventory.</p>
        <Link
          href="/cars"
          className="mt-6 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        >
          Back to cars
        </Link>
      </main>
    </div>
  );
}
