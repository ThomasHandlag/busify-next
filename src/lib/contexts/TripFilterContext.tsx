"use client";

import { createContext, useContext } from "react";

import { TripFilterQuery, TripItemProps } from "../data/trip";

interface TripFilterContextType {
  trips: TripItemProps[];
  handleApplyFilters: (filters: TripFilterQuery| null) => Promise<void>;
  isLoading: boolean;
}

const TripFilterContext = createContext<TripFilterContextType | undefined>(
  undefined
);

export const useTripFilter = () => {
  const context = useContext(TripFilterContext);
  if (context === undefined) {
    throw new Error("useTripFilter must be used within a TripFilterProvider");
  }
  return context;
};

export default TripFilterContext;
