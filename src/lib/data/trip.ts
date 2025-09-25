import api, { ApiFnParams } from "./axios-instance";
import { Location } from "./location";

export interface TripItemProps {
  trip_id: number;
  operator_name: string;
  operator_avatar: string;
  route: {
    start_location: string;
    end_location: string;
  };
  departure_time: string;
  arrival_time: string;
  available_seats: number;
  average_rating: number;
  price_per_seat: number;
  status: string;
  duration: string;
}
export interface TripDetail {
  trip_id: number;
  departure_time: string;
  arrival_time: string;
  available_seats: number;
  average_rating: number;
  total_reviews: number;
  bus: {
    bus_id: number;
    license_plate: string;
    name: string;
    total_seats: number;
    amenities: string[];
    images: {
      id: number;
      url: string;
      is_primary: boolean;
    }[];
  };
  price_per_seat: number;
  route: {
    route_id: number;
    start_location: Location;
    estimated_duration: string;
    end_location: Location;
  };
  operator_name: string;
  operator_id: number;
  route_stops: Location[];
}

export interface Trip {
  trip_id: number;
  operator_name: string;
  route: {
    start_location: string;
    end_location: string;
  };
  departure_time: string;
  arrival_time: string;
  available_seats: number;
  average_rating: number;
  price_per_seat: number;
  duration: string;
}

export interface TripFilterQuery {
  startLocation?: number | undefined;
  endLocation?: number | undefined;
  departureDate?: Date | undefined;
  busModels?: string[];
  untilTime?: Date | undefined;
  amenities?: string[];
  operatorName?: string | undefined;
  timeZone: string;
  availableSeats: number;
  priceRange?: number[] | undefined;
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

export interface TripFilterResponse {
  total: number;
  page: number;
  size: number;
  totalPages: number;
  isFirst: boolean;
  isLast: boolean;
  data: TripItemProps[];
}

export async function filterTrips(
  filters: TripFilterQuery,
  page: number,
  size = 10
): Promise<TripFilterResponse> {
  try {
    console.log("Filter Trips Request:", filters);
    const res = await api.post(
      `api/trips/filter?page=${page}&size=${size}`,
      filters
    );
    console.log("Filter Trips Response:", res);
    if (res && res.data.code == 200) {
      return res.data.result;
    } else {
      return {
        data: [],
        total: 0,
        page: 0,
        size: 20,
        totalPages: 0,
        isFirst: true,
        isLast: true,
      };
    }
  } catch (error) {
    console.error("Error filtering trips:", error);
    return {
      data: [],
      total: 0,
      page: 0,
      size: 20,
      totalPages: 0,
      isFirst: true,
      isLast: true,
    };
  }
}

export async function filterTripsClient(
  filters: TripFilterQuery,
  page: number,
  size = 20
): Promise<TripFilterResponse> {
  try {
    const res = await fetch(`/api/filter?page=${page}&size=${size}`, {
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
    return data.result as TripFilterResponse;
  } catch (error) {
    console.error("Error filtering trips client:", error);
    return {
      data: [],
      total: 0,
      page: 0,
      size: 20,
      totalPages: 0,
      isFirst: true,
      isLast: true,
    };
  }
}

export async function getTripDetail(tripId: number): Promise<TripDetail> {
  try {
    const res = await api.get(`api/trips/${tripId}`);
    return res.data.result;
  } catch (error) {
    console.error("Error fetching trip detail:", error);
    throw error;
  }
}

export async function getSimilarTrips(
  tripId: number
): Promise<TripItemProps[]> {
  try {
    const res = await api.get(`api/trips/similar/${tripId}`);
    return res.data.result as TripItemProps[];
  } catch (error) {
    console.error("Error fetching similar trips:", error);

    return [];
  }
}

export enum LocationRegion {
  NORTH = "NORTH",
  CENTRAL = "CENTRAL",
  SOUTH = "SOUTH",
}

export interface TripsByRegion {
  [key: string]: TripItemProps[];
}

export async function getTripsByRegions(
  params: ApiFnParams
): Promise<TripsByRegion> {
  const res = await api.get("api/trips/by-regions");
  const response = await res.data;
  if (res.status !== 200) {
    params.callback(response.message ?? params.localeMessage);
    return {};
  }
  return response.result.tripsByRegion as TripsByRegion;
}
