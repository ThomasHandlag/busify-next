"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Bus,
  Car,
  Clock,
  Droplets,
  Navigation,
  Users,
  Wifi,
  Zap,
} from "lucide-react";
import { Separator } from "@radix-ui/react-separator";
import dynamic from "next/dynamic";
import { Badge } from "../ui/badge";
import { TripDetail } from "@/lib/types/widget_proptype";

const RouteMap = dynamic(() => import("./google_map"), {
  ssr: false,
  loading: () => <div className="h-80 w-full bg-gray-200 animate-pulse" />,
});

export interface Location {
  address: string;
  latitude: number;
  longitude: number;
  city: string;
}

export interface RouteStop extends Location {
  time_offset_from_start?: number;
}

export interface BusProps {
  name: string;
  license_plate: string;
  amenities: string[];
}

const TripOverviewCard = ({
  mockTripDetail,
}: {
  mockTripDetail: TripDetail;
}) => {
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
          <span>Thông tin chuyến</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="lg:px-6 md:px-6 px-0 sm:px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-4 mb-6 ">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-sm font-medium">
                {formatTime(mockTripDetail.departure_time)}
              </p>
              <p className="text-xs text-gray-500">
                {formatDate(mockTripDetail.departure_time)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Navigation className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-sm font-medium">
                {mockTripDetail.estimated_duration}
              </p>
              <p className="text-xs text-gray-500">Thời gian di chuyển</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Bus className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-sm font-medium">{mockTripDetail.bus.name}</p>
              <p className="text-xs text-gray-500">Loại xe</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-sm font-medium">
                {mockTripDetail.available_seats}/{mockTripDetail.total_seats}
              </p>
              <p className="text-xs text-gray-500">Ghế trống</p>
            </div>
          </div>
        </div>
        <Separator />
        {/* Route map */}
        <div className="mt-6">
          <h3 className="font-semibold mb-4">Bản đồ hành trình</h3>
          <RouteMap
            startLocation={mockTripDetail.route.start_location}
            endLocation={mockTripDetail.route.end_location}
            routeStops={mockTripDetail.route_stop || []}
            className="h-80 w-full rounded-lg"
          />
        </div>
        <Separator />
        {/* Pickup/Dropoff */}
        <div className="mt-6">
          <h3 className="font-semibold mb-4">Điểm đón/trả</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Điểm đón</p>
                <p className="text-gray-600">
                  {mockTripDetail.route.start_location.address}
                </p>
                <p className="text-sm text-gray-500">
                  {mockTripDetail.route.start_location.city}
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-3 h-3 bg-red-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Điểm trả</p>
                <p className="text-gray-600">
                  {mockTripDetail.route.end_location.address}
                </p>
                <p className="text-sm text-gray-500">
                  {mockTripDetail.route.end_location.city}
                </p>
              </div>
            </div>
          </div>
        </div>
        <Separator />
        {/* Amenities */}
        <div className="mt-6">
          <h3 className="font-semibold mb-4">Tiện ích</h3>
          <div className="flex flex-wrap gap-2">
            {mockTripDetail.bus.amenities.map((amenity, index) => (
              <Badge key={index} variant="secondary">
                {amenity === "Wi-fi" && <Wifi className="w-3 h-3 mr-1" />}
                {amenity === "Nước uống" && (
                  <Droplets className="w-3 h-3 mr-1" />
                )}
                {amenity === "Cổng sạc" && <Zap className="w-3 h-3 mr-1" />}
                {amenity === "Điều hòa" && <Car className="w-3 h-3 mr-1" />}
                {amenity}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TripOverviewCard;
