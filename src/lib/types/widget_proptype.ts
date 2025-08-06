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

interface BookingData {
  booking_id: string;
  booking_code: string;
  route_name: string;
  departure_address: string;
  arrival_address: string;
  departure_time: string;
  arrival_time: string;
  status:
    | "confirmed"
    | "pending"
    | "completed"
    | "canceled_by_operator"
    | "canceled_by_user";
  booking_date: string;
  passenger_count: number;
  payment_method: string;
  total_amount: number;
}

interface BookingResponse {
  result: BookingData[];
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

interface RouteLocation {
  name: string;
  address: string;
  city: string;
}

interface BusInfo {
  model: string;
  license_plate: string;
}

interface TicketInfo {
  seat_number: string;
  ticket_code: string;
}

interface PaymentInfo {
  amount: number;
  method: string;
  timestamp: string;
}

interface BookingDetailResponse {
  passenger_name: string;
  phone: string;
  email: string;
  booking_id: string;
  route_start: RouteLocation;
  route_end: RouteLocation;
  operator_name: string;
  departure_time: string;
  arrival_estimate_time: string;
  bus: BusInfo;
  tickets: TicketInfo[];
  status:
    | "pending"
    | "confirmed"
    | "completed"
    | "canceled_by_user"
    | "canceled_by_operator";
  payment_info: PaymentInfo;
}

export type {
  Review,
  BusifyRoute,
  Complaint,
  Trip,
  TripDetail,
  Location,
  Bus,
  Operator,
  RouteStop,
  BookingData,
  BookingResponse,
  RouteLocation,
  BusInfo,
  TicketInfo,
  PaymentInfo,
  BookingDetailResponse,
};
