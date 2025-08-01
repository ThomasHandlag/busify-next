import { Card, CardContent } from "@/components/ui/card";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import TripOverviewCard from "@/components/custom/trip_overview_card";
import ReviewSection from "@/components/custom/review_section";
import { TripHeroSection } from "@/components/custom/trip_detail/trip_hero_section";
import { OperatorInfoCard } from "@/components/custom/trip_detail/operator_info_card";
import { MobileBookingBar } from "@/components/custom/trip_detail/mobile_booking_bar";
import { SimilarTripsSection } from "@/components/custom/trip_detail/similar_trip_section";
import { ReviewModal } from "@/components/custom/trip_detail/review_modal";
import ComplaintSection from "@/components/custom/trip_detail/complaint_section";
import { TripItemProps } from "@/app/passenger/page";
import { getSimilarTrips, getTripDetail } from "@/lib/data/trip";

// Bus layouts configuration by ID
const busLayouts = {
  1: { rows: 10, columns: 4, floors: 2 },
  2: { rows: 15, columns: 3, floors: 1 },
  3: { rows: 3, columns: 3, floors: 1 },
  4: { rows: 9, columns: 4, floors: 2 },
  5: { rows: 10, columns: 3, floors: 1 },
  6: { rows: 4, columns: 3, floors: 1 },
  7: { rows: 6, columns: 2, floors: 2 },
  8: { rows: 4, columns: 4, floors: 1 },
  9: { rows: 5, columns: 4, floors: 2 },
  10: { rows: 6, columns: 3, floors: 1 },
};

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Mock data for trip detail
  const mockTripDetail = await getTripDetail(
    parseInt((await params).id)
  );

  // Generate seats based on layout ID
  const generateMockSeats = (layoutId: number, totalSeats: number) => {
    const layout = busLayouts[layoutId as keyof typeof busLayouts];
    if (!layout) {
      // Fallback layout if ID not found
      return Array.from({ length: totalSeats }, (_, i) => ({
        id: i + 1,
        seat_number: `${String.fromCharCode(65 + Math.floor(i / 4))}.${
          (i % 4) + 1
        }.1`,
        status: i < 15 ? "booked" : "available",
        price: 350000,
        row: Math.floor(i / 4),
        column: i % 4,
        floor: 1,
      }));
    }

    const seats = [];
    const floors = layout.floors || 1;
    let seatId = 1;

    for (let floor = 1; floor <= floors; floor++) {
      for (let row = 0; row < layout.rows; row++) {
        for (let col = 0; col < layout.columns; col++) {
          if (seatId > totalSeats) break;

          const rowLetter = String.fromCharCode(65 + row);
          const seatNumber = `${rowLetter}.${col + 1}.${floor}`;

          seats.push({
            id: seatId,
            seat_number: seatNumber,
            status: seatId <= 15 ? "booked" : "available", // First 15 seats are booked
            price: 350000,
            row,
            column: col,
            floor,
          });

          seatId++;
        }
        if (seatId > totalSeats) break;
      }
      if (seatId > totalSeats) break;
    }

    return seats;
  };

  // Generate mock seats and get current layout using layout_id
  const mockSeats = generateMockSeats(
    mockTripDetail.bus.layout_id,
    mockTripDetail.total_seats
  );
  const currentLayout = busLayouts[
    mockTripDetail.bus.layout_id as keyof typeof busLayouts
  ] || {
    rows: 8,
    columns: 4,
    floors: 1,
  };
  const mockSimilarTrips: TripItemProps[] = await getSimilarTrips(
    mockTripDetail.route.route_id
  );

  const bookingBar = (
    <MobileBookingBar
      layout={currentLayout}
      seats={mockSeats}
      pricePerSeat={mockTripDetail.price_per_seat}
      busType={mockTripDetail.bus.name}
      operatorName={mockTripDetail.operator_name}
    />
  );
  return (
    <div className="min-h-screen bg-gray-50">
      <TripHeroSection isFavorite={false} tripDetail={mockTripDetail} />

      <div className="container mx-auto lg:px-4 lg:py-4 md:px-4 md:py-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <TripOverviewCard mockTripDetail={mockTripDetail} />
            <div className="lg:hidden md:hidden block">{bookingBar}</div>
            <OperatorInfoCard tripDetail={mockTripDetail} />
            <ReviewModal />
            <ReviewSection mockTripDetail={mockTripDetail} />
            <ComplaintSection tripId={mockTripDetail.trip_id} />
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
      <SimilarTripsSection trips={mockSimilarTrips} />
    </div>
  );
}
