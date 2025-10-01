"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo, useCallback } from "react";
import BookingInteractiveSection from "@/components/custom/booking/BookingInteractiveSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock, User } from "lucide-react";
import { Label } from "@radix-ui/react-label";
import React from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { BASE_URL } from "@/lib/constants/constants";
import { DiscountInfo } from "@/lib/data/discount";
import { useSession } from "next-auth/react";
import PromoCodeSection from "@/components/custom/booking/PromoCodeSection";
import PointsSection from "@/components/custom/booking/PointsSession";
import AutoPromotionSection from "@/components/custom/promotion/AutoPromotionSection";
import { getScore } from "@/lib/data/score";
import { Separator } from "@/components/ui/separator";
import BookingCountdown from "@/components/custom/booking/booking_countdown";

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

  const [discount, setDiscount] = useState(0);
  const [discountInfo, setDiscountInfo] = useState<DiscountInfo | null>(null);
  const [autoPromotionDiscount, setAutoPromotionDiscount] = useState(0);
  const [selectedAutoPromotion, setSelectedAutoPromotion] = useState<{
    id: number;
    code: string | null;
    discountType: string;
    discountValue: number;
  } | null>(null);
  const [usedPoints, setUsedPoints] = useState(0);
  const [pointsDiscount, setPointsDiscount] = useState(0);
  const [availablePoints, setAvailablePoints] = useState(0);

  // State để lưu dữ liệu
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);
  const t = useTranslations();

  const handleAutoPromotionSelect = useCallback(
    (
      promotion: {
        id: number;
        code: string | null;
        discountType: string;
        discountValue: number;
      } | null,
      discountAmount: number
    ) => {
      setSelectedAutoPromotion(promotion);
      setAutoPromotionDiscount(discountAmount);
      // No longer reset manual discount when auto promotion is selected
      // Both can be applied together now
    },
    []
  );

  const handleDiscountChange = (
    newDiscount: number,
    newDiscountInfo: DiscountInfo | null
  ) => {
    setDiscount(newDiscount);
    setDiscountInfo(newDiscountInfo);
  };

  const handlePointsChange = (points: number, discountAmount: number) => {
    setUsedPoints(points);
    setPointsDiscount(discountAmount);
  };

  useEffect(() => {
    async function loadScore() {
      try {
        const score = await getScore();
        setAvailablePoints(score.points);
      } catch (error) {
        console.error("Failed to load score:", error);
      }
    }
    loadScore();
  }, []);

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
        const response = await fetch(`${BASE_URL}api/trips/${tripId}`, {
          cache: "no-store",
        });

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
    <div className="h-full bg-primary w-full lg:px-4 px-2 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 lg:max-w-6xl mx-auto">
        <div className="lg:sticky lg:top-4 col-span-2">
          <div className="rounded-lg scrollBar space-y-6">
            <BookingCountdown tripId={tripId} />
            <AutoPromotionSection
              originalPrice={bookingData.pricing.totalPrice}
              onPromotionSelect={handleAutoPromotionSelect}
            />

            <Card className="shadow-lg overflow-hidden">
              <CardHeader>
                <CardTitle className="text-foreground text-lg">
                  {t("Booking.promoCode")}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                <PromoCodeSection
                  initialDiscount={discount}
                  onDiscountChange={handleDiscountChange}
                  originalPrice={bookingData.pricing.totalPrice}
                />
                <div className="flex flex-col items-start gap-4">
                  <div className="text-lg font-semibold">
                    {t("Points.usePoints")}
                  </div>
                  <PointsSection
                    availablePoints={availablePoints}
                    onPointsChange={handlePointsChange}
                    originalPrice={bookingData.pricing.totalPrice}
                    discountAmount={discount}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Card className="lg:col-span-4 col-span-1">
          <CardHeader>
            <CardTitle className="flex lg:flex-row flex-col items-center justify-between gap-2">
              <h3 className="text-xl">{t("Booking.confirmation.title")}</h3>
              <h3 className="font-semibold text-lg">
                {bookingData.trip.route}
              </h3>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">
                  {bookingData.trip.operator}
                </p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("Booking.departure")}
                  </p>
                  <p className="font-medium">
                    {bookingData.trip.departureTime} - {bookingData.trip.date}
                  </p>
                </div>
              </div>
              <div className="lg:flex hidden items-center gap-3 ">
                <Badge variant="outline">{bookingData.trip.duration}</Badge>
                <ArrowRight className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t("Booking.arrival")}
                    </p>
                    <p className="font-medium">
                      {bookingData.trip.arrivalTime} - {bookingData.trip.date}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-2">
              <div className="capitalize">{t("Booking.seatSelected")}</div>
              <div className="flex gap-2">
                {bookingData.selectedSeats.map((seat) => (
                  <Badge
                    key={seat}
                    variant="secondary"
                    className="bg-primary/10 text-primary"
                  >
                    {t("Booking.seats")} {seat}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-foreground" />
              {t("MyTickets.passengerInfo")}
            </div>
            <div className="flex gap-6 items-start flex-col lg:flex-row">
              <div>
                <Label className="text-sm text-muted-foreground">
                  {t("Form.fullName")}
                </Label>
                <p className="font-medium">{bookingData.passenger.fullName}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">
                  {t("Form.phone")}
                </Label>
                <p className="font-medium">{bookingData.passenger.phone}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">
                  {t("Form.email")}
                </Label>
                <p className="font-medium">{bookingData.passenger.email}</p>
              </div>
            </div>
            <Separator />
            <div className="flex flex-col gap-4">
              <BookingInteractiveSection
                autoPromotionDiscount={autoPromotionDiscount}
                discountInfo={discountInfo}
                mockData={bookingData}
                pointsDiscount={pointsDiscount}
                selectedAutoPromotion={selectedAutoPromotion}
                usedPoints={usedPoints}
                tripId={tripId}
                initialTotalPrice={bookingData.pricing.totalPrice}
                discount={discount + autoPromotionDiscount + pointsDiscount}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
