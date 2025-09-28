"use client";

import { useTripFilter } from "@/lib/contexts/TripFilterContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export const ViewTripBtn = ({ name }: { name: string }) => {
  const filter = useTripFilter();
  const navigate = useRouter();
  const t = useTranslations("TripDetail");
  return (
    <Button
      aria-label="View all trips"
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
      {t("viewAllTrips")}
    </Button>
  );
};

export default ViewTripBtn;
