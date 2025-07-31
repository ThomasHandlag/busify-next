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
}


export type { Review, BusifyRoute, Complaint, Trip };
