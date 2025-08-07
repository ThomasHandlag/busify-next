"use client";

import TripItem from "@/components/custom/trip_item";
import { useTripFilter } from "@/lib/contexts/TripFilterContext";

const AppPage = () => {
  const { trips, isLoading } = useTripFilter();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-lg">Loading trips...</div>
      </div>
    );
  }

  if (!trips || trips.length === 0) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-lg">No trips found.</div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 p-4">
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
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default AppPage;
