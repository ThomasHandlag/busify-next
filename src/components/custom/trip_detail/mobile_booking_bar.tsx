"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Armchair } from "lucide-react";
import { useState } from "react";
import { SeatSelectionCard } from "./seat_selection_card";
import { Seat } from "@/lib/data/trip_seats";
import { BusLayout } from "@/lib/data/bus";

interface MobileBookingBarProps {

  tripId: string; // Thêm tripId
  layout: BusLayout | null;
  seats: Seat[];
  pricePerSeat: number;
  busType?: string; // Optional
  operatorName?: string; // Optional
}


export function MobileBookingBar({
tripId,
  busType,
  seats,
  layout,
  pricePerSeat,
  operatorName,
}: MobileBookingBarProps) {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const children = layout ? (
    SeatSelectionCard({

      tripId,// Truyền tripId

      seats,
      layout,
      pricePerSeat,
      onSeatSelection: (seats, price) => {
        setSelectedSeats(seats);
        setTotalPrice(price);
      },
    })
  ) : (
    <div className="text-center text-gray-500">
      Không có thông tin về bố trí ghế.
    </div>
  );

  return (
    <div className="block">
      <div className="hidden lg:block md:block">{children}</div>
      <div className="block lg:hidden md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button className="flex items-center gap-2 ml-2 lg:inset-0">
              <Armchair className="w-4 h-4" />
              Chọn ghế
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-full">
            <div className="flex flex-col h-full mb-4 px-2 lg:px-2 pt-6 gap-2">
              <SheetTitle className="font-semibold text-lg flex items-center gap-2">
                <Armchair className="w-5 h-5" />
                <div className="flex flex-col">
                  <span>{operatorName}</span>
                  {busType && (
                    <span className="text-sm font-normal text-gray-500">
                      {busType}
                    </span>
                  )}
                </div>
              </SheetTitle>

              <div className="flex-1 overflow-y-auto px-2 lg:px-4">
                {children}
              </div>
            </div>
            <SheetFooter>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1">
                  <Armchair className="w-5 h-5" />
                  <span className="text-sm text-gray-500">
                    {selectedSeats.length} ghế
                  </span>
                </div>
                <div>
                  <p className="font-bold text-xl text-green-600">
                    {totalPrice.toLocaleString("vi-VN")}đ
                  </p>
                </div>
              </div>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
