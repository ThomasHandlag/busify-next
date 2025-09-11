import api, { ApiFnParams } from "./axios-instance";

export interface BookingData {
  trip_id: string;
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
  result: BookingData[];
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface BookingDetailResponse {
  trip_id: string;
  passenger_name: string;
  phone: string;
  email: string;
  booking_id: string;
  booking_code: string;
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
    `api/bookings?page=${params.page}&size=${params.size}`,
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
  const response = await api.get(`api/bookings/${params.bookingCode}`);
  if (response.status !== 200) {
    params.callback(
      response.data.message ??
        params.localeMessage ??
        "Failed to fetch booking details"
    );
  }
  return response.data.result[0];
}

// Thêm hàm mới để tải vé PDF
export async function downloadBookingPdf(params: {
  bookingCode: string;
  accessToken: string;
  callback: (message: string) => void;
  localeMessage?: string;
}): Promise<Blob | null> {
  try {
    const response = await api.get(`api/bookings/${params.bookingCode}/pdf`, {
      headers: {
        Authorization: `Bearer ${params.accessToken}`,
      },
      responseType: "blob", // Yêu cầu axios trả về dữ liệu dạng blob
    });

    if (response.status !== 200) {
      params.callback(
        params.localeMessage ?? "Không thể tải vé. Vui lòng thử lại."
      );
      return null;
    }
    return response.data;
  } catch (error) {
    console.error("Error downloading PDF:", error);
    params.callback(
      params.localeMessage ?? "Có lỗi xảy ra khi tải vé. Vui lòng thử lại."
    );
    return null;
  }
}

// Thêm hàm mới để hủy vé
export async function cancelBooking(params: {
  bookingCode: string;
  accessToken: string;
  callback: (message: string) => void;
  localeMessage?: string;
}): Promise<boolean> {
  try {
    const response = await api.delete(`api/bookings/${params.bookingCode}`, {
      headers: {
        Authorization: `Bearer ${params.accessToken}`,
      },
    });
    if (response.status !== 200) {
      params.callback(
        response.data.message ??
          params.localeMessage ??
          "Không thể hủy vé. Vui lòng thử lại."
      );
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error cancelling booking:", error);
    params.callback(
      params.localeMessage ?? "Không thể hủy vé. Vui lòng thử lại."
    );
    return false;
  }
}
