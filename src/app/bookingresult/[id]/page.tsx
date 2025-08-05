"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  Clock,
  Mail,
  MessageSquare,
  Copy,
  Calendar,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface BookingResult {
  bookingCode: string;
  status: "pending" | "confirmed";
  trip: {
    route: string;
    operator: string;
    departureTime: string;
    date: string;
  };
  passenger: {
    name: string;
    phone: string;
    email: string;
  };
  payment: {
    totalAmount: number;
    paidAmount: number;
    remainingAmount: number;
    paymentDeadline?: string;
  };
  seats: string[];
  notifications: {
    email: boolean;
    sms: boolean;
  };
}

interface PageProps {
  params: {
    id: string; // booking_id from URL
  };
}

export default function BookingSuccess({ params }: PageProps) {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const bookingId = params.id; // Lấy booking_id từ URL

  // Dữ liệu mock tĩnh để test giao diện
  const mockBookingResult =
    bookingId === "1"
      ? {
          bookingCode: "BUS240801001",
          status: "pending",
          trip: {
            route: "TP.HCM → Đà Lạt",
            operator: "Liên Hưng",
            departureTime: "08:00",
            date: "01/08/2025",
          },
          passenger: {
            name: "Nguyễn Văn A",
            phone: "0123456789",
            email: "nguyenvana@email.com",
          },
          payment: {
            totalAmount: 500000,
            paidAmount: 100000,
            remainingAmount: 400000,
            paymentDeadline: "01/08/2025 06:00",
          },
          seats: ["A01", "A02"],
          notifications: {
            email: true,
            sms: true,
          },
        }
      : bookingId === "2"
      ? {
          bookingCode: "BUS240802002",
          status: "confirmed",
          trip: {
            route: "Đà Nẵng → Huế",
            operator: "Mai Linh",
            departureTime: "14:00",
            date: "02/08/2025",
          },
          passenger: {
            name: "Trần Thị B",
            phone: "0987654321",
            email: "tranthib@email.com",
          },
          payment: {
            totalAmount: 300000,
            paidAmount: 300000,
            remainingAmount: 0,
          },
          seats: ["B01"],
          notifications: {
            email: false,
            sms: true,
          },
        }
      : {
          bookingCode: "BUS240803003",
          status: "pending",
          trip: {
            route: "Hà Nội → Vinh",
            operator: "Hoàng Long",
            departureTime: "09:00",
            date: "03/08/2025",
          },
          passenger: {
            name: "Lê Văn C",
            phone: "0912345678",
            email: "levanc@email.com",
          },
          payment: {
            totalAmount: 400000,
            paidAmount: 0,
            remainingAmount: 400000,
            paymentDeadline: "02/08/2025 23:00",
          },
          seats: ["C01", "C02"],
          notifications: {
            email: true,
            sms: false,
          },
        };

  // Copy booking code to clipboard
  const copyBookingCode = async () => {
    try {
      await navigator.clipboard.writeText(mockBookingResult.bookingCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  // Calculate time remaining for payment
  useEffect(() => {
    if (
      mockBookingResult.status === "pending" &&
      mockBookingResult.payment.paymentDeadline
    ) {
      const updateTimeLeft = () => {
        const deadline = new Date(mockBookingResult.payment.paymentDeadline!);
        const now = new Date("2025-08-02T16:36:00+07:00"); // Current time for testing
        const diff = deadline.getTime() - now.getTime();

        if (diff > 0) {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          setTimeLeft(`${hours}h ${minutes}m`);
        } else {
          setTimeLeft("Đã hết hạn");
        }
      };

      updateTimeLeft();
      const interval = setInterval(updateTimeLeft, 60000); // Update every minute

      return () => clearInterval(interval);
    }
  }, [mockBookingResult.status, mockBookingResult.payment.paymentDeadline]);

  return (
    <div className="min-h-screen bg-gray-50 w-full ">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-4 w-full">
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Kết quả đặt vé</span>
          </div>
        </div>
      </div>

      <div className="px-4 py-8 w-full">
        <div className="space-y-6">
          {/* Success Message */}
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-6 text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-green-800 mb-2">
                    Đặt vé thành công!
                  </h1>
                  <p className="text-green-700">
                    Cảm ơn bạn đã sử dụng dịch vụ của BUSIFY. Thông tin đặt vé
                    đã được xác nhận.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Details */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Booking Code */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Mã đặt vé</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-2xl font-bold text-green-600">
                        {mockBookingResult.bookingCode}
                      </p>
                      <p className="text-sm text-gray-500">
                        Vui lòng lưu mã này để tra cứu
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyBookingCode}
                      className="flex items-center gap-2 bg-transparent"
                    >
                      <Copy className="w-4 h-4" />
                      {copied ? "Đã sao chép" : "Sao chép"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Trip Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin chuyến đi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Tuyến đường</p>
                    <p className="font-semibold">
                      {mockBookingResult.trip.route}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Nhà xe</p>
                    <p className="font-semibold">
                      {mockBookingResult.trip.operator}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Khởi hành</p>
                      <p className="font-semibold">
                        {mockBookingResult.trip.departureTime}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Ngày đi</p>
                      <p className="font-semibold">
                        {mockBookingResult.trip.date}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ghế đã đặt</p>
                    <div className="flex gap-2 mt-1">
                      {mockBookingResult.seats.map((seat) => (
                        <Badge
                          key={seat}
                          variant="secondary"
                          className="bg-green-100 text-green-700"
                        >
                          {seat}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Status & Payment */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-green-600" />
                    Trạng thái vé
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Trạng thái</span>
                    <Badge
                      variant={
                        mockBookingResult.status === "confirmed"
                          ? "default"
                          : "secondary"
                      }
                      className={
                        mockBookingResult.status === "confirmed"
                          ? "bg-green-500 text-white"
                          : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {mockBookingResult.status === "confirmed"
                        ? "Đã xác nhận"
                        : "Chờ thanh toán"}
                    </Badge>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Tổng tiền</span>
                      <span className="font-semibold">
                        {mockBookingResult.payment.totalAmount.toLocaleString(
                          "vi-VN"
                        )}
                        đ
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Đã thanh toán</span>
                      <span className="text-green-600 font-semibold">
                        {mockBookingResult.payment.paidAmount.toLocaleString(
                          "vi-VN"
                        )}
                        đ
                      </span>
                    </div>
                    {mockBookingResult.payment.remainingAmount > 0 && (
                      <div className="flex justify-between">
                        <span>Còn lại</span>
                        <span className="text-orange-600 font-semibold">
                          {mockBookingResult.payment.remainingAmount.toLocaleString(
                            "vi-VN"
                          )}
                          đ
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Payment Reminder */}
                  {mockBookingResult.status === "pending" && (
                    <Card className="bg-orange-50 border-orange-200">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5" />
                          <div className="space-y-2 text-sm">
                            <p className="font-medium text-orange-800">
                              Nhắc nhở thanh toán:
                            </p>
                            <ul className="space-y-1 text-orange-700">
                              <li>
                                • Hạn thanh toán:{" "}
                                {mockBookingResult.payment.paymentDeadline}
                              </li>
                              <li>
                                • Thời gian còn lại:{" "}
                                <span className="font-semibold">
                                  {timeLeft}
                                </span>
                              </li>
                              <li>
                                • Vé sẽ bị hủy nếu không thanh toán đúng hạn
                              </li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>

              {/* Passenger Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin hành khách</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Họ và tên</p>
                    <p className="font-semibold">
                      {mockBookingResult.passenger.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Số điện thoại</p>
                    <p className="font-semibold">
                      {mockBookingResult.passenger.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-semibold">
                      {mockBookingResult.passenger.email}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>Thông báo xác nhận</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-800">Email xác nhận</p>
                    <p className="text-sm text-blue-600">
                      {mockBookingResult.notifications.email
                        ? `Đã gửi đến ${mockBookingResult.passenger.email}`
                        : "Chưa gửi"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">SMS xác nhận</p>
                    <p className="text-sm text-green-600">
                      {mockBookingResult.notifications.sms
                        ? `Đã gửi đến ${mockBookingResult.passenger.phone}`
                        : "Chưa gửi"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/booking/history">
              <Button className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Xem lịch sử đặt vé
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>

            {mockBookingResult.status === "pending" && (
              <Link href={`/booking/payment/${mockBookingResult.bookingCode}`}>
                <Button
                  variant="outline"
                  className="border-orange-500 text-orange-600 hover:bg-orange-50 bg-transparent"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Thanh toán ngay
                </Button>
              </Link>
            )}
          </div>

          {/* Support Info */}
          <Card className="bg-gray-50">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-gray-600">
                Cần hỗ trợ? Liên hệ hotline:{" "}
                <span className="font-semibold text-green-600">1900 1234</span>{" "}
                hoặc email:{" "}
                <span className="font-semibold text-green-600">
                  support@busify.vn
                </span>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
