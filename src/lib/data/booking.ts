import api from "./axios-instance";

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

export const mockBookingDetailResponse: BookingDetailResponse = {
  passenger_name: "Nguyễn An Toàn",
  phone: "0123456789",
  email: "antoan@gmail.com",
  booking_id: "1",
  route_start: {
    name: "Bến xe Miền Đông",
    address: "292 Đinh Bộ Lĩnh",
    city: "TP.HCM",
  },
  route_end: {
    name: "Bến xe Miền Tây",
    address: "395 Kinh Dương Vương",
    city: "TP.HCM",
  },
  operator_name: "Futa Bus Lines",
  departure_time: "2025-10-01T08:00:00Z",
  arrival_estimate_time: "2025-10-01T10:10:00Z",
  bus: {
    model: "Hyundai Universe",
    license_plate: "51B-12345",
  },
  tickets: [
    {
      seat_number: "B.4.1",
      ticket_code: "TK002",
    },
    {
      seat_number: "B.4.2",
      ticket_code: "TK003",
    },
  ],
  status: "pending",
  payment_info: {
    amount: 500000,
    method: "Chuyển khoản",
    timestamp: "2025-09-25T10:15:00Z",
  },
};

export async function getBookingHistory(
  page = 1,
  size = 10
): Promise<BookingResponse> {
  const response = await api.get(`/api/bookings?page=${page}&size=${size}`);
  return response.data.result;
}

export async function getBookingDetails(
  bookingCode: string
): Promise<BookingDetailResponse> {
  const response = await api.get(`/api/bookings/${bookingCode}`);
  return response.data.result[0];
}
