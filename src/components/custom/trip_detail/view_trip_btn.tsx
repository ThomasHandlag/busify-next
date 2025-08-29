"use client";

import { useTripFilter } from "@/lib/contexts/TripFilterContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export const ViewTripBtn = ({ name }: { name: string }) => {
  const filter = useTripFilter();
  const navigate = useRouter();
  return (
    <Button
      variant="outline"
      className="w-full mt-4"
      onClick={() => {
        console.log("Filter by operator:", name);
        filter.handleApplyFilters({
          operatorName: name,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          availableSeats: 1,
        });
        navigate.push("/trips");
      }}
    >
      Xem tất cả chuyến của nhà xe này
    </Button>
  );
};

export default ViewTripBtn;
