// lib/data/seat_layout.ts
import api from "./axios-instance";
import axios from "./axios-instance";

export interface SeatLayout {
  id: number;
  name: string;
}
interface SeatData {
  seatNumber: string;
  status: string;
  isBooked: boolean;
  rows: string;
  columns: string;
  floors: string;
}

// Interface for seat layout response from API
export interface SeatLayoutResponse {
  rows: string;
  columns: string;
  floors: string;
  seats: SeatData[];
}
export async function getAllSeatLayouts(): Promise<SeatLayout[]> {
  try {
    const res = await api.get("/api/seat-layout");
    return res.data.result;
  } catch (error) {
    console.error("Error fetching seat layouts:", error);
    return [];
  }
}


export async function getSeatLayoutByTripId(tripId: string): Promise<SeatLayoutResponse | null> {
  try {
    const res = await axios.get(`/api/trip-seats/${tripId}`);
    if (res.data.code === 200 && res.data.result) {
      return res.data.result as SeatLayoutResponse;
    } else {
      throw new Error(res.data.message || "Failed to fetch seat layout");
    }
  } catch (error) {
    console.error("Error fetching seat layout:", error);
    return null;
  }
}