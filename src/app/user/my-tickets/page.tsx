"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Clock,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Home,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";
import Link from "next/link";
import {
  BookingResponse,
  BookingDetailResponse,
  BookingData,
} from "@/lib/data/booking";
import { TicketCard } from "../../../components/custom/my_tickets/ticket_card";
import { getBookingDetails } from "@/lib/data/booking";
import { BookingDetailSheet } from "@/components/custom/my_tickets/booking_detail_sheet";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export default function MyTicketsPage() {
  const [selectedBookingDetail, setSelectedBookingDetail] =
    useState<BookingDetailResponse | null>(null);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
  const [bookingResponse, setBookingResponse] = useState<BookingResponse>({
    result: [],
    pageNumber: 1,
    pageSize: 10,
    totalRecords: 0,
    totalPages: 0,
    hasNext: false,
    hasPrevious: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  const fetchBookings = useCallback(
    async (page: number) => {
      if (!session?.user?.accessToken) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8080/api/bookings?page=${page}&size=10`,
          {
            headers: {
              Authorization: `Bearer ${session.user.accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setBookingResponse(data.result || data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setBookingResponse({
          result: [],
          pageNumber: 1,
          pageSize: 10,
          totalRecords: 0,
          totalPages: 0,
          hasNext: false,
          hasPrevious: false,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [session?.user?.accessToken]
  );

  useEffect(() => {
    if (session?.user?.accessToken) {
      fetchBookings(currentPage);
    }
  }, [currentPage, fetchBookings, session?.user?.accessToken]);

  const filterBookings = (status: string) => {
    return bookingResponse.result.filter((booking) => {
      if (status === "upcoming") {
        return booking.status === "pending" || booking.status === "confirmed";
      } else if (status === "completed") {
        return booking.status === "completed";
      } else if (status === "canceled") {
        return (
          booking.status === "canceled_by_user" ||
          booking.status === "canceled_by_operator"
        );
      }
      return true;
    });
  };

  const upcomingBookings = filterBookings("upcoming");
  const completedBookings = filterBookings("completed");
  const canceledBookings = filterBookings("canceled");

  const handleViewDetails = async (booking: BookingData) => {
    try {
      const detailedBooking = await getBookingDetails({
        bookingCode: booking.booking_code,
        callback: (message: string) => {
          toast.error(message);
        },
        localeMessage: "Failed to fetch booking details",
      });
      setSelectedBookingDetail(detailedBooking);
      setIsDetailSheetOpen(true);
    } catch (error) {
      console.error("Error fetching booking details:", error);
    }
  };

  const renderTicketCard = (booking: BookingData) => (
    <TicketCard
      key={booking.booking_code}
      booking={booking}
      onViewDetails={() => handleViewDetails(booking)}
      onBookingCancelled={() => fetchBookings(currentPage)}
    />
  );

  const PaginationControls = () => (
    <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mt-4 sm:mt-6">
      <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
        Hiển thị{" "}
        <span className="font-medium">
          {(bookingResponse.pageNumber - 1) * bookingResponse.pageSize + 1} -{" "}
          {Math.min(
            bookingResponse.pageNumber * bookingResponse.pageSize,
            bookingResponse.totalRecords
          )}
        </span>{" "}
        trong tổng số{" "}
        <span className="font-medium">{bookingResponse.totalRecords}</span> vé
      </div>
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((prev) => prev - 1)}
          disabled={!bookingResponse.hasPrevious || isLoading}
          className="text-xs sm:text-sm px-2 sm:px-3"
        >
          <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline ml-1">Trước</span>
        </Button>
        <span className="text-xs sm:text-sm font-medium px-2">
          <span className="hidden sm:inline">Trang </span>
          {bookingResponse.pageNumber} / {bookingResponse.totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={!bookingResponse.hasNext || isLoading}
          className="text-xs sm:text-sm px-2 sm:px-3"
        >
          <span className="hidden sm:inline mr-1">Sau</span>
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      {/* Breadcrumb */}
      <div className="bg-white border-b px-4 py-3">
        <nav className="flex items-center space-x-2 text-sm text-gray-600">
          <Link href="/user" className="hover:text-gray-900">
            <Home className="w-4 h-4" />
          </Link>
          <ChevronRightIcon className="w-4 h-4" />
          <span className="font-medium text-gray-900">Vé của tôi</span>
        </nav>
      </div>

      {/* Header */}
      <div className="bg-white shadow-sm border-b px-4 py-6">
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
              Vé của tôi
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1 hidden sm:block">
              Quản lý và theo dõi tất cả các vé đã đặt
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6">
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4 sm:mb-6 h-auto">
            <TabsTrigger
              value="upcoming"
              className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm"
            >
              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Sắp tới</span>
              <span className="sm:hidden">Sắp tới</span>
              <span className="text-xs">({upcomingBookings.length})</span>
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm"
            >
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Đã hoàn thành</span>
              <span className="sm:hidden">Hoàn thành</span>
              <span className="text-xs">({completedBookings.length})</span>
            </TabsTrigger>
            <TabsTrigger
              value="canceled"
              className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm"
            >
              <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Đã hủy</span>
              <span className="sm:hidden">Đã hủy</span>
              <span className="text-xs">({canceledBookings.length})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-3 sm:space-y-4">
            {isLoading ? (
              <div className="text-center py-8 sm:py-12">
                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-green-600 mx-auto"></div>
                <p className="mt-2 text-sm sm:text-base text-gray-600">
                  Đang tải...
                </p>
              </div>
            ) : upcomingBookings.length > 0 ? (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                  {upcomingBookings.map(renderTicketCard)}
                </div>
                <PaginationControls />
              </>
            ) : (
              <Card className="text-center py-8 sm:py-12">
                <CardContent className="px-4 sm:px-6">
                  <Clock className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                    Không có vé sắp tới
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 max-w-md mx-auto">
                    Bạn chưa có chuyến đi nào được lên lịch. Hãy đặt vé ngay để
                    khám phá những điểm đến mới!
                  </p>
                  <Link aria-label="Book a Ticket" href="/trips">
                    <Button className="bg-green-600 hover:bg-green-700 text-sm sm:text-base">
                      Đặt vé ngay
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-3 sm:space-y-4">
            {isLoading ? (
              <div className="text-center py-8 sm:py-12">
                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-green-600 mx-auto"></div>
                <p className="mt-2 text-sm sm:text-base text-gray-600">
                  Đang tải...
                </p>
              </div>
            ) : completedBookings.length > 0 ? (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                  {completedBookings.map(renderTicketCard)}
                </div>
                <PaginationControls />
              </>
            ) : (
              <Card className="text-center py-8 sm:py-12">
                <CardContent className="px-4 sm:px-6">
                  <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                    Chưa có chuyến đi nào hoàn thành
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto">
                    Các chuyến đi đã hoàn thành sẽ được hiển thị tại đây.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="canceled" className="space-y-3 sm:space-y-4">
            {isLoading ? (
              <div className="text-center py-8 sm:py-12">
                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-green-600 mx-auto"></div>
                <p className="mt-2 text-sm sm:text-base text-gray-600">
                  Đang tải...
                </p>
              </div>
            ) : canceledBookings.length > 0 ? (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                  {canceledBookings.map(renderTicketCard)}
                </div>
                <PaginationControls />
              </>
            ) : (
              <Card className="text-center py-8 sm:py-12">
                <CardContent className="px-4 sm:px-6">
                  <XCircle className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                    Không có vé đã hủy
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto">
                    Các vé đã hủy sẽ được hiển thị tại đây.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Booking Detail Sheet */}
      {selectedBookingDetail && (
        <BookingDetailSheet
          booking={selectedBookingDetail}
          isOpen={isDetailSheetOpen}
          onClose={() => setIsDetailSheetOpen(false)}
          onBookingCancelled={() => fetchBookings(currentPage)}
        />
      )}
    </div>
  );
}
