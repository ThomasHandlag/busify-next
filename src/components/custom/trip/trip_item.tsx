"use client";

import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Clock, MapPin, Users, Star, ArrowRight, Bus } from "lucide-react";
import { format } from "date-fns";
import { TripItemProps } from "@/lib/data/trip";
import Link from "next/link";
import LocaleText from "../locale_text";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  getCurrentPromotionCampaigns,
  type PromotionCampaign,
  calculateDiscountedPrice,
  getBestPromotionCampaign,
} from "@/lib/data/promotion";

const TripItem = ({ trip }: { trip: TripItemProps }) => {
  const [campaigns, setCampaigns] = useState<PromotionCampaign[]>([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const apiCampaigns = await getCurrentPromotionCampaigns();
        setCampaigns(apiCampaigns);
      } catch (error) {
        console.error("Failed to fetch promotion campaigns:", error);
        setCampaigns([]);
      } 
    };

    fetchCampaigns();
  }, []);

  const bestCampaign = getBestPromotionCampaign(campaigns, trip.price_per_seat);
  const { discountedPrice, discountAmount } = bestCampaign
    ? calculateDiscountedPrice(trip.price_per_seat, bestCampaign)
    : { discountedPrice: trip.price_per_seat, discountAmount: 0 };

  const getAvailabilityColor = (seats: number) => {
    if (seats <= 5)
      return "bg-destructive/10 text-destructive border-destructive/20";
    if (seats <= 10)
      return "bg-secondary/10 text-secondary dark:text-secondary-foreground border-secondary/20";
    return "bg-primary/10 text-primary border-primary/20";
  };

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
    <Card>
      <CardContent className="relative p-2">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              {trip.operator_avatar ? (
                <Image
                  src={trip.operator_avatar}
                  alt={trip.operator_name}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-xl object-cover border-2 border-border/50 shadow-sm"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-border/50 flex items-center justify-center">
                  <Bus className="w-6 h-6 text-primary" />
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full"></div>
            </div>

            <div>
              <h3 className="font-semibold text-foreground text-lg leading-tight">
                {trip.operator_name}
              </h3>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {departureDate}
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{trip.average_rating}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-bold text-foreground mb-2">
              {new Intl.NumberFormat("vi-VN").format(trip.price_per_seat)}đ
            </div>
            <Badge
              variant="outline"
              className={`${getAvailabilityColor(
                trip.available_seats
              )} border text-xs font-medium px-3 py-1 rounded-full`}
            >
              {getAvailabilityText(trip.available_seats)}
            </Badge>

            {/* Price Display Logic */}
            <div className="text-right">
              {discountAmount > 0 ? (
                <>
                  <p className="text-sm text-red-500 line-through">
                    {new Intl.NumberFormat("vi-VN").format(trip.price_per_seat)}
                    đ
                  </p>
                  <p className="text-lg font-bold text-primary">
                    {new Intl.NumberFormat("vi-VN").format(discountedPrice)}đ
                  </p>
                </>
              ) : (
                <p className="text-lg font-bold text-primary">
                  {new Intl.NumberFormat("vi-VN").format(trip.price_per_seat)}đ
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-muted/30 rounded-xl p-4 mb-4">
          <div className="grid grid-cols-5 items-center gap-4">
            <div className="col-span-2">
              <div className="text-xl font-bold text-foreground mb-1">
                {departure_time}
              </div>
              <div className="text-sm text-muted-foreground font-medium truncate">
                {trip.route.start_location}
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="flex items-center w-full relative">
                <div className="w-3 h-3 bg-primary rounded-full shadow-sm"></div>
                <div className="flex-1 h-0.5 bg-gradient-to-r from-primary/50 to-primary/50 mx-3 relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-full"></div>
                  <ArrowRight className="w-4 h-4 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background rounded-full p-0.5 shadow-sm" />
                </div>
                <div className="w-3 h-3 bg-primary rounded-full shadow-sm"></div>
              </div>
            </div>

            <div className="col-span-2 text-right">
              <div className="text-xl font-bold text-foreground mb-1">
                {arrival_time}
              </div>
              <div className="text-sm text-muted-foreground font-medium truncate">
                {trip.route.end_location}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span className="font-medium">{duration}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span className="font-medium">{trip.available_seats} seats</span>
            </div>
          </div>

          <Button
            disabled={trip.available_seats < 1}
            size="sm"
            className={`font-semibold px-6 py-2 h-9 rounded-lg transition-all duration-200 ${
              trip.available_seats < 1
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-md hover:shadow-lg transform hover:scale-105"
            }`}
          >
            <Link
              href={`/trips/${trip.trip_id}`}
              className="flex items-center gap-2"
            >
              <LocaleText string="bookTrip" name="Trips.tripItem" />
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TripItem;
