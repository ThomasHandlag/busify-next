"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import BookingInteractiveSection from "@/components/custom/booking/BookingInteractiveSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, User } from "lucide-react";
import { Label } from "@radix-ui/react-label";
import React from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { BASE_URL } from "@/lib/constants/constants";

interface TripApiResponse {
  code: number;
  message: string;
  result: {
    departure_time: string;
    arrival_time: string;
    bus: {
      license_plate: string;
      name: string;
      seats: number;
    };
    pricePerSeat: number;

    route: {
      start_location: {
        address: string;
        city: string;
        latitude: number;
        name: string;
        longtitude: number;
      };
      estimated_duration: string;
      end_location: {
        address: string;
        city: string;
        latitude: number;
        name: string;
        longtitude: number;
      };
    };
    id: number;
    operator_name: string;
    operator_id: number;
    routeStop: Array<{
      address: string;
      city: string;
      latitude: number;
      longtitude: number;
      time_offset_from_start: number;
    }>;
  };
}

interface BookingData {
  trip: {
    route: string;
    operator: string;
    departureTime: string;
    arrivalTime: string;
    date: string;
    duration: string;
  };
  selectedSeats: string[];
  passenger: {
    fullName: string;
    phone: string;
    email: string;
  };
  pricing: {
    basePrice: number;
    totalPrice: number;
  };
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function BookingConfirmation({ params }: PageProps) {
  const { id: tripId } = React.use(params);
  const searchParams = useSearchParams();

  // Lấy dữ liệu từ query params
  const selectedSeatsFromParams = useMemo(
    () => searchParams.get("seats")?.split(",") || [],
    [searchParams]
  );
  const fullName = searchParams.get("fullName") || "";
  const phone = searchParams.get("phone") || "";
  const email = searchParams.get("email") || "";
  const totalPriceFromParams = Number(searchParams.get("totalPrice")) || 0;

  // State để lưu dữ liệu
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);
  const t = useTranslations();

  useEffect(() => {
    // Kiểm tra query params
    if (!selectedSeatsFromParams.length || !fullName || !phone || !email) {
      toast.error("Thông tin đặt vé không đầy đủ. Vui lòng kiểm tra lại.");
      setLoading(false);
      return;
    }

    console.log(tripId, "Trip ID from params");
    const fetchTripData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${BASE_URL}api/trips/${tripId}`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Chuyến đi không tồn tại.");
          }
          throw new Error(`Lỗi khi gọi API: ${response.status}`);
        }
        const data: TripApiResponse = await response.json();

        console.log("Trip data from API:", data);
        // Chuyển đổi estimatedDuration từ chuỗi sang số phút
        let totalMinutes = Number(data.result.route.estimated_duration);
        if (isNaN(totalMinutes)) {
          console.warn(
            "Định dạng estimatedDuration không hợp lệ:",
            data.result.route.estimated_duration
          );
          totalMinutes = 0;
        }

        // Chuyển đổi dữ liệu
        const departureDateTime = new Date(data.result.departure_time);
        if (isNaN(departureDateTime.getTime())) {
          throw new Error("Thời gian khởi hành không hợp lệ từ API.");
        }
        const departureTime = departureDateTime.toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        });
        const arrivalDateTime = new Date(data.result.arrival_time);
        if (isNaN(arrivalDateTime.getTime())) {
          throw new Error("Thời gian đến không hợp lệ từ API.");
        }
        const arrivalTime = arrivalDateTime.toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        });
        const durationHours = Math.floor(totalMinutes / 60);
        const durationMinutes = totalMinutes % 60;
        const durationString = `${durationHours} ${t("Common.hours")}${
          durationMinutes > 0
            ? ` ${durationMinutes} ${t("Common.minutes")}`
            : ""
        }`;

        setBookingData({
          trip: {
            route: `${data.result.route.start_location.city} → ${data.result.route.end_location.city}`,
            operator: data.result.operator_name,
            departureTime: departureTime,
            arrivalTime: arrivalTime,
            date: departureDateTime.toLocaleDateString("vi-VN"),
            duration: durationString,
          },
          selectedSeats: selectedSeatsFromParams,
          passenger: {
            fullName: decodeURIComponent(fullName),
            phone: decodeURIComponent(phone),
            email: decodeURIComponent(email),
          },
          pricing: {
            basePrice: data.result.pricePerSeat,
            totalPrice:
              totalPriceFromParams ||
              data.result.pricePerSeat * selectedSeatsFromParams.length,
          },
        });
      } catch (error) {
        const errMessage = error as Error;
        toast.error(`${errMessage.message ?? t("Common.infoNotFound")}`);
      } finally {
        setLoading(false);
      }
    };

    fetchTripData();
  }, [tripId, searchParams]);

  if (loading)
    return <div className="text-center py-8">{t("Common.loading")}</div>;
  if (!bookingData)
    return (
      <div className="flex justify-center text-center py-8">
        {t("Common.infoNotFound")}
      </div>
    );

  return (
    <div className="min-h-screen bg-accent w-full">
      <div className="bg-background shadow-sm border-b w-full">
        <div className="px-4 py-4">
          <div className="flex items-center gap-4">
            <span className="text-foreground">
              {t("Booking.confirmation.title")}
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-600" />
                  {t("Booking.confirmation.tripDetails")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {bookingData.trip.route}
                    </h3>
                    <p className="text-gray-600">{bookingData.trip.operator}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-green-600 border-green-600"
                  >
                    {bookingData.trip.duration}
                  </Badge>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">
                        {t("Booking.departure")}
                      </p>
                      <p className="font-medium">
                        {bookingData.trip.departureTime} -
                        {bookingData.trip.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">
                        {t("Booking.arrival")}
                      </p>
                      <p className="font-medium">
                        {bookingData.trip.arrivalTime} - {bookingData.trip.date}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("Booking.seatSelected")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  {bookingData.selectedSeats.map((seat) => (
                    <Badge
                      key={seat}
                      variant="secondary"
                      className="bg-green-100 text-green-700"
                    >
                      {t("Booking.seats")} {seat}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-green-600" />
                  {t("MyTickets.passengerInfo")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm text-gray-500">
                    {t("Form.fullName")}
                  </Label>
                  <p className="font-medium">
                    {bookingData.passenger.fullName}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">
                    {t("Form.phone")}
                  </Label>
                  <p className="font-medium">{bookingData.passenger.phone}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">
                    {t("Form.email")}
                  </Label>
                  <p className="font-medium">{bookingData.passenger.email}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar với sticky position và scroll */}
          <div className="lg:sticky lg:top-4 lg:self-start">
            <div className="max-h-[calc(100vh-4rem)] overflow-y-auto space-y-6 pr-2">
              <BookingInteractiveSection
                initialTotalPrice={bookingData.pricing.totalPrice}
                mockData={bookingData}
                tripId={tripId}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
