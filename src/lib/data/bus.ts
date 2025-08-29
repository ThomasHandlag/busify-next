import api, { ApiFnParams } from "./axios-instance";
import ResponseError from "./response_error";

export interface BusLayout {
  rows: number;
  cols: number;
  floors: number;
}

export async function getBusSeatsLayout(
  busId: number
): Promise<BusLayout | null> {
  try {
    const res = await api.get(`api/bus/layout/${busId}`);
    return res.data.result as BusLayout;
  } catch (error) {
    console.error("Error fetching seat layouts:", error);
    return null;
  }
}

export interface BusModel {
  modelId: number;
  modelName: string;
}

export async function getAllBusModels(): Promise<BusModel[]> {
  try {
    const res = await api.get("api/bus-models");
    return res.data.result as BusModel[];
  } catch (error) {
    console.error("Error fetching bus routes:", error);
    return [];
  }
}

export async function getAllBusModelsClient(
  params: ApiFnParams
): Promise<string[]> {
  const res = await fetch("/api/bus-models", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  if (!res.ok) {
    const error = data as ResponseError;
    params.callback(error.message ?? data.message);
    return [];
  }
  return data.result.map((model: BusModel) => model.modelName);
}
