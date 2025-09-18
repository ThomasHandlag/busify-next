"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Clock,
  Mail,
  Copy,
  Calendar,
  AlertCircle,
  ArrowRight,
  CreditCard,
  Banknote,
  MapPin,
  User,
  Phone,
} from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface PaymentDetails {
  paymentId: number;
  amount: number;
  transactionCode: string;
  paymentMethod: string;
  bookingDetails: {
    bookingId: number;
    bookingCode: string;
    departureName: string;
    arrivalName: string;
    departureTime: string;
    arrivalTime: string;
    status: string;
  };
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: string;
  paidAt: string | null;
}

export default function BookingResult() {
  const { id } = useParams();
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const t = useTranslations();

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:8080/api/payments/${id}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          throw new Error(t("BookingResult.fetchError"));
        }

        const result = await response.json();
        console.log("Payment details response:", result);
        setPaymentDetails(result.result);
      } catch (err) {
        console.error("Error fetching payment details:", err);
        setError(t("BookingResult.notFound"));
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPaymentDetails();
    }
  }, [id, t]);

  // Copy booking code to clipboard
  const copyBookingCode = async () => {
    if (!paymentDetails) return;
    try {
      await navigator.clipboard.writeText(
        paymentDetails.bookingDetails.bookingCode
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Format date time
  const formatDateTime = (dateString: string) => {
    return new Date(dateString)?.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format time only
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format date only
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Get status badge props
  const getStatusBadgeProps = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
      case "success":
      case "completed":
        return {
          className: "bg-green-500 text-white",
          text: t("Booking.confirmed"),
        };
      case "pending":
        return {
          className: "bg-yellow-500 text-white",
          text: t("Booking.pending"),
        };
      case "cancelled":
        return {
          className: "bg-red-500 text-white",
          text: t("Booking.canceled"),
        };
      default:
        return {
          className: "bg-gray-500 text-white",
          text: t("Booking.unknown"),
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center w-full">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex flex-col items-center space-y-4">
              <Clock className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-gray-600">{t("BookingResult.loading")}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !paymentDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center w-full">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6 text-center">
            <div className="flex flex-col items-center space-y-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
              <p className="text-red-700">
                {error || t("Common.bookingNotFound")}
              </p>
              <Button
                aria-label="Try Again"
                onClick={() => window.location.reload()}
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                {t("Error.tryAgain")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusBadgeProps = getStatusBadgeProps(paymentDetails.status);
  const isSuccess =
    paymentDetails.status.toLowerCase() === "success" ||
    paymentDetails.status.toLowerCase() === "completed" ||
    paymentDetails.status.toLowerCase() === "confirmed";

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-4 w-full">
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{t("BookingResult.title")}</span>
          </div>
        </div>
      </div>

      <div className="px-4 py-8 w-full">
        <div className="space-y-6">
          {/* Success/Status Message */}
          <Card
            className={
              isSuccess
                ? "border-green-200 bg-green-50"
                : "border-yellow-200 bg-yellow-50"
            }
          >
            <CardContent className="p-6 text-center">
              <div className="flex flex-col items-center space-y-4">
                <div
                  className={`w-16 h-16 ${
                    isSuccess ? "bg-green-500" : "bg-yellow-500"
                  } rounded-full flex items-center justify-center`}
                >
                  {isSuccess ? (
                    <CheckCircle className="w-8 h-8 text-white" />
                  ) : (
                    <Clock className="w-8 h-8 text-white" />
                  )}
                </div>
                <div>
                  <h1
                    className={`text-2xl font-bold ${
                      isSuccess ? "text-green-800" : "text-yellow-800"
                    } mb-2`}
                  >
                    {isSuccess
                      ? t("BookingResult.successTitle")
                      : t("BookingResult.processingTitle")}
                  </h1>
                  <p
                    className={isSuccess ? "text-green-700" : "text-yellow-700"}
                  >
                    {isSuccess ? (
                      <>
                        {t("BookingResult.successDesc", {
                          email: paymentDetails.customerEmail,
                          phone: paymentDetails.customerPhone,
                        })}
                      </>
                    ) : (
                      t("BookingResult.processingDesc")
                    )}
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
                  <CardTitle className="text-lg">
                    {t("BookingResult.bookingCodeTitle")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-2xl font-bold text-green-600">
                        {paymentDetails.bookingDetails.bookingCode}
                      </p>
                      <p className="text-sm text-gray-500">
                        {t("BookingResult.bookingCodeHint")}
                      </p>
                    </div>
                    <Button
                      aria-label="Copy Booking Code"
                      variant="outline"
                      size="sm"
                      onClick={copyBookingCode}
                      className="flex items-center gap-2 bg-transparent"
                    >
                      <Copy className="w-4 h-4" />
                      {copied
                        ? t("BookingResult.copied")
                        : t("BookingResult.copy")}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Trip Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    {t("BookingResult.tripInfo")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="text-center">
                      <p className="text-sm text-gray-500">
                        {t("Booking.confirmation.startPoint")}
                      </p>
                      <p className="font-semibold text-blue-800">
                        {paymentDetails.bookingDetails.departureName}
                      </p>
                      <p className="text-sm text-blue-600">
                        {formatTime(
                          paymentDetails.bookingDetails.departureTime
                        )}
                      </p>
                    </div>
                    <div className="flex-1 flex justify-center">
                      <ArrowRight className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">
                        {t("Booking.confirmation.endPoint")}
                      </p>
                      <p className="font-semibold text-blue-800">
                        {paymentDetails.bookingDetails.arrivalName}
                      </p>
                      <p className="text-sm text-blue-600">
                        {formatTime(paymentDetails.bookingDetails.arrivalTime)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        {t("BookingResult.departureDate")}
                      </p>
                      <p className="font-semibold">
                        {formatDate(
                          paymentDetails.bookingDetails.departureTime
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        {t("BookingResult.arrivalDate")}
                      </p>
                      <p className="font-semibold">
                        {formatDate(paymentDetails.bookingDetails.arrivalTime)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    {t("BookingResult.statusTitle")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span>{t("BookingResult.status")}</span>
                    <Badge className={statusBadgeProps.className}>
                      {statusBadgeProps.text}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    {t("BookingResult.paymentInfoTitle")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">
                        {t("BookingResult.paymentMethod")}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Banknote className="w-4 h-4 text-blue-600" />
                        <span className="font-semibold">
                          {paymentDetails.paymentMethod}
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        {t("BookingResult.amountPaid")}
                      </p>
                      <p className="font-semibold text-green-600 text-lg">
                        {formatCurrency(paymentDetails.amount)}
                      </p>
                    </div>

                    {paymentDetails.paidAt && (
                      <div>
                        <p className="text-sm text-gray-500">
                          {t("BookingResult.paidAt")}
                        </p>
                        <p className="font-semibold">
                          {formatDateTime(paymentDetails.paidAt)}
                        </p>
                      </div>
                    )}

                    <div>
                      <p className="text-sm text-gray-500">
                        {t("BookingResult.transactionCode")}
                      </p>
                      <p className="font-semibold text-blue-600">
                        {paymentDetails.transactionCode}
                      </p>
                    </div>
                  </div>

                  {isSuccess && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">
                          {t("Payment.paymentSuccess")}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Customer Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-purple-600" />
                    {t("BookingResult.customerInfoTitle")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">
                      {t("Profile.fullName")}
                    </p>
                    <p className="font-semibold">
                      {paymentDetails.customerName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      {t("Booking.phoneNumber")}
                    </p>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <p className="font-semibold">
                        {paymentDetails.customerPhone}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      {t("Profile.email")}
                    </p>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <p className="font-semibold">
                        {paymentDetails.customerEmail}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link aria-label="View Booking History" href="/user/my-tickets">
              <Button
                aria-label="View Booking History"
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                {t("BookingResult.viewHistory")}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            {!isSuccess && (
              <Button
                aria-label="Try Again"
                onClick={() => window.location.reload()}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Clock className="w-4 h-4" />
                {t("BookingResult.checkAgain")}
              </Button>
            )}
          </div>

          {/* Support Info */}
          <Card className="bg-gray-50">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-gray-600">
                {t("BookingResult.supportText", {
                  phone: "1900 1234",
                  email: "support@busify.vn",
                })}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
