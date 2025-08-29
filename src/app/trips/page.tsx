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

const AppPage = () => {
  const { trips, isLoading } = useTripFilter();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-80 shrink-0">
            <Card className="sticky top-20 h-[80vh] scrollBar overflow-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Search & Filter
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SearchFilterSidebar
                />
              </CardContent>
            </Card>
          </div>

          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost">
                  <Filter className="w-5 h-5 mr-2" />
                  Filter
                </Button>
              </SheetTrigger>
              <SheetContent
                className="overflow-y-auto p-4 h-full rounded"
                side="bottom"
              >
                <SheetHeader>
                  <SheetTitle className="flex items-center">
                    <Search className="w-5 h-5 mr-2" />
                    Search & Filter
                  </SheetTitle>
                  <SheetDescription>
                    Find the perfect bus trip by filtering routes, operators,
                    and preferences.
                  </SheetDescription>
                </SheetHeader>
                <SearchFilterSidebar
                />
              </SheetContent>
            </Sheet>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Summary */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                Available Trips
              </h1>
              <p className="text-gray-600 mt-2">
                Found {trips.length} trips matching your criteria
              </p>
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
                        Không tìm thấy chuyến đi phù hợp
                      </div>
                      <p className="text-gray-400 text-sm mt-2">
                        Thử thay đổi tiêu chí tìm kiếm để xem thêm kết quả
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppPage;
