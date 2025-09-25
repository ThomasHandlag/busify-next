"use client";

import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Armchair, Users, CheckCircle } from "lucide-react";
import { Seat } from "@/lib/data/trip_seats";
import { BusLayout } from "@/lib/data/bus";
import { Badge } from "@/components/ui/badge";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import LocaleText from "../locale_text";
import { useTranslations } from "next-intl";
import { BASE_URL } from "@/lib/constants/constants";

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
  const t = useTranslations();
  const { data: session } = useSession();
  const router = useRouter();

  // Generate seats based on layout
  const generateSeatsFromLayout = () => {
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
  };

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
          const response = await fetch(
            `${BASE_URL}api/users/profile`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${session.user.accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );

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

  const allSeats = generateSeatsFromLayout();

  const handleSeatClick = (seatNumber: string, seatStatus: string) => {
    if (seatStatus === "booked" || seatStatus === "locked") return;

    setSelectedSeats((prev) => {
      const newSelection = prev.includes(seatNumber)
        ? prev.filter((s) => s !== seatNumber)
        : [...prev, seatNumber];

      const totalPrice = newSelection.length * pricePerSeat;
      onSeatSelection?.(newSelection, totalPrice);
      return newSelection;
    });
  };

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
              className="bg-green-50 text-green-700 z-20"
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
                            ? "bg-gray-200 border-gray-300 text-gray-500 cursor-not-allowed"
                            : isLocked
                            ? "bg-yellow-100 border-yellow-200 text-yellow-700 cursor-not-allowed"
                            : isSelected
                            ? "bg-green-500 border-green-600 text-white shadow-lg scale-105"
                            : isAvailable
                            ? "bg-white border-green-300 text-green-700 hover:border-green-500 hover:bg-green-50"
                            : "bg-gray-100 border-gray-200 text-gray-400"
                        }
                      `}
                    >
                      {/* Icon ghế giữ nguyên */}
                      <Armchair className="w-5 h-5 text-gray-600" />

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

  const onSubmit = async (data: PassengerInfo) => {
    if (selectedSeats.length === 0) {
      toast.error("Vui lòng chọn ghế trước khi tiếp tục");
      return;
    }

    const totalPrice = selectedSeats.length * pricePerSeat;

    const queryParams = new URLSearchParams({
      seats: selectedSeats.join(","),
      fullName: encodeURIComponent(data.fullName),
      phone: encodeURIComponent(data.phone),
      email: encodeURIComponent(data.email),
      totalPrice: totalPrice.toString(),
    });

    router.push(`/booking/confirmation/${tripId}?${queryParams.toString()}`);
  };

  const totalPrice = selectedSeats.length * pricePerSeat;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Armchair className="w-5 h-5" />
          <span>
            <LocaleText string="selectSeat" name="TripDetail" />
          </span>
        </CardTitle>
        <CardDescription>
          <LocaleText string="selectSeatDesc" name="TripDetail" />
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Seat Legend */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm justify-items-start">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white border-2 border-green-300 rounded"></div>
            <span>
              <LocaleText string="empty" name="TripDetail" />
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 border-2 border-green-600 rounded"></div>
            <span>
              <LocaleText string="selected" name="TripDetail" />
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 border-2 border-yellow-200 rounded"></div>
            <span>
              <LocaleText string="selecting" name="TripDetail" />
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 border-2 border-gray-300 rounded"></div>
            <span>
              <LocaleText string="booked" name="TripDetail" />
            </span>
          </div>
        </div>

        {/* Floor Tabs */}
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
                  <div className="border rounded-lg p-4 bg-accent">
                    {renderSeatGrid(getSeatsByFloor(floor))}
                  </div>
                </TabsContent>
              )
            )}
          </Tabs>
        ) : (
          <div className="border rounded-lg p-4 bg-accent">
            {renderSeatGrid(allSeats)}
          </div>
        )}

        {/* Passenger Information Form */}
        <div className="border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">{t("MyTickets.passengerInfo")}</h3>
            {session?.user && isLoadingProfile && (
              <span className="text-sm text-gray-500">
                {t("Common.loading")}
              </span>
            )}
            {session?.user && !isLoadingProfile}
            {session?.user && !isLoadingProfile}
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <LocaleText string="fullName" name="Form" />
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={`${t("Form.fullName")}`}
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
                    <FormLabel>
                      <LocaleText string="phone" name="Form" />
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={`${t("Form.phone")}`}
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={`${t("Form.email")}`}
                        type="email"
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

      <CardFooter className="bg-accent border-t">
        <div className="w-full space-y-4">
          {/* Selection Summary */}
          <div className="flex justify-between items-center">
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
            <div className="text-right">
              <p className="text-lg font-bold text-green-600">
                {totalPrice?.toLocaleString("vi-VN")}đ
              </p>
              <p className="text-xs text-gray-500">
                {selectedSeats.length} ${t("Booking.seats")} ×{" "}
                {pricePerSeat?.toLocaleString("vi-VN")}đ
              </p>
            </div>
          </div>

          <Button
            aria-label="Continue to booking"
            className="w-full bg-green-600 hover:bg-green-700"
            onClick={form.handleSubmit(onSubmit)}
            disabled={selectedSeats.length === 0}
          >
            <LocaleText string="continueBooking" name="TripDetail" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default SeatSelectionTabsCard;
