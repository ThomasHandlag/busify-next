import { TripItemProps } from "@/app/passenger/page";
import api from "./axios-instance";

export interface TripFilterQuery {
  departureDate?: string;
  departureTime?: string;
  arrivalDate?: string;
  arrivalTime?: string;
  fromLocation?: string;
  toLocation?: string;
  busOperatorId?: number;
  minPrice?: number;
  maxPrice?: number;
}

export async function getUpcomingTrips(): Promise<TripItemProps[]> {
  try {
    const res = await api.get("api/trips/upcoming-trips");
    return res.data.result as TripItemProps[];
  } catch (error) {
    console.error("Error fetching upcoming trips:", error);
    throw error;
  }
}

export async function filterTrips(filters: TripFilterQuery): Promise<TripItemProps[]> {
  try {
    const res = await api.post("api/trips/filter", filters);
    console.log("Calling API with filters:", filters);
    return res.data.result;
  } catch (error) {
    console.error("Error filtering trips:", error);
    return [];
  }
}

