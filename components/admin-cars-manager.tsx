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
    reader.onerror = () => reject(new Error("Failed to read selected file."));
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
      setErrorMessage(error instanceof Error ? error.message : "Failed to load cars.");
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
      setErrorMessage(error instanceof Error ? error.message : "Failed to add car.");
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
      setErrorMessage(error instanceof Error ? error.message : "Failed to load selected image.");
    }
  };

  const removeCar = async (id: string) => {
    try {
      await deleteCarById(id);
      await loadCars();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to delete car.");
    }
  };

  const toggleAvailability = async (id: string, value: boolean) => {
    try {
      await setCarAvailability(id, !value);
      await loadCars();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to update availability.");
    }
  };

  const quickEditPrice = async (id: string) => {
    const value = window.prompt("New price per day");
    if (!value) return;
    const nextPrice = Number(value);
    if (Number.isNaN(nextPrice) || nextPrice <= 0) return;
    try {
      await updateCarPrice(id, nextPrice);
      await loadCars();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to update price.");
    }
  };

  return (
    <div className="space-y-8">
      {errorMessage ? (
        <div className="rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{errorMessage}</div>
      ) : null}
      <form onSubmit={addCar} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Add car</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">
            Name
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Brand
            <input
              required
              value={brand}
              onChange={(event) => setBrand(event.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Year
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
            Price per day (EUR)
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
            Availability
            <select
              value={availability ? "available" : "unavailable"}
              onChange={(event) => setAvailabilityValue(event.target.value === "available")}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="available">available</option>
              <option value="unavailable">unavailable</option>
            </select>
          </label>
          <label className="text-sm font-medium text-slate-700">
            Fuel type
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
            Seats
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
            Condition
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
            Color
            <input
              required
              value={color}
              onChange={(event) => setColor(event.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm font-medium text-slate-700 sm:col-span-2">
            Car image (file)
            <input
              required
              type="file"
              accept="image/*"
              onChange={(event) => void onImageSelected(event)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
            {imageFileName ? (
              <p className="mt-1 text-xs text-slate-500">Selected: {imageFileName}</p>
            ) : null}
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Selected car preview"
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
          Add car
        </button>
      </form>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Car</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Price/day</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Status</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td className="px-4 py-3 text-slate-600" colSpan={4}>
                  Loading...
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
                <td className="px-4 py-3">EUR {car.pricePerDay}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${
                      car.availability ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {car.availability ? "available" : "unavailable"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => quickEditPrice(car.id)}
                      className="rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => void toggleAvailability(car.id, car.availability)}
                      className="rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700"
                    >
                      Mark {car.availability ? "unavailable" : "available"}
                    </button>
                    <button
                      type="button"
                      onClick={() => void removeCar(car.id)}
                      className="rounded-md border border-red-300 px-2 py-1 text-xs font-medium text-red-700"
                    >
                      Delete
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
