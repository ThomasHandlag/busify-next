"use client";

import { ReactNode, useState } from "react";
import { filterTrips, TripFilterQuery } from "@/lib/data/trip";
import { TripItemProps } from "@/app/passenger/page";
import TripFilterContext from "../../lib/contexts/TripFilterContext";

interface TripFilterProviderProps {
  children: ReactNode;
}

export const TripFilterProvider = ({ children }: TripFilterProviderProps) => {
  const [trips, setTrips] = useState<TripItemProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleApplyFilters = async (filters: TripFilterQuery) => {
    setIsLoading(true);
    try {
      console.log("Filters to send:", filters);
      const result = await filterTrips(filters);
      console.log("Filtered result:", result);
      setTrips(result);
    } catch (error) {
      console.error("Error applying filters:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    trips,
    handleApplyFilters,
    isLoading,
  };

  return (
    <TripFilterContext.Provider value={value}>
      {children}
    </TripFilterContext.Provider>
  );
};

export default TripFilterProvider;
