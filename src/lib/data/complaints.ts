import { Complaint } from "../types/widget_proptype";
import api from "./axios-instance";

const getComplaintsByOperator = async (
  operatorId: string
): Promise<Complaint[]> => {
  try {
    const response = await api.get(`/complaints/bus-operator/${operatorId}`);
    return response.data.result.complaints;
  } catch (error) {
    return [];
  }
};

const getComplaintsByTripId = async (tripId: number): Promise<Complaint[]> => {
  try {
    const response = await api.get(`/complaints/trip/${tripId}`);
    return response.data.result.complaints;
  } catch (error) {
    return [];
  }
};

export { getComplaintsByOperator, getComplaintsByTripId };
