import { Review } from "../types/widget_proptype";
import api from "./axios-instance";

const getReviewsByOperatorId = async (
  operatorId: number
): Promise<Review[]> => {
  try {
    const response = await api.get(`/reviews/bus-operator/${operatorId}`);
    return response.data.result.reviews;
  } catch (error) {
    return [];
  }
};

const getReviewsByCustomerId = async (
  customerId: number
): Promise<Review[]> => {
  try {
    const response = await api.get(`/reviews/customer/${customerId}`);
    return response.data.result.reviews;
  } catch (error) {
    return [];
  }
};

const getReviewsByTripId = async (tripId: number): Promise<Review[]> => {
  try {
    const response = await api.get(`/reviews/trip/${tripId}`);
    return response.data.result.reviews;
  } catch (error) {
    return [];
  }
};

export { getReviewsByOperatorId, getReviewsByCustomerId, getReviewsByTripId };
