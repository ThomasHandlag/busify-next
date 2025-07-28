"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import {
  ArrowRight,
  Clock,
  MapPin,
  Bus,
  Heart,
  Star,
  Phone,
  Users,
  Wifi,
  Droplets,
  Zap,
  Navigation,
  Car,
  User,
  MessageSquare,
} from "lucide-react";
import TripItem from "@/components/custom/trip_item";
import RouteMap from "@/components/custom/google_map";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

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
  available_seats: 15,
  total_seats: 45,
  price_per_seat: 350000,
  bus: {
    name: "Giường nằm cao cấp",
    license_plate: "51F-12345",
    amenities: ["Wi-fi", "Nước uống", "Cổng sạc", "Điều hòa"],
  },
  average_rating: 4.5,
  total_reviews: 25,
  is_favorite: false,
};

// Mock data for seats
const mockSeats = {
  rows: 8,
  columns: 4,
  seats: Array.from({ length: 32 }, (_, i) => ({
    id: i + 1,
    seat_number: `${String.fromCharCode(65 + Math.floor(i / 4))}${(i % 4) + 1}`,
    status: i < 15 ? "booked" : "available", // First 15 seats are booked
    price: 350000,
  })),
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
];

export default function TripDetailPage({ params }: { params: { id: string } }) {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isFavorite, setIsFavorite] = useState(mockTripDetail.is_favorite);
  const [showSeatModal, setShowSeatModal] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSeatClick = (seatNumber: string, status: string) => {
    if (status === "booked") return;
    setSelectedSeats((prev) =>
      prev.includes(seatNumber)
        ? prev.filter((seat) => seat !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  const getSeatStatusColor = (status: string, seatNumber: string) => {
    if (selectedSeats.includes(seatNumber)) return "bg-green-500 text-white";
    if (status === "booked")
      return "bg-gray-300 text-gray-600 cursor-not-allowed";
    return "bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer";
  };

  const totalPrice = selectedSeats.length * mockTripDetail.price_per_seat;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - sticky top */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto lg:px-4 lg:py-4 md:px-4 md:py-4 px-9 py-0  flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-900">
                {mockTripDetail.route.start_location.city}
              </h2>
              <p className="text-sm text-gray-500">
                {mockTripDetail.route.start_location.address}
              </p>
            </div>
            <ArrowRight className="w-6 h-6 text-green-600" />
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-900">
                {mockTripDetail.route.end_location.city}
              </h2>
              <p className="text-sm text-gray-500">
                {mockTripDetail.route.end_location.address}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFavorite(!isFavorite)}
              className={isFavorite ? "text-red-500" : "text-gray-400"}
            >
              <Heart
                className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`}
              />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content - 2 columns layout */}
      <div className="container mx-auto lg:px-4 lg:py-4 md:px-4 md:py-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tổng quan chuyến */}
            <Card className="px-4 py-6">
              <CardHeader className="lg:px-6 md:px-6 px-0 sm:px-4">
                <CardTitle className="flex items-center space-x-2">
                  <Bus className="w-5 h-5" />
                  <span>Thông tin chuyến</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="lg:px-6 md:px-6 px-0 sm:px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-4 mb-6 ">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">
                        {formatTime(mockTripDetail.departure_time)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(mockTripDetail.departure_time)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Navigation className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">
                        {mockTripDetail.estimated_duration}
                      </p>
                      <p className="text-xs text-gray-500">
                        Thời gian di chuyển
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Bus className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">
                        {mockTripDetail.bus.name}
                      </p>
                      <p className="text-xs text-gray-500">Loại xe</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">
                        {mockTripDetail.available_seats}/
                        {mockTripDetail.total_seats}
                      </p>
                      <p className="text-xs text-gray-500">Ghế trống</p>
                    </div>
                  </div>
                </div>
                <Separator />
                {/* Route map */}
                <div className="mt-6">
                  <h3 className="font-semibold mb-4">Bản đồ hành trình</h3>
                  <RouteMap
                    startLocation={mockTripDetail.route.start_location}
                    endLocation={mockTripDetail.route.end_location}
                    routeStops={mockTripDetail.route_stop}
                    className="h-80 w-full rounded-lg"
                  />
                </div>
                <Separator />
                {/* Pickup/Dropoff */}
                <div className="mt-6">
                  <h3 className="font-semibold mb-4">Điểm đón/trả</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">Điểm đón</p>
                        <p className="text-gray-600">
                          {mockTripDetail.route.start_location.address}
                        </p>
                        <p className="text-sm text-gray-500">
                          {mockTripDetail.route.start_location.city}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">Điểm trả</p>
                        <p className="text-gray-600">
                          {mockTripDetail.route.end_location.address}
                        </p>
                        <p className="text-sm text-gray-500">
                          {mockTripDetail.route.end_location.city}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <Separator />
                {/* Amenities */}
                <div className="mt-6">
                  <h3 className="font-semibold mb-4">Tiện ích</h3>
                  <div className="flex flex-wrap gap-2">
                    {mockTripDetail.bus.amenities.map((amenity, index) => (
                      <Badge key={index} variant="secondary">
                        {amenity === "Wi-fi" && (
                          <Wifi className="w-3 h-3 mr-1" />
                        )}
                        {amenity === "Nước uống" && (
                          <Droplets className="w-3 h-3 mr-1" />
                        )}
                        {amenity === "Cổng sạc" && (
                          <Zap className="w-3 h-3 mr-1" />
                        )}
                        {amenity === "Điều hòa" && (
                          <Car className="w-3 h-3 mr-1" />
                        )}
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Thông tin nhà xe */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bus className="w-5 h-5" />
                  <span>Nhà xe</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={mockTripDetail.operator_logo}
                    alt={mockTripDetail.operator_name}
                    className="w-12 h-12 rounded-lg"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">
                      {mockTripDetail.operator_name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">
                        {mockTripDetail.average_rating}/5 (
                        {mockTripDetail.total_reviews} đánh giá)
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">Hotline: 1900-xxxx</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">Trụ sở: TP.HCM</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Xem tất cả chuyến của nhà xe này
                </Button>
              </CardContent>
            </Card>

            {/* Đánh giá */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span>Đánh giá</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-500">
                      {mockTripDetail.average_rating}
                    </div>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= mockTripDetail.average_rating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">Đánh giá trung bình</p>
                    <p className="text-sm text-gray-500">
                      Dựa trên {mockTripDetail.total_reviews} đánh giá
                    </p>
                  </div>
                </div>
                <Button>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Viết đánh giá
                </Button>
                <Separator className="my-4" />
                <div className="space-y-4">
                  {mockReviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-b pb-4 last:border-b-0"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">
                            {review.user_name}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3 h-3 ${
                                star <= review.rating
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 mb-2">{review.comment}</p>
                      <p className="text-sm text-gray-500">{review.date}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Booking */}
          <div className="lg:col-span-1 hidden lg:block md:block">
            <div className="sticky top-24 space-y-4">
              {/* Seat Selection Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>Chọn ghế</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Legend */}
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-gray-300 rounded"></div>
                      <span className="text-xs text-gray-600">Đã đặt</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-blue-100 rounded"></div>
                      <span className="text-xs text-gray-600">Còn trống</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                      <span className="text-xs text-gray-600">Đang chọn</span>
                    </div>
                  </div>
                  {/* Seat Layout */}
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {mockSeats.seats.map((seat) => (
                      <button
                        key={seat.id}
                        onClick={() =>
                          handleSeatClick(seat.seat_number, seat.status)
                        }
                        disabled={seat.status === "booked"}
                        className={`
                          p-2 rounded-lg text-xs font-medium transition-colors
                          ${getSeatStatusColor(seat.status, seat.seat_number)}
                        `}
                      >
                        {seat.seat_number}
                      </button>
                    ))}
                  </div>
                  {/* Selection Summary */}
                  {selectedSeats.length > 0 && (
                    <div className="bg-blue-50 p-2 rounded-lg mb-2">
                      <h4 className="font-medium text-blue-900 mb-1">
                        Ghế đã chọn: {selectedSeats.join(", ")}
                      </h4>
                      <p className="text-blue-700">
                        Tổng tiền: {totalPrice.toLocaleString("vi-VN")}đ
                      </p>
                    </div>
                  )}
                  <Button
                    className="w-full mt-2"
                    disabled={selectedSeats.length === 0}
                  >
                    Đặt vé ({selectedSeats.length} ghế)
                  </Button>
                </CardContent>
              </Card>
              {/* Quick Info Card */}
              <Card>
                <CardContent className="pt-4">
                  <div className="text-sm text-gray-600">
                    <p>Chính sách hủy vé linh hoạt.</p>
                    <p>Hỗ trợ 24/7 qua hotline.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Booking Bar & Seat Modal */}
      <div className="block lg:hidden md:hidden">
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-50">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold text-green-600">
                {totalPrice.toLocaleString("vi-VN")}đ
              </p>
              <p className="text-sm text-gray-500">
                {selectedSeats.length} ghế
              </p>
            </div>
            <Button onClick={() => setShowSeatModal(true)}>Chọn ghế</Button>
          </div>
        </div>
        <Sheet open={showSeatModal} onOpenChange={setShowSeatModal}>
          <SheetContent side="bottom" className="h-[80vh]">
            <div className="flex flex-col h-ful px-4 py-6l">
              <div className="flex items-center justify-between mb-4">
                <SheetTitle className="font-semibold text-lg">
                  Chọn ghế
                </SheetTitle>
                <Button variant="ghost" onClick={() => setShowSeatModal(false)}>
                  Đóng
                </Button>
              </div>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {mockSeats.seats.map((seat) => (
                  <button
                    key={seat.id}
                    onClick={() =>
                      handleSeatClick(seat.seat_number, seat.status)
                    }
                    disabled={seat.status === "booked"}
                    className={`
                      p-2 rounded-lg text-xs font-medium transition-colors
                      ${getSeatStatusColor(seat.status, seat.seat_number)}
                    `}
                  >
                    {seat.seat_number}
                  </button>
                ))}
              </div>
              {selectedSeats.length > 0 && (
                <div className="bg-blue-50 p-2 rounded-lg mb-2">
                  <h4 className="font-medium text-blue-900 mb-1">
                    Ghế đã chọn: {selectedSeats.join(", ")}
                  </h4>
                  <p className="text-blue-700">
                    Tổng tiền: {totalPrice.toLocaleString("vi-VN")}đ
                  </p>
                </div>
              )}
              <Button
                className="w-full mt-auto"
                disabled={selectedSeats.length === 0}
                onClick={() => setShowSeatModal(false)}
              >
                Đặt vé ({selectedSeats.length} ghế)
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Similar Trips Section */}
      <div className="container mx-auto lg:px-4 lg:py-4 md:px-4 md:py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold px-4">Các chuyến đi tương tự</h2>
          <Button variant="outline" size="sm">
            Xem tất cả
          </Button>
        </div>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 overflow-x-auto pb-4">
          {mockSimilarTrips.map((trip) => (
            <div key={trip.trip_id} className="min-w-[280px]">
              <TripItem trip={trip} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
