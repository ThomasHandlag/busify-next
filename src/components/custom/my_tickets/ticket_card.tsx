"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Navigation,
  Users,
  CreditCard,
  Download,
} from "lucide-react";
import { BookingData } from "@/lib/data/booking";

const getStatusInfo = (status: BookingData["status"]) => {
  switch (status) {
    case "confirmed":
      return {
        label: "Đã xác nhận",
        variant: "default" as const,
        icon: CheckCircle,
        color: "text-green-600",
      };
    case "pending":
      return {
        label: "Đã cọc",
        variant: "secondary" as const,
        icon: AlertCircle,
        color: "text-yellow-600",
      };
    case "completed":
      return {
        label: "Đã hoàn thành",
        variant: "default" as const,
        icon: CheckCircle,
        color: "text-blue-600",
      };
    case "canceled_by_user":
    case "canceled_by_operator":
      return {
        label: "Đã hủy",
        variant: "destructive" as const,
        icon: XCircle,
        color: "text-red-600",
      };
    default:
      return {
        label: "Không xác định",
        variant: "outline" as const,
        icon: AlertCircle,
        color: "text-gray-600",
      };
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
};

export const TicketCard = ({
  booking,
  onViewDetails,
}: {
  booking: BookingData;
  onViewDetails?: () => void;
}) => {
  const statusInfo = getStatusInfo(booking.status);
  const StatusIcon = statusInfo.icon;

  // const isUpcoming =
  //   booking.status === "confirmed" || booking.status === "pending";
  const isPast = new Date(booking.departure_time) < new Date();

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-green-500">
      <CardHeader className="pb-3 sm:pb-4">
        <div className="flex flex-col space-y-3 sm:flex-row sm:justify-between sm:items-start sm:space-y-0">
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 truncate">
              {booking.route_name}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mb-2">
              Mã đặt vé:{" "}
              <span className="font-medium">{booking.booking_code}</span>
            </p>
          </div>
          <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2">
            <Badge
              variant={statusInfo.variant}
              className="flex items-center gap-1 text-xs"
            >
              <StatusIcon className="w-3 h-3" />
              {statusInfo.label}
            </Badge>
            <p className="text-lg sm:text-xl font-bold text-green-600">
              {formatCurrency(booking.total_amount)}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 sm:space-y-4">
        {/* Route Information */}
        <div className="grid grid-cols-3 gap-1 sm:gap-2 items-center">
          <div className="text-center">
            <p className="text-sm sm:text-lg font-bold text-gray-900">
              {formatTime(booking.departure_time)}
            </p>
            <p className="text-xs text-gray-500 truncate px-1">
              {booking.departure_address}
            </p>
            <p className="text-xs text-gray-400 hidden sm:block">
              {formatDate(booking.departure_time)}
            </p>
          </div>
          <div className="text-center px-1">
            <div className="flex items-center justify-center mb-1">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1 h-px bg-gray-300 mx-1 sm:mx-2 relative">
                <Navigation className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white" />
              </div>
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex items-center justify-center text-xs text-gray-500">
              <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
              <span className="text-xs">
                {Math.round(
                  (new Date(booking.arrival_time).getTime() -
                    new Date(booking.departure_time).getTime()) /
                    3600000
                )}
                h
              </span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm sm:text-lg font-bold text-gray-900">
              {formatTime(booking.arrival_time)}
            </p>
            <p className="text-xs text-gray-500 truncate px-1">
              {booking.arrival_address}
            </p>
            <p className="text-xs text-gray-400 hidden sm:block">
              {formatDate(booking.arrival_time)}
            </p>
          </div>
        </div>

        {/* Mobile Date Display */}
        <div className="block sm:hidden text-center">
          <p className="text-xs text-gray-500">
            {formatDate(booking.departure_time)}
            {booking.departure_time !== booking.arrival_time &&
              ` - ${formatDate(booking.arrival_time)}`}
          </p>
        </div>

        <Separator />

        {/* Booking Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
          <div className="flex items-center space-x-2">
            <Users className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
            <span className="text-gray-600">
              {booking.passenger_count} hành khách
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
            <span className="text-gray-600">
              Đặt: {formatDate(booking.booking_date)}
            </span>
          </div>
          <div className="flex items-center space-x-2 sm:col-span-2">
            <CreditCard className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
            <span className="text-gray-600">{booking.payment_method}</span>
          </div>
        </div>

        <Separator />

        {/* Actions */}
        <div className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
          <Button
            variant="outline"
            size="sm"
            onClick={onViewDetails}
            className="w-full sm:w-auto text-xs sm:text-sm"
          >
            Xem chi tiết
          </Button>
          <div className="flex flex-col space-y-2 sm:flex-row sm:gap-2 sm:space-y-0">
            {(booking.status === "confirmed" ||
              booking.status === "completed") && (
              <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-auto text-xs sm:text-sm"
              >
                <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Tải vé
              </Button>
            )}
            {booking.status === "confirmed" && !isPast && (
              <Button
                variant="destructive"
                size="sm"
                className="w-full sm:w-auto text-xs sm:text-sm"
              >
                Hủy vé
              </Button>
            )}
            {booking.status === "completed" && (
              <Button
                variant="default"
                size="sm"
                className="bg-green-600 hover:bg-green-700 w-full sm:w-auto text-xs sm:text-sm"
              >
                Đánh giá
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { getStatusInfo, formatDate, formatTime, formatCurrency };
