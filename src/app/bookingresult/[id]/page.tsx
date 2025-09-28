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
import { BASE_URL } from "@/lib/constants/constants";

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
        const response = await fetch(`${BASE_URL}api/payments/${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

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
          className: "bg-primary text-primary-foreground",
          text: t("Booking.confirmed"),
        };
      case "pending":
        return {
          className: "bg-secondary text-secondary-foreground",
          text: t("Booking.pending"),
        };
      case "cancelled":
        return {
          className: "bg-destructive text-destructive-foreground",
          text: t("Booking.canceled"),
        };
      default:
        return {
          className: "bg-muted text-muted-foreground",
          text: t("Booking.unknown"),
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center w-full">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex flex-col items-center space-y-4">
              <Clock className="w-8 h-8 text-primary animate-spin" />
              <p className="text-muted-foreground">
                {t("BookingResult.loading")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !paymentDetails) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center w-full">
        <Card className="border-destructive/20 bg-destructive/10">
          <CardContent className="p-6 text-center">
            <div className="flex flex-col items-center space-y-4">
              <AlertCircle className="w-8 h-8 text-destructive" />
              <p className="text-destructive">
                {error || t("Common.bookingNotFound")}
              </p>
              <Button
                aria-label="Try Again"
                onClick={() => window.location.reload()}
                variant="outline"
                className="border-destructive/30 text-destructive hover:bg-destructive/10"
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
    <div className="min-h-screen bg-primary w-full lg:px-4 px-2">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>
              <div className="text-center">
                <div className="flex flex-col lg:flex-row items-center justify-between">
                  <div className="flex items-start flex-col">
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      {isSuccess
                        ? t("BookingResult.successTitle")
                        : t("BookingResult.processingTitle")}
                    </h2>
                    <p className="text-muted-foreground">
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
                  <div
                    className={`w-16 h-16 ${
                      isSuccess ? "bg-primary" : "bg-secondary"
                    } rounded-full flex items-center justify-center`}
                  >
                    {isSuccess ? (
                      <CheckCircle className="w-8 h-8 text-primary-foreground" />
                    ) : (
                      <Clock className="w-8 h-8 text-secondary-foreground" />
                    )}
                  </div>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2 p-4 bg-accent/10 rounded-lg border border-accent/20">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    {t("BookingResult.bookingCodeTitle")}
                  </h3>
                  <p className="text-2xl font-bold text-primary">
                    {paymentDetails.bookingDetails.bookingCode}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("BookingResult.bookingCodeHint")}
                  </p>
                </div>
                <Button
                  aria-label="Copy Booking Code"
                  variant="outline"
                  size="sm"
                  onClick={copyBookingCode}
                  className="flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  {copied ? t("BookingResult.copied") : t("BookingResult.copy")}
                </Button>
              </div>
            </div>

            {/* Trip Information Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                {t("BookingResult.tripInfo")}
              </h3>

              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg mb-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    {t("Booking.confirmation.startPoint")}
                  </p>
                  <p className="font-semibold text-foreground">
                    {paymentDetails.bookingDetails.departureName}
                  </p>
                  <p className="text-sm text-primary">
                    {formatTime(paymentDetails.bookingDetails.departureTime)}
                  </p>
                </div>
                <div className="flex-1 flex justify-center">
                  <ArrowRight className="w-6 h-6 text-primary" />
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    {t("Booking.confirmation.endPoint")}
                  </p>
                  <p className="font-semibold text-foreground">
                    {paymentDetails.bookingDetails.arrivalName}
                  </p>
                  <p className="text-sm text-primary">
                    {formatTime(paymentDetails.bookingDetails.arrivalTime)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("BookingResult.departureDate")}
                  </p>
                  <p className="font-semibold text-foreground">
                    {formatDate(paymentDetails.bookingDetails.departureTime)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("BookingResult.arrivalDate")}
                  </p>
                  <p className="font-semibold text-foreground">
                    {formatDate(paymentDetails.bookingDetails.arrivalTime)}
                  </p>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {/* Status */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  {t("BookingResult.statusTitle")}
                </h4>
                <Badge className={statusBadgeProps.className}>
                  {statusBadgeProps.text}
                </Badge>
              </div>

              {/* Payment Method */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-primary" />
                  {t("BookingResult.paymentMethod")}
                </h4>
                <div className="flex items-center gap-2">
                  <Banknote className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-foreground">
                    {paymentDetails.paymentMethod}
                  </span>
                </div>
              </div>

              {/* Amount */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">
                  {t("BookingResult.amountPaid")}
                </h4>
                <p className="font-semibold text-primary text-lg">
                  {formatCurrency(paymentDetails.amount)}
                </p>
              </div>
            </div>

            {/* Additional Details */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Customer Information */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  {t("BookingResult.customerInfoTitle")}
                </h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t("Profile.fullName")}
                    </p>
                    <p className="font-semibold text-foreground">
                      {paymentDetails.customerName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t("Booking.phoneNumber")}
                    </p>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <p className="font-semibold text-foreground">
                        {paymentDetails.customerPhone}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t("Profile.email")}
                    </p>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <p className="font-semibold text-foreground">
                        {paymentDetails.customerEmail}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transaction Details */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3">
                  {t("BookingResult.transactionCode")}
                </h4>
                <p className="font-semibold text-primary mb-4">
                  {paymentDetails.transactionCode}
                </p>

                {paymentDetails.paidAt && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t("BookingResult.paidAt")}
                    </p>
                    <p className="font-semibold text-foreground">
                      {formatDateTime(paymentDetails.paidAt)}
                    </p>
                  </div>
                )}

                {isSuccess && (
                  <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-primary">
                        {t("Payment.paymentSuccess")}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Link aria-label="View Booking History" href="/user/my-tickets">
                <Button
                  aria-label="View Booking History"
                  className="flex items-center gap-2"
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
            <div className="p-4 bg-muted/30 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">
                {t("BookingResult.supportText", {
                  phone: "1900 1234",
                  email: "support@busify.vn",
                })}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
