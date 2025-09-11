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
import { cancelBooking } from "@/lib/data/booking"; // Thêm import cancelBooking
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
        label: "Đã xác nhận",
        variant: "default" as const,
        icon: CheckCircle,
        color: "text-green-600",
      };
    case "pending":
      return {
        label: "Đang xử lý",
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
  const router = useRouter(); // Khởi tạo router

  const handleCancelBooking = async () => {
    if (!session?.user?.accessToken) {
      toast.error("Bạn cần đăng nhập để hủy vé.");
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
        localeMessage: "Không thể hủy vé. Vui lòng thử lại.",
      });

      if (success) {
        toast.success("Vé đã được hủy thành công!");
        setIsCancelConfirmOpen(false); // Đóng dialog sau khi hủy thành công
        onClose(); // Đóng sheet sau khi hủy

        // Gọi callback để refresh danh sách vé
        if (onBookingCancelled) {
          onBookingCancelled();
        }
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Có lỗi xảy ra khi hủy vé. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadTicket = () => {
    // Generate and download PDF ticket
    console.log("Downloading ticket...");
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
      toast.error("Bạn cần đăng nhập để gửi khiếu nại.");
      return;
    }

    if (!complaintTitle.trim() || !complaintDescription.trim()) {
      toast.error("Vui lòng nhập đầy đủ tiêu đề và mô tả khiếu nại.");
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
        toast.success("Khiếu nại đã được gửi thành công!");
        setComplaintTitle("");
        setComplaintDescription("");
        setIsComplaintModalOpen(false);
      } else {
        toast.error("Có lỗi xảy ra khi gửi khiếu nại. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error submitting complaint:", error);
      toast.error("Có lỗi xảy ra khi gửi khiếu nại. Vui lòng thử lại.");
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
                Chi tiết đặt vé
              </SheetTitle>
              <SheetDescription className="text-sm text-gray-600">
                Mã đặt vé:{" "}
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
              {statusInfo.label}
            </Badge>
          </div>
        </SheetHeader>

        <div className="space-y-6">
          {/* Trip Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bus className="w-5 h-5" />
                Thông tin chuyến đi
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
                      <span className="font-medium">Khởi hành</span>
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
                      <span className="font-medium">Đến nơi</span>
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

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Bus className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium">Loại xe:</span>
                    <span className="text-sm">{booking.bus.model}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Biển số:</span>
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
                Thông tin hành khách
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
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400" />
                <span>{booking.tickets.length} hành khách</span>
              </div>
            </CardContent>
          </Card>

          {/* Ticket Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="w-5 h-5" />
                Chi tiết vé
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
                      <span className="font-medium">Vé #{index + 1}</span>
                      <Badge variant="outline">{ticket.seat_number}</Badge>
                    </div>
                    <div className="text-sm space-y-1">
                      <p>
                        <span className="font-medium">Mã vé:</span>{" "}
                        {ticket.ticket_code}
                      </p>
                      <p>
                        <span className="font-medium">Hành khách:</span>{" "}
                        {index === 0
                          ? booking.passenger_name
                          : `Hành khách ${index + 1}`}
                      </p>
                      <p>
                        <span className="font-medium">Giá vé:</span>{" "}
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
                Thông tin thanh toán
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-green-800">Tổng tiền:</span>
                  <span className="text-xl font-bold text-green-600">
                    {formatCurrency(booking.payment_info.amount)}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="font-medium">Lịch sử thanh toán:</h5>
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">
                      {formatCurrency(booking.payment_info.amount)}
                    </span>
                    <Badge variant="default">Thành công</Badge>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Phương thức: {booking.payment_info.method}</p>
                    <p>
                      Thời gian: {formatDate(booking.payment_info.timestamp)} -{" "}
                      {formatTime(booking.payment_info.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-3">
                {canDownload && (
                  <Button
                    onClick={handleDownloadTicket}
                    variant="outline"
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Tải vé/hóa đơn PDF
                  </Button>
                )}

                {canReview && (
                  <Button
                    onClick={handleWriteReview}
                    variant="outline"
                    className="w-full"
                  >
                    <Star className="w-4 h-4 mr-2" />
                    Viết đánh giá
                  </Button>
                )}

                {canComplain && (
                  <Dialog
                    open={isComplaintModalOpen}
                    onOpenChange={setIsComplaintModalOpen}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Gửi khiếu nại
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Gửi khiếu nại</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Tiêu đề</label>
                          <Input
                            placeholder="Nhập tiêu đề khiếu nại (5-100 ký tự)"
                            value={complaintTitle}
                            onChange={(e) => setComplaintTitle(e.target.value)}
                            disabled={isSubmittingComplaint}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Mô tả</label>
                          <Textarea
                            placeholder="Nhập mô tả khiếu nại (10-1000 ký tự)"
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
                          {isSubmittingComplaint ? "Đang gửi..." : "Gửi"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}

                {canCancel && (
                  <Button
                    onClick={() => setIsCancelConfirmOpen(true)}
                    disabled={isLoading}
                    variant="destructive"
                    className="w-full"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    {isLoading ? "Đang hủy..." : "Hủy vé"}
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
            <DialogTitle>Xác nhận hủy vé</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn hủy vé này không? Hành động này không thể
              hoàn tác và bạn sẽ được hoàn {refundPercentage}% tiền vé.
              {refundPercentage === 0 &&
                " (Lưu ý: Không được hoàn tiền do hủy sát giờ khởi hành.)"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCancelConfirmOpen(false)}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelBooking}
              disabled={isLoading}
            >
              {isLoading ? "Đang xử lý..." : "Xác nhận hủy"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sheet>
  );
}
