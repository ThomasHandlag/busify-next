"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bus,
  Clock,
  CreditCard,
  Download,
  Mail,
  MapPin,
  Phone,
  Star,
  User,
  Users,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  AlertTriangle, // Đổi từ MessageSquare sang AlertTriangle cho biểu tượng khiếu nại
} from "lucide-react";
import { BookingDetailResponse } from "@/lib/data/booking";
import {
  formatDate,
  formatTime,
  formatCurrency,
} from "../my_tickets/ticket_card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"; // Thêm DialogFooter và DialogDescription
import { Textarea } from "@/components/ui/textarea"; // Thêm import cho Textarea
import { Input } from "@/components/ui/input"; // Thêm import cho Input
import { useSession } from "next-auth/react"; // Thêm import useSession
import { createComplaint, ComplaintAddDTO } from "@/lib/data/complaints"; // Thêm import createComplaint
import { toast } from "sonner"; // Thêm import toast cho thông báo
import { useTranslations } from "next-intl";
import { cancelBooking, downloadBookingPdf } from "@/lib/data/booking"; // Thêm import cancelBooking và downloadBookingPdf
import { useRouter } from "next/navigation"; // Thêm import useRouter

interface BookingDetailSheetProps {
  booking: BookingDetailResponse;
  isOpen: boolean;
  onClose: () => void;
  onBookingCancelled?: () => void; // Thêm prop callback để refresh danh sách
}

const getStatusInfo = (status: BookingDetailResponse["status"]) => {
  switch (status) {
    case "confirmed":
      return {
        labelKey: "status.confirmed",
        variant: "default" as const,
        icon: CheckCircle,
        color: "text-green-600",
      };
    case "pending":
      return {
        labelKey: "status.pending",
        variant: "secondary" as const,
        icon: AlertCircle,
        color: "text-yellow-600",
      };
    case "completed":
      return {
        labelKey: "status.completed",
        variant: "default" as const,
        icon: CheckCircle,
        color: "text-blue-600",
      };
    case "canceled_by_user":
    case "canceled_by_operator":
      return {
        labelKey: "status.canceled",
        variant: "destructive" as const,
        icon: XCircle,
        color: "text-red-600",
      };
    default:
      return {
        labelKey: "status.unknown",
        variant: "outline" as const,
        icon: AlertCircle,
        color: "text-gray-600",
      };
  }
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

export function BookingDetailSheet({
  booking,
  isOpen,
  onClose,
  onBookingCancelled,
}: BookingDetailSheetProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [complaintTitle, setComplaintTitle] = useState(""); // State cho tiêu đề khiếu nại
  const [complaintDescription, setComplaintDescription] = useState(""); // State cho mô tả khiếu nại
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false); // State cho modal
  const [isSubmittingComplaint, setIsSubmittingComplaint] = useState(false); // State cho loading khi gửi khiếu nại
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false); // State cho dialog xác nhận hủy
  const statusInfo = getStatusInfo(booking.status);
  const StatusIcon = statusInfo.icon;
  const { data: session } = useSession(); // Lấy session để lấy token
  const t = useTranslations();
  const router = useRouter(); // Khởi tạo router

  const handleCancelBooking = async () => {
    if (!session?.user?.accessToken) {
      toast.error(t("MyTickets.loginRequiredCancel"));
      return;
    }

    setIsLoading(true);
    try {
      const success = await cancelBooking({
        bookingCode: booking.booking_code,
        accessToken: session.user.accessToken,
        callback: (message: string) => {
          toast.error(message);
        },
        localeMessage: t("MyTickets.cancelError"),
      });

      if (success) {
        toast.success(t("MyTickets.cancelSuccess"));
        setIsCancelConfirmOpen(false); // Đóng dialog sau khi hủy thành công
        onClose(); // Đóng sheet sau khi hủy

        // Gọi callback để refresh danh sách vé
        if (onBookingCancelled) {
          onBookingCancelled();
        }
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error(t("MyTickets.cancelError"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadTicket = async () => {
    if (!session?.user?.accessToken) {
      toast.error("Bạn cần đăng nhập để tải vé.");
      return;
    }
    setIsLoading(true);
    try {
      const pdfBlob = await downloadBookingPdf({
        bookingCode: booking.booking_code,
        accessToken: session.user.accessToken,
        callback: (message: string) => toast.error(message),
        localeMessage: "Không thể tải xuống vé PDF.",
      });

      if (pdfBlob) {
        // Tạo URL tạm thời cho blob
        const url = window.URL.createObjectURL(pdfBlob);
        // Tạo một thẻ a ẩn để kích hoạt tải xuống
        const a = document.createElement("a");
        a.href = url;
        a.download = `ve-xe-${booking.booking_code}.pdf`; // Tên file tải về
        document.body.appendChild(a);
        a.click();
        // Dọn dẹp
        a.remove();
        window.URL.revokeObjectURL(url);
        toast.success("Đã bắt đầu tải xuống vé PDF.");
      }
    } catch (error) {
      console.error("Error in handleDownloadTicket:", error);
      // Thông báo lỗi đã được xử lý trong hàm downloadBookingPdf
    } finally {
      setIsLoading(false);
    }
  };

  const handleWriteReview = () => {
    // Navigate to review page or open review modal
    if (booking.trip_id) {
      router.push(`/trips/${booking.trip_id}`);
    } else {
      console.error("Trip ID is missing, cannot redirect to review page.");
      toast.error("Không thể mở trang đánh giá do thiếu thông tin chuyến đi.");
    }
  };

  const handleSubmitComplaint = async () => {
    if (!session?.user?.accessToken) {
      toast.error(t("MyTickets.loginRequiredComplaint"));
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
        bookingCode: booking.booking_id, // Sử dụng booking_id thay vì booking_code nếu cần
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

  const isPast = new Date(booking.departure_time) < new Date();
  const canCancel =
    (booking.status === "confirmed" || booking.status === "pending") && !isPast;
  const canReview = booking.status === "completed";
  const canDownload =
    booking.status === "confirmed" || booking.status === "completed";
  const canComplain = booking.status === "completed"; // Thêm điều kiện cho khiếu nại

  const routeName = `${booking.route_start.city} - ${booking.route_end.city}`;
  const refundPercentage = calculateRefundPercentage(
    booking.payment_info.timestamp, // Thời gian đặt vé
    booking.departure_time // Thời gian khởi hành
  );

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl overflow-y-auto"
      >
        <SheetHeader className="space-y-4 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-xl font-bold">
                {t("MyTickets.bookingDetails")}
              </SheetTitle>
              <SheetDescription className="text-sm text-gray-600">
                {t("MyTickets.bookingCode")}:{" "}
                <span className="font-semibold">
                  BUSIFY-{booking.booking_id}
                </span>
              </SheetDescription>
            </div>
            <Badge
              variant={statusInfo.variant}
              className="flex items-center gap-1 mt-2"
            >
              <StatusIcon className="w-3 h-3" />
              {t(`MyTickets.${statusInfo.labelKey}`)}
            </Badge>
          </div>
        </SheetHeader>

        <div className="space-y-6">
          {/* Trip Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bus className="w-5 h-5" />
                {t("MyTickets.tripInfo")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <h4 className="font-semibold text-lg">{routeName}</h4>
                  <p className="text-gray-600">{booking.operator_name}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">
                        {t("Filter.departureDate")}
                      </span>
                    </div>
                    <p className="text-lg font-bold">
                      {formatTime(booking.departure_time)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(booking.departure_time)}
                    </p>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {booking.route_start.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {booking.route_start.address},{" "}
                        {booking.route_start.city}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">
                        {t("Booking.arrival")}
                      </span>
                    </div>
                    <p className="text-lg font-bold">
                      {formatTime(booking.arrival_estimate_time)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(booking.arrival_estimate_time)}
                    </p>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {booking.route_end.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {booking.route_end.address}, {booking.route_end.city}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
                  <div className="flex items-center gap-2">
                    <Bus className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium">
                      {t("MyTickets.busType")}:
                    </span>
                    <span className="text-sm">{booking.bus.model}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {t("Booking.confirmation.license")}:
                    </span>
                    <span className="text-sm">{booking.bus.license_plate}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="w-5 h-5" />
                {t("MyTickets.passengerInfo")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                <span className="font-medium">{booking.passenger_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>{booking.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span>{booking.email}</span>
              </div>
              {booking.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{booking.address}</span>
                </div>
              )}
              {booking.guestFullName && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">
                    {t("MyTickets.guestInfo")}: {booking.guestFullName}
                  </span>
                </div>
              )}
              {booking.guestPhone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{booking.guestPhone}</span>
                </div>
              )}
              {booking.guestEmail && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{booking.guestEmail}</span>
                </div>
              )}
              {booking.guestAddress && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{booking.guestAddress}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400" />
                <span>
                  {t("MyTickets.passengersCount", {
                    count: booking.tickets.length,
                  })}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Ticket Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="w-5 h-5" />
                {t("MyTickets.ticketDetails")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {booking.tickets.map((ticket, index) => (
                  <div
                    key={ticket.ticket_code}
                    className="p-3 border rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">
                        {t("MyTickets.ticketNumber", { number: index + 1 })}
                      </span>
                      <Badge variant="outline">{ticket.seat_number}</Badge>
                    </div>
                    <div className="text-sm space-y-1">
                      <p>
                        <span className="font-medium">
                          {t("MyTickets.ticketCode")}:
                        </span>{" "}
                        {ticket.ticket_code}
                      </p>
                      <p>
                        <span className="font-medium">
                          {t("MyTickets.passenger")}:
                        </span>{" "}
                        {index === 0
                          ? booking.passenger_name
                          : t("MyTickets.passengerN", { number: index + 1 })}
                      </p>
                      <p>
                        <span className="font-medium">
                          {t("Booking.ticketPrice")}:
                        </span>{" "}
                        {formatCurrency(
                          booking.payment_info.amount / booking.tickets.length
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CreditCard className="w-5 h-5" />
                {t("MyTickets.paymentInfo")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-green-800">
                    {t("Booking.totalAmount")}:
                  </span>
                  <span className="text-xl font-bold text-green-600">
                    {formatCurrency(booking.payment_info.amount)}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="font-medium">
                  {t("MyTickets.paymentHistory")}:
                </h5>
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">
                      {formatCurrency(booking.payment_info.amount)}
                    </span>
                    <Badge variant="default">{t("Common.success")}</Badge>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      {t("MyTickets.method")}: {booking.payment_info.method}
                    </p>
                    <p>
                      {t("Booking.confirmation.time")}:{" "}
                      {formatDate(booking.payment_info.timestamp)} -{" "}
                      {formatTime(booking.payment_info.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Refund Information - Only show if refunds exist */}
          {booking.refunds && booking.refunds.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CreditCard className="w-5 h-5" />
                  {t("MyTickets.refundInfo")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {booking.refunds.map((refund) => (
                  <div key={refund.refundId} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium">
                        {t("MyTickets.refund")} #{refund.refundId}
                      </h5>
                      <Badge
                        variant={
                          refund.status === "COMPLETED"
                            ? "default"
                            : refund.status === "PENDING"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {refund.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">
                          {t("MyTickets.refundAmount")}:
                        </p>
                        <p className="font-medium text-green-600">
                          {formatCurrency(refund.refundAmount)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">
                          {t("MyTickets.cancellationFee")}:
                        </p>
                        <p className="font-medium text-red-600">
                          {formatCurrency(refund.cancellationFee)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">
                          {t("MyTickets.netRefundAmount")}:
                        </p>
                        <p className="font-medium text-blue-600">
                          {formatCurrency(refund.netRefundAmount)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">
                          {t("MyTickets.refundTransactionCode")}:
                        </p>
                        <p className="font-medium">
                          {refund.refundTransactionCode}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t">
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">
                          {t("MyTickets.refundReason")}:
                        </span>{" "}
                        {refund.refundReason}
                      </p>
                      <div className="grid grid-cols-3 gap-4 text-xs text-gray-500">
                        <div>
                          <p>
                            {t("MyTickets.requestedAt")}:{" "}
                            {formatDate(refund.requestedAt)}
                          </p>
                        </div>
                        {refund.processedAt && (
                          <div>
                            <p>
                              {t("MyTickets.processedAt")}:{" "}
                              {formatDate(refund.processedAt)}
                            </p>
                          </div>
                        )}
                        {refund.completedAt && (
                          <div>
                            <p>
                              {t("MyTickets.completedAt")}:{" "}
                              {formatDate(refund.completedAt)}
                            </p>
                          </div>
                        )}
                      </div>
                      {refund.notes && (
                        <p className="text-xs text-gray-500 mt-2">
                          <span className="font-medium">
                            {t("MyTickets.notes")}:
                          </span>{" "}
                          {refund.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-3">
                {canDownload && (
                  <Button
                    aria-label="Download Ticket PDF"
                    onClick={handleDownloadTicket}
                    variant="outline"
                    className="w-full"
                    disabled={isLoading}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {t("MyTickets.downloadPdf")}
                  </Button>
                )}

                {canReview && (
                  <Button
                    aria-label="Write a Review"
                    onClick={handleWriteReview}
                    variant="outline"
                    className="w-full"
                  >
                    <Star className="w-4 h-4 mr-2" />
                    {t("MyTickets.writeReview")}
                  </Button>
                )}

                {canComplain && (
                  <Dialog
                    open={isComplaintModalOpen}
                    onOpenChange={setIsComplaintModalOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        aria-label="Submit a Complaint"
                        variant="outline"
                        className="w-full"
                      >
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        {t("MyTickets.submitComplaint")}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {t("MyTickets.submitComplaint")}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">
                            {t("MyTickets.title")}
                          </label>
                          <Input
                            placeholder={t(
                              "MyTickets.complaintTitlePlaceholder"
                            )}
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
                            placeholder={t(
                              "MyTickets.complaintDescPlaceholder"
                            )}
                            value={complaintDescription}
                            onChange={(e) =>
                              setComplaintDescription(e.target.value)
                            }
                            disabled={isSubmittingComplaint}
                          />
                        </div>
                        <Button
                          aria-label="Submit Complaint"
                          onClick={handleSubmitComplaint}
                          disabled={
                            isSubmittingComplaint ||
                            !complaintTitle.trim() ||
                            !complaintDescription.trim()
                          }
                        >
                          {isSubmittingComplaint
                            ? t("MyTickets.complaintSending")
                            : t("MyTickets.complaintSend")}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}

                {canCancel && (
                  <Button
                    aria-label="Cancel Booking"
                    onClick={() => setIsCancelConfirmOpen(true)}
                    disabled={isLoading}
                    variant="destructive"
                    className="w-full"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    {isLoading
                      ? t("MyTickets.cancelling")
                      : t("MyTickets.cancelTicket")}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </SheetContent>

      {/* Dialog xác nhận hủy vé */}
      <Dialog open={isCancelConfirmOpen} onOpenChange={setIsCancelConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("MyTickets.confirmCancelTitle")}</DialogTitle>
            <DialogDescription>
              {t("MyTickets.confirmCancelDescriptionPercent", {
                percent: refundPercentage,
              })}
              {refundPercentage === 0 && ` ${t("MyTickets.noRefundNote")}`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              aria-label="Cancel"
              variant="outline"
              onClick={() => setIsCancelConfirmOpen(false)}
              disabled={isLoading}
            >
              {t("MyTickets.cancel")}
            </Button>
            <Button
              aria-label="Confirm Cancel Booking"
              variant="destructive"
              onClick={handleCancelBooking}
              disabled={isLoading}
            >
              {isLoading
                ? t("MyTickets.processing")
                : t("MyTickets.confirmCancel")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sheet>
  );
}
