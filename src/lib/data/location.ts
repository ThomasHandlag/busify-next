import { FilterLocationType } from "@/components/custom/search_filter_sidebar";
import api, { ApiFnParams } from "./axios-instance";
import ResponseError from "./response_error";
export interface Location {
  address: string;
  city: string;
  latitude: number;
  name: string;
  longitude: number;
  time_offset_from_start: number | null;
}

export const getAllLocationsClient = async (
  params: ApiFnParams
): Promise<FilterLocationType[]> => {
  const response = await fetch("/api/locations");
  if (!response.ok) {
    const errorResponse = (await response.json()) as ResponseError;
    params.callback(
      errorResponse.message ??
        params.localeMessage ??
        "Failed to fetch locations"
    );
  }
  return response.json();
};

export const getAllLocationsServer = async (): Promise<Location[]> => {
  const response = await api.get("api/locations");
  if (response.status !== 200) {
    throw new Error("Failed to fetch locations");
  }
  return response.data.result;
};
