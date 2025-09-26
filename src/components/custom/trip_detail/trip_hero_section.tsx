"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Heart } from "lucide-react";
import { useState } from "react";

import { TripDetail } from "@/lib/data/trip";

interface TripHeroSectionProps {
  tripDetail: TripDetail;
  isFavorite: boolean;
}

export function TripHeroSection({
  tripDetail,
  isFavorite,
}: TripHeroSectionProps) {
  const [is_favorite, setIsFavorite] = useState(isFavorite);

  const onToggleFavorite = () => {
    setIsFavorite(!is_favorite);
  };

  return (
    <div className="bg-accent shadow-sm sticky top-0 z-20">
      <div className="container mx-auto lg:px-4 lg:py-4 md:px-4 md:py-4 px-9 py-0 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-foreground">
              {tripDetail.route.start_location.city}
            </h2>
            <p className="text-sm text-muted-foreground">
              {tripDetail.route.start_location.address}
            </p>
          </div>
          <ArrowRight className="w-6 h-6 text-primary" />
          <div className="text-center">
            <h2 className="text-lg font-semibold text-foreground">
              {tripDetail.route.end_location.city}
            </h2>
            <p className="text-sm text-muted-foreground">
              {tripDetail.route.end_location.address}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            aria-label="Toggle Favorite"
            variant="ghost"
            size="sm"
            onClick={onToggleFavorite}
            className={is_favorite ? "text-destructive" : "text-muted-foreground"}
          >
            <Heart className={`w-5 h-5 ${is_favorite ? "fill-current" : ""}`} />
          </Button>
        </div>
      </div>
    </div>
  );
}
