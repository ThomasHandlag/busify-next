// This file defines the type for any widget props.

interface BusifyRoute {
  routeId: number;
  routeName: string;
  durationHours: string;
  startingPrice: number;
}

interface Review {
  reviewId: number;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface Complaint {
  id: number;
  title: string;
  description: string;
  customerName: string;
  createdAt: string;
}

interface Trip {
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
  arrival_estimate_time?: string;
  duration_minutes?: number;
}

interface Location {
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  name?: string;
}

interface Bus {
  license_plate: string;
  name: string;
  layout_id: number;
  amenities: string[];
}

interface Operator {
  operator_name: string;
  operator_logo: string;
}

interface RouteStop {
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  time_offset_from_start: number;
}

interface TripDetail {
  trip_id: number;
  operator_name: string;
  operator_logo: string;
  route: {
    route_id: number;
    start_location: Location;
    end_location: Location;
  };
  route_stop: RouteStop[];
  departure_time: string;
  arrival_time: string;
  estimated_duration: string;
  available_seats: number;
  total_seats: number;
  price_per_seat: number;
  bus: Bus;
  average_rating: number;
  total_reviews: number;
  is_favorite: boolean;
}


export type { Review, BusifyRoute, Complaint, Trip, TripDetail, Location, Bus, Operator, RouteStop };

