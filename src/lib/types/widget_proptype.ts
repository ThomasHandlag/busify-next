// This file defines the type for any widget props.

interface BusifyRoute {
  routeId: number;
  routeName: string;
  durationHours: string;
  startingPrice: number;
}

interface Review {
  reviewId: number;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface Complaint {
  id: number;
  title: string;
  description: string;
  customerName: string;
  createdAt: string;
}

export type { Review, BusifyRoute, Complaint };
