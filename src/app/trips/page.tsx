"use client";

import TripItem from "@/components/custom/trip/trip_item";
import { useTripFilter } from "@/lib/contexts/TripFilterContext";
import { Filter, Search } from "lucide-react";
import SearchFilterSidebar from "@/components/custom/search_filter_sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import LocaleText from "@/components/custom/locale_text";
import Pager from "@/components/custom/trip/pager";
import TripSortControls from "@/components/custom/trip/trip_sort_controls";
import { getAllLocationsClient } from "@/lib/data/location";
import React, { Fragment } from "react";
import Loading from "../loading";

const AppPage = () => {
  const { trips, isLoading, query } = useTripFilter();
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [locations, setLocations] = React.useState<{ [key: number]: string }>(
    {}
  );

  React.useEffect(() => {
    const fetchLocations = async () => {
      try {
        const locs = await getAllLocationsClient({
          callback: (message: string) => console.error(message),
        });
        const locationMap: { [key: number]: string } = {};
        locs.forEach((loc) => {
          locationMap[loc.locationId] = loc.locationName;
        });
        setLocations(locationMap);
      } catch (error) {
        console.error("Failed to fetch locations:", error);
      }
    };
    fetchLocations();
  }, []);

  const getLocationName = (id?: number) => {
    return id ? locations[id] || `Location ${id}` : "";
  };

  const getTripTitle = () => {
    if (query?.startLocation && query?.endLocation) {
      const startName = getLocationName(query.startLocation);
      const endName = getLocationName(query.endLocation);
      return (
        <span>
          {startName} → {endName}
        </span>
      );
    }
    return <LocaleText string="available" name="Trips" />;
  };

  return (
    <div className="h-full bg-primary w-full lg:px-4 px-2 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 max-w-6xl mx-auto">
        <div className="hidden lg:block col-span-2">
          <Card className="sticky top-8 h-[90vh] scrollBar overflow-scroll rounded-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                <LocaleText string="search" name="Trips" /> &{" "}
                <LocaleText string="filter" name="Trips" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SearchFilterSidebar />
            </CardContent>
          </Card>
        </div>

        <div className="lg:hidden mb-4">
          <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
            <SheetTrigger asChild>
              <Button aria-label="Open Filter" variant="ghost">
                <Filter className="w-5 h-5 mr-2" />
                <LocaleText string="filter" name="Trips" />
              </Button>
            </SheetTrigger>
            <SheetContent
              className="overflow-y-auto p-4 h-full rounded"
              side="bottom"
            >
              <SheetHeader>
                <SheetTitle className="flex items-center">
                  <Search className="w-5 h-5 mr-2" />
                  <LocaleText string="search" name="Trips" />
                  &
                  <LocaleText string="filter" name="Trips" />
                </SheetTitle>
                <SheetDescription>
                  <LocaleText string="searchTitle" name="Trips" />
                </SheetDescription>
              </SheetHeader>
              <SearchFilterSidebar callback={() => setFilterOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>
        <div className="col-span-4 flex flex-col gap-4">
          <div className="sticky top-8 z-10">
            <TripSortControls />
          </div>
          <Card className="h-[90vh] overflow-auto scrollBar p-4 lg:p-2">
            <CardHeader>
              <CardTitle>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <h1 className="text-xl font-bold text-foreground">
                      {getTripTitle()}
                    </h1>
                    <p className="text-muted-foreground mt-2">
                      {isLoading ? (
                        <LocaleText string="searching" name="Filter" />
                      ) : (
                        <Fragment>
                          <LocaleText string="found" name="Trips" />{" "}
                          {trips.length}{" "}
                          <LocaleText string="foundRex" name="Trips" />
                        </Fragment>
                      )}
                    </p>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Loading />
              ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 overflow-auto p-2">
                  {trips.length > 0 ? (
                    trips.map((trip) => (
                      <TripItem key={trip.trip_id} trip={trip} />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <div className="text-gray-500 text-lg">
                        <LocaleText string="noTrips" name="Trips" />
                      </div>
                      <p className="text-gray-400 text-sm mt-2">
                        <LocaleText string="searchRecommend" name="Trips" />
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
            {trips.length > 0 && <Pager />}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AppPage;
