import {
  BookingDetailResponse,
  BookingResponse,
} from "../types/widget_proptype";
import api from "./axios-instance";

const mockBookingResponse: BookingResponse = {
  result: [
    {
      booking_id: "2",
      route_name: "Đà Nẵng - Hà Nội",
      departure_time: "2025-10-01T08:00:00Z",
      arrival_time: "2025-10-01T16:00:00Z",
      departure_address: "Bến xe Miền Đông",
      arrival_address: "Bến xe Đà Lạt",
      booking_code: "TWNT3",
      status: "pending",
      total_amount: 1000000,
      booking_date: "2025-09-30T10:00:00Z",
      passenger_count: 1,
      payment_method: "Credit Card",
    },
    {
      booking_id: "3",
      route_name: "TP.HCM - Đà Lạt",
      departure_time: "2025-01-15T08:00:00Z",
      arrival_time: "2025-01-15T14:00:00Z",
      departure_address: "Bến xe Miền Đông",
      arrival_address: "Bến xe Đà Lạt",
      booking_code: "BUSIFY-2025-001",
      status: "confirmed",
      total_amount: 700000,
      booking_date: "2025-01-10T10:30:00Z",
      passenger_count: 2,
      payment_method: "Credit Card",
    },
    {
      booking_id: "4",
      route_name: "Đà Nẵng - Nha Trang",
      departure_time: "2024-12-25T14:30:00Z",
      arrival_time: "2024-12-25T22:30:00Z",
      departure_address: "Bến xe Đà Nẵng",
      arrival_address: "Bến xe Nha Trang",
      booking_code: "BUSIFY-2024-156",
      status: "completed",
      total_amount: 800000,
      booking_date: "2024-12-20T09:15:00Z",
      passenger_count: 2,
      payment_method: "Digital Wallet",
    },
    {
      booking_id: "5",
      route_name: "TP.HCM - Cần Thơ",
      departure_time: "2024-12-28T16:00:00Z",
      arrival_time: "2024-12-28T20:00:00Z",
      departure_address: "Bến xe Miền Tây",
      arrival_address: "Bến xe Cần Thơ",
      booking_code: "BUSIFY-2024-178",
      status: "canceled_by_user",
      total_amount: 250000,
      booking_date: "2024-12-26T11:20:00Z",
      passenger_count: 1,
      payment_method: "Credit Card",
    },
    {
      booking_id: "6",
      route_name: "Hà Nội - Hải Phòng",
      departure_time: "2025-02-10T09:00:00Z",
      arrival_time: "2025-02-10T12:00:00Z",
      departure_address: "Bến xe Mỹ Đình",
      arrival_address: "Bến xe Hải Phòng",
      booking_code: "BUSIFY-2025-025",
      status: "confirmed",
      total_amount: 400000,
      booking_date: "2025-02-05T14:30:00Z",
      passenger_count: 1,
      payment_method: "Digital Wallet",
    },
    {
      booking_id: "7",
      route_name: "TP.HCM - Vũng Tàu",
      departure_time: "2025-01-20T07:30:00Z",
      arrival_time: "2025-01-20T10:30:00Z",
      departure_address: "Bến xe Miền Đông",
      arrival_address: "Bến xe Vũng Tàu",
      booking_code: "BUSIFY-2025-012",
      status: "pending",
      total_amount: 300000,
      booking_date: "2025-01-18T11:00:00Z",
      passenger_count: 1,
      payment_method: "Credit Card",
    },
    {
      booking_id: "8",
      route_name: "Đà Nẵng - Huế",
      departure_time: "2024-11-15T15:00:00Z",
      arrival_time: "2024-11-15T18:00:00Z",
      departure_address: "Bến xe Đà Nẵng",
      arrival_address: "Bến xe Huế",
      booking_code: "BUSIFY-2024-089",
      status: "completed",
      total_amount: 500000,
      booking_date: "2024-11-10T16:45:00Z",
      passenger_count: 2,
      payment_method: "Bank Transfer",
    },
    {
      booking_id: "9",
      route_name: "TP.HCM - Phan Thiết",
      departure_time: "2024-12-05T13:00:00Z",
      arrival_time: "2024-12-05T17:30:00Z",
      departure_address: "Bến xe Miền Đông",
      arrival_address: "Bến xe Phan Thiết",
      booking_code: "BUSIFY-2024-134",
      status: "canceled_by_operator",
      total_amount: 350000,
      booking_date: "2024-12-01T09:20:00Z",
      passenger_count: 1,
      payment_method: "Digital Wallet",
    },
    {
      booking_id: "10",
      route_name: "Hà Nội - Thanh Hóa",
      departure_time: "2025-03-01T06:00:00Z",
      arrival_time: "2025-03-01T10:00:00Z",
      departure_address: "Bến xe Giáp Bát",
      arrival_address: "Bến xe Thanh Hóa",
      booking_code: "BUSIFY-2025-045",
      status: "confirmed",
      total_amount: 600000,
      booking_date: "2025-02-25T08:15:00Z",
      passenger_count: 3,
      payment_method: "Credit Card",
    },
  ],
  pageNumber: 1,
  pageSize: 10,
  totalRecords: 20,
  totalPages: 2,
  hasNext: true,
  hasPrevious: false,
};

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
  userId: number,
  page = 1,
  size = 10
): Promise<BookingResponse> {
  const response = await api.get(`/api/bookings?userId=${userId}&page=${page}&size=${size}`);
  console.log("Booking history response:", response.data);
  return response.data.result;
  // return mockBookingResponse;
}

export async function getBookingDetails(
  bookingCode: string
): Promise<BookingDetailResponse> {
  const response = await api.get(`/api/bookings/${bookingCode}`);
  return response.data.result[0];
  // return mockBookingDetailResponse;
}
