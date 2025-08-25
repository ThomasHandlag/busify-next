"use client";

import { ReactNode, useEffect, useState, useCallback } from "react";
import {
  filterTripsClient,
  getUpcomingTrips,
  TripFilterQuery,
} from "@/lib/data/trip";

import { TripItemProps } from "@/lib/data/trip";
import TripFilterContext from "../../lib/contexts/TripFilterContext";

interface TripFilterProviderProps {
  children: ReactNode;
}

export const TripFilterProvider = ({ children }: TripFilterProviderProps) => {
  const [trips, setTrips] = useState<TripItemProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState<TripFilterQuery | null>(null);

  const handleApplyFilters = useCallback(
    async (filters: TripFilterQuery | null) => {
      setQuery(filters);
    },
    []
  );

  useEffect(() => {
    const fetchTrips = async () => {
      setIsLoading(true);
      try {
        if (query) {
          const filteredTrips = await filterTripsClient(query);
          setTrips(filteredTrips);
        } else {
          const initialTrips = await getUpcomingTrips();
          setTrips(initialTrips);
        }
      } catch (error) {
        console.error("Error fetching trips:", error);
        setTrips([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce the API call by 300ms
    const timeoutId = setTimeout(fetchTrips, 300);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [query]);

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
