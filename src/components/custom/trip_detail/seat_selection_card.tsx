"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Armchair } from "lucide-react";

export interface Seat {
  id: number;
  seat_number: string;
  status: string;
  price: number;
  row: number;
  column: number;
  floor?: number; // For multi-floor buses
}

export interface BusLayout {
  rows: number;
  columns: number;
  floors?: number;
}

interface SeatSelectionCardProps {
  seats: Seat[];
  layout: BusLayout;
  pricePerSeat: number;
  onSeatSelection?: (selectedSeats: string[], totalPrice: number) => void;
}

export function SeatSelectionCard({
  seats,
  layout,
  pricePerSeat,
  onSeatSelection,
}: SeatSelectionCardProps) {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  // Generate seat name based on row, column, and floor
  const generateSeatName = (row: number, column: number, floor: number = 1) => {
    const rowLetter = String.fromCharCode(65 + row); // A, B, C, D...
    return `${rowLetter}.${column + 1}.${floor}`;
  };

  // Generate seats based on layout
  const generateSeatsFromLayout = () => {
    const generatedSeats: Seat[] = [];
    const floors = layout.floors || 1;

    for (let floor = 1; floor <= floors; floor++) {
      for (let row = 0; row < layout.rows; row++) {
        for (let col = 0; col < layout.columns; col++) {
          const seatId =
            (floor - 1) * layout.rows * layout.columns +
            row * layout.columns +
            col +
            1;
          const seatName = generateSeatName(row, col, floor);

          // Find existing seat data or create new one
          const existingSeat = seats.find((s) => s.id === seatId);

          generatedSeats.push({
            id: seatId,
            seat_number: seatName,
            status: existingSeat?.status || "available",
            price: existingSeat?.price || pricePerSeat,
            row,
            column: col,
            floor,
          });
        }
      }
    }

    return generatedSeats;
  };

  const allSeats = generateSeatsFromLayout();

  const handleSeatClick = (seatNumber: string, status: string) => {
    if (status === "booked") return;

    const newSelectedSeats = selectedSeats.includes(seatNumber)
      ? selectedSeats.filter((seat) => seat !== seatNumber)
      : [...selectedSeats, seatNumber];

    setSelectedSeats(newSelectedSeats);
    const totalPrice = newSelectedSeats.length * pricePerSeat;
    onSeatSelection?.(newSelectedSeats, totalPrice);
  };

  const getSeatStatusColor = (status: string, seatNumber: string) => {
    if (selectedSeats.includes(seatNumber)) return "text-green-500";
    if (status === "booked") return "text-gray-400 cursor-not-allowed";
    return "text-blue-500 hover:text-blue-600 cursor-pointer";
  };

  const totalPrice = selectedSeats.length * pricePerSeat;
  const floors = layout.floors || 1;

  // Render seats for a specific floor
  const renderFloorSeats = (floorNumber: number) => {
    const floorSeats = allSeats.filter(
      (seat) => (seat.floor || 1) === floorNumber
    );

    return (
      <div key={floorNumber} className="mb-6">
        {floors > 1 && (
          <h3 className="text-sm font-medium text-gray-700 mb-3 text-center">
            Tầng {floorNumber}
          </h3>
        )}

        <div
          className="grid gap-2 justify-center"
          style={{
            gridTemplateColumns: `repeat(${layout.columns}, minmax(0, 1fr))`,
            maxWidth: `${layout.columns * 60}px`,
            margin: "0 auto",
          }}
        >
          {Array.from({ length: layout.rows }, (_, rowIndex) =>
            Array.from({ length: layout.columns }, (_, colIndex) => {
              const seat = floorSeats.find(
                (s) => s.row === rowIndex && s.column === colIndex
              );

              if (!seat) return null;

              return (
                <button
                  key={seat.id}
                  onClick={() => handleSeatClick(seat.seat_number, seat.status)}
                  disabled={seat.status === "booked"}
                  className="relative p-2 transition-all duration-200 flex flex-col items-center justify-center min-h-[50px]"
                >
                  <Armchair
                    className={`w-5 h-5 mb-1 ${getSeatStatusColor(
                      seat.status,
                      seat.seat_number
                    )}`}
                  />
                  <span
                    className={`text-[10px] font-medium ${getSeatStatusColor(
                      seat.status,
                      seat.seat_number
                    )}`}
                  >
                    {seat.seat_number}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>
    );
  };

  return (
    <Card className="overflow-y-auto max-h-[80vh] scrollbar-hide">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Armchair className="w-5 h-5" />
          <span>Chọn ghế</span>
        </CardTitle>
        <CardDescription>
          <p className="text-sm text-gray-500">
            Chọn ghế của bạn từ sơ đồ ghế bên dưới. Nhấn vào ghế để chọn hoặc bỏ chọn.
          </p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Legend */}
        <div className="flex items-center justify-center space-x-4 mb-4">
          <div className="flex items-center space-x-1">
            <Armchair className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-600">Đã đặt</span>
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
          {Array.from({ length: floors }, (_, i) => renderFloorSeats(i + 1))}
        </div>
      </CardContent>
      <CardFooter>
        <div className="border-t bg-white p-4 mt-auto flex flex-col justify-center w-full">
          <div className="bg-blue-50 p-3 rounded-lg mb-2 border border-blue-200 w-full">
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
          <Button className="w-full">
            <Armchair className="w-4 h-4 mr-2" />
            Đặt vé ({selectedSeats.length} ghế)
          </Button>
        </div>
      </CardFooter>

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
