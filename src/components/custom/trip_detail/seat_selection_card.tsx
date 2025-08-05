"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Armchair } from "lucide-react";
import { PassengerInfoForm, PassengerInfo } from "./PassengerInfoForm";
import { useRouter } from "next/navigation"; // Update to use next/navigation
import { toast } from "sonner";

// Updated Seat interface to match API response
interface Seat {
  seatNumber: string;
  status: string; // "booked", "available", "locked"
  booked: boolean;
  row: string;
  column: string;
  floor: string;
}

interface BusLayout {
  rows: number;
  columns: number;
  floors: number; // Optional for multi-floor buses
}

interface SeatSelectionCardProps {
  tripId: string;
  seats: Seat[]; // Now directly uses the API Seat interface
  layout: BusLayout; // Contains rows and columns from the API
  pricePerSeat: number;
  onSeatSelection?: (selectedSeats: string[], totalPrice: number) => void;
}

export function SeatSelectionCard({
  tripId,
  seats,
  layout,
  pricePerSeat,
  onSeatSelection,
}: SeatSelectionCardProps) {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [passengerInfo, setPassengerInfo] = useState<PassengerInfo | null>(
    null
  );
  const router = useRouter(); // Use useRouter from next/navigation

  // Handle passenger info submission
  const handlePassengerInfoSubmit = (info: PassengerInfo) => {
    console.log("Received passenger info:", info); // Debug log
    setPassengerInfo(info);
  };

  const handleSeatClick = (seatNumber: string, status: string) => {
    // Prevent selection if status is "booked" or "locked"
    if (status === "booked" || status === "locked") return;

    const newSelectedSeats = selectedSeats.includes(seatNumber)
      ? selectedSeats.filter((seat) => seat !== seatNumber)
      : [...selectedSeats, seatNumber];

    setSelectedSeats(newSelectedSeats);
    const totalPrice = newSelectedSeats.length * pricePerSeat;
    onSeatSelection?.(newSelectedSeats, totalPrice);
  };

  const handleBookTicket = () => {
    console.log("Selected seats:", selectedSeats);
    console.log("Passenger info:", passengerInfo);

    if (selectedSeats.length === 0) {
      toast.error("Vui lòng chọn ít nhất một ghế!");
      return;
    }

    if (
      !passengerInfo ||
      !passengerInfo.fullName.trim() ||
      !passengerInfo.phone.trim() ||
      !passengerInfo.email.trim()
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin hành khách!");
      return;
    }

    // Navigate to confirmation page with data
    router.push(
      `/booking/confirmation/${tripId}?seats=${selectedSeats.join(
        ","
      )}&fullName=${passengerInfo.fullName}&phone=${
        passengerInfo.phone
      }&email=${passengerInfo.email}`
    );
  };

  const getSeatStatusColor = (status: string, seatNumber: string) => {
    if (selectedSeats.includes(seatNumber)) return "text-green-500";
    if (status === "booked" || status === "locked")
      return "text-gray-400 cursor-not-allowed";
    return "text-blue-500 hover:text-blue-600 cursor-pointer";
  };

  const totalPrice = selectedSeats.length * pricePerSeat;

  // Render seats based on rows and columns from layout and the provided seats array
  const renderSeats = () => {
    // Create a 2D grid representation for rendering
    const seatsByFloor: { [key: string]: Seat[] } = {};
    for (let i = 1; i <= layout.floors; i++) {
      seatsByFloor[String(i)] = seats.filter(
        (seat) => seat.floor === String(i)
      );
    }

    return (
      <div className="space-y-6">
        {Array.from({ length: layout.floors }, (_, floorIndex) => {
          const floor = String(floorIndex + 1);
          const floorSeats = seatsByFloor[floor];
          if (!floorSeats || floorSeats.length === 0) return null;

          // Create a 2D grid for this floor
          const seatGrid: (Seat | null)[][] = Array.from(
            { length: layout.rows },
            () => Array(layout.columns).fill(null)
          );

          // Populate the grid with seats based on row and column
          floorSeats.forEach((seat) => {
            const rowIndex = parseInt(seat.row) - 1; // API returns 1-based row
            const colIndex = parseInt(seat.column) - 1; // API returns 1-based column
            if (rowIndex < layout.rows && colIndex < layout.columns) {
              seatGrid[rowIndex][colIndex] = seat;
            }
          });

          return (
            <div key={`floor-${floor}`} className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Tầng {floor}</h3>
              <div
                className="grid gap-2 justify-center"
                style={{
                  gridTemplateColumns: `repeat(${layout.columns}, minmax(0, 1fr))`,
                  maxWidth: `${layout.columns * 60}px`,
                  margin: "0 auto",
                }}
              >
                {seatGrid.map((row, rowIndex) =>
                  row.map((seat, colIndex) => {
                    if (!seat) {
                      return (
                        <div
                          key={`empty-${floor}-${rowIndex}-${colIndex}`}
                          className="min-h-[50px]"
                        ></div>
                      );
                    }
                    return (
                      <button
                        key={seat.seatNumber}
                        onClick={() =>
                          handleSeatClick(seat.seatNumber, seat.status)
                        }
                        disabled={
                          seat.status === "booked" || seat.status === "locked"
                        }
                        className="relative p-2 transition-all duration-200 flex flex-col items-center justify-center min-h-[50px]"
                      >
                        <Armchair
                          className={`w-5 h-5 mb-1 ${getSeatStatusColor(
                            seat.status,
                            seat.seatNumber
                          )}`}
                        />
                        <span
                          className={`text-[10px] font-medium ${getSeatStatusColor(
                            seat.status,
                            seat.seatNumber
                          )}`}
                        >
                          {seat.seatNumber}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Check if the button should be disabled
  const isButtonDisabled =
    selectedSeats.length === 0 ||
    !passengerInfo ||
    !passengerInfo.fullName.trim() ||
    !passengerInfo.phone.trim() ||
    !passengerInfo.email.trim();

  return (
    <Card className="overflow-y-auto max-h-[70vh] scrollbar-hide">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Armchair className="w-5 h-5" />
          <span>Chọn ghế</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Legend */}
        <div className="flex items-center justify-center space-x-4 mb-4">
          <div className="flex items-center space-x-1">
            <Armchair className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-600">Đã đặt / Đã khóa</span>
          </div>
          <div className="flex items-center space-x-1">
            <Armchair className="w-4 h-4 text-blue-500" />
            <span className="text-xs text-gray-600">Còn trống</span>
          </div>
          <div className="flex items-center space-x-1">
            <Armchair className="w-4 h-4 text-green-500" />
            <span className="text-xs text-gray-600">Đang chọn</span>
          </div>
        </div>

        {/* Bus Layout */}
        <div className="border rounded-lg p-4 bg-gray-50 mb-4">
          {renderSeats()}
        </div>

        {/* Selection Summary */}
        {selectedSeats.length > 0 && (
          <div className="bg-blue-50 p-3 rounded-lg mb-2 border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <Armchair className="w-4 h-4 text-green-500" />
              <h4 className="font-medium text-blue-900">
                Ghế đã chọn: {selectedSeats.join(", ")}
              </h4>
            </div>
            <p className="text-blue-700 font-semibold">
              Tổng tiền: {totalPrice.toLocaleString("vi-VN")}đ
            </p>
          </div>
        )}
        <PassengerInfoForm onInfoSubmit={handlePassengerInfoSubmit} />

        <Button
          onClick={handleBookTicket}
          className="w-full mt-2"
          disabled={isButtonDisabled}
        >
          <Armchair className="w-4 h-4 mr-2" />
          Đặt vé ({selectedSeats.length} ghế)
        </Button>
      </CardContent>

      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none; /* Internet Explorer 10+ */
          scrollbar-width: none; /* Firefox */
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none; /* Safari and Chrome */
        }
      `}</style>
    </Card>
  );
}
