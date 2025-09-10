"use client";

import { createContext, useContext } from "react";

import { TripFilterQuery, TripItemProps } from "../data/trip";

export interface TripPagerType {
  page: number;
  size: number;
  totalPages: number;
  isFirst: boolean;
  isLast: boolean;
}

interface TripFilterContextType {
  query: TripFilterQuery | undefined;
  trips: TripItemProps[];
  page: number;
  handlePageChange: (page: number) => void;
  handleApplyFilters: (filters: TripFilterQuery | undefined) => Promise<void>;
  isLoading: boolean;
  pager: TripPagerType | undefined;
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
