"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bus, Star, Phone, MapPin } from "lucide-react";
import { TripDetailProps } from "../trip_overview_card";
import Image from "next/image";

interface OperatorInfoCardProps {
  tripDetail: TripDetailProps;
}

export function OperatorInfoCard({ tripDetail }: OperatorInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bus className="w-5 h-5" />
          <span>Nhà xe</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-4">
          <Image
            src={tripDetail.operator_logo}
            alt={tripDetail.operator_name}
            width={48}
            height={48}
            className="w-12 h-12 rounded-lg"
          />
          <div>
            <h3 className="text-lg font-semibold">
              {tripDetail.operator_name}
            </h3>
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600">
                {tripDetail.average_rating}/5 ({tripDetail.total_reviews} đánh
                giá)
              </span>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <Phone className="w-5 h-5 text-gray-400" />
            <span className="text-gray-600">Hotline: 1900-xxxx</span>
          </div>
          <div className="flex items-center space-x-3">
            <MapPin className="w-5 h-5 text-gray-400" />
            <span className="text-gray-600">Trụ sở: TP.HCM</span>
          </div>
        </div>
        <Button variant="outline" className="w-full mt-4">
          Xem tất cả chuyến của nhà xe này
        </Button>
      </CardContent>
    </Card>
  );
}
