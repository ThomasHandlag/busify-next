"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Navigation,
  Users,
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

  const isPast = new Date(booking.departure_time) < new Date();

  return (
    <Card className="hover:shadow-md transition-all duration-200 border-l-4 border-l-green-500 overflow-hidden">
      <CardContent className="p-4">
        {/* Header Row */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 min-w-0 pr-3">
            <h3 className="text-sm font-bold text-gray-900 mb-1 truncate">
              {booking.route_name}
            </h3>
            <p className="text-xs text-gray-500">
              {booking.booking_code}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge
              variant={statusInfo.variant}
              className="flex items-center gap-1 text-xs px-2 py-1"
            >
              <StatusIcon className="w-3 h-3" />
              {statusInfo.label}
            </Badge>
            <p className="text-sm font-bold text-green-600">
              {formatCurrency(booking.total_amount)}
            </p>
          </div>
        </div>

        {/* Route Row - Compact */}
        <div className="grid grid-cols-5 items-center gap-2 mb-3">
          <div className="col-span-2 text-left">
            <p className="text-sm font-semibold text-gray-900">
              {formatTime(booking.departure_time)}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {booking.departure_address}
            </p>
          </div>
          
          <div className="flex items-center justify-center">
            <div className="flex items-center w-full">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <div className="flex-1 h-px bg-gray-300 mx-2 relative">
                <Navigation className="w-3 h-3 text-gray-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white" />
              </div>
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            </div>
          </div>
          
          <div className="col-span-2 text-right">
            <p className="text-sm font-semibold text-gray-900">
              {formatTime(booking.arrival_time)}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {booking.arrival_address}
            </p>
          </div>
        </div>

        {/* Info Row - Compact */}
        <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(booking.departure_time)}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {booking.passenger_count}
            </span>
          </div>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {Math.round(
              (new Date(booking.arrival_time).getTime() -
                new Date(booking.departure_time).getTime()) /
                3600000
            )}h
          </span>
        </div>

        {/* Actions Row - Compact */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onViewDetails}
            className="flex-1 h-8 text-xs"
          >
            Chi tiết
          </Button>
          
          {(booking.status === "confirmed" || booking.status === "completed") && (
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs"
            >
              <Download className="w-3 h-3" />
            </Button>
          )}
          
          {booking.status === "confirmed" && !isPast && (
            <Button
              variant="destructive"
              size="sm"
              className="h-8 px-3 text-xs"
            >
              Hủy
            </Button>
          )}
          
          {booking.status === "completed" && (
            <Button
              variant="default"
              size="sm"
              className="bg-green-600 hover:bg-green-700 h-8 px-3 text-xs"
            >
              Đánh giá
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export { getStatusInfo, formatDate, formatTime, formatCurrency };
