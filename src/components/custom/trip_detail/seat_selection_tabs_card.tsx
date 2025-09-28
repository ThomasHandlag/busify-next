"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BASE_URL } from "@/lib/constants/constants";
import { BusLayout } from "@/lib/data/bus";
import { Seat } from "@/lib/data/trip_seats";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import LocaleText from "../locale_text";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Armchair, Users, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  calculateDiscountedPrice,
  getBestPromotionCampaign,
  getCurrentPromotionCampaigns,
  PromotionCampaign,
} from "@/lib/data/promotion";

interface PassengerInfo {
  phone: string;
  fullName: string;
  email: string;
}

interface SeatSelectionTabsCardProps {
  tripId: string;
  seats: Seat[];
  layout: BusLayout | null;
  pricePerSeat: number;
  onSeatSelection?: (selectedSeats: string[], totalPrice: number) => void;
}

export function SeatSelectionTabsCard({
  tripId,
  seats,
  layout,
  pricePerSeat,
  onSeatSelection,
}: SeatSelectionTabsCardProps) {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  const [campaigns, setCampaigns] = useState<PromotionCampaign[]>([]);
  const t = useTranslations();
  const { data: session } = useSession();
  const router = useRouter();

  const passengerSchema = z.object({
    phone: z
      .string()
      .min(1, "Vui lòng nhập số điện thoại")
      .regex(/^\d{10}$/, "Số điện thoại phải gồm 10 số"),
    fullName: z.string().min(1, "Vui lòng nhập họ tên"),
    email: z.email("Email không hợp lệ"),
  });

  const form = useForm<PassengerInfo>({
    resolver: zodResolver(passengerSchema),
    defaultValues: {
      phone: "",
      fullName: "",
      email: "",
    },
  });

  // Auto-fill user profile data when logged in
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (session?.user?.accessToken) {
        setIsLoadingProfile(true);

        try {
          const response = await fetch(`${BASE_URL}api/users/profile`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${session.user.accessToken}`,
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const profileData = await response.json();
            console.log("Profile data fetched:", profileData);

            // Auto-fill form with user data
            if (profileData.result) {
              const { fullName, phoneNumber, email } = profileData.result;

              form.setValue("fullName", fullName || "");
              form.setValue("phone", phoneNumber || "");
              form.setValue("email", email || "");

              console.log("Form auto-filled with user profile data");
            }
          } else {
            console.error("Failed to fetch user profile:", response.status);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        } finally {
          setIsLoadingProfile(false);
        }
      }
    };

    fetchUserProfile();
  }, [session?.user?.accessToken, form]);

  const allSeats = useMemo(() => {
    const generatedSeats: Seat[] = [];

    // Return the provided seats if layout is null
    if (!layout) {
      return seats;
    }

    for (let floor = 1; floor <= layout.floors; floor++) {
      for (let row = 1; row <= layout.rows; row++) {
        for (let col = 0; col < layout.cols; col++) {
          const seatId =
            (floor - 1) * layout.rows * layout.cols +
            (row - 1) * layout.cols +
            col +
            1;
          const seatName = `${String.fromCharCode(65 + col)}.${row}.${floor}`;

          // Find status from trip seats data if available
          const seatStatus =
            seats?.find((s) => s.seat_number === seatName)?.status ||
            "available";

          generatedSeats.push({
            id: seatId,
            seat_number: seatName,
            status: seatStatus,
            price: pricePerSeat,
            row: row - 1,
            column: col,
            floor,
          });
        }
      }
    }

    return generatedSeats;
  }, [seats, layout, pricePerSeat]);

  const handleSeatClick = useCallback(
    (seatNumber: string, seatStatus: string) => {
      if (seatStatus === "booked" || seatStatus === "locked") return;
      setSelectedSeats((prev) => {
        const newSelection = prev.includes(seatNumber)
          ? prev.filter((s) => s !== seatNumber)
          : [...prev, seatNumber];

        const totalPrice = newSelection.length * pricePerSeat;
        onSeatSelection?.(newSelection, totalPrice);
        return newSelection;
      });
    },
    [pricePerSeat, onSeatSelection]
  );

  // Auto-fill user profile data when logged in
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (session?.user?.accessToken) {
        setIsLoadingProfile(true);
        try {
          const response = await fetch(`${BASE_URL}api/users/profile`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${session.user.accessToken}`,
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const profileData = await response.json();
            console.log("Profile data fetched:", profileData);

            // Auto-fill form with user data
            if (profileData.result) {
              const { fullName, phoneNumber, email } = profileData.result;

              form.setValue("fullName", fullName || "");
              form.setValue("phone", phoneNumber || "");
              form.setValue("email", email || "");

              console.log("Form auto-filled with user profile data");
            }
          } else {
            console.error("Failed to fetch user profile:", response.status);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        } finally {
          setIsLoadingProfile(false);
        }
      }
    };

    fetchUserProfile();
  }, [session?.user?.accessToken, form]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const apiCampaigns = await getCurrentPromotionCampaigns();
        setCampaigns(apiCampaigns);
      } catch (error) {
        console.error("Failed to fetch promotion campaigns:", error);
        setCampaigns([]);
      }
    };

    fetchCampaigns();
  }, []);

  const getSeatsByFloor = (floor: number) => {
    return allSeats.filter((seat) => seat.floor === floor);
  };

  const getFloorName = (floor: number) => {
    if (layout?.floors === 1)
      return <LocaleText string="singleFloor" name="TripDetail" />;
    return floor === 1 ? (
      <LocaleText string="lowerFloor" name="TripDetail" />
    ) : (
      <LocaleText string="upperFloor" name="TripDetail" />
    );
  };

  const renderSeatGrid = (floorSeats: Seat[]) => {
    if (!layout) return null;

    const seatRows: Seat[][] = [];
    for (let row = 0; row < layout.rows; row++) {
      seatRows.push(floorSeats.filter((seat) => seat.row === row));
    }

    return (
      <div className="space-y-4">
        {/* Wrapper to ensure badge sits above the seat grid */}
        <div className="relative">
          <div className="absolute inset-x-0 -top-6 flex justify-center z-20">
            <Badge
              variant="outline"
              className="bg-accent text-accent-foreground z-20"
            >
              <Users className="w-4 h-4 mr-1" />
              {floorSeats.filter((s) => s.status === "available").length}{" "}
              <LocaleText string="availableSeat" name="TripDetail" />
            </Badge>
          </div>

          {/* Seat grid (add top padding so grid doesn't overlap the absolute badge) */}
          <div className="pt-6 flex flex-col items-center space-y-2 z-0">
            {seatRows.map((row, rowIndex) => (
              <div key={rowIndex} className="flex justify-center space-x-2">
                {row.map((seat) => {
                  const isSelected = selectedSeats.includes(seat.seat_number);
                  const isBooked = seat.status === "booked";
                  const isAvailable = seat.status === "available";
                  const isLocked = seat.status === "locked";

                  return (
                    <button
                      key={seat.id}
                      onClick={() =>
                        handleSeatClick(seat.seat_number, seat.status)
                      }
                      disabled={isBooked}
                      className={`
                        relative z-0 w-10 h-10 rounded-lg border-2 flex items-center justify-center text-xs font-medium transition-all
                        ${
                          isBooked
                            ? "bg-muted border-muted text-muted-foreground cursor-not-allowed"
                            : isLocked
                            ? "bg-secondary border-secondary text-secondary-foreground cursor-not-allowed"
                            : isSelected
                            ? "bg-primary border-primary text-primary-foreground shadow-lg scale-105"
                            : isAvailable
                            ? "bg-background border-accent text-accent-foreground hover:border-accent hover:bg-accent"
                            : "bg-muted border-muted text-muted-foreground"
                        }
                      `}
                    >
                      {/* Icon ghế giữ nguyên */}
                      <Armchair className="w-5 h-5 text-muted-foreground" />

                      {/* Số ghế đặt ở phía dưới icon trong cùng ô */}
                      <span className="absolute bottom-0 text-[10px] font-semibold text-muted-foreground">
                        {seat.seat_number}
                      </span>

                      {isSelected && (
                        <CheckCircle className="w-3 h-3 absolute -top-1 -right-1 text-foreground" />
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const onSubmit = (data: PassengerInfo) => {
    console.log("Passenger Info Submitted:", selectedSeats);
    if (selectedSeats.length === 0) {
      toast.error("Vui lòng chọn ghế trước khi tiếp tục");
      return;
    }

    const basePrice = selectedSeats.length * pricePerSeat;
    const bestCampaign = getBestPromotionCampaign(campaigns, pricePerSeat);
    const { discountedPrice } = bestCampaign
      ? calculateDiscountedPrice(basePrice, bestCampaign)
      : { discountedPrice: basePrice };

    const queryParams = new URLSearchParams({
      seats: selectedSeats.join(","),
      fullName: encodeURIComponent(data.fullName),
      phone: encodeURIComponent(data.phone),
      email: encodeURIComponent(data.email),
      totalPrice: discountedPrice.toString(),
    });

    router.push(`/booking/confirmation/${tripId}?${queryParams.toString()}`);
  };

  const basePrice = selectedSeats.length * pricePerSeat;
  const bestCampaign = getBestPromotionCampaign(campaigns, pricePerSeat);
  const { discountedPrice, discountAmount } = bestCampaign
    ? calculateDiscountedPrice(basePrice, bestCampaign)
    : { discountedPrice: basePrice, discountAmount: 0 };

  const totalPrice = discountedPrice;

  return (
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Armchair className="w-5 h-5" />
          <span>{t("TripDetail.selectSeat")}</span>
        </CardTitle>
        <CardDescription>{t("TripDetail.selectSeatDesc")}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Seat Legend */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm justify-items-start">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white border-2 border-accent rounded"></div>
            <span>{t("TripDetail.empty")}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-primary border-2 border-primary rounded"></div>
            <span>{t("TripDetail.selected")}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-muted border-2 border-muted rounded"></div>
            <span>{t("TripDetail.selecting")}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-secondary border-2 border-secondary rounded"></div>
            <span>{t("TripDetail.booked")}</span>
          </div>
        </div>

        {layout && layout.floors > 1 ? (
          <Tabs defaultValue="1" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              {Array.from({ length: layout.floors }, (_, i) => i + 1).map(
                (floor) => (
                  <TabsTrigger key={floor} value={floor.toString()}>
                    {getFloorName(floor)}
                  </TabsTrigger>
                )
              )}
            </TabsList>

            {Array.from({ length: layout.floors }, (_, i) => i + 1).map(
              (floor) => (
                <TabsContent
                  key={floor}
                  value={floor.toString()}
                  className="space-y-4"
                >
                  <div className="border rounded-lg p-4 bg-background">
                    {renderSeatGrid(getSeatsByFloor(floor))}
                  </div>
                </TabsContent>
              )
            )}
          </Tabs>
        ) : (
          <div className="border rounded-lg p-4 bg-background">
            {renderSeatGrid(allSeats)}
          </div>
        )}

        <div className="border-t pt-6">
          <Form {...form}>
            <form
              id="passenger-info-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem
                    className={`${isLoadingProfile ? "animate-pulse" : ""}`}
                  >
                    <FormLabel>{t("Form.fullName")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("Form.fullName")}
                        {...field}
                        disabled={isLoadingProfile}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Form.email")}</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder={t("Form.email")}
                        {...field}
                        disabled={isLoadingProfile}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Form.phone")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("Form.phone")}
                        {...field}
                        disabled={isLoadingProfile}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      </CardContent>

      <CardFooter className="border-t p-4">
        <div className="w-full space-y-4">
          <div className="flex flex-col justify-between items-start font-semibold text-lg">
            <div className="text-sm text-foreground">
              {selectedSeats.length > 0 ? (
                <span>
                  <LocaleText string="selected" name="TripDetail" />:{" "}
                  {selectedSeats.join(", ")}
                </span>
              ) : (
                <span>
                  <LocaleText string="noSelected" name="TripDetail" />
                </span>
              )}
            </div>
            <div className="flex justify-between items-center w-full">
              <span>{t("Booking.totalAmount")}</span>
              <span>
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(totalPrice)}
              </span>
              <div className="text-right">
                {discountAmount > 0 ? (
                  <>
                    <p className="text-sm text-red-500 line-through">
                      {basePrice?.toLocaleString("vi-VN")}đ
                    </p>
                    <p className="text-lg font-bold text-primary">
                      {totalPrice?.toLocaleString("vi-VN")}đ
                    </p>
                  </>
                ) : (
                  <p className="text-lg font-bold text-primary">
                    {totalPrice?.toLocaleString("vi-VN")}đ
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  {selectedSeats.length} {t("Booking.seats")} ×{" "}
                  {pricePerSeat?.toLocaleString("vi-VN")}đ
                </p>
              </div>
            </div>
          </div>

          <Button
            aria-label="Continue to booking"
            onClick={form.handleSubmit(onSubmit)}
            form="passenger-info-form"
            className="w-full"
            disabled={selectedSeats.length === 0}
          >
            {t("TripDetail.continueBooking")}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default SeatSelectionTabsCard;
