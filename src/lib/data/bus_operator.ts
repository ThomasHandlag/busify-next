// lib/data/operator.ts
import { AxiosError } from "axios";
import axios from "./axios-instance";
import api from "./axios-instance";

export interface BusOperatorDetail {
  id: number;
  name: string;
  email: string;
  hotline: string;
  description: string;
  logoUrl: string;
  address: string;
  rating: number;
  totalReviews: number;
}

export interface BusOperatorRating {
  id: number;
  name: string;
  logo: string;
  description: string;
  averageRating: number;
  hotline: string;
  totalReviews: number;
}

export interface BusOperator {
  id: number;
  name: string;
  hotline: string;
  address: string;
  email: string;
  description: string;
  status: string;
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

export async function getBusOperatorsRating(
  limit = 10
): Promise<BusOperatorRating[]> {
  try {
    const res = await api.get(`api/bus-operators/rating?limit=${limit}`);
    return res.data.result as BusOperatorRating[];
  } catch (error) {
    console.error("Error fetching bus operators rating:", error);
    throw error;
  }
}

export async function getBusOperatorById(
  id: number
): Promise<BusOperatorDetail | null> {
  try {
    console.log("Fetching bus operator with ID:", id);
    const res = await api.get(`api/bus-operators/${id}`);
    return res.data.result as BusOperatorDetail;
  } catch (e) {
    const error = e as AxiosError;
    console.error("Error fetching bus operator by ID:", error);
    console.log("Response data:", error.response);
    return null;
  }
}

export async function getAllBusOperatorsClient(): Promise<BusOperator[]> {
  try {
    const res = await fetch("/api/operator");
    if (!res.ok) {
      throw new Error("Failed to fetch bus operators");
    }
    const data = await res.json();
    return data as BusOperator[];
  } catch (error) {
    console.error("Error fetching client bus operators:", error);
    return [];
  }
}
