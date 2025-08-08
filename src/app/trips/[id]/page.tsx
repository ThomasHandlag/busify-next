import { Card, CardContent } from "@/components/ui/card";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import TripOverviewCard from "@/components/custom/trip/trip_overview_card";
import ReviewSection from "@/components/custom/review_section";
import { TripHeroSection } from "@/components/custom/trip_detail/trip_hero_section";
import { OperatorInfoCard } from "@/components/custom/trip_detail/operator_info_card";
import { MobileBookingBar } from "@/components/custom/trip_detail/mobile_booking_bar";
import { SimilarTripsSection } from "@/components/custom/trip_detail/similar_trip_section";
import { ReviewModal } from "@/components/custom/trip_detail/review_modal";
import ComplaintSection from "@/components/custom/trip_detail/complaint_section";
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
    console.log("Bus layout is null or invalid:", busLayout);
    return seats;
  }

  // Additional validation to prevent infinite loops
  if (busLayout.rows <= 0 || busLayout.cols <= 0 || busLayout.floors <= 0) {
    console.log("Bus layout has invalid dimensions:", {
      rows: busLayout.rows,
      cols: busLayout.cols,
      floors: busLayout.floors,
    });
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
    <MobileBookingBar
      layout={busLayout}
      seats={busSeats}
      pricePerSeat={tripDetail.price_per_seat}
      busType={tripDetail.bus.name}
      operatorName={tripDetail.operator_name}
    />
  );
  return (
    <div className="min-h-screen bg-gray-50">
      <TripHeroSection isFavorite={false} tripDetail={tripDetail} />

      <div className="container mx-auto lg:px-4 lg:py-4 md:px-4 md:py-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <TripOverviewCard tripDetail={tripDetail} />
            <div className="lg:hidden md:hidden block">{bookingBar}</div>
            <OperatorInfoCard id={tripDetail.operator_id} />
            <ReviewModal tripId={tripDetail.trip_id} />
            <ReviewSection mockTripDetail={tripDetail} />
            <ComplaintSection tripId={tripDetail.trip_id} />
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
