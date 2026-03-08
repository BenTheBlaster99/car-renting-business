"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { getCarById } from "@/lib/supabase-data";
import { Car } from "@/lib/types";

export default function CarDetailsPage() {
  const params = useParams<{ id: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadCar = async () => {
      try {
        const data = await getCarById(params.id);
        setCar(data);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Echec du chargement de la voiture.");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      void loadCar();
    }
  }, [params.id]);

  if (!car) {
    return (
      <div className="min-h-screen bg-slate-50">
        <SiteHeader />
        <main className="mx-auto w-full max-w-3xl px-6 py-10">
          <Link href="/cars" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            Retour aux voitures
          </Link>
          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-6 text-slate-700 shadow-sm">
            {loading ? "Chargement des details de la voiture..." : errorMessage ?? "Voiture introuvable."}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl px-6 py-10">
        <Link href="/cars" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          Retour aux voitures
        </Link>

        <div className="mt-4 grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h1 className="text-4xl font-bold uppercase tracking-tight text-slate-900">
                {car.name}
              </h1>
              <p className="mt-1 text-lg uppercase text-slate-500">{car.brand}</p>
              <div className="relative mt-6 h-72 w-full overflow-hidden rounded-lg">
                <Image
                  src={car.imageUrl}
                  alt={`${car.brand} ${car.name}`}
                  fill
                  className="object-cover"
                />
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-3xl font-bold uppercase text-slate-900">Prix de Location</h2>
              <table className="mt-4 w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-slate-500">
                    <th className="py-2 font-semibold">Duree du contrat</th>
                    <th className="py-2 font-semibold">Montant particulier HT</th>
                    <th className="py-2 font-semibold">Montant societe HT</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="py-2 text-slate-600">Entre 2 et 5 jrs</td>
                    <td className="py-2 text-slate-800">{car.pricePerDay + 10} DA</td>
                    <td className="py-2 text-slate-800">{car.pricePerDay + 5} DA</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2 text-slate-600">Entre 6 et 12 jrs</td>
                    <td className="py-2 text-slate-800">{car.pricePerDay} DA</td>
                    <td className="py-2 text-slate-800">{Math.max(car.pricePerDay - 5, 1)} DA</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2 text-slate-600">Entre 13 et 20 jrs</td>
                    <td className="py-2 text-slate-800">{Math.max(car.pricePerDay - 5, 1)} DA</td>
                    <td className="py-2 text-slate-800">{Math.max(car.pricePerDay - 10, 1)} DA</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-slate-600">Plus de 20 jrs</td>
                    <td className="py-2 text-slate-800">{Math.max(car.pricePerDay - 10, 1)} DA</td>
                    <td className="py-2 text-slate-800">{Math.max(car.pricePerDay - 15, 1)} DA</td>
                  </tr>
                </tbody>
              </table>
            </section>
          </div>

          <aside className="space-y-4">
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-3xl font-bold uppercase text-slate-900">Details de Vehicule</h2>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between border-b border-slate-100 py-1">
                  <dt className="text-slate-500">Nom</dt>
                  <dd className="font-medium text-slate-900">{car.name}</dd>
                </div>
                <div className="flex justify-between border-b border-slate-100 py-1">
                  <dt className="text-slate-500">Annee</dt>
                  <dd className="font-medium text-slate-900">{car.year}</dd>
                </div>
                <div className="flex justify-between border-b border-slate-100 py-1">
                  <dt className="text-slate-500">Energie</dt>
                  <dd className="font-medium text-slate-900">{car.fuelType}</dd>
                </div>
                <div className="flex justify-between border-b border-slate-100 py-1">
                  <dt className="text-slate-500">Transmission</dt>
                  <dd className="font-medium text-slate-900">{car.transmission}</dd>
                </div>
                <div className="flex justify-between border-b border-slate-100 py-1">
                  <dt className="text-slate-500">Places</dt>
                  <dd className="font-medium text-slate-900">{car.seats}</dd>
                </div>
                <div className="flex justify-between border-b border-slate-100 py-1">
                  <dt className="text-slate-500">Etat</dt>
                  <dd className="font-medium text-slate-900">{car.condition}</dd>
                </div>
                <div className="flex justify-between border-b border-slate-100 py-1">
                  <dt className="text-slate-500">Airbags</dt>
                  <dd className="font-medium text-slate-900">{car.airbags}</dd>
                </div>
                <div className="flex justify-between py-1">
                  <dt className="text-slate-500">Couleur</dt>
                  <dd className="font-medium text-slate-900">{car.color}</dd>
                </div>
                <div className="flex justify-between py-1">
                  <dt className="text-slate-500">Description</dt>
                  <dd className="font-medium text-slate-900">{car.description}</dd>
                </div>
              </dl>
            </section>


            <div>
              {car.availability ? (
                <Link
                  href={`/booking?carId=${car.id}`}
                  className="inline-flex w-full items-center justify-center rounded-md bg-red-600 px-4 py-4 text-lg font-semibold uppercase text-white hover:bg-red-700"
                >
                  Envoyer une demande de reservation
                </Link>
              ) : (
                <div className="rounded-md bg-slate-400 px-4 py-4 text-center text-lg font-semibold uppercase text-white">
                  Indisponible
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
