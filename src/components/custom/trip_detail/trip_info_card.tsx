"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import {
  Bus,
  Clock,
  Navigation as NavigationIcon,
  Users,
  MapPin,
  ArrowRight,
  Wifi,
  Snowflake,
  Tv,
  BatteryCharging,
  Toilet,
} from "lucide-react";
import { Separator } from "../../ui/separator";
import { TripDetail } from "@/lib/data/trip";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation as SwiperNavigation,
  Pagination,
  Thumbs,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";

const RouteMap = dynamic(() => import("../google_map"), {
  ssr: false,
  loading: () => (
    <div className="h-80 w-full bg-gray-200 animate-pulse rounded-lg" />
  ),
});

const TripInfoCard = ({ tripDetail }: { tripDetail: TripDetail }) => {
  const t = useTranslations();

  const busImages = tripDetail.bus.images?.map((img) => img.url) || [];
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

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

  const amenityMap: Record<
    string,
    {
      icon: React.ComponentType<{ className?: string }>;
      label: string;
      color: string;
    }
  > = {
    wifi: { icon: Wifi, label: t("Amenities.wifi"), color: "text-blue-500" },
    tv: { icon: Tv, label: t("Amenities.tv"), color: "text-purple-500" },
    toilet: {
      icon: Toilet,
      label: t("Amenities.toilet"),
      color: "text-green-500",
    },
    charging: {
      icon: BatteryCharging,
      label: t("Amenities.charging"),
      color: "text-green-500",
    },
    air_conditioner: {
      icon: Snowflake,
      label: t("Amenities.air_conditioner"),
      color: "text-blue-500",
    },
  };

  const renderAmenities = () => {
    const availableAmenities = tripDetail.bus.amenities
      .filter((amenity) => amenityMap[amenity])
      .map((amenity) => {
        const config = amenityMap[amenity];
        const IconComponent = config.icon;
        return (
          <div key={amenity} className="flex items-center gap-2 text-sm">
            <IconComponent className={`w-4 h-4 ${config.color}`} />
            <span>{config.label}</span>
          </div>
        );
      });

    if (availableAmenities.length === 0) {
      return (
        <div className="text-sm text-gray-500">
          {t("Amenities.noAmenities")}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {availableAmenities}
      </div>
    );
  };

  const renderRouteTimeline = () => {
    const routeStops = tripDetail.route_stops || [];
    const allStops = [
      tripDetail.route.start_location,
      ...routeStops,
      tripDetail.route.end_location,
    ];

    return (
      <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
        <div className="flex items-center min-w-max px-4 py-2">
          {allStops.map((stop, index) => {
            const isStart = index === 0;
            const isEnd = index === allStops.length - 1;
            const isLast = index === allStops.length - 1;

            return (
              <React.Fragment key={index}>
                {/* Stop point */}
                <div className="flex flex-col items-center text-center flex-shrink-0 relative gap-y-2">
                  <div
                    className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 transition-all duration-200 flex-shrink-0
                    ${
                      isStart
                        ? "bg-green-500 border-green-500 shadow-lg shadow-green-200"
                        : isEnd
                        ? "bg-red-500 border-red-500 shadow-lg shadow-red-200"
                        : "bg-yellow-500 border-yellow-500 shadow-lg shadow-yellow-200"
                    }`}
                  />
                  <div className="inline-block whitespace-nowrap">
                    <p className="text-xs sm:text-sm font-medium text-gray-800">
                      {stop.address || stop.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{stop.city}</p>
                  </div>
                </div>

                {/* Connection line */}
                {!isLast && (
                  <div className="flex items-center mx-3 sm:mx-4 min-w-[60px] sm:min-w-[80px]">
                    <div className="h-px bg-gray-300 flex-1" />
                    <ArrowRight className="w-4 h-4 text-gray-400 mx-2 flex-shrink-0" />
                    <div className="h-px bg-gray-300 flex-1" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Card className="px-4 py-6">
      <CardHeader className="lg:px-6 md:px-6 px-0 sm:px-4">
        <CardTitle className="flex items-center space-x-2">
          <Bus className="w-5 h-5" />
          <span>{t("TripDetail.tripInfo")}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="lg:px-6 md:px-6 px-0 sm:px-4 space-y-6">
        {/* Route & Schedule */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {t("TripDetail.routeAndTime")}
          </h3>

          <div className="grid grid-cols-3 gap-4 items-center mb-4">
            <div className="text-center">
              <div className="bg-green-500 text-white p-3 rounded-lg mb-2">
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
              <p className="text-xs text-gray-500">
                {t("Booking.confirmation.startPoint")}
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1 h-px bg-gray-300 mx-2 relative">
                  <ArrowRight className="w-4 h-4 text-gray-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-50" />
                </div>
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              </div>
              <div className="flex items-center justify-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-1" />
                {formatDuration(Number(tripDetail.route.estimated_duration))}
              </div>
            </div>

            <div className="text-center">
              <div className="bg-red-500 text-white p-3 rounded-lg mb-2">
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
              <p className="text-xs text-gray-500">
                {t("Booking.confirmation.endPoint")}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Trip Details */}
        <div>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Bus className="w-4 h-4" />
            {t("TripDetail.tripDetails")}
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Bus className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium">{tripDetail.bus.name}</p>
                <p className="text-sm text-gray-500">
                  {t("TripDetail.busType")}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Users className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium">
                  {tripDetail.available_seats}/{tripDetail.bus.total_seats}{" "}
                  {t("Trips.tripItem.seats")}
                </p>
                <p className="text-sm text-gray-500">
                  {t("TripDetail.seatsAvailableTotal")}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <NavigationIcon className="w-5 h-5 text-purple-600" />
              <div>
                <p className="font-medium">{t("Booking.confirmation.route")}</p>
                <p className="text-sm text-gray-500">
                  {t("TripDetail.distance")}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Clock className="w-5 h-5 text-orange-600" />
              <div>
                <p className="font-medium">
                  {formatDuration(Number(tripDetail.route.estimated_duration))}
                </p>
                <p className="text-sm text-gray-500">
                  {t("TripDetail.duration")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bus Images and Amenities */}
        <div className="space-y-4">
          <Separator />
          {/* Bus Images */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">
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
                        className="w-full h-16 object-cover rounded-md border border-gray-200"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </>
            ) : (
              <p className="text-sm text-gray-500">
                {t("TripDetail.noBusImages")}
              </p>
            )}
          </div>

          <Separator />

          {/* Route Map */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">
              {t("TripDetail.journeyMap")}
            </h4>
            <RouteMap
              startLocation={tripDetail.route.start_location}
              endLocation={tripDetail.route.end_location}
              routeStops={tripDetail.route_stops || []}
              className="h-80 w-full rounded-lg"
            />
          </div>

          <Separator />

          {/* Amenities */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">
              {t("TripDetail.amenities")}
            </h4>
            {renderAmenities()}
          </div>

          <Separator />
        </div>

        <div>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {t("TripDetail.tripTimeline")}
          </h3>

          <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
            {renderRouteTimeline()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TripInfoCard;
