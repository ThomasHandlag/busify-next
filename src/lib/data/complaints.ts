import api from "./axios-instance";

import ResponseError, { printError } from "./response_error";

export interface Complaint {
  id: number;
  title: string;
  description: string;
  status: "New" | "in_progress" | "pending" | "rejected" | "resolved"; // Thêm status để khớp với trạng thái mới
  createdAt: string;
  updatedAt: string; // Thêm updatedAt
  tripId?: number; // Thêm tripId, loại bỏ customerName nếu không cần
}

export interface ComplaintAddDTO {
  title: string;
  description: string;
  bookingCode: string;
  status: "New";
}

const getComplaintsByOperator = async (
  operatorId: number
): Promise<Complaint[]> => {
  try {
    const response = await api.get(
      `api/complaints/bus-operator/${operatorId.toString()}`
    );
    return response.data.result.complaints;
  } catch (error) {
    const errorMessage = error as ResponseError;
    printError(errorMessage);
    return [];
  }
};

const getComplaintsByTripId = async (tripId: number): Promise<Complaint[]> => {
  try {
    const response = await api.get(`api/complaints/trip/${tripId}`);
    return response.data.result.complaints;
  } catch (error) {
    const errorMessage = error as ResponseError;
    printError(errorMessage);
    return [];
  }
};

const getComplaintsByCurrentUser = async (
  token: string
): Promise<Complaint[]> => {
  try {
    const response = await api.get(`api/complaints/customer`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.result.complaints;
  } catch (error) {
    const errorMessage = error as ResponseError;
    printError(errorMessage);
    return [];
  }
};

const createComplaint = async (
  token: string,
  complaint: ComplaintAddDTO
): Promise<Complaint | null> => {
  try {
    const response = await api.post(`api/complaints/booking`, complaint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data.result);
    return response.data.result;
  } catch (error) {
    const errorMessage = error as ResponseError;
    printError(errorMessage);
    return null;
  }
};

export {
  getComplaintsByOperator,
  getComplaintsByTripId,
  getComplaintsByCurrentUser,
  createComplaint,
};
