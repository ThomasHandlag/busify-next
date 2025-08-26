"use client";

import TripItem from "@/components/custom/trip/trip_item";
import { useTripFilter } from "@/lib/contexts/TripFilterContext";
import { Filter } from "lucide-react";
import SearchFilter from "@/components/custom/search_filter";
import SearchFilterSidebar from "@/components/custom/search_filter_sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AppPage = () => {
  const { trips, isLoading, handleApplyFilters } = useTripFilter();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-80 shrink-0">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Search & Filter
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SearchFilterSidebar
                  onApplyFilters={handleApplyFilters}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>
          </div>

          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-4">
            <SearchFilter
              onApplyFilters={handleApplyFilters}
              isLoading={isLoading}
            />
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
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
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
