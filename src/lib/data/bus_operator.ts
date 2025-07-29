// lib/data/operator.ts
import axios from "./axios-instance";

export interface BusOperator {
  id: number;
  name: string;
}

export async function getAllBusOperators(): Promise<BusOperator[]> {
  try {
    const res = await axios.get("/api/bus-operators");
    return res.data.result;
  } catch (error) {
    console.error("Error fetching bus operators:", error);
    return [];
  }
}
