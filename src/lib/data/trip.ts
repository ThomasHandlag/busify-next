import { TripItemProps } from "@/app/passenger/page";
import api from "./axios-instance";
import { TripDetail } from "../types/widget_proptype";

export interface TripFilterQuery {
  routeId?: string;
  busOperatorIds?: string[];
  departureDate?: string;
  busModel?: string[];
  untilTime?: string;
  availableSeats?: number;
  amenities?: string[];
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

export async function filterTrips(
  filters: TripFilterQuery
): Promise<TripItemProps[]> {
  try {
    const res = await api.post("api/trips/filter", filters);
    console.log("Calling API with filters:", filters);
    return res.data.result;
  } catch (error) {
    console.error("Error filtering trips:", error);
    return [];
  }
}

export async function filterTripsClient(
  filters: TripFilterQuery
): Promise<TripItemProps[]> {
  try {
    const res = await fetch("/api/filter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(filters),
    });

    if (!res.ok) {
      throw new Error("Failed to filter trips");
    }

    const data = await res.json();
    return data.result as TripItemProps[];
  } catch (error) {
    console.error("Error filtering trips client:", error);
    return [];
  }
}

export async function getTripDetail(tripId: number): Promise<TripDetail> {
  try {
    const res = await api.get(`api/trips/${tripId}`);
    return res.data.result as TripDetail;
  } catch (error) {
    console.error("Error fetching trip detail:", error);
    throw error;
  }
}

export async function getSimilarTrips(
  routeId: number
): Promise<TripItemProps[]> {
  try {
    const res = await api.get(`api/trips/similar?routeId=${routeId}`);
    return res.data.result as TripItemProps[];
  } catch (error) {
    console.error("Error fetching similar trips:", error);
    return [];
  }
}
