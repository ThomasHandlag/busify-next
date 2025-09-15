"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";

export default function PaymentCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const queryParams = Object.fromEntries(searchParams.entries());
        const responseCode = queryParams["vnp_ResponseCode"];
        const transactionCode = queryParams["vnp_TxnRef"];

        console.log("VNPAY callback params:", queryParams);
        console.log("ResponseCode:", responseCode);
        console.log("TransactionCode:", transactionCode);

        if (!transactionCode) {
          console.error("Missing vnp_TxnRef in VNPAY callback");
          router.push("/error?message=Invalid payment callback");
          return;
        }

        const response = await fetch(
          `http://localhost:8080/api/payments/vnpay/callback?${new URLSearchParams(
            queryParams
          )}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        console.log("Fetch response status:", response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Payment callback verification failed:", errorText);
          router.push("/error?message=Payment verification failed");
          return;
        }

        const result = await response.json();
        console.log("Backend callback response:", result);

        if (
          result?.code === 200 &&
          responseCode === "00" &&
          result?.result?.status === "completed"
        ) {
          const paymentId = result.result?.paymentId;
          if (paymentId) {
            console.log("Redirecting to:", `/bookingresult/${paymentId}`);
            router.push(`/bookingresult/${paymentId}`);
            return;
          } else {
            console.error("Missing paymentId in response");
            router.push("/error?message=Missing payment information");
            return;
          }
        } else {
          console.error("Payment failed or invalid response:", {
            code: result?.code,
            responseCode,
            status: result?.result?.status,
          });
          router.push("/error?message=Payment failed");
        }
      } catch (error) {
        console.error("Error handling VNPAY callback:", error);
        router.push("/error?message=Error processing payment callback");
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gray-50">
      <div className="flex flex-col items-center space-y-4 p-8 bg-white rounded-lg shadow-lg">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
        <p className="text-lg font-medium text-gray-700 text-center">
          {t("Payment.processingCallback")}
        </p>
        <p className="text-sm text-gray-500 text-center">
          {t("Payment.doNotClose")}
        </p>
      </div>
    </div>
  );
}
