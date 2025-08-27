"use client";

import { ReactNode, useEffect, useState, useCallback } from "react";
import { filterTripsClient, TripFilterQuery } from "@/lib/data/trip";

import { TripItemProps } from "@/lib/data/trip";
import TripFilterContext from "../../lib/contexts/TripFilterContext";

interface TripFilterProviderProps {
  children: ReactNode;
}

export const TripFilterProvider = ({ children }: TripFilterProviderProps) => {
  const [trips, setTrips] = useState<TripItemProps[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState<TripFilterQuery | null>(null);
  const [total, setTotal] = useState(0);

  const handleApplyFilters = useCallback(
    async (filters: TripFilterQuery | null) => {
      setQuery(filters);
    },
    []
  );

  useEffect(() => {
    // get current time zone
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const fetchTrips = async () => {
      setIsLoading(true);
      try {
        if (query) {
          const filteredTrips = await filterTripsClient(
            { ...query, timeZone },
            page
          );
          setTrips(filteredTrips.data);
        } else {
          const filteredTrips = await filterTripsClient(
            {
              routeId: undefined,
              departureDate: undefined,
              busModels: undefined,
              untilTime: undefined,
              amenities: undefined,
              operatorName: undefined,
              timeZone,
              availableSeats: 1,
            },
            page
          );
          setTrips(filteredTrips.data);
          setTotal(filteredTrips.total);
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
  }, [query, page]);

  const value = {
    trips,
    handleApplyFilters,
    isLoading,
    page,
    handlePageChange: setPage,
    total,
  };

  return (
    <TripFilterContext.Provider value={value}>
      {children}
    </TripFilterContext.Provider>
  );
};

export default TripFilterProvider;
