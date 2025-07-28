import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Clock, MapPin, Users, Star, ArrowRight } from "lucide-react";
import { parse, add, format } from "date-fns";
import { TripItemProps } from "@/app/passenger/page";

const TripItem = ({ trip }: { trip: TripItemProps }) => {
  const getAvailabilityColor = (seats: number) => {
    if (seats <= 5) return "bg-red-100 text-red-700";
    if (seats <= 10) return "bg-yellow-100 text-yellow-700";
    return "bg-green-100 text-green-700";
  };

  const getAvailabilityText = (seats: number) => {
    if (seats <= 5) return "Few seats left";
    if (seats <= 10) return "Limited seats";
    return "Available";
  };

  const departure_time = format(new Date(trip.departure_time), "HH:mm");
  const departure_date = format(new Date(trip.departure_time), "dd/MM/yyyy");
  const arrival_time = format(new Date(trip.arrival_time), "HH:mm");
  const arrival_date = format(new Date(trip.arrival_time), "dd/MM/yyyy");
  // Assuming trip.duration is in minutes by departure time - arrival time
  const trip_duration_minutes = Math.abs(
    (new Date(trip.arrival_time).getTime() -
      new Date(trip.departure_time).getTime()) /
      60000
  );
  const hours = Math.floor(trip_duration_minutes / 60);
  const minutes = trip_duration_minutes % 60;
  const trip_duration =
    minutes === 0 ? `${hours} giờ` : `${hours} giờ ${minutes} phút`;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-green-500">
      <CardHeader className="pb-1">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg font-bold text-gray-900 mb-1">
              {trip.operator_name}
            </CardTitle>
          </div>
          <Badge
            className={`${getAvailabilityColor(trip.available_seats)} border-0`}
          >
            {getAvailabilityText(trip.available_seats)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        {/* Route Information */}
        <div className="grid grid-cols-3 gap-2 items-center">
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">{departure_time}</p>
            <p className="text-xs text-gray-500 truncate">
              {trip.route.start_location}
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1 h-px bg-gray-300 mx-2 relative">
                <ArrowRight className="w-3 h-3 text-gray-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white" />
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex items-center justify-center text-xs text-gray-500">
              <Clock className="w-3 h-3 mr-1" />
              {trip_duration}
            </div>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">{arrival_time}</p>
            <p className="text-xs text-gray-500 truncate">
              {trip.route.end_location}
            </p>
          </div>
        </div>

        {/* Trip Details */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1 text-green-600" />
              <span className="text-xs">
                {departure_date} - {arrival_date}
              </span>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1 text-green-600" />
              <span className="text-xs">{trip.available_seats} seats</span>
            </div>
          </div>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
            <span className="text-xs font-medium">{trip.average_rating}</span>
          </div>
        </div>

        <Separator />

        {/* Price and Action */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-2xl font-bold text-green-600">
              {trip.price_per_seat.toLocaleString("vi-VN")} VNĐ
            </p>
            <p className="text-xs text-gray-500">per person</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-green-600 text-green-600 hover:bg-green-50"
            >
              View Details
            </Button>
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Book Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TripItem;
