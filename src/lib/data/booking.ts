import api, { ApiFnParams } from "./axios-instance";

export interface BookingData {
  booking_id: string;
  route_name: string;
  departure_time: string;
  arrival_time: string;
  departure_address: string;
  arrival_address: string;
  booking_code: string;
  status: string;
  total_amount: number;
  booking_date: string;
  passenger_count: number;
  payment_method: string;
}

export interface Booking {
  booking_id: string;
  route_name: string;
  departure_time: string;
  arrival_time: string;
  departure_address: string;
  arrival_address: string;
  booking_code: string;
  status: string;
  total_amount: number;
  booking_date: string;
  passenger_count: number;
  payment_method: string;
}

export interface BookingResponse {
  result: Booking[];
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface BookingDetailResponse {
  passenger_name: string;
  phone: string;
  email: string;
  booking_id: string;
  route_start: {
    name: string;
    address: string;
    city: string;
  };
  route_end: {
    name: string;
    address: string;
    city: string;
  };
  operator_name: string;
  departure_time: string;
  arrival_estimate_time: string;
  bus: {
    model: string;
    license_plate: string;
  };
  tickets: Array<{
    seat_number: string;
    ticket_code: string;
  }>;
  status: string;
  payment_info: {
    amount: number;
    method: string;
    timestamp: string;
  };
}

export async function getBookingHistory(
  params: ApiFnParams
): Promise<BookingResponse> {
  const response = await api.get(
    `/api/bookings?page=${params.page}&size=${params.size}`,
    {}
  );
  if (response.status !== 200) {
    params.callback(
      response.data.message ??
        params.localeMessage ??
        "Failed to fetch booking history"
    );
  }
  return response.data.result;
}

export async function getBookingDetails(
  params: ApiFnParams
): Promise<BookingDetailResponse> {
  const response = await api.get(`/api/bookings/${params.bookingCode}`);
  if (response.status !== 200) {
    params.callback(
      response.data.message ??
        params.localeMessage ??
        "Failed to fetch booking details"
    );
  }
  return response.data.result[0];
}
