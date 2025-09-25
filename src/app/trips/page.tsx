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
import React from "react";

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
    <div className="flex lg:flex-row flex-col md:flex-col items-start">
      <div className="hidden lg:block w-80 shrink-0">
        <Card className="sticky top-25 h-[90vh] scrollBar overflow-auto rounded-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              <LocaleText string="search" name="Trips" />
              &
              <LocaleText string="filter" name="Trips" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SearchFilterSidebar />
          </CardContent>
        </Card>
      </div>

      {/* Mobile Filter Button */}
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
      <div className="h-[90vh] w-full bg-background overflow-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Desktop Sidebar */}
            {/* Main Content */}
            <div className="flex-1">
              {/* Results Summary and Sort Controls */}
              <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    {getTripTitle()}
                  </h1>
                  <p className="text-muted-foreground mt-2">
                    <LocaleText string="found" name="Trips" /> {trips.length}{" "}
                    <LocaleText string="foundRex" name="Trips" />
                  </p>
                </div>
                <TripSortControls />
              </div>

              {/* Trip Results */}
              <div className="mb-20">
                {isLoading ? (
                  // Loading skeleton
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div
                        key={i}
                        className="bg-white rounded-lg border p-6 animate-pulse h-32"
                      >
                        <div className="space-y-3">
                          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                          <div className="h-3 bg-gray-200 rounded w-full"></div>
                          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 overflow-auto">
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
              </div>
            </div>
          </div>
        </div>
        {trips.length > 0 && <Pager />}
      </div>
    </div>
  );
};

export default AppPage;
