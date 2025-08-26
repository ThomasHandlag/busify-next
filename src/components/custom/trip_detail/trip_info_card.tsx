"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import {
  Bus,
  Clock,
  Navigation,
  Users,
  MapPin,
  ArrowRight,
  Wifi,
  Coffee,
  Car,
  Snowflake,
  Shield,
  Tv,
  BatteryCharging,
} from "lucide-react";
import { Separator } from "../../ui/separator";
import { Badge } from "../../ui/badge";
import { TripDetail } from "@/lib/data/trip";
import Image from "next/image";
import dynamic from "next/dynamic";

const RouteMap = dynamic(() => import("../google_map"), {
  ssr: false,
  loading: () => (
    <div className="h-80 w-full bg-gray-200 animate-pulse rounded-lg" />
  ),
});

const TripInfoCard = ({ tripDetail }: { tripDetail: TripDetail }) => {
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
    <Card className="px-4 py-6">
      <CardHeader className="lg:px-6 md:px-6 px-0 sm:px-4">
        <CardTitle className="flex items-center space-x-2">
          <Bus className="w-5 h-5" />
          <span>Thông tin chuyến đi</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="lg:px-6 md:px-6 px-0 sm:px-4 space-y-6">
        {/* Route & Schedule */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Lộ trình & Thời gian
          </h3>

          {/* Route visualization */}
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
              <p className="text-xs text-gray-500">Điểm đi</p>
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
                {tripDetail.route.estimated_duration}
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
              <p className="text-xs text-gray-500">Điểm đến</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Trip Details */}
        <div>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Bus className="w-4 h-4" />
            Chi tiết chuyến xe
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Bus className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium">{tripDetail.bus.name}</p>
                <p className="text-sm text-gray-500">Loại xe</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Users className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium">
                  {tripDetail.available_seats}/{tripDetail.bus.total_seats} ghế
                </p>
                <p className="text-sm text-gray-500">Ghế trống/Tổng ghế</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Navigation className="w-5 h-5 text-purple-600" />
              <div>
                <p className="font-medium">Theo lộ trình</p>
                <p className="text-sm text-gray-500">Khoảng cách</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Clock className="w-5 h-5 text-orange-600" />
              <div>
                <p className="font-medium">
                  {tripDetail.route.estimated_duration}
                </p>
                <p className="text-sm text-gray-500">Thời gian di chuyển</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pickup Points */}
        <div>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Điểm đón & Điểm trả
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="border border-green-200 rounded-lg p-4 bg-green-50">
              <h4 className="font-medium text-green-800 mb-2 flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Điểm đón
              </h4>
              <div className="space-y-2">
                {tripDetail.route_stops?.slice(0, 3).map((point, index) => (
                  <div key={`pickup-${index}`} className="text-sm">
                    <p className="font-medium">{point.name}</p>
                    <p className="text-gray-600">{point.address}</p>
                  </div>
                )) || (
                  <div className="text-sm">
                    <p className="font-medium">
                      {tripDetail.route.start_location.name}
                    </p>
                    <p className="text-gray-600">
                      {tripDetail.route.start_location.address}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="border border-red-200 rounded-lg p-4 bg-red-50">
              <h4 className="font-medium text-red-800 mb-2 flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                Điểm trả
              </h4>
              <div className="space-y-2">
                {tripDetail.route_stops?.slice(-3).map((point, index) => (
                  <div key={`dropoff-${index}`} className="text-sm">
                    <p className="font-medium">{point.name}</p>
                    <p className="text-gray-600">{point.address}</p>
                  </div>
                )) || (
                  <div className="text-sm">
                    <p className="font-medium">
                      {tripDetail.route.end_location.name}
                    </p>
                    <p className="text-gray-600">
                      {tripDetail.route.end_location.address}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bus Images and Amenities */}
        <div className="space-y-4">
          <Separator />

          {/* Route Map */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Bản đồ hành trình
            </h4>
            <RouteMap
              startLocation={tripDetail.route.start_location}
              endLocation={tripDetail.route.end_location}
              routeStops={tripDetail.route_stops || []}
              className="h-80 w-full rounded-lg"
            />
          </div>

          {/* Bus Images */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Hình ảnh xe</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                <Image
                  src="/bus-photo.jpg"
                  alt="Xe khách"
                  width={200}
                  height={120}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <Bus className="w-8 h-8 text-gray-400" />
              </div>
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <Car className="w-8 h-8 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Tiện ích</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="flex items-center gap-2 text-sm">
                <Wifi className="w-4 h-4 text-blue-500" />
                <span>WiFi miễn phí</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Snowflake className="w-4 h-4 text-blue-500" />
                <span>Điều hòa</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <BatteryCharging className="w-4 h-4 text-green-500" />
                <span>Sạc điện thoại</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4 text-green-500" />
                <span>Bảo hiểm</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Coffee className="w-4 h-4 text-orange-500" />
                <span>Nước uống</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Tv className="w-4 h-4 text-purple-500" />
                <span>TV giải trí</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TripInfoCard;
