"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
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
import { getBookingDetails, getBookingHistory } from "@/lib/data/booking";
import { BookingDetailSheet } from "@/components/custom/my_tickets/booking_detail_sheet";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import LocaleText from "@/components/custom/locale_text";
import { useTranslations } from "next-intl";

type TabValue = "upcoming" | "completed" | "canceled";

interface PaginationState {
  upcoming: { currentPage: number; pageSize: number };
  completed: { currentPage: number; pageSize: number };
  canceled: { currentPage: number; pageSize: number };
}

export default function MyTicketsPage() {
  const t = useTranslations("MyTickets");
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

  const [activeTab, setActiveTab] = useState<TabValue>("upcoming");
  const [paginationState, setPaginationState] = useState<PaginationState>({
    upcoming: { currentPage: 1, pageSize: 6 },
    completed: { currentPage: 1, pageSize: 6 },
    canceled: { currentPage: 1, pageSize: 6 },
  });

  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  const fetchBookings = useCallback(
    async (page: number = 1, size: number = 50) => {
      // Fetch more data to handle client-side filtering
      if (!session?.user?.accessToken) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const data = await getBookingHistory({
          page,
          size,
          accessToken: session.user.accessToken,
          callback: (msg: string) => toast.error(msg),
          localeMessage: "Failed to fetch bookings",
        });

        // Sắp xếp dữ liệu theo thời gian đặt gần nhất (booking_date giảm dần)
        const sortedResult = data.result.sort((a, b) => {
          const dateA = new Date(a.booking_date).getTime();
          const dateB = new Date(b.booking_date).getTime();
          return dateB - dateA; // Giảm dần: mới nhất trước
        });

        setBookingResponse({ ...data, result: sortedResult });
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setBookingResponse({
          result: [],
          pageNumber: 1,
          pageSize: 50,
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
      fetchBookings();
    }
  }, [fetchBookings, session?.user?.accessToken]);

  const filterBookings = useCallback(
    (status: TabValue) => {
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
    },
    [bookingResponse.result]
  );

  // Memoized filtered bookings
  const filteredBookings = useMemo(
    () => ({
      upcoming: filterBookings("upcoming"),
      completed: filterBookings("completed"),
      canceled: filterBookings("canceled"),
    }),
    [filterBookings]
  );

  // Paginated data for current tab
  const paginatedBookings = useMemo(() => {
    const currentTabBookings = filteredBookings[activeTab];
    const { currentPage, pageSize } = paginationState[activeTab];
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return {
      data: currentTabBookings.slice(startIndex, endIndex),
      totalItems: currentTabBookings.length,
      totalPages: Math.ceil(currentTabBookings.length / pageSize),
      currentPage,
      pageSize,
      hasNext: endIndex < currentTabBookings.length,
      hasPrevious: currentPage > 1,
    };
  }, [filteredBookings, activeTab, paginationState]);

  // Update handleTabChange to accept a string and cast it to TabValue
  const handleTabChange = (value: string) => {
    // Cast to TabValue for type safety (assuming value is one of the expected strings)
    setActiveTab(value as TabValue);
  };

  const updatePagination = (
    tab: TabValue,
    updates: Partial<{ currentPage: number; pageSize: number }>
  ) => {
    setPaginationState((prev) => ({
      ...prev,
      [tab]: {
        ...prev[tab],
        ...updates,
      },
    }));
  };

  const handlePageChange = (direction: "next" | "prev") => {
    const newPage =
      direction === "next"
        ? paginatedBookings.currentPage + 1
        : paginatedBookings.currentPage - 1;

    updatePagination(activeTab, { currentPage: newPage });
  };

  const handleViewDetails = async (booking: BookingData) => {
    try {
      const detailedBooking = await getBookingDetails({
        bookingCode: booking.booking_code,
        callback: (message: string) => {
          toast.error(message);
        },
        localeMessage: t("fetchDetailsError"),
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
      onBookingCancelled={() => fetchBookings()}
    />
  );

  const PaginationControls = () => {
    const { totalItems, hasNext, hasPrevious } = paginatedBookings;
    // const startItem = (currentPage - 1) * pageSize + 1;
    // const endItem = Math.min(currentPage * pageSize, totalItems);

    if (totalItems === 0) return null;
    return (
      <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mt-4 sm:mt-6">
        <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
          {t("pagination.showing", {
            from:
              (bookingResponse.pageNumber - 1) * bookingResponse.pageSize + 1,
            to: Math.min(
              bookingResponse.pageNumber * bookingResponse.pageSize,
              bookingResponse.totalRecords
            ),
            total: bookingResponse.totalRecords,
          })}
        </div>
        <div className="flex items-center justify-center gap-2">
          <Button
            aria-label="Previous Page"
            variant="outline"
            size="sm"
            onClick={() => handlePageChange("prev")}
            disabled={!hasPrevious || isLoading}
            className="text-xs sm:text-sm px-2 sm:px-3"
          >
            <span className="hidden sm:inline ml-1">
              <LocaleText string="previous" name="Common" />
            </span>
            <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
          <span className="text-xs sm:text-sm font-medium px-2">
            <span className="hidden sm:inline">Trang </span>
            {bookingResponse.pageNumber} / {bookingResponse.totalPages}
          </span>
          <Button
            aria-label="Next Page"
            variant="outline"
            size="sm"
            onClick={() => handlePageChange("next")}
            disabled={!hasNext || isLoading}
            className="text-xs sm:text-sm px-2 sm:px-3"
          >
            <LocaleText string="next" name="Common" />
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
        </div>
      </div>
    );
  };

  const EmptyState = ({
    icon: Icon,
    title,
    description,
    actionButton,
  }: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
    actionButton?: React.ReactNode;
  }) => (
    <Card className="text-center py-8 sm:py-12">
      <CardContent className="px-4 sm:px-6">
        <Icon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-sm sm:text-base text-gray-600 mb-4 max-w-md mx-auto">
          {description}
        </p>
        {actionButton}
      </CardContent>
    </Card>
  );

  const TabContent = ({ tabType }: { tabType: TabValue }) => {
    const bookingsToShow = paginatedBookings.data;
    const hasBookings = bookingsToShow.length > 0;

    if (isLoading) {
      return (
        <div className="text-center py-8 sm:py-12">
          <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-sm sm:text-base text-gray-600">Đang tải...</p>
        </div>
      );
    }

    if (!hasBookings) {
      const emptyStateProps = {
        upcoming: {
          icon: Clock,
          title: "Không có vé sắp tới",
          description:
            "Bạn chưa có chuyến đi nào được lên lịch. Hãy đặt vé ngay để khám phá những điểm đến mới!",
          actionButton: (
            <Link aria-label="Book a Ticket" href="/trips">
              <Button
                aria-label="Book a Ticket"
                className="bg-green-600 hover:bg-green-700 text-sm sm:text-base"
              >
                Đặt vé ngay
              </Button>
            </Link>
          ),
        },
        completed: {
          icon: CheckCircle,
          title: "Chưa có chuyến đi nào hoàn thành",
          description: "Các chuyến đi đã hoàn thành sẽ được hiển thị tại đây.",
        },
        canceled: {
          icon: XCircle,
          title: "Không có vé đã hủy",
          description: "Các vé đã hủy sẽ được hiển thị tại đây.",
        },
      };

      return <EmptyState {...emptyStateProps[tabType]} />;
    }

    return (
      <>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          {bookingsToShow.map(renderTicketCard)}
        </div>
        <PaginationControls />
      </>
    );
  };

  return (
    <div className="w-full">
      {/* Breadcrumb */}
      <div className="bg-white border-b px-4 py-3">
        <nav className="flex items-center space-x-2 text-sm text-gray-600">
          <Link href="/user" className="hover:text-gray-900">
            <Home className="w-4 h-4" />
          </Link>
          <ChevronRightIcon className="w-4 h-4" />
          <span className="font-medium text-gray-900">
            <LocaleText string="breadcrumb" name="MyTickets" />
          </span>
        </nav>
      </div>

      {/* Header */}
      <div className="bg-white shadow-sm border-b px-4 py-6">
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
              <LocaleText string="pageTitle" name="MyTickets" />
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1 hidden sm:block">
              <LocaleText string="pageSubtitle" name="MyTickets" />
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6">
        <Tabs
          value={activeTab}
          onValueChange={(value: string) => handleTabChange(value)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 mb-4 sm:mb-6 h-auto">
            <TabsTrigger
              value={"upcoming" as TabValue}
              className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm"
            >
              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">
                <LocaleText string="tabs.upcoming" name="MyTickets" />
              </span>
              <span className="sm:hidden">
                <LocaleText string="tabs.upcoming" name="MyTickets" />
              </span>
              <span className="text-xs">
                ({filteredBookings.upcoming.length})
              </span>
            </TabsTrigger>
            <TabsTrigger
              value={"completed" as TabValue}
              className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm"
            >
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">
                <LocaleText string="tabs.completed" name="MyTickets" />
              </span>
              <span className="sm:hidden">
                <LocaleText string="tabs.completed" name="MyTickets" />
              </span>
              <span className="text-xs">
                ({filteredBookings.completed.length})
              </span>
            </TabsTrigger>
            <TabsTrigger
              value={"canceled" as TabValue}
              className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm"
            >
              <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">
                <LocaleText string="tabs.canceled" name="MyTickets" />
              </span>
              <span className="sm:hidden">
                <LocaleText string="tabs.canceled" name="MyTickets" />
              </span>
              <span className="text-xs">
                ({filteredBookings.canceled.length})
              </span>
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value={"upcoming" as TabValue}
            className="space-y-3 sm:space-y-4"
          >
            <TabContent tabType="upcoming" />
          </TabsContent>

          <TabsContent value="completed" className="space-y-3 sm:space-y-4">
            <TabContent tabType="completed" />
          </TabsContent>

          <TabsContent value="canceled" className="space-y-3 sm:space-y-4">
            <TabContent tabType="canceled" />
          </TabsContent>
        </Tabs>
      </div>

      {/* Booking Detail Sheet */}
      {selectedBookingDetail && (
        <BookingDetailSheet
          booking={selectedBookingDetail}
          isOpen={isDetailSheetOpen}
          onClose={() => setIsDetailSheetOpen(false)}
          onBookingCancelled={() => fetchBookings()}
        />
      )}
    </div>
  );
}
