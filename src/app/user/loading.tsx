import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserPageLoading() {
  return (
    <div className="container mx-auto p-6 max-w-4xl mb-10">
      {/* Page Header Skeleton */}
      <div className="mb-8">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Profile Card Skeleton */}
      <Card className="mb-6">
        <CardHeader className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0 pb-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-7 w-40" />
              <Skeleton className="h-5 w-48" />
            </div>
          </div>
          <Skeleton className="h-10 w-32" />
        </CardHeader>
        <div className="px-6 pb-6">
          <Skeleton className="h-10 w-full" />
        </div>
      </Card>

      {/* Personal Info and Address Grid Skeleton */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Personal Info Card Skeleton */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Skeleton className="w-5 h-5 mr-2" />
              <Skeleton className="h-5 w-32" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Skeleton className="w-5 h-5" />
              <div className="flex-1">
                <Skeleton className="h-4 w-16 mb-1" />
                <Skeleton className="h-5 w-40" />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Skeleton className="w-5 h-5" />
              <div className="flex-1">
                <Skeleton className="h-4 w-16 mb-1" />
                <Skeleton className="h-5 w-32" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address Info Card Skeleton */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Skeleton className="w-5 h-5 mr-2" />
              <Skeleton className="h-5 w-36" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-3">
              <Skeleton className="w-5 h-5 mt-1" />
              <div className="flex-1">
                <Skeleton className="h-4 w-20 mb-1" />
                <Skeleton className="h-5 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Statistics Card Skeleton */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-40" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Skeleton className="h-8 w-8 mx-auto mb-2" />
              <Skeleton className="h-4 w-24 mx-auto" />
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Skeleton className="h-8 w-8 mx-auto mb-2" />
              <Skeleton className="h-4 w-28 mx-auto" />
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Skeleton className="h-8 w-16 mx-auto mb-2" />
              <Skeleton className="h-4 w-24 mx-auto" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Complaint Management Section Skeleton */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-9 w-32" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Complaint items skeleton */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-32" />
                  <div className="flex space-x-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}