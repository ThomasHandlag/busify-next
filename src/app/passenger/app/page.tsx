"use client";

import { useState } from "react";
import { TripItemProps } from "../page";
import { filterTrips } from "@/lib/data/trip";
import TripItem from "@/components/custom/trip_item";
import SearchFilter from "@/components/custom/search_filter";

const AppPage = () => {
  const [trips, setTrips] = useState<TripItemProps[]>([]);

  const handleApplyFilters = async (filters: any) => {
    console.log("Filters to send:", filters); // Debug
    const result = await filterTrips(filters);
    console.log("Filtered result:", result); // Debug
    setTrips(result);
  };

  return (
    <div className="grid gap-4 p-4">
      <SearchFilter onApplyFilters={handleApplyFilters} />
      <div className="grid lg:grid-cols-3 sm:grid-cols-1 gap-4">
        {trips.map((trip, index) => (
          <TripItem
            key={trip.trip_id || index}
            trip={{
              trip_id: trip.trip_id,
              operator_name: trip.operator_name,
              route: {
                start_location: trip.route.start_location,
                end_location: trip.route.end_location,
              },
              departure_time: trip.departure_time,
              arrival_time: trip.arrival_time,
              available_seats: trip.available_seats || 20,
              average_rating: trip.average_rating,
              price_per_seat: trip.price_per_seat,
              duration: trip.duration,
            }}
          />
        ))}
      </div>
  );
};

export default AppPage;
