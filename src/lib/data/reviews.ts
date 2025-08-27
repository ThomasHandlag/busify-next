import api from "./axios-instance";

import ResponseError, { printError } from "./response_error";

export interface Review {
  reviewId: number;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
  tripId?: number; // Adding tripId as optional for backward compatibility
}

const getReviewsByOperatorId = async (
  operatorId: number
): Promise<Review[]> => {
  try {
    const response = await api.get(`api/reviews/bus-operator/${operatorId}`);
    return response.data.result.reviews;
  } catch (error) {
    const errorMessage = error as ResponseError;
    printError(errorMessage);
    return [];
  }
};

const getReviewsByCustomerId = async (
  customerId: number
): Promise<Review[]> => {
  try {
    const response = await api.get(`api/reviews/customer/${customerId}`);
    return response.data.result.reviews;
  } catch (error) {
    const errorMessage = error as ResponseError;
    printError(errorMessage);
    return [];
  }
};

const getReviewsByTripId = async (tripId: number): Promise<Review[]> => {
  console.log("Fetching reviews for tripId:", tripId);
  try {
    const response = await api.get(`api/reviews/trip/${tripId}`);
    return response.data.result.reviews;
  } catch (error) {
    console.log(error);
    const errorMessage = error as ResponseError;
    printError(errorMessage);
    return [];
  }
};

const addReviewClient = async (
  review: {
    rating: number;
    comment: string;
    tripId: number;
  },
  accessToken: string,
  callBack: (value: string) => void
) => {
    const response = await fetch(`/api/review`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(review),
    });
    if (!response.ok) {
      const errorData = (await response.json()) as ResponseError;
      console.log(errorData);
      callBack(errorData.message || "Failed to add review");
      return;
    }
    const data = await response.json();
    callBack("Add review successfully");
    return data.result;
};

export {
  getReviewsByOperatorId,
  getReviewsByCustomerId,
  getReviewsByTripId,
  addReviewClient,
};