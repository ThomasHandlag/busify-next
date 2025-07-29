// lib/data/seat_layout.ts
import axios from "./axios-instance";

export interface SeatLayout {
  id: number;
  name: string;
}

export async function getAllSeatLayouts(): Promise<SeatLayout[]> {
  try {
    const res = await axios.get("/api/seat-layout");
    return res.data.result;
  } catch (error) {
    console.error("Error fetching seat layouts:", error);
    return [];
  }
}
