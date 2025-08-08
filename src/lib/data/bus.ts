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