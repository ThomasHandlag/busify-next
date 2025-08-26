import api from "./axios-instance";

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
  id: number;
  name: string;
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

export async function getAllBusModelsClient(): Promise<string[]> {
  try {
    const res = await fetch("/api/bus-models", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    return data.result.map((model: BusModel) => model.name);
  } catch (error) {
    console.error("Error fetching bus models:", error);
    return [];
  }
}
