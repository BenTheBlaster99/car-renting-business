import { BookingRequestForm } from "@/components/booking-request-form";
import { SiteHeader } from "@/components/site-header";

type BookingPageProps = {
  searchParams: Promise<{ carId?: string }>;
};

export default async function BookingPage({ searchParams }: BookingPageProps) {
  const { carId } = await searchParams;

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 py-10">
        <h1 className="text-3xl font-bold text-slate-900">Reservation</h1>
        <p className="mt-2 text-slate-600">
          La premiere demande validee reserve la voiture immediatement. L equipe location appelle ensuite
          le client pour confirmer.
        </p>
        <div className="mt-6">
          <BookingRequestForm initialCarId={carId} />
        </div>
      </main>
    </div>
  );
}
