"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function PaymentCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

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
    <div className="w-full flex items-center justify-center min-h-screen">
      <p>Đang xử lý kết quả thanh toán...</p>
    </div>
  );
}
