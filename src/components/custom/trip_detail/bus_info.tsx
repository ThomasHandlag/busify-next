import { TripDetail } from "@/lib/data/trip";
import {
  Bus,
  NavigationIcon,
  Users,
  Wifi,
  Snowflake,
  Tv,
  BatteryCharging,
  Toilet,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const BusInfo = (tripDetail: TripDetail) => {
  const t = useTranslations();

  const amenityMap: Record<
    string,
    {
      icon: React.ComponentType<{ className?: string }>;
      label: string;
      color: string;
    }
  > = {
    wifi: { icon: Wifi, label: t("Amenities.wifi"), color: "text-primary" },
    tv: { icon: Tv, label: t("Amenities.tv"), color: "text-accent-foreground" },
    toilet: {
      icon: Toilet,
      label: t("Amenities.toilet"),
      color: "text-primary",
    },
    charging: {
      icon: BatteryCharging,
      label: t("Amenities.charging"),
      color: "text-primary",
    },
    air_conditioner: {
      icon: Snowflake,
      label: t("Amenities.air_conditioner"),
      color: "text-primary",
    },
  };

  const renderAmenities = () => {
    const availableAmenities = tripDetail.bus.amenities
      .filter((amenity) => amenityMap[amenity])
      .map((amenity) => {
        const config = amenityMap[amenity];
        const IconComponent = config.icon;
        return (
          <div key={amenity} className="flex items-center gap-2 text-sm">
            <IconComponent className={`w-4 h-4 ${config.color}`} />
            <span>{config.label}</span>
          </div>
        );
      });

    if (availableAmenities.length === 0) {
      return (
        <div className="text-sm text-muted-foreground">
          {t("Amenities.noAmenities")}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {availableAmenities}
      </div>
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">{t("TripDetail.busInfo")}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bus className="w-5 h-5" />
            {t("TripDetail.busInfo")}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center space-x-3 p-4 rounded-lg">
              <Bus className="w-6 h-6 text-primary" />
              <div>
                <p className="font-medium">{tripDetail.bus.name}</p>
                <p className="text-sm text-muted-foreground">
                  {t("TripDetail.busType")}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4  rounded-lg">
              <Users className="w-6 h-6 text-primary" />
              <div>
                <p className="font-medium">
                  {tripDetail.available_seats}/{tripDetail.bus.total_seats}{" "}
                  {t("Trips.tripItem.seats")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("TripDetail.seatsAvailableTotal")}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4  rounded-lg">
              <NavigationIcon className="w-6 h-6 text-primary" />
              <div>
                <p className="font-medium">{tripDetail.bus.license_plate}</p>
                <p className="text-sm text-muted-foreground">
                  {t("TripDetail.busLicense")}
                </p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">
                {t("TripDetail.amenities")}
              </h4>
              {renderAmenities()}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BusInfo;
