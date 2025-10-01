"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";

interface BookingCountdownProps {
  tripId: string;
  initialMinutes?: number;
}

const BookingCountdown = ({
  tripId,
  initialMinutes = 15,
}: BookingCountdownProps) => {
  const router = useRouter();
  const t = useTranslations("BookingCountdown");

  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true);
      router.push(`/trips/${tripId}`);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1;

        if (newTime <= 0) {
          setIsExpired(true);
          clearInterval(timer);
          router.push(`/trips/${tripId}`);
          return 0;
        }

        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, tripId, router]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const formatTime = (time: number) => time.toString().padStart(2, "0");

  return (
    <Card className="flex items-center justify-center p-4 bg-background border border-accent/20 rounded-lg">
      {isExpired ? (
        <p className="text-destructive font-medium">
          {t("expired", {
            defaultValue: "Booking session expired. Redirecting...",
          })}
        </p>
      ) : (
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">
            {t("sessionExpires", {
              defaultValue: "Booking session expires in:",
            })}
          </p>
          <div className="text-2xl font-mono font-bold text-accent">
            {formatTime(minutes)}:{formatTime(seconds)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {t("autoRedirect", {
              defaultValue:
                "You will be automatically redirected when time expires",
            })}
          </p>
        </div>
      )}
    </Card>
  );
};

export default BookingCountdown;
