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
    // // use fetch instead
    // const response = await fetch(
    //   `http://localhost:8080/api/complaints/customer`,
    //   {
    //     method: "GET",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${token}`,
    //     },
    //   }
    // );
    // const data = await response.json();

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

export {
  getComplaintsByOperator,
  getComplaintsByTripId,
  getComplaintsByCurrentUser,
};
