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
  AlertTriangle, // Đổi từ MessageSquare sang AlertTriangle cho biểu tượng khiếu nại
} from "lucide-react";
import { BookingData } from "@/lib/data/booking";
import { useState } from "react"; // Thêm import useState nếu chưa có
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"; // Thêm import cho Dialog, bao gồm DialogFooter và DialogDescription
import { Textarea } from "@/components/ui/textarea"; // Thêm import cho Textarea
import { Input } from "@/components/ui/input"; // Thêm import cho Input
import { useSession } from "next-auth/react"; // Thêm import useSession
import { createComplaint, ComplaintAddDTO } from "@/lib/data/complaints"; // Thêm import createComplaint
import { toast } from "sonner"; // Thêm import toast cho thông báo
import { cancelBooking } from "@/lib/data/booking"; // Thêm import cho cancelBooking
import { useTranslations } from "next-intl";

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

// Thêm hàm tính toán tỷ lệ hoàn tiền
const calculateRefundPercentage = (
  bookingDate: string,
  departureTime: string
) => {
  const now = new Date();
  const bookingTime = new Date(bookingDate);
  const departure = new Date(departureTime);

  const hoursSinceBooking =
    (now.getTime() - bookingTime.getTime()) / (1000 * 60 * 60);
  const hoursUntilDeparture =
    (departure.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (hoursSinceBooking <= 24) {
    return 100;
  } else if (hoursUntilDeparture >= 24) {
    return 70;
  } else {
    return 0;
  }
};

export const TicketCard = ({
  booking,
  onViewDetails,
  onBookingCancelled,
}: {
  booking: BookingData;
  onViewDetails?: () => void;
  onBookingCancelled?: () => void;
}) => {
  const { data: session } = useSession(); // Lấy session để lấy token
  const t = useTranslations();

  const getStatusInfo = (status: BookingData["status"]) => {
    switch (status) {
      case "confirmed":
        return {
          label: t("Booking.confirmed"),
          variant: "default" as const,
          icon: CheckCircle,
          color: "text-green-600",
        };
      case "pending":
        return {
          label: t("Booking.pending"),
          variant: "secondary" as const,
          icon: AlertCircle,
          color: "text-yellow-600",
        };
      case "completed":
        return {
          label: t("Booking.completed"),
          variant: "default" as const,
          icon: CheckCircle,
          color: "text-blue-600",
        };
      case "canceled_by_user":
      case "canceled_by_operator":
        return {
          label: t("Booking.canceled"),
          variant: "destructive" as const,
          icon: XCircle,
          color: "text-red-600",
        };
      default:
        return {
          label: t("Booking.unknown"),
          variant: "outline" as const,
          icon: AlertCircle,
          color: "text-gray-600",
        };
    }
  };

  const statusInfo = getStatusInfo(booking.status);
  const StatusIcon = statusInfo.icon;
  const [complaintTitle, setComplaintTitle] = useState(""); // State cho tiêu đề khiếu nại
  const [complaintDescription, setComplaintDescription] = useState(""); // State cho mô tả khiếu nại
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false); // State cho modal
  const [isSubmittingComplaint, setIsSubmittingComplaint] = useState(false); // State cho loading khi gửi khiếu nại
  const [isCancelling, setIsCancelling] = useState(false); // Thêm state cho loading khi hủy
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false); // State cho dialog xác nhận hủy

  const isPast = new Date(booking.departure_time) < new Date();
  const refundPercentage = calculateRefundPercentage(
    booking.booking_date, // Thời gian đặt vé
    booking.departure_time // Thời gian khởi hành
  );

  const handleSubmitComplaint = async () => {
    if (!session?.user?.accessToken) {
      toast.error(t("MyTickets.loginRequired"));
      return;
    }

    if (!complaintTitle.trim() || !complaintDescription.trim()) {
      toast.error(t("MyTickets.complaintValidationError"));
      return;
    }

    setIsSubmittingComplaint(true);
    try {
      const complaintData: ComplaintAddDTO = {
        title: complaintTitle.trim(),
        description: complaintDescription.trim(),
        bookingCode: booking.booking_code,
        status: "New",
      };

      const result = await createComplaint(
        session.user.accessToken,
        complaintData
      );

      if (result) {
        toast.success(t("MyTickets.complaintSubmitted"));
        setComplaintTitle("");
        setComplaintDescription("");
        setIsComplaintModalOpen(false);
      } else {
        toast.error(t("MyTickets.complaintError"));
      }
    } catch (error) {
      console.error("Error submitting complaint:", error);
      toast.error(t("MyTickets.complaintError"));
    } finally {
      setIsSubmittingComplaint(false);
    }
  };

  // Thêm hàm xử lý hủy vé
  const handleCancelBooking = async () => {
    if (!session?.user?.accessToken) {
      toast.error(t("MyTickets.loginRequired"));
      return;
    }

    setIsCancelling(true);
    try {
      const success = await cancelBooking({
        bookingCode: booking.booking_code,
        accessToken: session.user.accessToken,
        callback: (message: string) => {
          toast.error(message);
        },
        localeMessage: t("MyTickets.cannotCancelNotice"),
      });

      if (success) {
        toast.success(t("MyTickets.cancelSuccess"));
        // Thông báo cho parent component để làm mới danh sách
        if (onBookingCancelled) {
          onBookingCancelled();
        }
        setIsCancelConfirmOpen(false); // Đóng dialog sau khi hủy thành công
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error(t("MyTickets.cancelError"));
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <Card className="hover:shadow-md transition-all duration-200 border-l-4 border-l-green-500 overflow-hidden">
      <CardContent className="p-4">
        {/* Header Row */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 min-w-0 pr-3">
            <h3 className="text-sm font-bold text-gray-900 mb-1 truncate">
              {booking.route_name}
            </h3>
            <p className="text-xs text-gray-500">{booking.booking_code}</p>
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
            )}
            h
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
            {t("MyTickets.details")}
          </Button>{" "}
          {(booking.status === "confirmed" || booking.status === "pending") &&
            !isPast && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setIsCancelConfirmOpen(true)} // Mở dialog xác nhận thay vì hủy ngay
                disabled={isCancelling} // Vô hiệu hóa khi đang hủy
                className="h-8 px-3 text-xs"
              >
                {isCancelling ? t("MyTickets.cancelling") : t("MyTickets.cancel")} {/* Text động */}
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
            <>
              <Button
                variant="default"
                size="sm"
                className="bg-green-600 hover:bg-green-700 h-8 px-3 text-xs"
              >
                Đánh giá
              </Button>
              <Dialog
                open={isComplaintModalOpen}
                onOpenChange={setIsComplaintModalOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-3 text-xs"
                  >
                    <AlertTriangle className="w-3 h-3" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t("MyTickets.submitComplaint")}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">
                        {t("MyTickets.title")}
                      </label>
                      <Input
                        placeholder={t("MyTickets.complaintTitlePlaceholder")}
                        value={complaintTitle}
                        onChange={(e) => setComplaintTitle(e.target.value)}
                        disabled={isSubmittingComplaint}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">
                        {t("MyTickets.description")}
                      </label>
                      <Textarea
                        placeholder={t("MyTickets.complaintDescPlaceholder")}
                        value={complaintDescription}
                        onChange={(e) =>
                          setComplaintDescription(e.target.value)
                        }
                        disabled={isSubmittingComplaint}
                      />
                    </div>
                    <Button
                      onClick={handleSubmitComplaint}
                      disabled={
                        isSubmittingComplaint ||
                        !complaintTitle.trim() ||
                        !complaintDescription.trim()
                      }
                    >
                      {isSubmittingComplaint ? t("MyTickets.sending") : t("MyTickets.send")}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>

        {/* Dialog xác nhận hủy vé */}
        <Dialog
          open={isCancelConfirmOpen}
          onOpenChange={setIsCancelConfirmOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("MyTickets.confirmCancelTitle")}</DialogTitle>
              <DialogDescription>
                {t("MyTickets.confirmCancelDescription")}
                {refundPercentage}% {t("MyTickets.refundNotice")}.
                {refundPercentage === 0 && t("MyTickets.cancelNotice")}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCancelConfirmOpen(false)}
                disabled={isCancelling}
              >
                {t("Common.cancel")}
              </Button>
              <Button
                variant="destructive"
                onClick={handleCancelBooking}
                disabled={isCancelling}
              >
                {isCancelling
                  ? t("MyTickets.processing")
                  : t("MyTickets.confirmCancel")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export { formatDate, formatTime, formatCurrency };
