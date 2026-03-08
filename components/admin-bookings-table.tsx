"use client";

import { useEffect, useState } from "react";
import { getBookingsWithCars, updateBookingStatus } from "@/lib/supabase-data";
import { BookingStatus } from "@/lib/types";

export function AdminBookingsTable() {
  const [rows, setRows] = useState<
    {
      id: string;
      customerName: string;
      phone: string;
      carId: string;
      carName: string;
      pickupDate: string;
      returnDate: string;
      status: BookingStatus;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadRows = async () => {
    try {
      setErrorMessage(null);
      const data = await getBookingsWithCars();
      setRows(data);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Echec du chargement des reservations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadRows();
  }, []);

  const handleStatusUpdate = async (id: string, status: BookingStatus, carId: string) => {
    try {
      await updateBookingStatus(id, status, carId);
      await loadRows();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Echec de la mise a jour de la reservation.");
    }
  };

  if (loading) {
    return <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">Chargement...</div>;
  }

  return (
    <div className="space-y-3">
      {errorMessage ? (
        <div className="rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{errorMessage}</div>
      ) : null}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Client</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Telephone</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Voiture</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Retrait</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Retour</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Statut</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Suivi confirmation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((booking) => (
              <tr key={booking.id}>
                <td className="px-4 py-3 text-slate-900">{booking.customerName}</td>
                <td className="px-4 py-3 text-slate-700">{booking.phone}</td>
                <td className="px-4 py-3 text-slate-700">{booking.carName}</td>
                <td className="px-4 py-3 text-slate-700">{booking.pickupDate}</td>
                <td className="px-4 py-3 text-slate-700">{booking.returnDate}</td>
                <td className="px-4 py-3">
                  <select
                    value={booking.status}
                    onChange={(event) =>
                      void handleStatusUpdate(
                        booking.id,
                        event.target.value as BookingStatus,
                        booking.carId,
                      )
                    }
                    className="rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700"
                  >
                    <option value="pending">en attente</option>
                    <option value="confirmed">confirmee</option>
                    <option value="rejected">refusee</option>
                  </select>
                </td>
                <td className="px-4 py-3 text-xs text-slate-600">
                  {booking.status === "pending"
                    ? "Appelez le client pour confirmer. La voiture reste bloquee."
                    : booking.status === "confirmed"
                      ? "Confirmee. Gardez la voiture indisponible."
                      : "Refusee. La voiture redevient disponible."}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
