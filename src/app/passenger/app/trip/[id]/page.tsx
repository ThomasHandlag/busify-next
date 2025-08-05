"use client";

import { useState, useEffect, use } from "react"; // Import 'use' hook from React
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { MessageSquare } from "lucide-react";
import TripOverviewCard from "@/components/custom/trip_overview_card";
import ReviewSection from "@/components/custom/review_section";
import { TripHeroSection } from "@/components/custom/trip_detail/trip_hero_section";
import { OperatorInfoCard } from "@/components/custom/trip_detail/operator_info_card";
import { SeatSelectionCard } from "@/components/custom/trip_detail/seat_selection_card";
import { MobileBookingBar } from "@/components/custom/trip_detail/mobile_booking_bar";
import { SimilarTripsSection } from "@/components/custom/trip_detail/similar_trip_section";
import { ReviewModal } from "@/components/custom/trip_detail/review_modal";
import ComplaintSection from "@/components/custom/trip_detail/complaint_section";

// Bus layouts configuration by ID (kept for other bus details, not for seat generation)
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

// Mock data for trip detail
const mockTripDetail = {
  trip_id: 1,
  operator_name: "Phương Trang",
  operator_logo: "/logo.png",
  route: {
    start_location: {
      address: "Bến xe Miền Đông",
      city: "TP.HCM",
      longitude: 106.6297,
      latitude: 10.8231,
    },
    end_location: {
      address: "Bến xe Đà Lạt",
      city: "Đà Lạt",
      longitude: 108.4419,
      latitude: 11.9404,
    },
  },
  route_stop: [
    {
      address: "Bến xe Đà Lạt",
      city: "Đà Lạt",
      longitude: 100.4419,
      latitude: 6.9404,
      time_offset_from_start: 120,
    },
  ],
  departure_time: "2025-08-01T08:00:00",
  arrival_time: "2025-08-01T14:00:00",
  estimated_duration: "6 giờ",
  available_seats: 25,
  total_seats: 40,
  price_per_seat: 350000,
  bus: {
    name: "Giường 40 chỗ",
    layout_id: 9,
    license_plate: "51F-12345",
    amenities: ["Wi-fi", "Nước uống", "Cổng sạc", "Điều hòa"],
  },
  average_rating: 4.5,
  total_reviews: 25,
  is_favorite: false,
};

// Mock data for similar trips
const mockSimilarTrips = [
  {
    trip_id: 2,
    operator_name: "Thành Bưởi",
    route: {
      start_location: "TP.HCM",
      end_location: "Đà Lạt",
    },
    departure_time: "2025-08-01T10:00:00",
    arrival_time: "2025-08-01T16:00:00",
    available_seats: 8,
    price_per_seat: 320000,
    average_rating: 4.3,
    duration: 120,
  },
  {
    trip_id: 3,
    operator_name: "Liên Hưng",
    route: {
      start_location: "TP.HCM",
      end_location: "Đà Lạt",
    },
    departure_time: "2025-08-01T14:00:00",
    arrival_time: "2025-08-01T20:00:00",
    available_seats: 12,
    price_per_seat: 380000,
    average_rating: 4.7,
    duration: 180,
  },
];

// Mock data for reviews
const mockReviews = [
  {
    id: 1,
    user_name: "Nguyễn Văn A",
    rating: 5,
    comment: "Chuyến đi rất thoải mái, tài xế lái xe an toàn, xe sạch sẽ.",
    date: "2025-07-15",
  },
  {
    id: 2,
    user_name: "Trần Thị B",
    rating: 4,
    comment: "Đúng giờ, phục vụ tốt. Chỉ hơi ồn một chút.",
    date: "2025-07-10",
  },
  {
    id: 3,
    user_name: "Võ Văn C",
    rating: 4,
    comment: "Dịch vụ tốt, xe sạch sẽ và đúng giờ.",
    date: "2025-07-10",
  },
];

// Mock data for complaints
const mockComplaints = [
  {
    id: 1,
    user_name: "Trần Thị B",
    title: "Trễ chuyến",
    description: "Xe đến trễ hơn 1 tiếng so với lịch hẹn.",
    date: "2025-07-20",
  },
  {
    id: 2,
    user_name: "Võ Văn C",
    title: "Thiết bị hư hại",
    description: "Điều hòa không hoạt động trong suốt chuyến đi.",
    date: "2025-07-18",
  },
];

// Interface for seat data from API
interface SeatData {
  seatNumber: string;
  status: string;
  booked: boolean;
  floor: string;
  row: string;
  column: string;
}

// Interface for seat layout response from API
interface SeatLayoutResponse {
  floors: number;
  rows: number;
  columns: number;
  seats: SeatData[];
}

// Update the type definition for params to expect a Promise
export default function TripDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isFavorite, setIsFavorite] = useState(mockTripDetail.is_favorite);
  const [showSeatModal, setShowSeatModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // State to hold fetched seat layout data
  const [seatLayout, setSeatLayout] = useState<SeatLayoutResponse | null>(null);
  const [loadingSeats, setLoadingSeats] = useState(true);
  const [errorSeats, setErrorSeats] = useState<string | null>(null);

  // Unwrap the params Promise using React.use()
  const resolvedParams = use(params);
  const tripId = resolvedParams.id; // Access the id from the resolved object

  // Effect hook to fetch seat layout data from the API
  useEffect(() => {
    const fetchSeatLayout = async () => {
      setLoadingSeats(true);
      setErrorSeats(null);
      try {
        const response = await fetch(
          `http://localhost:8080/api/trip-seats/${tripId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.code === 200 && data.result) {
          setSeatLayout(data.result);
        } else {
          throw new Error(data.message || "Failed to fetch seat layout");
        }
      } catch (error: any) {
        console.error("Error fetching seat layout:", error);
        setErrorSeats(error.message || "Failed to load seat layout.");
      } finally {
        setLoadingSeats(false);
      }
    };

    // Only fetch if tripId is available
    if (tripId) {
      fetchSeatLayout();
    }
  }, [tripId]); // Re-fetch when the trip ID changes

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleSeatSelection = (seats: string[], price: number) => {
    setSelectedSeats(seats);
    setTotalPrice(price);
  };

  const handleSubmitReview = (rating: number, text: string) => {
    console.log("Review submitted:", { rating, text });
    // Handle review submission logic here
    setShowReviewModal(false);
  };

  // Determine current layout based on fetched data or fallback
  const currentLayout = seatLayout
    ? {
        rows: seatLayout.rows,
        columns: seatLayout.columns,
        floors: seatLayout.floors,
      }
    : { rows: 0, columns: 0, floors: 0 }; // Default to 0 if not loaded yet

  return (
    <div className="min-h-screen bg-gray-50">
      <TripHeroSection
        tripDetail={mockTripDetail}
        isFavorite={isFavorite}
        onToggleFavorite={handleToggleFavorite}
      />

      <div className="container mx-auto lg:px-4 lg:py-4 md:px-4 md:py-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <TripOverviewCard mockTripDetail={mockTripDetail} />
            <OperatorInfoCard tripDetail={mockTripDetail} />
            <Button onClick={() => setShowReviewModal(true)}>
              <MessageSquare className="w-4 h-4 mr-2" />
              Viết đánh giá
            </Button>
            <ReviewSection
              mockTripDetail={mockTripDetail}
              mockReviews={mockReviews}
            />
            <ComplaintSection complaints={mockComplaints} />
            <ReviewModal
              isOpen={showReviewModal}
              onClose={() => setShowReviewModal(false)}
              onSubmitReview={handleSubmitReview}
            />
          </div>

          {/* Right Column - Desktop Booking */}
          <div className="lg:col-span-1 hidden lg:block md:block">
            <div className="sticky top-24 space-y-4">
              {loadingSeats && (
                <Card>
                  <CardContent className="pt-4 text-center text-gray-500">
                    Đang tải sơ đồ ghế...
                  </CardContent>
                </Card>
              )}
              {errorSeats && (
                <Card>
                  <CardContent className="pt-4 text-center text-red-500">
                    Lỗi: {errorSeats}
                  </CardContent>
                </Card>
              )}
              {seatLayout && (
                <SeatSelectionCard
                tripId={tripId}
                  seats={seatLayout.seats}
                  layout={currentLayout}
                  pricePerSeat={mockTripDetail.price_per_seat}
                  onSeatSelection={handleSeatSelection}
                />
              )}
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

      {/* Mobile Components */}
      <MobileBookingBar
        selectedSeats={selectedSeats}
        totalPrice={totalPrice}
        showSeatModal={showSeatModal}
        onShowSeatModal={setShowSeatModal}
        busType={mockTripDetail.bus.name}
      >
        {loadingSeats && (
          <div className="p-4 text-center text-gray-500">
            Đang tải sơ đồ ghế...
          </div>
        )}
        {errorSeats && (
          <div className="p-4 text-center text-red-500">Lỗi: {errorSeats}</div>
        )}
        {seatLayout && (
          <SeatSelectionCard
          tripId={tripId}
            seats={seatLayout.seats}
            layout={currentLayout}
            pricePerSeat={mockTripDetail.price_per_seat}
            onSeatSelection={handleSeatSelection}
          />
        )}
      </MobileBookingBar>

      <SimilarTripsSection trips={mockSimilarTrips} />
    </div>
  );
}
