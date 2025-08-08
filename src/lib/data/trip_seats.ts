// lib/data/seat_layout.ts
import api from "./axios-instance";

export enum SStatus {
  AVAILABLE = "available",
  BOOKED = "booked",
  LOCKED = "locked",
}

export interface SeatStatus {
  seatNumber: string;
  status: SStatus;
}

export interface TripSeatsStatus {
  tripId: number;
  seatsStatus: SeatStatus[];
}

export interface Seat {
  id: number;
  seat_number: string;
  status: string;
  price: number;
  row: number;
  column: number;
  floor?: number; // For multi-floor buses
}

export async function getTripSeatById(
  tripId: number
): Promise<TripSeatsStatus | null> {
  try {
    const res = await api.get(`api/trip-seats/${tripId}`);
    return res.data.result as TripSeatsStatus;
  } catch (error) {
    console.error("Error fetching trip seat layout:", error);
    return null;
  }
}
