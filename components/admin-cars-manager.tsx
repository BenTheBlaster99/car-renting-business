"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  createCar,
  deleteCarById,
  getCars,
  setCarAvailability,
  updateCarPrice,
} from "@/lib/supabase-data";
import { Car } from "@/lib/types";

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Impossible de lire le fichier selectionne."));
    reader.readAsDataURL(file);
  });

export function AdminCarsManager() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [year, setYear] = useState<number>(2024);
  const [pricePerDay, setPricePerDay] = useState<number>(70);
  const [fuelType, setFuelType] = useState("Essence");
  const [transmission, setTransmission] = useState("Auto");
  const [seats, setSeats] = useState<number>(5);
  const [condition, setCondition] = useState("Excellent");
  const [airbags, setAirbags] = useState<number>(2);
  const [color, setColor] = useState("Blanc");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFileName, setImageFileName] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [availability, setAvailabilityValue] = useState(true);

  const loadCars = async () => {
    try {
      setErrorMessage(null);
      const data = await getCars();
      setCars(data);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Echec du chargement des voitures.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCars();
  }, []);

  const addCar = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    const carPayload = {
        name,
        brand,
        year,
        pricePerDay,
        availability,
        fuelType,
        transmission,
        seats,
        condition,
        airbags,
        color,
        imageUrl,
        description,
      };

    try {
      await createCar(carPayload);
      await loadCars();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Echec de l ajout de la voiture.");
      return;
    }

    setName("");
    setBrand("");
    setYear(2024);
    setPricePerDay(70);
    setFuelType("Essence");
    setTransmission("Auto");
    setSeats(5);
    setCondition("Excellent");
    setAirbags(2);
    setColor("Blanc");
    setImageUrl("");
    setImageFileName(null);
    setDescription("");
    setAvailabilityValue(true);
  };

  const onImageSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await fileToDataUrl(file);
      setImageUrl(dataUrl);
      setImageFileName(file.name);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Echec du chargement de l image.");
    }
  };

  const removeCar = async (id: string) => {
    try {
      await deleteCarById(id);
      await loadCars();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Echec de la suppression de la voiture.");
    }
  };

  const toggleAvailability = async (id: string, value: boolean) => {
    try {
      await setCarAvailability(id, !value);
      await loadCars();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Echec de la mise a jour de disponibilite.");
    }
  };

  const quickEditPrice = async (id: string) => {
    const value = window.prompt("Nouveau prix par jour (DA)");
    if (!value) return;
    const nextPrice = Number(value);
    if (Number.isNaN(nextPrice) || nextPrice <= 0) return;
    try {
      await updateCarPrice(id, nextPrice);
      await loadCars();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Echec de la mise a jour du prix.");
    }
  };

  return (
    <div className="space-y-8">
      {errorMessage ? (
        <div className="rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{errorMessage}</div>
      ) : null}
      <form onSubmit={addCar} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Ajouter une voiture</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">
            Nom
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Marque
            <input
              required
              value={brand}
              onChange={(event) => setBrand(event.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Annee
            <input
              required
              type="number"
              min={1980}
              value={year}
              onChange={(event) => setYear(Number(event.target.value))}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Prix par jour (DA)
            <input
              required
              type="number"
              min={1}
              value={pricePerDay}
              onChange={(event) => setPricePerDay(Number(event.target.value))}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Disponibilite
            <select
              value={availability ? "available" : "unavailable"}
              onChange={(event) => setAvailabilityValue(event.target.value === "available")}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="available">disponible</option>
              <option value="unavailable">indisponible</option>
            </select>
          </label>
          <label className="text-sm font-medium text-slate-700">
            Type de carburant
            <input
              required
              value={fuelType}
              onChange={(event) => setFuelType(event.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Transmission
            <input
              required
              value={transmission}
              onChange={(event) => setTransmission(event.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Places
            <input
              required
              type="number"
              min={1}
              value={seats}
              onChange={(event) => setSeats(Number(event.target.value))}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Etat
            <input
              required
              value={condition}
              onChange={(event) => setCondition(event.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Airbags
            <input
              required
              type="number"
              min={0}
              value={airbags}
              onChange={(event) => setAirbags(Number(event.target.value))}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Couleur
            <input
              required
              value={color}
              onChange={(event) => setColor(event.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm font-medium text-slate-700 sm:col-span-2">
            Image de la voiture (fichier)
            <input
              required
              type="file"
              accept="image/*"
              onChange={(event) => void onImageSelected(event)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
            {imageFileName ? (
              <p className="mt-1 text-xs text-slate-500">Selectionne: {imageFileName}</p>
            ) : null}
            {imageUrl ? (
              // Local preview can be data URL; using img keeps it simple here.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl}
                alt="Apercu de la voiture selectionnee"
                className="mt-3 h-24 w-40 rounded-md border border-slate-200 object-cover"
              />
            ) : null}
          </label>
          <label className="text-sm font-medium text-slate-700 sm:col-span-2">
            Description
            <textarea
              required
              rows={3}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
        </div>
        <button
          type="submit"
          className="mt-4 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        >
          Ajouter la voiture
        </button>
      </form>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Voiture</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Prix/jour</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Statut</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td className="px-4 py-3 text-slate-600" colSpan={4}>
                  Chargement...
                </td>
              </tr>
            ) : cars.map((car) => (
              <tr key={car.id}>
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-900">
                    {car.brand} {car.name}
                  </div>
                  <div className="text-xs text-slate-500">{car.id}</div>
                </td>
                <td className="px-4 py-3 text-green-700">{car.pricePerDay} DA</td>
                <td className="px-4 py-3">
                  <label className="inline-flex cursor-pointer items-center gap-2">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={car.availability}
                      onClick={() => void toggleAvailability(car.id, car.availability)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                        car.availability ? "bg-emerald-500" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          car.availability ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                    <span
                      className={`text-xs font-semibold ${
                        car.availability ? "text-emerald-700" : "text-slate-600"
                      }`}
                    >
                      {car.availability ? "Disponible" : "Indisponible"}
                    </span>
                  </label>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => quickEditPrice(car.id)}
                      className="rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700"
                    >
                      Modifier
                    </button>
                    <button
                      type="button"
                      onClick={() => void removeCar(car.id)}
                      className="rounded-md border border-red-300 px-2 py-1 text-xs font-medium text-red-700"
                    >
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
