"use client";

import { useEffect, useMemo, useState } from "react";
import { createBookingRequest, getCars } from "@/lib/supabase-data";
import { Car } from "@/lib/types";

type BookingRequestFormProps = {
  initialCarId?: string;
};

export function BookingRequestForm({ initialCarId }: BookingRequestFormProps) {
  const [cars, setCars] = useState<Car[]>([]);
  const [selectedCarId, setSelectedCarId] = useState(initialCarId ?? "");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  useEffect(() => {
    const loadCars = async () => {
      try {
        const nextCars = await getCars();
        setCars(nextCars);
        const preferredId = initialCarId ?? nextCars.find((car) => car.availability)?.id ?? nextCars[0]?.id ?? "";
        const preferredCar = nextCars.find((car) => car.id === preferredId);
        setSelectedCarId(
          preferredCar?.availability
            ? preferredId
            : nextCars.find((car) => car.availability)?.id ?? nextCars[0]?.id ?? "",
        );
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Failed to load cars.");
      } finally {
        setLoading(false);
      }
    };

    void loadCars();
  }, [initialCarId]);

  const selectedCar = useMemo(
    () => cars.find((car) => car.id === selectedCarId),
    [cars, selectedCarId],
  );
  const hasAvailableCars = cars.some((car) => car.availability);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(false);
    setErrorMessage(null);

    try {
      const result = await createBookingRequest({
        customerName,
        phone,
        carId: selectedCarId,
        pickupDate,
        returnDate,
      });

      if (!result.ok) {
        setErrorMessage("This car is no longer available. Please pick another car.");
        const refreshedCars = await getCars();
        setCars(refreshedCars);
        setSelectedCarId(refreshedCars.find((car) => car.availability)?.id ?? refreshedCars[0]?.id ?? "");
        return;
      }

      const refreshedCars = await getCars();
      setCars(refreshedCars);
      setSubmitted(true);
      setCustomerName("");
      setPhone("");
      setPickupDate("");
      setReturnDate("");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to submit booking.");
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Booking Request</h2>
      <p className="mt-2 text-sm text-slate-600">
        Submit this form to reserve the car, then the business team calls you to confirm.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <label className="block text-sm font-medium text-slate-700">
          Name
          <input
            required
            value={customerName}
            onChange={(event) => setCustomerName(event.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Phone
          <input
            required
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Car
          <select
            value={selectedCarId}
            onChange={(event) => setSelectedCarId(event.target.value)}
            disabled={loading || cars.length === 0}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            {cars.map((car) => (
              <option key={car.id} value={car.id} disabled={!car.availability}>
                {car.brand} {car.name}{" "}
                {car.availability ? "" : "(not available right now)"}
              </option>
            ))}
          </select>
        </label>

        {selectedCar ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Selected car</p>
            <div className="mt-2 flex items-start gap-3">
              <img
                src={selectedCar.imageUrl}
                alt={`${selectedCar.brand} ${selectedCar.name}`}
                className="h-20 w-28 rounded-md border border-slate-200 object-cover"
              />
              <div className="text-sm text-slate-700">
                <p className="font-semibold text-slate-900">
                  {selectedCar.brand} {selectedCar.name}
                </p>
                <p>{selectedCar.year} • {selectedCar.fuelType} • {selectedCar.transmission}</p>
                <p>{selectedCar.seats} seats • EUR {selectedCar.pricePerDay}/day</p>
              </div>
            </div>
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700">
            Pickup date
            <input
              required
              type="date"
              value={pickupDate}
              onChange={(event) => setPickupDate(event.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Return date
            <input
              required
              type="date"
              value={returnDate}
              onChange={(event) => setReturnDate(event.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={loading || !hasAvailableCars || !selectedCar?.availability}
          className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        >
          {loading ? "Loading cars..." : hasAvailableCars ? "Submit request" : "No cars available right now"}
        </button>
      </form>

      {submitted ? (
        <div className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          Request sent for {selectedCar?.brand} {selectedCar?.name}. The car is now held for you while
          the rental team calls to confirm.
        </div>
      ) : null}
      {errorMessage ? (
        <div className="mt-4 rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
          {errorMessage}
        </div>
      ) : null}
    </div>
  );
}
