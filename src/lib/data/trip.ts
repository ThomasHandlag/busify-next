import { TripItemProps } from "@/app/passenger/page";
import api from "./axios-instance";

export async function getUpcomingTrips(): Promise<Response> {
  try {
    const res = await api.get("api/trips/upcoming-trips");
    return res.data;
  } catch (error) {
    console.error("Error fetching upcoming trips:", error);
    throw error;
  }
}

export async function filterTrips(filters: any): Promise<TripItemProps[]> {
  try {
    const res = await api.post("api/trips/filter", filters);
    console.log("Calling API with filters:", filters);
    return res.data.result;
  } catch (error) {
    console.error("Error filtering trips:", error);
    return [];
  }
}

