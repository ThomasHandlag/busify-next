"use client";

import React, { useState } from "react";
import { Clock, ArrowRight } from "lucide-react";
import { TripDetail } from "@/lib/data/trip";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";

const RouteMap = dynamic(() => import("../google_map"), {
  ssr: false,
  loading: () => (
    <div className="h-80 w-full bg-muted animate-pulse rounded-lg" />
  ),
});

const TripInfoCard = ({ tripDetail }: { tripDetail: TripDetail }) => {
  const t = useTranslations();

  const busImages = tripDetail.bus.images?.map((img) => img.url) || [];
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  const formatDuration = (minutes: number) => {
    if (isNaN(minutes) || minutes < 0) {
      return "N/A";
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    let result = "";
    if (hours > 0) {
      result += `${hours} ${t("Common.hours")} `;
    }
    if (mins > 0) {
      result += `${mins} ${t("Common.minutes")}`;
    }
    return result.trim() || `0 ${t("Common.minutes")}`;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="lg:px-6 md:px-6 px-0 sm:px-4 space-y-6 w-full">
      {/* Route & Schedule */}
      <div className="bg-background grid grid-cols-1 items-center">
        <div className="text-center">
          <h1 className="text-xl font-bold">
            {tripDetail.route.start_location.city} {t("TripDetail.to")}{" "}
            {tripDetail.route.end_location.city}
          </h1>
        </div>
        <div className="grid grid-cols-3 gap-4 items-center">
          <div className="text-center">
            <div className="bg-background text-foreground p-3 rounded-lg mb-2">
              <p className="text-lg font-bold">
                {formatTime(tripDetail.departure_time)}
              </p>
              <p className="text-xs opacity-90">
                {formatDate(tripDetail.departure_time)}
              </p>
            </div>
            <p className="text-sm font-medium">
              {tripDetail.route.start_location.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {t("Booking.confirmation.startPoint")}
            </p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <div className="flex-1 h-px bg-border mx-2 relative w-px">
                <ArrowRight className="w-4 h-4 text-muted-foreground absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-muted" />
              </div>
              <div className="w-2 h-2 bg-destructive rounded-full"></div>
            </div>
            <div className="flex items-center justify-center text-sm text-muted-foreground">
              <Clock className="w-4 h-4 mr-1" />
              {formatDuration(Number(tripDetail.route.estimated_duration))}
            </div>
          </div>

          <div className="text-center">
            <div className="bg-background text-destructive-foreground p-3 rounded-lg mb-2">
              <p className="text-lg font-bold">
                {formatTime(tripDetail.arrival_time)}
              </p>
              <p className="text-xs opacity-90">
                {formatDate(tripDetail.arrival_time)}
              </p>
            </div>
            <p className="text-sm font-medium">
              {tripDetail.route.end_location.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {t("Booking.confirmation.endPoint")}
            </p>
          </div>
          <div className="text-start grid grid-cols-2 col-span-3 mt-2 items-center">
            <span className="">{tripDetail.route.start_location.address}</span>
            <span className="">{tripDetail.route.end_location.address}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-foreground mb-3">
            {t("TripDetail.busImages")}
          </h4>
          {busImages.length > 0 ? (
            <>
              {/* Main gallery */}
              <Swiper
                modules={[Thumbs]}
                spaceBetween={16}
                loop
                thumbs={{ swiper: thumbsSwiper }}
                className="rounded-lg overflow-hidden mb-4"
              >
                {busImages.map((url, index) => (
                  <SwiperSlide key={index}>
                    <Image
                      src={url}
                      alt={tripDetail.bus.name ?? "Bus Image"}
                      width={800}
                      height={450}
                      className="w-full h-50 md:h-100 object-cover rounded-lg"
                      loading={index === 0 ? "eager" : "lazy"}
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..."
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Thumbnails */}
              <Swiper
                modules={[Thumbs]}
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                freeMode
                watchSlidesProgress
                breakpoints={{
                  320: { slidesPerView: 2 }, // mobile
                  640: { slidesPerView: 3 }, // tablet
                  1024: { slidesPerView: 4 }, // desktop
                }}
                className="cursor-pointer"
              >
                {busImages.map((url, index) => (
                  <SwiperSlide key={index} className="!w-24">
                    <Image
                      src={url}
                      alt={`Thumbnail ${index + 1}`}
                      width={100}
                      height={60}
                      className="w-full h-16 object-cover rounded-md border border-border"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              {t("TripDetail.noBusImages")}
            </p>
          )}
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-3">
            {t("TripDetail.journeyMap")}
          </h4>
          <RouteMap
            startLocation={tripDetail.route.start_location}
            endLocation={tripDetail.route.end_location}
            routeStops={tripDetail.route_stops || []}
            className="h-80 w-full rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default TripInfoCard;
