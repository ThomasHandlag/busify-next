import { getUpcomingTrips } from "@/lib/data/trip";
import TripItem from "@/components/custom/trip_item";
import { TripItemProps } from "../page";

const AppPage = async () => {
  const trips = await getUpcomingTrips();
  return (
    <div className="grid lg:grid-cols-3 sm:grid-cols-1 gap-4 p-4">
      {trips.result.map((trip: TripItemProps) => (
        <TripItem key={trip.trip_Id} trip={trip} />
      ))}
    </div>
  );
};

export default AppPage;
