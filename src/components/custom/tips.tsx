import { Calendar, MapPin, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";

const Tips = () => {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-green-700 mb-12">
            Travel Tips & Guides
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <div className="relative h-48 bg-green-100">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Calendar className="w-16 h-16 text-green-600" />
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-green-700">
                  Best Time to Travel
                </CardTitle>
                <CardDescription>
                  Learn about peak seasons, weather patterns, and the best times
                  to visit popular destinations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                >
                  Read More
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <div className="relative h-48 bg-green-100">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Shield className="w-16 h-16 text-green-600" />
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-green-700">
                  Safety Guidelines
                </CardTitle>
                <CardDescription>
                  Important safety tips for bus travel, what to expect, and how
                  to prepare for your journey.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                >
                  Read More
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <div className="relative h-48 bg-green-100">
                <div className="absolute inset-0 flex items-center justify-center">
                  <MapPin className="w-16 h-16 text-green-600" />
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-green-700">
                  Destination Guides
                </CardTitle>
                <CardDescription>
                  Discover amazing destinations, local attractions, and hidden
                  gems along your bus routes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                >
                  Read More
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    )
}

export default Tips;