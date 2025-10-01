import { Button } from "@/components/ui/button";
import TripItem from "@/components/custom/trip/trip_item";
import { TripItemProps } from "@/lib/data/trip";
import { getSimilarTrips } from "@/lib/data/trip";
import Link from "next/link";
import LocaleText from "../locale_text";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export async function SimilarTripsSection({ tripId }: { tripId: number }) {
  const trips: TripItemProps[] = await getSimilarTrips(tripId);

  if (!trips || trips.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">
            <LocaleText string="similarTrips" name="Trips" />
          </CardTitle>
          <Button asChild variant="link" className="text-primary">
            <Link href="/trips">
              <LocaleText string="viewAll" name="Common" />
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {trips.map((trip) => (
            <TripItem key={trip.trip_id} trip={trip} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
