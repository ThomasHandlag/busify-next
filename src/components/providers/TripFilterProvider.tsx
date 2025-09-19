"use client";

import { ReactNode, useEffect, useState, useCallback } from "react";
import { filterTripsClient, TripFilterQuery } from "@/lib/data/trip";

import { TripItemProps } from "@/lib/data/trip";
import TripFilterContext, {
  TripPagerType,
} from "../../lib/contexts/TripFilterContext";

interface TripFilterProviderProps {
  children: ReactNode;
}

export const TripFilterProvider = ({ children }: TripFilterProviderProps) => {
  const [trips, setTrips] = useState<TripItemProps[]>([]);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState<TripFilterQuery | undefined>(undefined);
  const [pager, setPager] = useState<TripPagerType | undefined>(undefined);

  const handleApplyFilters = useCallback(
    async (filters: TripFilterQuery | undefined) => {
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
          const filteredPriceTrips = filteredTrips.data.filter((trip) => {
            if (query.priceRange) {
              return (
                trip.price_per_seat &&
                trip.price_per_seat >= query.priceRange[0] &&
                trip.price_per_seat <= query.priceRange[1]
              );
            }
            return true;
          });
          setTrips(filteredPriceTrips);
        } else {
          const filteredTrips = await filterTripsClient(
            {
              startLocation: undefined,
              endLocation: undefined,
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
          setPager({
            page: filteredTrips.page,
            size: filteredTrips.size,
            totalPages: filteredTrips.totalPages,
            isFirst: filteredTrips.isFirst,
            isLast: filteredTrips.isLast,
          });
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
    pager,
    query,
  };

  return (
    <TripFilterContext.Provider value={value}>
      {children}
    </TripFilterContext.Provider>
  );
};

export default TripFilterProvider;
