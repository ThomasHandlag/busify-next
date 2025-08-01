"use client";

import { Button } from "@/components/ui/button";
import TripItem from "@/components/custom/trip_item";
import { TripItemProps } from "@/app/passenger/page";

interface SimilarTripsSectionProps {
  trips: TripItemProps[];
}

export function SimilarTripsSection({ trips }: SimilarTripsSectionProps) {
  return (
    <div className="container mb-10 mx-auto lg:px-4 lg:py-4 md:px-4 md:py-4 sm:pb-20">
      <div className="flex items-center justify-between p-2">

        <h2 className="text-xl font-semibold px-4">Các chuyến đi tương tự</h2>
        <Button variant="link" size="sm">
          Xem tất cả
        </Button>
      </div>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 overflow-x-auto pb-4">
        {trips.map((trip) => (
          <div key={trip.trip_id} className="min-w-[280px]">
            <TripItem trip={trip} />
          </div>
        ))}
      </div>
    </div>
  );
}
