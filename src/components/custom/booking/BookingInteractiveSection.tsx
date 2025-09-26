"use client";

import { useState, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import PromoCodeSection from "./PromoCodeSection";
import PaymentMethods from "./PaymentMethods";
import AutoPromotionSection from "../promotion/AutoPromotionSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DiscountInfo } from "@/lib/data/discount";
import { useTranslations } from "next-intl";
import PointsSection from "./PointsSession";
import { getScore, makeUsePoints } from "@/lib/data/score";
import { BASE_URL } from "@/lib/constants/constants";

interface BookingData {
  trip: { route: string };
  selectedSeats: string[];
  pricing: { totalPrice: number };
  passenger: {
    fullName: string;
    phone: string;
    email: string;
  };
}

interface BookingAddRequestDTO {
  tripId: number;
  guestFullName: string;
  guestEmail: string;
  guestPhone: string;
  guestAddress?: string | null;
  discountCode?: string | null;
  promotionId?: number | null; // Add promotionId field for auto promotions
  seatNumber: string;
  totalAmount: number;
}

interface PaymentRequestDTO {
  bookingId: number;
  paymentMethod: string;
}

interface BookingInteractiveSectionProps {
  initialTotalPrice: number;
  mockData: BookingData;
  tripId: string;
}

export default function BookingInteractiveSection({
  initialTotalPrice,
  mockData,
  tripId,
}: BookingInteractiveSectionProps) {
  const { data: session } = useSession();
  const t = useTranslations();
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
  const [paymentMethod, setPaymentMethod] = useState<string>("vnpay"); // Mặc định là VNPAY
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentLink, setPaymentLink] = useState<string | null>(null);

  const finalAmount =
    initialTotalPrice - discount - autoPromotionDiscount - pointsDiscount;

  const handleDiscountChange = (
    newDiscount: number,
    newDiscountInfo: DiscountInfo | null
  ) => {
    setDiscount(newDiscount);
    setDiscountInfo(newDiscountInfo);
    // No longer reset auto promotion when manual code is applied
    // Both can be applied together now
  };

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

  // Hàm xử lý xác nhận thanh toán
  const handleConfirmPayment = async () => {
    // Kiểm tra dữ liệu trước khi gửi
    if (!mockData.selectedSeats.length) {
      setPaymentError(t("Booking.error.noSeats"));
      return;
    }
    if (
      !mockData.passenger.fullName ||
      !mockData.passenger.email ||
      !mockData.passenger.phone
    ) {
      setPaymentError(t("Booking.error.noRequiredInfo"));
      return;
    }
    if (finalAmount <= 0) {
      setPaymentError(t("Booking.error.invalidPaymentAmount"));
      return;
    }

    // Kiểm tra session
    if (!session?.user?.accessToken) {
      setPaymentError(t("Booking.error.loginRequired"));
      return;
    }

    setPaymentLoading(true);
    setPaymentError(null);
    setPaymentLink(null);

    try {
      // Combine both discount codes if available
      let combinedDiscountCode = null;
      const manualCode = discountInfo?.code;
      const autoCode = selectedAutoPromotion?.code;

      if (manualCode && autoCode) {
        combinedDiscountCode = `${manualCode},${autoCode}`;
      } else if (manualCode) {
        combinedDiscountCode = manualCode;
      } else if (autoCode) {
        combinedDiscountCode = autoCode;
      }

      // Bước 1: Gửi POST request tới API bookings
      const bookingRequest: BookingAddRequestDTO = {
        tripId: Number(tripId),
        guestFullName: mockData.passenger.fullName,
        guestEmail: mockData.passenger.email,
        guestPhone: mockData.passenger.phone,
        guestAddress: null,
        discountCode: combinedDiscountCode,
        promotionId: selectedAutoPromotion?.id || null, // Add promotionId for auto promotion tracking
        seatNumber: mockData.selectedSeats.join(","),
        totalAmount: finalAmount,
      };

      console.log("Sending booking request:", bookingRequest);

      const bookingResponse = await fetch(`${BASE_URL}api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.accessToken}`, // Thêm token
        },
        body: JSON.stringify(bookingRequest),
      });

      if (!bookingResponse.ok) {
        const errorData = await bookingResponse.json().catch(() => null);
        console.log("Booking API error:", errorData);
        console.error("Booking API error response:", errorData.message);
        throw new Error(errorData?.message || t("Booking.error.bookingFailed"));
      }

      const bookingResult = await bookingResponse.json();
      const bookingId = bookingResult.result?.bookingId;
      if (!bookingId) {
        throw new Error(t("Booking.error.missingBookingId"));
      }
      console.log("Booking created successfully, booking_id:", bookingId);

      // Bước 2: Gửi POST request tới API payments
      const paymentRequest: PaymentRequestDTO = {
        bookingId: bookingId,
        paymentMethod: paymentMethod.toUpperCase(),
      };

      console.log("Sending payment request:", paymentRequest);

      const paymentResponse = await fetch(`${BASE_URL}api/payments/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.accessToken}`, // Thêm token
        },
        body: JSON.stringify(paymentRequest),
      });

      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.json().catch(() => null);
        console.error("Payment API error response:", errorData);
        throw new Error(t("Payment.paymentFailed"));
      }

      const paymentResult = await paymentResponse.json();
      const paymentUrl = paymentResult.result?.paymentUrl;
      if (!paymentUrl) {
        throw new Error(t("Booking.error.missingPaymentLink"));
      }
      console.log("Payment link received:", paymentUrl);

      // Lưu link thanh toán để hiển thị
      setPaymentLink(paymentUrl);

      // Nếu user có dùng điểm thì gọi API trừ điểm
      if (usedPoints > 0 && session?.user?.accessToken) {
        try {
          const pointResponse = await makeUsePoints(
            {
              bookingId: bookingId,
              pointsToUse: usedPoints,
            },
            session.user.accessToken // truyền token
          );

          if (!pointResponse.success) {
            console.warn("Không trừ được điểm:", pointResponse.message);
          } else {
            console.log("Điểm còn lại:", pointResponse.result?.points);
            setAvailablePoints(pointResponse.result?.points || 0);
          }
        } catch (err) {
          console.error("Lỗi khi trừ điểm:", err);
        }
      }

      // Không chuyển hướng ngay, để người dùng nhấp vào link thanh toán
      // router.push(`/booking/success/${bookingId}`);
    } catch (e) {
      const error = e as Error;
      console.error("Payment processing error:", error.message);
      let userFriendlyMessage = error.message;
      if (error.message.includes("409")) {
        userFriendlyMessage = t("Booking.error.seatConflict409");
      }
      setPaymentError(userFriendlyMessage);
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <>
      {/* Auto Promotion Section */}
      <AutoPromotionSection
        originalPrice={initialTotalPrice}
        onPromotionSelect={handleAutoPromotionSelect}
      />

      <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-accent pt-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-300 to-indigo-300 text-white relative overflow-hidden px-1.5 py-2">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full"></div>
          <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/5 rounded-full"></div>
          <CardTitle className="flex items-center gap-3 relative z-10">
            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              🎫
            </div>
            <span className="text-lg font-bold">{t("Booking.promoCode")}</span>
          </CardTitle>
          <p className="text-blue-100 text-sm relative z-10 mt-1">
            {t("Booking.promoCodeDesc")}
          </p>
        </CardHeader>
        <CardContent>
          <PromoCodeSection
            initialDiscount={discount}
            onDiscountChange={handleDiscountChange}
            originalPrice={initialTotalPrice}
          />
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-accent pt-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-300 to-pink-300 text-white relative overflow-hidden px-1.5 py-2">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full"></div>
          <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/5 rounded-full"></div>
          <CardTitle className="flex items-center gap-3 relative z-10">
            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              ⭐
            </div>
            <span className="text-lg font-bold">{t("Points.title")}</span>
          </CardTitle>
          <p className="text-purple-100 text-sm relative z-10 mt-1">
            {t("Booking.pointsDesc")}
          </p>
        </CardHeader>
        <CardContent>
          <PointsSection
            availablePoints={availablePoints}
            onPointsChange={handlePointsChange}
            originalPrice={initialTotalPrice}
            discountAmount={discount}
          />
        </CardContent>
      </Card>

      <Card className="border-0 shadow-xl bg-gradient-to-br from-background to-accent pt-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-300 to-emerald-300 text-white relative overflow-hidden px-1.5 py-2">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full"></div>
          <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/5 rounded-full"></div>
          <CardTitle className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">
              {t("Booking.paymentSummary")}
            </span>
          </CardTitle>
          <p className="text-green-100 text-sm relative z-10 mt-2">
            {t("Booking.paymentConfirmDesc")}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>
                {t("Booking.ticketPrice")} ({mockData.selectedSeats.length}{" "}
                {t("Booking.seats")})
              </span>
              <div className="text-right">
                {discount > 0 || autoPromotionDiscount > 0 ? (
                  <>
                    <span className="text-gray-400 line-through text-sm">
                      {mockData.pricing.totalPrice?.toLocaleString("vi-VN")}đ
                    </span>
                  </>
                ) : (
                  <span>
                    {mockData.pricing.totalPrice?.toLocaleString("vi-VN")}đ
                  </span>
                )}
              </div>
            </div>
            {discount > 0 && discountInfo && (
              <div className="flex justify-between text-red-600">
                <span>
                  {t("Booking.discount")}
                  {discountInfo.code} (
                  {discountInfo.discountType === "PERCENTAGE"
                    ? `${discountInfo.discountValue}%`
                    : `${discountInfo.discountValue?.toLocaleString("vi-VN")}đ`}
                  )
                </span>
                <span>-{discount?.toLocaleString("vi-VN")}đ</span>
              </div>
            )}
            {autoPromotionDiscount > 0 && selectedAutoPromotion && (
              <div className="flex justify-between text-red-600">
                <span>
                  {t("Booking.autoPromotion")} (
                  {selectedAutoPromotion.discountType === "PERCENTAGE"
                    ? `${selectedAutoPromotion.discountValue}%`
                    : `${selectedAutoPromotion.discountValue?.toLocaleString(
                        "vi-VN"
                      )}đ`}
                  )
                </span>
                <span>-{autoPromotionDiscount?.toLocaleString("vi-VN")}đ</span>
              </div>
            )}
            {pointsDiscount > 0 && (
              <div className="flex justify-between text-blue-600">
                <span>
                  {t("Points.usedPointsLabel", { count: usedPoints })}
                </span>
                <span>-{pointsDiscount?.toLocaleString("vi-VN")}đ</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-semibold text-lg">
              <span>{t("Booking.totalAmount")}</span>
              <span className="text-green-300">
                {finalAmount?.toLocaleString("vi-VN")}đ
              </span>
            </div>
          </div>

          <PaymentMethods
            paymentMethod={paymentMethod}
            onPaymentMethodChange={setPaymentMethod}
            mockData={mockData}
          />

          {paymentError && (
            <p className="text-red-500 text-sm">{paymentError}</p>
          )}

          <Button
            aria-label="Confirm Payment"
            className="w-full bg-gradient-to-r from-green-300 to-emerald-300 hover:from-green-400 hover:to-emerald-400 text-white py-4 text-lg font-bold shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 border-0 relative overflow-hidden px-3"
            onClick={handleConfirmPayment}
            disabled={paymentLoading || !!paymentLink}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 flex items-center justify-center gap-3">
              {paymentLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{t("Booking.processing")}</span>
                </>
              ) : (
                <>
                  <span>🚀 {t("Booking.confirmPay")}</span>
                  <span className="text-xl font-extrabold">
                    {finalAmount?.toLocaleString("vi-VN")}đ
                  </span>
                </>
              )}
            </div>
          </Button>

          {paymentLink && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">
                {t("Booking.paymentLinkText")}
              </p>
              <a
                href={paymentLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
              >
                {t("Booking.payWithVNPay")}
              </a>
            </div>
          )}

          <div className="text-xs text-gray-500 space-y-1 w-full">
            <p>• {t("Policies.policyDesc1")}</p>
            <p>• {t("Policies.policyDesc2")}</p>
            <p>• {t("Policies.policyDesc3")}</p>
            <p>• {t("Policies.policyDesc4")}</p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
