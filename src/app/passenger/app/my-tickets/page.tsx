"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Clock,
  CheckCircle,
  XCircle,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import {
  BookingResponse,
  BookingDetailResponse,
  BookingData,
} from "@/lib/data/booking";
import { TicketCard } from "../../../../components/custom/my_tickets/ticket_card";
import { getBookingDetails, getBookingHistory } from "@/lib/data/booking";
import { BookingDetailSheet } from "@/components/custom/my_tickets/booking_detail_sheet";

const getMockBookingDetailResponse = async (
  booking: string
): Promise<BookingDetailResponse> => {
  return await getBookingDetails(booking);
};

export default function MyTicketsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("departure_time");
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

  // Simulate API call
  const fetchBookings = async (
    page: number
    // search?: string,
    // sort?: string
  ) => {
    setIsLoading(true);
    // Simulate API delay
    const mockBookingResponse = await getBookingHistory(2);

    setBookingResponse(mockBookingResponse);
    setIsLoading(false);
  };

  useEffect(() => {
    // fetchBookings(currentPage, searchTerm, sortBy);
    fetchBookings(currentPage);
  }, [currentPage]);

  const filterBookings = (status: string) => {
    return bookingResponse.result.filter((booking) => {
      // Filter by status
      if (status === "upcoming") {
        return (
          // check if booking is upcoming if departure time is in the future
          // (booking.status === "pending" || booking.status === "confirmed") &&
          // new Date(booking.departure_time) > new Date()

          // not checking departure time for upcoming bookings
          booking.status === "pending" || booking.status === "confirmed"
        );
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
    const detailedBooking = await getMockBookingDetailResponse(
      booking.booking_code
    );
    setSelectedBookingDetail(detailedBooking);
    setIsDetailSheetOpen(true);
  };

  const renderTicketCard = (booking: BookingData) => (
    <TicketCard
      key={booking.booking_id}
      booking={booking}
      onViewDetails={() => handleViewDetails(booking)}
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                Vé của tôi
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1 hidden sm:block">
                Quản lý và theo dõi tất cả các vé đã đặt
              </p>
            </div>

            {/* Search and Filter Controls */}
            <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 lg:min-w-80 xl:min-w-96">
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-sm"
                />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-40 lg:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="departure_time">
                    Sắp xếp theo ngày đi
                  </SelectItem>
                  <SelectItem value="booking_date">
                    Sắp xếp theo ngày đặt
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
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
                <div className="space-y-3 sm:space-y-4">
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
                  <Link href="/passenger/app">
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
                <div className="space-y-3 sm:space-y-4">
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
                <div className="space-y-3 sm:space-y-4">
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
        />
      )}
    </div>
  );
}
