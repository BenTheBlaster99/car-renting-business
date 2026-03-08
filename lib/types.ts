export type BookingStatus = "pending" | "confirmed" | "rejected";

export type Car = {
  id: string;
  name: string;
  brand: string;
  year: number;
  pricePerDay: number;
  availability: boolean;
  fuelType: string;
  transmission: string;
  seats: number;
  condition: string;
  airbags: number;
  color: string;
  imageUrl: string;
  description: string;
  createdAt: string;
};

export type BookingRequest = {
  id: string;
  customerName: string;
  phone: string;
  carId: string;
  pickupDate: string;
  returnDate: string;
  status: BookingStatus;
  createdAt: string;
};
