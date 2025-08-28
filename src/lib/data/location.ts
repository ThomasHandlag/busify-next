import api from "./axios-instance";
import ResponseError, { AsyncCallback } from "./response_error";
export interface Location {
  id?: number;
  address: string;
  city: string;
  latitude: number;
  name: string;
  longitude: number;
  time_offset_from_start: number | null;
}

export const getAllLocationsClient = async (
  callback: AsyncCallback
): Promise<Location[]> => {
  const response = await fetch("/api/locations");
  if (!response.ok) {
    const errorResponse = (await response.json()) as ResponseError;
    callback(errorResponse.message || "Failed to fetch locations");
  }
  return response.json();
};

export const getAllLocations = async (): Promise<Location[]> => {
  const response = await api.get("api/locations");
  if (response.status !== 200) {
    throw new Error("Failed to fetch locations");
  }
  return response.data.result;
};
