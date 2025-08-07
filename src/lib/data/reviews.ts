import api from "./axios-instance";

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
    return [];
  }
};

const getReviewsByTripId = async (tripId: number): Promise<Review[]> => {
  try {
    const response = await api.get(`api/reviews/trip/${tripId}`);
    return response.data.result.reviews;
  } catch (error) {
    return [];
  }
};

const addReview = async (review: {
  customerId: number;
  rating: number;
  comment: string;
  tripId: number;
}) => {
  try {
    const response = await api.post(`api/reviews/trip`, review);
    return response.data.result;
  } catch (error) {
    return null;
  }
};

const addReviewClient = async (review: {
  customerId: number;
  rating: number;
  comment: string;
  tripId: number;
}) => {
  try {
    const response = await fetch(`/api/review`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(review),
    });
    if (!response.ok) {
      throw new Error("Failed to add review");
    }
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("Error submitting review:", error);
    throw error; // Re-throw for handling in the UI
  }
};

export {
  getReviewsByOperatorId,
  getReviewsByCustomerId,
  getReviewsByTripId,
  addReview,
  addReviewClient,
};
