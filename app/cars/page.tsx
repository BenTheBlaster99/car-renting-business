"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { getCars } from "@/lib/supabase-data";
import { Car } from "@/lib/types";

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getCars();
        setCars(data);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Failed to load cars.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-6 py-10">
        <h1 className="text-3xl font-bold text-slate-900">Cars</h1>
        <p className="mt-2 text-slate-600">Choose a car and start a booking request.</p>

        {errorMessage ? (
          <div className="mt-6 rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            {errorMessage}
          </div>
        ) : null}

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
              Loading cars...
            </div>
          ) : null}
          {cars.map((car) => (
            <article key={car.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <Image
                src={car.imageUrl}
                alt={`${car.brand} ${car.name}`}
                width={800}
                height={450}
                className="h-40 w-full rounded-lg object-cover"
              />

              <div className="mt-4 space-y-2">
                <h2 className="text-lg font-semibold text-slate-900">
                  {car.brand} {car.name}
                </h2>
                <p className="text-sm text-slate-600">EUR {car.pricePerDay}/day</p>
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                    car.availability ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {car.availability ? "Available" : "Unavailable"}
                </span>
              </div>

              <div className="mt-4 flex gap-2">
                <Link
                  href={`/cars/${car.id}`}
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  Details
                </Link>
                {car.availability ? (
                  <Link
                    href={`/booking?carId=${car.id}`}
                    className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
                  >
                    Book Now
                  </Link>
                ) : (
                  <span className="rounded-md bg-slate-400 px-3 py-2 text-sm font-medium text-white">
                    Not available
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
