import { Card, CardContent } from "@/components/ui/card";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import ReviewSection from "@/components/custom/review_section";
import { TripHeroSection } from "@/components/custom/trip_detail/trip_hero_section";
import { OperatorInfoCard } from "@/components/custom/trip_detail/operator_info_card";
import { SimilarTripsSection } from "@/components/custom/trip_detail/similar_trip_section";
import { ReviewModal } from "@/components/custom/trip_detail/review_modal";
import TripInfoCard from "@/components/custom/trip_detail/trip_info_card";
import SeatSelectionTabsCard from "@/components/custom/trip_detail/seat_selection_tabs_card";
// import ComplaintSection from "@/components/custom/trip_detail/complaint_section";
import { getTripDetail } from "@/lib/data/trip";
import { getTripSeatById, Seat, TripSeatsStatus } from "@/lib/data/trip_seats";
import { BusLayout, getBusSeatsLayout } from "@/lib/data/bus";

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
    <div className="min-h-screen bg-gray-50">
      <TripHeroSection isFavorite={false} tripDetail={tripDetail} />

      <div className="container mx-auto lg:px-4 lg:py-4 md:px-4 md:py-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <TripInfoCard tripDetail={tripDetail} />
            <div className="lg:hidden md:hidden block">{bookingBar}</div>
            <OperatorInfoCard id={tripDetail.operator_id} />
            {tripDetail.departure_time && (
              <ReviewModal tripId={tripDetail.trip_id} />
            )}
            {tripStarted && <ReviewSection mockTripDetail={tripDetail} />}
            {/* Moved ComplaintSection to profile - will be implemented later */}
            {/* <ComplaintSection tripId={tripDetail.trip_id} /> */}
          </div>

          {/* Right Column - Desktop Booking */}
          <div className="lg:col-span-1 hidden lg:block md:block">
            <div className="sticky top-24 space-y-4">
              {bookingBar}
              <Card>
                <CardContent className="pt-4">
                  <div className="text-sm text-gray-600 space-y-2">
                    <p>• Chính sách hủy vé linh hoạt</p>
                    <p>• Hỗ trợ 24/7 qua hotline</p>
                    <p>• Đảm bảo ghế đã đặt</p>
                    <p>• Thanh toán an toàn</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <SimilarTripsSection routeId={tripDetail.route.route_id} />
    </div>
  );
}
