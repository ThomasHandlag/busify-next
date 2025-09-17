"use client";

import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Clock, MapPin, Users, Star, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { TripItemProps } from "@/lib/data/trip";
import Link from "next/link";
import LocaleText from "../locale_text";
import Image from "next/image";

const TripItem = ({ trip }: { trip: TripItemProps }) => {
  const getAvailabilityColor = (seats: number) => {
    if (seats <= 5) return "bg-red-100 text-red-700";
    if (seats <= 10) return "bg-yellow-100 text-yellow-700";
    return "bg-green-100 text-green-700";
  };

  console.log("Trip Data:", trip);

  const getAvailabilityText = (seats: number) => {
    if (seats <= 5)
      return <LocaleText string="fewSeats" name="Trips.tripItem" />;
    if (seats <= 10)
      return <LocaleText string="limitedSeats" name="Trips.tripItem" />;
    return <LocaleText string="availableSeats" name="Trips.tripItem" />;
  };

  // Parse ISO 8601 format dates properly and convert to VN time (UTC+7)
  const departureDateObj = new Date(trip.departure_time);
  const arrivalDateObj = new Date(trip.arrival_time);

  // Format the times
  const departure_time = departureDateObj.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const arrival_time = arrivalDateObj.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  // Calculate duration correctly
  const trip_duration_minutes = Math.abs(
    (arrivalDateObj.getTime() - departureDateObj.getTime()) / 60000
  );
  const hours = Math.floor(trip_duration_minutes / 60);
  const minutes = Math.round(trip_duration_minutes % 60);
  const duration = minutes === 0 ? `${hours}h` : `${hours}h${minutes}m`;

  // Format the dates
  const departureDate = format(departureDateObj, "dd/MM");

  return (
    <Card className="hover:shadow-md transition-all duration-200 border-l-4 border-l-green-500 cursor-pointer">
      <CardContent className="p-4">
        {/* Header Row - Compact */}
        <div className="flex items-start mb-3 gap-3">
          {/* Avatar */}
          {trip.operator_avatar && (
            <Image
              width={10}
              height={10}
              src={trip.operator_avatar}
              alt={trip.operator_name}
              className="w-10 h-10 rounded-full object-cover flex-shrink-0 border border-gray-200"
            />
          )}

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-gray-900 mb-1 truncate">
              {trip.operator_name}
            </h3>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {departureDate}
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                {trip.average_rating}
              </span>
            </div>
          </div>

          {/* Price + Seats */}
          <div className="flex flex-col items-end gap-1">
            <Badge
              className={`${getAvailabilityColor(
                trip.available_seats
              )} text-xs px-2 py-1`}
            >
              {getAvailabilityText(trip.available_seats)}
            </Badge>

            {/* Price Display Logic */}
            <div className="text-right">
              <p className="text-lg font-bold text-green-600">
                {new Intl.NumberFormat("vi-VN").format(trip.price_per_seat)}đ
              </p>
            </div>
          </div>
        </div>

        {/* Route Row - Ultra Compact */}
        <div className="grid grid-cols-5 items-center gap-2 mb-3">
          <div className="col-span-2 text-left">
            <p className="text-sm font-semibold text-gray-900">
              {departure_time}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {trip.route.start_location}
            </p>
          </div>

          <div className="flex items-center justify-center">
            <div className="flex items-center w-full">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <div className="flex-1 h-px bg-gray-300 mx-2 relative">
                <ArrowRight className="w-3 h-3 text-gray-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white" />
              </div>
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            </div>
          </div>

          <div className="col-span-2 text-right">
            <p className="text-sm font-semibold text-gray-900">
              {arrival_time}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {trip.route.end_location}
            </p>
          </div>
        </div>

        {/* Bottom Row - Info & Actions */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>
                <LocaleText string="duration" name="Trips.tripItem" />
              </span>
              : {duration}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>
                <LocaleText string="seats" name="Trips.tripItem" />
              </span>
              : {trip.available_seats}
            </span>
          </div>

          <div className="flex gap-2">
            <Link
              aria-label="View trip details"
              href={`/trips/${trip.trip_id}`}
              className="hidden sm:block"
            ></Link>

            <Link aria-label="Book trip" href={`/trips/${trip.trip_id}`}>
              <Button
                aria-label="Book Trip"
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white text-xs h-7 px-3"
              >
                <LocaleText string="bookTrip" name="Trips.tripItem" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TripItem;
