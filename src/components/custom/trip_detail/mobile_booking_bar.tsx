"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Armchair } from "lucide-react";

interface MobileBookingBarProps {
  selectedSeats: string[];
  totalPrice: number;
  showSeatModal: boolean;
  onShowSeatModal: (show: boolean) => void;
  children: React.ReactNode; // Seat selection content
  busType?: string; // Add bus type for display
}

export function MobileBookingBar({
  selectedSeats,
  totalPrice,
  showSeatModal,
  onShowSeatModal,
  children,
  busType,
}: MobileBookingBarProps) {
  return (
    <div className="block lg:hidden md:hidden">
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-50 shadow-lg">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Armchair className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-500">
                {selectedSeats.length} ghế
              </span>
            </div>
            <div>
              <p className="font-bold text-green-600">
                {totalPrice.toLocaleString("vi-VN")}đ
              </p>
            </div>
          </div>
          <Button
            onClick={() => onShowSeatModal(true)}
            className="flex items-center gap-2"
          >
            <Armchair className="w-4 h-4" />
            Chọn ghế
          </Button>
        </div>
      </div>

      <Sheet open={showSeatModal} onOpenChange={onShowSeatModal}>
        <SheetContent side="bottom" className="h-[85vh]">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-4 px-4 pt-6">
              <SheetTitle className="font-semibold text-lg flex items-center gap-2">
                <Armchair className="w-5 h-5" />
                <div className="flex flex-col">
                  <span>Chọn ghế</span>
                  {busType && (
                    <span className="text-sm font-normal text-gray-500">
                      {busType}
                    </span>
                  )}
                </div>
              </SheetTitle>
              <Button variant="ghost" onClick={() => onShowSeatModal(false)}>
                Đóng
              </Button>
            </div>

            {/* Scrollable seat selection area */}
            <div className="flex-1 overflow-y-auto px-4">{children}</div>

            {/* Fixed bottom summary */}
            {selectedSeats.length > 0 && (
              <div className="border-t bg-white p-4 mt-auto">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <Armchair className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">
                      Ghế: {selectedSeats.join(", ")}
                    </span>
                  </div>
                  <div className="font-bold text-green-600">
                    {totalPrice.toLocaleString("vi-VN")}đ
                  </div>
                </div>
                <Button className="w-full">
                  <Armchair className="w-4 h-4 mr-2" />
                  Đặt vé ({selectedSeats.length} ghế)
                </Button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
