"use client";

import { supabase } from "@/lib/supabase";
import { BookingRequest, BookingStatus, Car } from "@/lib/types";

type CarRow = {
  id: string;
  name: string;
  brand: string;
  year: number;
  price_per_day: number;
  availability: boolean;
  fuel_type: string;
  transmission: string;
  seats: number;
  condition: string;
  airbags: number;
  color: string;
  image_url: string;
  description: string;
  created_at: string;
};

type BookingRow = {
  id: string;
  customer_name: string;
  phone: string;
  car_id: string;
  pickup_date: string;
  return_date: string;
  status: BookingStatus;
  created_at: string;
};

type CreateBookingInput = {
  customerName: string;
  phone: string;
  carId: string;
  pickupDate: string;
  returnDate: string;
};

export type BookingWithCarName = BookingRequest & {
  carName: string;
};

const mapCarRow = (row: CarRow): Car => ({
  id: row.id,
  name: row.name,
  brand: row.brand,
  year: row.year,
  pricePerDay: row.price_per_day,
  availability: row.availability,
  fuelType: row.fuel_type,
  transmission: row.transmission,
  seats: row.seats,
  condition: row.condition,
  airbags: row.airbags,
  color: row.color,
  imageUrl: row.image_url,
  description: row.description,
  createdAt: row.created_at,
});

const mapBookingRow = (row: BookingRow): BookingRequest => ({
  id: row.id,
  customerName: row.customer_name,
  phone: row.phone,
  carId: row.car_id,
  pickupDate: row.pickup_date,
  returnDate: row.return_date,
  status: row.status,
  createdAt: row.created_at,
});

export async function getCars() {
  const { data, error } = await supabase
    .from("cars")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => mapCarRow(row as CarRow));
}

export async function getCarById(carId: string) {
  const { data, error } = await supabase.from("cars").select("*").eq("id", carId).maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapCarRow(data as CarRow) : null;
}

export async function createCar(input: Omit<Car, "id" | "createdAt">) {
  const { data, error } = await supabase
    .from("cars")
    .insert({
      name: input.name,
      brand: input.brand,
      year: input.year,
      price_per_day: input.pricePerDay,
      availability: input.availability,
      fuel_type: input.fuelType,
      transmission: input.transmission,
      seats: input.seats,
      condition: input.condition,
      airbags: input.airbags,
      color: input.color,
      image_url: input.imageUrl,
      description: input.description,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapCarRow(data as CarRow);
}

export async function updateCarPrice(carId: string, pricePerDay: number) {
  const { error } = await supabase.from("cars").update({ price_per_day: pricePerDay }).eq("id", carId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function setCarAvailability(carId: string, availability: boolean) {
  const { error } = await supabase.from("cars").update({ availability }).eq("id", carId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteCarById(carId: string) {
  const { error } = await supabase.from("cars").delete().eq("id", carId);
  if (error) {
    throw new Error(error.message);
  }
}

export async function createBookingRequest(input: CreateBookingInput) {
  const lockCar = await supabase
    .from("cars")
    .update({ availability: false })
    .eq("id", input.carId)
    .eq("availability", true)
    .select("id")
    .maybeSingle();

  if (lockCar.error) {
    throw new Error(lockCar.error.message);
  }

  if (!lockCar.data) {
    return { ok: false as const, reason: "car_not_available" as const };
  }

  const created = await supabase
    .from("booking")
    .insert({
      customer_name: input.customerName.trim(),
      phone: input.phone.trim(),
      car_id: input.carId,
      pickup_date: input.pickupDate,
      return_date: input.returnDate,
      status: "pending",
    })
    .select("*")
    .single();

  if (created.error) {
    await supabase.from("cars").update({ availability: true }).eq("id", input.carId);
    throw new Error(created.error.message);
  }

  return { ok: true as const, booking: mapBookingRow(created.data as BookingRow) };
}

export async function getBookingsWithCars() {
  const [bookingsRes, carsRes] = await Promise.all([
    supabase.from("booking").select("*").order("created_at", { ascending: false }),
    supabase.from("cars").select("id,name,brand"),
  ]);

  if (bookingsRes.error) {
    throw new Error(bookingsRes.error.message);
  }
  if (carsRes.error) {
    throw new Error(carsRes.error.message);
  }

  const carsMap = new Map<string, { name: string; brand: string }>(
    (carsRes.data ?? []).map((car) => [car.id as string, { name: car.name as string, brand: car.brand as string }]),
  );

  return (bookingsRes.data ?? []).map((row) => {
    const booking = mapBookingRow(row as BookingRow);
    const car = carsMap.get(booking.carId);
    return {
      ...booking,
      carName: car ? `${car.brand} ${car.name}` : "Unknown car",
    };
  }) as BookingWithCarName[];
}

export async function updateBookingStatus(bookingId: string, status: BookingStatus, carId: string) {
  const { error } = await supabase.from("booking").update({ status }).eq("id", bookingId);
  if (error) {
    throw new Error(error.message);
  }

  if (status === "rejected") {
    const activeBookingCheck = await supabase
      .from("booking")
      .select("id")
      .eq("car_id", carId)
      .in("status", ["pending", "confirmed"])
      .limit(1)
      .maybeSingle();

    if (activeBookingCheck.error) {
      throw new Error(activeBookingCheck.error.message);
    }

    const shouldBeAvailable = !activeBookingCheck.data;
    const { error: carError } = await supabase
      .from("cars")
      .update({ availability: shouldBeAvailable })
      .eq("id", carId);
    if (carError) {
      throw new Error(carError.message);
    }
    return;
  }

  if (status === "pending" || status === "confirmed") {
    const { error: carError } = await supabase.from("cars").update({ availability: false }).eq("id", carId);
    if (carError) {
      throw new Error(carError.message);
    }
  }
}
