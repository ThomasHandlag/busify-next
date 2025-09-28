import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import ReviewSection from "@/components/custom/review_section";
import { OperatorInfoCard } from "@/components/custom/trip_detail/operator_info_card";
import { ReviewModal } from "@/components/custom/trip_detail/review_modal";
import TripInfoCard from "@/components/custom/trip_detail/trip_info_card";
// import ComplaintSection from "@/components/custom/trip_detail/complaint_section";
import { getTripDetail } from "@/lib/data/trip";
import { getTripSeatById, Seat, TripSeatsStatus } from "@/lib/data/trip_seats";
import { BusLayout, getBusSeatsLayout } from "@/lib/data/bus";
import LocaleText from "@/components/custom/locale_text";
import SeatSelectionTabsCard from "@/components/custom/trip_detail/seat_selection_tabs_card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles } from "lucide-react";
import { SimilarTripsSection } from "@/components/custom/trip_detail/similar_trip_section";
import BusInfo from "@/components/custom/trip_detail/bus_info";
import RouteTimeline from "@/components/custom/trip_detail/route_timeline";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const generateSeats = ({
  busLayout,
  pricePS,
  tripSeatsStatus,
}: {
  busLayout: BusLayout | null;
  pricePS: number;
  tripSeatsStatus: TripSeatsStatus | null;
}) => {
  const seats: Seat[] = [];

  // Return empty array if layout is null or invalid
  if (!busLayout || (!busLayout.rows && !busLayout.cols && !busLayout.floors)) {
    return seats;
  }

  // Additional validation to prevent infinite loops
  if (busLayout.rows <= 0 || busLayout.cols <= 0 || busLayout.floors <= 0) {
    return seats;
  }

  for (let floor = 1; floor <= busLayout.floors; floor++) {
    for (let row = 1; row <= busLayout.rows; row++) {
      for (let col = 0; col < busLayout.cols; col++) {
        const seatId =
          (floor - 1) * busLayout.rows * busLayout.cols +
          (row - 1) * busLayout.cols +
          col +
          1;
        const seatName = `${String.fromCharCode(65 + col)}.${row}.${floor}`;

        // Find status from trip seats data if available
        const seatStatus =
          tripSeatsStatus?.seatsStatus.find((s) => s.seatNumber === seatName)
            ?.status || "booked";

        seats.push({
          id: seatId,
          seat_number: seatName,
          status: seatStatus,
          price: pricePS,
          row: row - 1,
          column: col,
          floor,
        });
      }
    }
  }

  return seats;
};

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const tripId = (await params).id;

  const tripDetail = await getTripDetail(Number(tripId));

  const tripSeatsData = await getTripSeatById(Number(tripId));

  const busLayout = await getBusSeatsLayout(tripDetail.bus.bus_id);

  const isArrival = new Date(tripDetail.arrival_time) < new Date();

  // Generate seats with fallback handling
  const busSeats = generateSeats({
    busLayout,
    pricePS: tripDetail.price_per_seat,
    tripSeatsStatus: tripSeatsData,
  });

  const bookingBar = (
    <SeatSelectionTabsCard
      tripId={tripId}
      layout={busLayout}
      seats={busSeats}
      pricePerSeat={tripDetail.price_per_seat}
    />
  );
  const departureDate = new Date(tripDetail.departure_time);
  const tripStarted = departureDate.getTime() < Date.now();

  return (
    <div className="h-full bg-primary w-full lg:px-4 px-2 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 max-w-6xl mx-auto">
        <div className="space-y-8 col-span-4">
          <Tabs defaultValue="details">
            <TabsList className="grid grid-cols-3 overflow-y-hidden overflow-x-auto rounded-xl">
              <TabsTrigger value="details" className="rounded-lg">
                <LocaleText name="TripDetail" string="tripInfo" />
              </TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-lg capitalize">
                <LocaleText name="TripDetail" string="reviews" />
              </TabsTrigger>
              <TabsTrigger value="policies" className="rounded-lg">
                <LocaleText name="TripDetail" string="policies" />
              </TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="mt-6">
              <Card>
                <CardHeader className="lg:px-6 md:px-6 px-0 sm:px-4">
                  <CardTitle className="flex flex-col lg:flex-row items-center justify-between space-x-2 gap-2">
                    <span>
                      <LocaleText name="TripDetail" string="tripInfo" />
                    </span>
                    <div className="flex items-center gap-2">
                      <BusInfo {...tripDetail} />
                      <RouteTimeline {...tripDetail} />
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-10">
                  <TripInfoCard tripDetail={tripDetail} />
                  <div className="lg:hidden">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button>
                          <LocaleText name="TripDetail" string="selectSeat" />
                        </Button>
                      </SheetTrigger>
                      <SheetHeader>
                        <SheetTitle>
                          <LocaleText name="TripDetail" string="selectSeat" />
                        </SheetTitle>
                      </SheetHeader>
                      <SheetContent side="bottom" className="max-h-screen overflow-auto">
                        {bookingBar}
                      </SheetContent>
                    </Sheet>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardContent className="p-6 flex flex-col gap-6">
                  <div className="flex justify-between items-start">
                    {isArrival && <ReviewModal tripId={tripDetail.trip_id} />}
                  </div>
                  {tripStarted && <ReviewSection mockTripDetail={tripDetail} />}
                  {!tripStarted && (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">
                        <LocaleText name="TripDetail" string="noReviews" />
                      </p>
                    </div>
                  )}
                  <OperatorInfoCard id={tripDetail.operator_id} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="policies" className="mt-6">
              <Card>
                <CardContent className="p-6 space-y-3 text-muted-foreground">
                  <p className="flex items-start">
                    <Sparkles className="w-4 h-4 mr-3 mt-1 flex-shrink-0 text-primary" />
                    <span>
                      <LocaleText string="policyDesc1" name="Policies" />
                    </span>
                  </p>
                  <p className="flex items-start">
                    <Sparkles className="w-4 h-4 mr-3 mt-1 flex-shrink-0 text-primary" />
                    <span>
                      <LocaleText string="policyDesc2" name="Policies" />
                    </span>
                  </p>
                  <p className="flex items-start">
                    <Sparkles className="w-4 h-4 mr-3 mt-1 flex-shrink-0 text-primary" />
                    <span>
                      <LocaleText string="policyDesc3" name="Policies" />
                    </span>
                  </p>
                  <p className="flex items-start">
                    <Sparkles className="w-4 h-4 mr-3 mt-1 flex-shrink-0 text-primary" />
                    <span>
                      <LocaleText string="policyDesc4" name="Policies" />
                    </span>
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          <div className="col-span-1">
            <SimilarTripsSection tripId={tripDetail.trip_id} />
          </div>
        </div>
        <div className="hidden lg:block col-span-2">{bookingBar}</div>
      </div>
    </div>
  );
}
