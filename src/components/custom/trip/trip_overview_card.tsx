"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
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
import { Badge } from "../../ui/badge";
import { TripDetail } from "@/lib/data/trip";
import LocaleText from "../locale_text";

const RouteMap = dynamic(() => import("../google_map"), {
  ssr: false,
  loading: () => <div className="h-80 w-full bg-gray-200 animate-pulse" />,
});

export interface BusProps {
  name: string;
  license_plate: string;
  amenities: string[];
}

const TripOverviewCard = ({ tripDetail }: { tripDetail: TripDetail }) => {
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
          <span>
            <LocaleText string="tripInfo" name="TripDetail" />
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="lg:px-6 md:px-6 px-0 sm:px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-4 mb-6 ">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">
                {formatTime(tripDetail.departure_time)}
              </p>
              <p className="text-xs text-gray-500">
                {formatDate(tripDetail.departure_time)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Navigation className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-sm font-medium">
                {tripDetail.route.estimated_duration}
              </p>
              <p className="text-xs text-gray-500">
                <LocaleText string="duration" name="TripDetail" />
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Bus className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-sm font-medium">{tripDetail.bus.name}</p>
              <p className="text-xs text-gray-500">
                <LocaleText string="busType" name="TripDetail" />
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-sm font-medium">
                {tripDetail.available_seats}/{tripDetail.bus.total_seats}
              </p>
              <p className="text-xs text-gray-500">
                <LocaleText string="empty" name="TripDetail" />
              </p>
            </div>
          </div>
        </div>
        <Separator />
        {/* Route map */}
        <div className="mt-6">
          <h3 className="font-semibold mb-4">
            <LocaleText string="journeyMap" name="TripDetail" />
          </h3>
          <RouteMap
            startLocation={tripDetail.route.start_location}
            endLocation={tripDetail.route.end_location}
            routeStops={tripDetail.route_stops || []}
            className="h-80 w-full rounded-lg"
          />
        </div>
        <Separator />
        {/* Pickup/Dropoff */}
        <div className="mt-6">
          <h3 className="font-semibold mb-4">
            <LocaleText string="pickAndDrop" name="TripDetail" />
          </h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">
                  <LocaleText string="pickUp" name="TripDetail" />
                </p>
                <p className="text-gray-600">
                  {tripDetail.route.start_location.address}
                </p>
                <p className="text-sm text-gray-500">
                  {tripDetail.route.start_location.city}
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-3 h-3 bg-red-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">
                  <LocaleText string="dropOff" name="TripDetail" />
                </p>
                <p className="text-gray-600">
                  {tripDetail.route.end_location.address}
                </p>
                <p className="text-sm text-gray-500">
                  {tripDetail.route.end_location.city}
                </p>
              </div>
            </div>
          </div>
        </div>
        <Separator />
        {/* Amenities */}
        <div className="mt-6">
          <h3 className="font-semibold mb-4">
            <LocaleText string="amenities" name="TripDetail" />
          </h3>
          <div className="flex flex-wrap gap-2">
            {tripDetail.bus.amenities.map((amenity, index) => (
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
