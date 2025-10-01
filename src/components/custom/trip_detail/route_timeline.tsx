import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TripDetail } from "@/lib/data/trip";
import { MapPin } from "lucide-react";
import { useTranslations } from "next-intl";

const RouteTimeline = (tripDetail: TripDetail) => {
  const t = useTranslations();
  const routeStops = tripDetail.route_stops || [];
  const allStops = [
    tripDetail.route.start_location,
    ...routeStops,
    tripDetail.route.end_location,
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          {t("TripDetail.routeAndTime")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            {t("TripDetail.routeAndTime")}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {allStops.map((stop, index) => {
            const isStart = index === 0;
            const isEnd = index === allStops.length - 1;
            const isLast = index === allStops.length - 1;

            return (
              <div key={index} className="flex items-start gap-4">
                {/* Timeline indicator */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                      isStart
                        ? "bg-primary border-primary"
                        : isEnd
                        ? "bg-destructive border-destructive"
                        : "bg-accent border-accent"
                    }`}
                  />
                  {!isLast && <div className="w-px h-12 bg-border mt-2" />}
                </div>

                {/* Stop details */}
                <div className="flex-1 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">
                      {stop.address || stop.name}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground ml-6">
                    {stop.city}
                  </p>
                  {isStart && (
                    <div className="ml-6 mt-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                        {t("TripDetail.departureTime")}
                      </span>
                    </div>
                  )}
                  {isEnd && (
                    <div className="ml-6 mt-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-destructive/10 text-destructive">
                        {t("TripDetail.arrivalTime")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RouteTimeline;
