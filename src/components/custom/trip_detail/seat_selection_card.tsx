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
import { Seat } from "@/lib/data/trip_seats";
import { BusLayout } from "@/lib/data/bus";

import { PassengerInfo, PassengerInfoForm } from "@/components/custom/trip_detail/PassengerInfoForm";
import { useRouter } from "next/navigation";
import form from "antd/es/form";
import { FormInstance } from "antd";
import { toast } from "sonner";



interface SeatSelectionCardProps {
  tripId: string;
  seats: Seat[];
  layout: BusLayout | null;
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

  const router = useRouter();
  const [formInstance, setFormInstance] = useState<FormInstance | null>(null);



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

    console.log("Generated seats with status:", generatedSeats);
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


  // Handle null layout
  if (!layout) {
    return (
      <Card className="overflow-y-auto max-h-[80vh] scrollbar-hide">
        <CardContent>
          <div className="p-4 text-center">
            <p className="text-gray-500">Không có thông tin sơ đồ ghế</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const floors = layout.floors || 1;
  const rows = layout.rows || 0;
  const cols = layout.cols || 0;


  

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
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            maxWidth: `${cols * 60}px`,
            margin: "0 auto",
          }}
        >
          {Array.from({ length: rows }, (_, rowIndex) =>
            Array.from({ length: cols }, (_, colIndex) => {
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

  const handleFormSubmit = (values: PassengerInfo) => {
    if (selectedSeats.length === 0) {
      toast.error("Vui lòng chọn ít nhất một ghế!");
      return;
    }

    // Chuyển sang trang booking-confirmation
    router.push(
      `/booking/confirmation/${tripId}?` +
      new URLSearchParams({
        seats: selectedSeats.join(","),
        totalPrice: totalPrice.toString(),
        fullName: values.fullName,
        phone: values.phone,
        email: values.email
      }).toString()
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
            Chọn ghế của bạn từ sơ đồ ghế bên dưới. Nhấn vào ghế để chọn hoặc bỏ
            chọn.
          </p>
        </CardDescription>
      </CardHeader>
      <CardContent>
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

        <div className="border rounded-lg p-4 bg-gray-50 mb-4">
          {Array.from({ length: layout?.floors || 1 }, (_, i) =>
            renderFloorSeats(i + 1)
          )}
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

          <PassengerInfoForm
            selectedSeats={selectedSeats}
            totalPrice={totalPrice}
            onFinishAction={handleFormSubmit}
            onFormInstance={setFormInstance}
          />

          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4"
            disabled={selectedSeats.length === 0}
            onClick={() => formInstance?.submit()}
          > Đặt vé
            </Button>
          {/* <Button className="w-full">
            <Armchair className="w-4 h-4 mr-2" />
            Đặt vé ({selectedSeats.length} ghế)
          </Button> */}
        </div>
      </CardFooter>

      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </Card>
  );
}
