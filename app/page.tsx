"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { getCars } from "@/lib/supabase-data";
import { Car } from "@/lib/types";

export default function Home() {
  const [cars, setCars] = useState<Car[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getCars();
        setCars(data.slice(0, 2));
      } catch {
        setCars([]);
      }
    };
    void load();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-6 py-10">
        <section className="rounded-2xl bg-slate-900 px-8 py-12 text-white shadow-lg">
          <p className="text-sm uppercase tracking-widest text-slate-300">CityDrive Rentals</p>
          <h1 className="mt-3 max-w-xl text-4xl font-bold leading-tight">
            Voitures premium. Reservation simple. Pense pour un service rapide.
          </h1>
          <p className="mt-4 max-w-xl text-slate-200">
            Les clients voient les voitures disponibles et envoient une demande en une minute.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/cars"
              className="rounded-md bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100"
            >
              Voir les voitures disponibles
            </Link>
            <Link
              href="/admin"
              className="rounded-md border border-slate-400 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Ouvrir le tableau de bord admin
            </Link>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-slate-900">Voitures en vedette</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {cars.map((car) => (
              <article key={car.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <Image
                  src={car.imageUrl}
                  alt={`${car.brand} ${car.name}`}
                  width={800}
                  height={450}
                  className="h-48 w-full rounded-lg object-cover"
                />
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {car.brand} {car.name}
                  </h3>
                  <p className="text-sm text-slate-600">{car.pricePerDay} DA/jour</p>
                  <Link
                    href={`/cars/${car.id}`}
                    className="mt-3 inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                  >
                    Voir les details
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">
            Pourquoi les agences de location utilisent ce systeme
          </h2>
          <ul className="mt-5 grid gap-3 text-sm text-slate-700 md:grid-cols-2">
            <li className="rounded-lg bg-slate-50 p-3">Les clients voient les voitures disponibles instantanement</li>
            <li className="rounded-lg bg-slate-50 p-3">Reduction des messages repetitifs sur Instagram</li>
            <li className="rounded-lg bg-slate-50 p-3">Reception des demandes de reservation 24h/24 et 7j/7</li>
            <li className="rounded-lg bg-slate-50 p-3">Gestion des voitures simple depuis un seul tableau de bord</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
