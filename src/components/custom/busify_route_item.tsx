import {BusifyRoute} from "@/lib/data/route_api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

const BusifyRouteItem = ({ item }: { item: BusifyRoute }) => {

  return (
    <Card className="hover:shadow-lg transition-shadow flex flex-col justify-between">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg text-green-700">
              {item.routeName}
            </CardTitle>
            <CardDescription className="flex items-center mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              {item.durationHours} journey
            </CardDescription>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            Popular
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Starting from</p>
            <p className="text-2xl font-bold text-green-600">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(item.startingPrice)}
            </p>
          </div>
          <Button size="sm" className="bg-green-600 hover:bg-green-700">
            View Routes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusifyRouteItem;
