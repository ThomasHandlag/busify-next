import api from "./axios-instance";
import ResponseError, { printError } from "./response_error";

export interface Complaint {
  id: number;
  title: string;
  description: string;
  customerName: string;
  createdAt: string;
}


const getComplaintsByOperator = async (
  operatorId: number
): Promise<Complaint[]> => {
  try {
    const response = await api.get(`api/complaints/bus-operator/${operatorId.toString()}`);
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

export { getComplaintsByOperator, getComplaintsByTripId };
