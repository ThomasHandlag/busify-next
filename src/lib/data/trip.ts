import { TripItemProps } from "@/app/passenger/page";
import api from "./axios-instance";
import { Trip, TripDetail } from "../types/widget_proptype";

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

export async function getTripDetail(tripId: number): Promise<TripDetail> {
  try {
    const res = await api.get(`api/trips/${tripId}`);
    return res.data.result as TripDetail;
  } catch (error) {
    console.error("Error fetching trip detail:", error);
    throw error;
  }
}

function convertTripToTripItemProps(trip: Trip): TripItemProps {
  return {
    trip_id: trip.trip_id,
    operator_name: trip.operator_name || "Unknown Operator",
    route: {
      start_location: trip.route?.start_location || "Unknown",
      end_location: trip.route?.end_location || "Unknown",
    },
    departure_time: trip.departure_time || new Date().toISOString(),
    arrival_time: trip.arrival_time || new Date().toISOString(),
    duration: trip.duration || "0",
    available_seats: trip.available_seats || 0,
    price_per_seat: trip.price_per_seat || 0,
    average_rating: trip.average_rating || 0,
  };
}


export async function getSimilarTrips(
  tripId: number
): Promise<TripItemProps[]> {
  try {
    const res = await api.get(`api/trips/similar?routeId=${tripId}`);
    const trips = res.data.result as Trip[];
    return trips.map(convertTripToTripItemProps);
  } catch (error) {
    console.error("Error fetching similar trips:", error);
    return [];
  }
}
