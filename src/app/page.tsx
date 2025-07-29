"use server";
import Footer from "@/components/custom/footer";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Star,
  MapPin,
  Clock,
  Shield,
  Award,
  Users,
  Zap,
  CheckCircle,
  Smartphone,
  Download,
  Globe,
  TrendingUp,
  CreditCard,
  Headphones,
  Navigation,
} from "lucide-react";
import FadeinWrapper from "@/components/custom/fadein_wrapper";
import { getPopularRoutes } from "@/lib/data/route_api";

const Home = async () => {
  const popularRoutes = await getPopularRoutes();
  return (
    <div className="h-full w-full">
      <section className="bg-gradient-to-br w-full relative from-green-600 to-green-700 h-screen flex flex-col justify-center items-center text-white">
        <Image
          src="/bus-photo.jpg"
          fill
          loading="lazy"
          placeholder="blur"
          blurDataURL="..."
          alt="Bus"
          className="object-cover  absolute opacity-40"
        />
        <div className="z-10 flex flex-col items-center">
          <FadeinWrapper effect="animate-fade-in-left">
            <h1 className="text-5xl font-bold text-center mb-6">
              Welcome to Busify
            </h1>
            <FadeinWrapper effect="animate-fade-in-l300">
              <p className="text-xl text-center mb-8 max-w-2xl px-4">
                Your trusted platform connecting travelers with reliable bus
                providers across the nation
              </p>
            </FadeinWrapper>
          </FadeinWrapper>

          <FadeinWrapper effect="animate-fade-in-l400">
            <div className="flex gap-4">
              <Button
                size="lg"
                className="bg-white text-green-600 hover:bg-green-50 "
              >
                Book Your Ticket
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white bg-transparent text-white hover:bg-white hover:text-green-600 "
              >
                Become a Partner
              </Button>
            </div>
          </FadeinWrapper>
        </div>
      </section>
      <section className="p-8 shadow-lg bg-white">
        <FadeinWrapper effect="animate-fade-in-up">
          <h2 className="text-3xl font-bold text-center mt-8 text-green-700 mb-12">
            Our Mission & Services
          </h2>
        </FadeinWrapper>

        {/* Mission Statement */}
        <div className="max-w-4xl mx-auto mb-16 text-center">
          <FadeinWrapper effect="animate-fade-in-up">
            <h3 className="text-2xl font-semibold text-green-600 mb-4 animate-fade-in-left">
              Connecting Travelers with Trusted Bus Providers
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed animate-fade-in-left">
              Busify is a comprehensive platform that bridges the gap between
              travelers seeking convenient bus transportation and reliable bus
              operators looking to expand their reach. We provide a seamless
              ticket booking experience while empowering bus providers to grow
              their business through our partnership program.
            </p>
          </FadeinWrapper>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <FadeinWrapper effect="animate-fade-in-left">
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    ></path>
                  </svg>
                </div>
                <CardTitle className="text-green-700">
                  Easy Ticket Booking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Book bus tickets from multiple providers in one convenient
                  platform with real-time availability.
                </CardDescription>
              </CardContent>
            </Card>
          </FadeinWrapper>

          <FadeinWrapper effect="animate-fade-in-l300">
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-green-700">
                  Partner Network
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Join our growing network of trusted bus operators and expand
                  your business reach.
                </CardDescription>
              </CardContent>
            </Card>
          </FadeinWrapper>

          <FadeinWrapper effect="animate-fade-in-l400">
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-green-700">
                  Real-time Updates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Stay informed with live tracking, schedule updates, and
                  instant notifications.
                </CardDescription>
              </CardContent>
            </Card>
          </FadeinWrapper>
        </div>

        {/* Call to Action for Providers */}
        <Card className="bg-gradient-to-r from-green-600 to-green-700 text-white border-0 mt-16">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold mb-4">
              Ready to Become a Bus Provider Partner?
            </CardTitle>
            <CardDescription className="text-lg text-green-100">
              Join our platform and reach thousands of potential customers.
              Simple contract process, competitive rates, and dedicated support.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button
              size="lg"
              className="bg-white text-green-600 hover:bg-green-50"
            >
              Start Partnership Process
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* How It Works Section */}
      <FadeinWrapper effect="animate-fade-in-up">
        <section className="bg-gray-50 py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-green-700 mb-12">
              How Busify Works
            </h2>

            <Tabs defaultValue="travelers" className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-12">
                <TabsTrigger value="travelers">For Travelers</TabsTrigger>
                <TabsTrigger value="providers">For Providers</TabsTrigger>
              </TabsList>

              <TabsContent value="travelers" className="space-y-8">
                <div className="grid md:grid-cols-3 gap-8">
                  <Card className="text-center">
                    <CardHeader>
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-green-600">
                          1
                        </span>
                      </div>
                      <CardTitle className="text-green-700">
                        Search & Compare
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>
                        Search for bus routes, compare prices, schedules, and
                        amenities from multiple providers in one place.
                      </CardDescription>
                    </CardContent>
                  </Card>

                  <Card className="text-center">
                    <CardHeader>
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-green-600">
                          2
                        </span>
                      </div>
                      <CardTitle className="text-green-700">
                        Book & Pay
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>
                        Select your preferred trip, choose your seats, and
                        complete secure payment with multiple payment options.
                      </CardDescription>
                    </CardContent>
                  </Card>

                  <Card className="text-center">
                    <CardHeader>
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-green-600">
                          3
                        </span>
                      </div>
                      <CardTitle className="text-green-700">
                        Travel & Track
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>
                        Get your e-ticket, track your bus in real-time, and
                        receive updates throughout your journey.
                      </CardDescription>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="providers" className="space-y-8">
                <div className="grid md:grid-cols-3 gap-8">
                  <Card className="text-center">
                    <CardHeader>
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-green-600">
                          1
                        </span>
                      </div>
                      <CardTitle className="text-green-700">
                        Apply & Verify
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>
                        Submit your application with business documents. Our
                        team verifies your credentials and fleet quality.
                      </CardDescription>
                    </CardContent>
                  </Card>

                  <Card className="text-center">
                    <CardHeader>
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-green-600">
                          2
                        </span>
                      </div>
                      <CardTitle className="text-green-700">
                        Setup & Launch
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>
                        Configure your routes, pricing, and schedules. Our team
                        helps you launch your services on the platform.
                      </CardDescription>
                    </CardContent>
                  </Card>

                  <Card className="text-center">
                    <CardHeader>
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-green-600">
                          3
                        </span>
                      </div>
                      <CardTitle className="text-green-700">
                        Grow & Earn
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>
                        Start receiving bookings, manage your fleet, and grow
                        your business with our marketing and support.
                      </CardDescription>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </FadeinWrapper>

      {/* Why Choose Busify Section */}
      <FadeinWrapper effect="animate-fade-in-up">
        <section className="bg-green-600 text-white py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Choose Busify?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center space-y-4">
                <Shield className="w-12 h-12 mx-auto text-green-200" />
                <h3 className="text-xl font-semibold">Secure & Safe</h3>
                <p className="text-green-100">
                  All our partner buses are verified and meet safety standards
                </p>
              </div>
              <div className="text-center space-y-4">
                <Award className="w-12 h-12 mx-auto text-green-200" />
                <h3 className="text-xl font-semibold">Best Prices</h3>
                <p className="text-green-100">
                  Compare prices across providers and get the best deals
                </p>
              </div>
              <div className="text-center space-y-4">
                <Zap className="w-12 h-12 mx-auto text-green-200" />
                <h3 className="text-xl font-semibold">Instant Booking</h3>
                <p className="text-green-100">
                  Book tickets instantly with immediate confirmation
                </p>
              </div>
              <div className="text-center space-y-4">
                <CheckCircle className="w-12 h-12 mx-auto text-green-200" />
                <h3 className="text-xl font-semibold">24/7 Support</h3>
                <p className="text-green-100">
                  Round-the-clock customer support for any assistance
                </p>
              </div>
            </div>
          </div>
        </section>
      </FadeinWrapper>

      {/* Statistics Section */}
      <FadeinWrapper effect="animate-fade-in-up">
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-green-700 mb-12">
              Trusted by Thousands
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="space-y-2">
                <div className="text-4xl font-bold text-green-600">500+</div>
                <div className="text-gray-600">Bus Providers</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-green-600">50,000+</div>
                <div className="text-gray-600">Happy Travelers</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-green-600">1,000+</div>
                <div className="text-gray-600">Routes Available</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-green-600">24/7</div>
                <div className="text-gray-600">Customer Support</div>
              </div>
            </div>
          </div>
        </section>
      </FadeinWrapper>

      {/* Business Solutions Section */}
      <section className="py-16 bg-green-50">
        <div className="max-w-6xl mx-auto px-4">
          <FadeinWrapper effect="animate-fade-in-up">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-green-700 mb-4">
                Business Solutions
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Special services for companies, travel agencies, and
                organizations looking for group bookings and corporate travel
                solutions.
              </p>
            </div>
          </FadeinWrapper>

          <div className="grid md:grid-cols-3 gap-8">
            <FadeinWrapper effect="animate-fade-in-left">
              <Card className="border-green-200">
                <CardHeader>
                  <TrendingUp className="w-12 h-12 text-green-600 mb-4" />
                  <CardTitle className="text-green-700">
                    Corporate Travel
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    Streamlined booking for employee business trips with expense
                    tracking and reporting.
                  </CardDescription>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Centralized billing and invoicing</li>
                    <li>• Travel policy compliance</li>
                    <li>• Detailed trip reports</li>
                    <li>• Priority customer support</li>
                  </ul>
                </CardContent>
              </Card>
            </FadeinWrapper>

            <FadeinWrapper effect="animate-fade-in-l300">
              <Card className="border-green-200">
                <CardHeader>
                  <Users className="w-12 h-12 text-green-600 mb-4" />
                  <CardTitle className="text-green-700">
                    Group Bookings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    Special rates and coordinated travel for groups, events, and
                    tour operators.
                  </CardDescription>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Bulk booking discounts</li>
                    <li>• Seat allocation management</li>
                    <li>• Flexible payment terms</li>
                    <li>• Dedicated group coordinator</li>
                  </ul>
                </CardContent>
              </Card>
            </FadeinWrapper>

            <FadeinWrapper effect="animate-fade-in-l400">
              <Card className="border-green-200">
                <CardHeader>
                  <Headphones className="w-12 h-12 text-green-600 mb-4" />
                  <CardTitle className="text-green-700">
                    Management Tools
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    Various tools for management systems, travel agencies, and
                    corporate platforms to integrate bus booking services.
                  </CardDescription>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Comprehensive dashboard for booking management</li>
                    <li>• Monitoring tools for real-time analytics</li>
                    <li>• Seamless integration with existing systems</li>
                    <li>
                      • Resource management tools for efficient operations
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </FadeinWrapper>
          </div>

          <div className="text-center mt-12">
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              Contact Business Team
            </Button>
          </div>
        </div>
      </section>

      {/* Popular Routes Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-green-700 mb-12">
            Popular Routes
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularRoutes.result.slice(0, 6).map((route: any) => (
              <Card
                key={route.routeId}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg text-green-700">
                        {route.routeName}
                      </CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        {route.durationHours} journey
                      </CardDescription>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-700"
                    >
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
                        }).format(route.startingPrice)}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      View Routes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button
              size="lg"
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
            >
              View All Routes
            </Button>
          </div>
        </div>
      </section>

      {/* Mobile App Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-green-700 mb-6">
                Book on the go with our Mobile App
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Download the Busify mobile app for seamless ticket booking,
                real-time tracking, and exclusive mobile-only deals. Available
                on both iOS and Android.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <Smartphone className="w-6 h-6 text-green-600" />
                  <span className="text-gray-700">
                    Easy booking in just a few taps
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Navigation className="w-6 h-6 text-green-600" />
                  <span className="text-gray-700">
                    Real-time bus tracking and notifications
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-6 h-6 text-green-600" />
                  <span className="text-gray-700">Secure mobile payments</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="w-6 h-6 text-green-600" />
                  <span className="text-gray-700">Offline ticket access</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-black text-white hover:bg-gray-800 flex items-center space-x-2">
                  <Download className="w-5 h-5" />
                  <span>Download on App Store</span>
                </Button>
                <Button className="bg-black text-white hover:bg-gray-800 flex items-center space-x-2">
                  <Download className="w-5 h-5" />
                  <span>Get it on Google Play</span>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl p-8 shadow-2xl">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                      <Smartphone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-green-700">
                        Busify Mobile
                      </h3>
                      <p className="text-sm text-gray-600">
                        Travel made simple
                      </p>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Ho Chi Minh → Da Lat
                      </span>
                      <Badge className="bg-green-100 text-green-700">
                        Booked
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Today, 8:30 AM</span>
                      <span className="font-semibold text-green-600">$15</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-green-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-green-700 mb-12">
            What Our Customers Say
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">John Doe</CardTitle>
                    <CardDescription>Frequent Traveler</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-600">
                  “Busify has made my business trips so much easier. I can
                  compare prices and book tickets in minutes!”
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>SM</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">Sarah Miller</CardTitle>
                    <CardDescription>Bus Provider Owner</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-600">
                  “Since joining Busify, our bookings increased by 40%. The
                  platform is easy to use and the support is excellent.”
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>MJ</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">Mike Johnson</CardTitle>
                    <CardDescription>Regular Commuter</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-600">
                  “Real-time tracking and reliable service. I always know when
                  my bus will arrive. Highly recommended!”
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-green-700 mb-12">
            Frequently Asked Questions
          </h2>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I book a bus ticket?</AccordionTrigger>
              <AccordionContent>
                Simply search for your route, select your preferred bus and
                time, choose your seats, and complete the payment. You'll
                receive an e-ticket immediately via email.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>
                How can I become a bus provider partner?
              </AccordionTrigger>
              <AccordionContent>
                Click on “Become a Partner” and fill out our application form.
                We'll review your credentials, fleet quality, and safety
                standards. Once approved, our team will help you set up your
                services on the platform.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>
                What payment methods do you accept?
              </AccordionTrigger>
              <AccordionContent>
                We accept all major credit cards, debit cards, mobile wallets,
                and bank transfers. All payments are processed securely through
                our encrypted payment gateway.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>
                Can I cancel or modify my booking?
              </AccordionTrigger>
              <AccordionContent>
                Yes, you can cancel or modify your booking up to a certain time
                before departure (varies by provider). Cancellation fees may
                apply according to the provider's policy.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>What if my bus is delayed?</AccordionTrigger>
              <AccordionContent>
                You'll receive real-time updates about any delays or changes to
                your trip. In case of significant delays, you may be eligible
                for compensation according to our passenger protection policy.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Newsletter Signup Section */}
      <section className="py-16 bg-green-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated with Busify</h2>
          <p className="text-lg text-green-100 mb-8">
            Get the latest deals, new routes, and travel tips delivered to your
            inbox.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              placeholder="Enter your email address"
              className="bg-white text-gray-900 border-0 flex-1"
            />
            <Button className="bg-green-500 hover:bg-green-400 text-white">
              Subscribe
            </Button>
          </div>

          <p className="text-sm text-green-200 mt-4">
            By subscribing, you agree to receive marketing emails. Unsubscribe
            at any time.
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Home;
