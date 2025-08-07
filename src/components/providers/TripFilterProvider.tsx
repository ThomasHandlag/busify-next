"use client";

import { ReactNode, useEffect, useState } from "react";
import {
  filterTripsClient,
  getUpcomingTrips,
  TripFilterQuery,
} from "@/lib/data/trip";
import { TripItemProps } from "@/app/passenger/page";
import TripFilterContext from "../../lib/contexts/TripFilterContext";

interface TripFilterProviderProps {
  children: ReactNode;
}

export const TripFilterProvider = ({ children }: TripFilterProviderProps) => {
  const [trips, setTrips] = useState<TripItemProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState<TripFilterQuery | null>(null);

  const handleApplyFilters = async (filters: TripFilterQuery| null) => {
    setQuery(filters);
  };

  useEffect(() => {
    if (query) {
      const fetchedTrips = async () => {
        setIsLoading(true);
        try {
          const filteredTrips = await filterTripsClient(query);
          setTrips(filteredTrips);
        } catch (error) {
          console.error("Error filtering trips:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchedTrips();
    } else {
      const fetchInitialTrips = async () => {
        setIsLoading(true);
        try {
          const initialTrips = await getUpcomingTrips();
          setTrips(initialTrips);
        } catch (error) {
          console.error("Error fetching initial trips:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchInitialTrips();
    }
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
