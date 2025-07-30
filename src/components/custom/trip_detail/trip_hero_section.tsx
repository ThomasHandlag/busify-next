"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Heart } from "lucide-react";

interface TripHeroSectionProps {
  tripDetail: any;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function TripHeroSection({
  tripDetail,
  isFavorite,
  onToggleFavorite,
}: TripHeroSectionProps) {
  return (
    <div className="bg-white shadow-sm sticky top-0 z-20">
      <div className="container mx-auto lg:px-4 lg:py-4 md:px-4 md:py-4 px-9 py-0 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-900">
              {tripDetail.route.start_location.city}
            </h2>
            <p className="text-sm text-gray-500">
              {tripDetail.route.start_location.address}
            </p>
          </div>
          <ArrowRight className="w-6 h-6 text-green-600" />
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-900">
              {tripDetail.route.end_location.city}
            </h2>
            <p className="text-sm text-gray-500">
              {tripDetail.route.end_location.address}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleFavorite}
            className={isFavorite ? "text-red-500" : "text-gray-400"}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
          </Button>
        </div>
      </div>
    </div>
  );
}
