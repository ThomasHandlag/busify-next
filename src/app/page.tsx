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
  Shield,
  Award,
  Users,
  Zap,
  Smartphone,
  Download,
  Globe,
  TrendingUp,
  CreditCard,
  Headphones,
  Navigation,
  MapPin,
  Bus,
  Building2,
  BarChart3,
  Ticket,
  Calendar,
} from "lucide-react";
import { FadeinWrapper } from "@/components/custom/animation/fadein_wrapper";
import { getPopularRoutes } from "@/lib/data/route_api";
import { BusifyRoute } from "@/lib/data/route_api";
import Link from "next/link";
import BusifyRouteItem from "@/components/custom/route/busify_route_item";

const Home = async () => {
  const popularRoutes = await getPopularRoutes();
  return (
    <div className="h-full w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-br w-full relative from-green-600 to-green-700 h-screen flex flex-col justify-center items-center text-white">
        <Image
          src="/bus-photo.jpg"
          fill
          loading="lazy"
          placeholder="blur"
          blurDataURL="/place-holder.png"
          alt="Bus"
          className="object-cover absolute h-sceen w-full opacity-50"
        />
        <div className="z-10 flex flex-col items-center">
          <FadeinWrapper effect="animate-fade-in-left">
            <h1 className="text-5xl font-bold text-center mb-6">
              Welcome to Busify
            </h1>
            <FadeinWrapper effect="animate-fade-in-l300">
              <p className="text-xl text-center mb-8 max-w-3xl px-4">
                The complete travel platform connecting passengers with trusted
                bus operators. Book tickets effortlessly or grow your bus
                business with our comprehensive management tools.
              </p>
            </FadeinWrapper>
          </FadeinWrapper>

          <FadeinWrapper effect="animate-fade-in-l400">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-white text-green-600 hover:bg-green-50 flex items-center space-x-2"
                asChild
              >
                <Link href="/trips">
                  <Ticket className="w-5 h-5" />
                  <span>Book Your Journey</span>
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white bg-transparent text-white hover:bg-white hover:text-green-600 flex items-center space-x-2"
                asChild
              >
                <a href="/operator">
                  <Building2 className="w-5 h-5" />
                  <span>Grow Your Business</span>
                </a>
              </Button>
            </div>
          </FadeinWrapper>
        </div>
      </section>

      {/* Two-Platform Introduction */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <FadeinWrapper effect="animate-fade-in-left">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-green-700 mb-6">
                One Platform, Two Complete Solutions
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Whether you&apos;re a traveler looking for your next journey or
                a bus operator wanting to expand your business, Busify provides
                everything you need.
              </p>
            </div>
          </FadeinWrapper>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Passenger Platform */}
            <FadeinWrapper effect="animate-fade-in-left">
              <Card className="border-green-200 bg-green-50 h-full">
                <CardHeader className="text-center pb-8">
                  <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-green-700 mb-2">
                    For Passengers
                  </CardTitle>
                  <CardDescription className="text-lg text-green-600">
                    Your gateway to comfortable and affordable bus travel
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-8">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <MapPin className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-800">
                          Smart Route Search
                        </h4>
                        <p className="text-green-700 text-sm">
                          Find the best routes, compare prices, and choose from
                          multiple operators
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Ticket className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-800">
                          Instant Booking
                        </h4>
                        <p className="text-green-700 text-sm">
                          Book tickets in seconds with secure payment and
                          instant confirmation
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Navigation className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-800">
                          Live Tracking
                        </h4>
                        <p className="text-green-700 text-sm">
                          Track your bus in real-time and get updates throughout
                          your journey
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Calendar className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-800">
                          Trip Management
                        </h4>
                        <p className="text-green-700 text-sm">
                          Manage all your bookings, view history, and plan
                          future trips
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    asChild
                  >
                    <Link href="/trips">Explore Passenger Portal</Link>
                  </Button>
                </CardContent>
              </Card>
            </FadeinWrapper>

            {/* Operator Platform */}
            <FadeinWrapper effect="animate-fade-in-l300">
              <Card className="border-green-300 bg-green-100 h-full">
                <CardHeader className="text-center pb-8">
                  <div className="w-20 h-20 bg-green-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building2 className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-green-800 mb-2">
                    For Bus Operators
                  </CardTitle>
                  <CardDescription className="text-lg text-green-700">
                    Complete business management platform for bus operators
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-8">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <BarChart3 className="w-4 h-4 text-green-700" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-900">
                          Business Dashboard
                        </h4>
                        <p className="text-green-800 text-sm">
                          Comprehensive analytics, revenue tracking, and
                          performance insights
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Bus className="w-4 h-4 text-green-700" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-900">
                          Fleet Management
                        </h4>
                        <p className="text-green-800 text-sm">
                          Manage your buses, routes, schedules, and driver
                          assignments
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Users className="w-4 h-4 text-green-700" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-900">
                          Passenger Management
                        </h4>
                        <p className="text-green-800 text-sm">
                          View bookings, manage passenger communications, and
                          handle requests
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <TrendingUp className="w-4 h-4 text-green-700" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-900">
                          Revenue Growth
                        </h4>
                        <p className="text-green-800 text-sm">
                          Access our passenger network and grow your business
                          with marketing tools
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button
                    className="w-full bg-green-700 hover:bg-green-800"
                    asChild
                  >
                    <a href="/operator">Explore Operator Portal</a>
                  </Button>
                </CardContent>
              </Card>
            </FadeinWrapper>
          </div>
        </div>
      </section>

      {/* Platform Benefits */}
      <section className="py-16 bg-green-50">
        <div className="max-w-6xl mx-auto px-4">
          <FadeinWrapper effect="animate-fade-in-up">
            <h2 className="text-3xl font-bold text-center text-green-700 mb-12">
              Why Choose Busify Platform?
            </h2>
          </FadeinWrapper>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FadeinWrapper effect="animate-fade-in-left">
              <Card className="text-center border-green-200 bg-white">
                <CardHeader>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-green-600" />
                  </div>
                  <CardTitle className="text-green-700">
                    Secure & Reliable
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Bank-level security, verified operators, and reliable
                    service you can trust
                  </CardDescription>
                </CardContent>
              </Card>
            </FadeinWrapper>

            <FadeinWrapper effect="animate-fade-in-l300">
              <Card className="text-center border-green-200 bg-white">
                <CardHeader>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-green-600" />
                  </div>
                  <CardTitle className="text-green-700">
                    Real-time Everything
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Live tracking, instant bookings, real-time analytics, and
                    immediate notifications
                  </CardDescription>
                </CardContent>
              </Card>
            </FadeinWrapper>

            <FadeinWrapper effect="animate-fade-in-l400">
              <Card className="text-center border-green-200 bg-white">
                <CardHeader>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-green-600" />
                  </div>
                  <CardTitle className="text-green-700">Best Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Competitive pricing for passengers, profitable margins for
                    operators
                  </CardDescription>
                </CardContent>
              </Card>
            </FadeinWrapper>

            <FadeinWrapper effect="animate-fade-in-l500">
              <Card className="text-center border-green-200 bg-white">
                <CardHeader>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Headphones className="w-8 h-8 text-green-600" />
                  </div>
                  <CardTitle className="text-green-700">24/7 Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Round-the-clock customer support for passengers and
                    operators
                  </CardDescription>
                </CardContent>
              </Card>
            </FadeinWrapper>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <FadeinWrapper effect="animate-fade-in-up">
        <section className="bg-white py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-green-700 mb-12">
              How Busify Works
            </h2>

            <Tabs defaultValue="passengers" className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-12 bg-green-100">
                <TabsTrigger
                  value="passengers"
                  className="flex items-center space-x-2 data-[state=active]:bg-green-600 data-[state=active]:text-white"
                >
                  <Users className="w-4 h-4" />
                  <span>For Passengers</span>
                </TabsTrigger>
                <TabsTrigger
                  value="operators"
                  className="flex items-center space-x-2 data-[state=active]:bg-green-600 data-[state=active]:text-white"
                >
                  <Building2 className="w-4 h-4" />
                  <span>For Operators</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="passengers" className="space-y-8">
                <div className="grid md:grid-cols-3 gap-8">
                  <Card className="text-center border-green-200 bg-green-50">
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
                      <CardDescription className="text-green-600">
                        Enter your route, compare prices, schedules, and
                        amenities from verified operators
                      </CardDescription>
                    </CardContent>
                  </Card>

                  <Card className="text-center border-green-200 bg-green-50">
                    <CardHeader>
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-green-600">
                          2
                        </span>
                      </div>
                      <CardTitle className="text-green-700">
                        Book & Pay Securely
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-green-600">
                        Choose your seats, complete secure payment, and receive
                        instant e-ticket confirmation
                      </CardDescription>
                    </CardContent>
                  </Card>

                  <Card className="text-center border-green-200 bg-green-50">
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
                      <CardDescription className="text-green-600">
                        Track your bus live, receive journey updates, and enjoy
                        a comfortable trip
                      </CardDescription>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="operators" className="space-y-8">
                <div className="grid md:grid-cols-3 gap-8">
                  <Card className="text-center border-green-300 bg-green-100">
                    <CardHeader>
                      <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-green-700">
                          1
                        </span>
                      </div>
                      <CardTitle className="text-green-800">
                        Register & Verify
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-green-700">
                        Complete registration, verify your business credentials,
                        and get approved by our team
                      </CardDescription>
                    </CardContent>
                  </Card>

                  <Card className="text-center border-green-300 bg-green-100">
                    <CardHeader>
                      <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-green-700">
                          2
                        </span>
                      </div>
                      <CardTitle className="text-green-800">
                        Setup & Launch
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-green-700">
                        Add your routes, set schedules and pricing, configure
                        your fleet, and go live
                      </CardDescription>
                    </CardContent>
                  </Card>

                  <Card className="text-center border-green-300 bg-green-100">
                    <CardHeader>
                      <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-green-700">
                          3
                        </span>
                      </div>
                      <CardTitle className="text-green-800">
                        Manage & Grow
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-green-700">
                        Receive bookings, manage passengers, track performance,
                        and grow your business
                      </CardDescription>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
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
              <p className="text-lg text-green-600 max-w-2xl mx-auto">
                Special services for companies, travel agencies, and
                organizations looking for group bookings and corporate travel
                solutions.
              </p>
            </div>
          </FadeinWrapper>

          <div className="grid md:grid-cols-3 gap-8">
            <FadeinWrapper effect="animate-fade-in-left">
              <Card className="border-green-200 bg-white">
                <CardHeader>
                  <TrendingUp className="w-12 h-12 text-green-600 mb-4" />
                  <CardTitle className="text-green-700">
                    Corporate Travel
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4 text-green-600">
                    Streamlined booking for employee business trips with expense
                    tracking and reporting.
                  </CardDescription>
                  <ul className="space-y-2 text-sm text-green-600">
                    <li>• Centralized billing and invoicing</li>
                    <li>• Travel policy compliance</li>
                    <li>• Detailed trip reports</li>
                    <li>• Priority customer support</li>
                  </ul>
                </CardContent>
              </Card>
            </FadeinWrapper>

            <FadeinWrapper effect="animate-fade-in-l300">
              <Card className="border-green-200 bg-white">
                <CardHeader>
                  <Users className="w-12 h-12 text-green-600 mb-4" />
                  <CardTitle className="text-green-700">
                    Group Bookings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4 text-green-600">
                    Special rates and coordinated travel for groups, events, and
                    tour operators.
                  </CardDescription>
                  <ul className="space-y-2 text-sm text-green-600">
                    <li>• Bulk booking discounts</li>
                    <li>• Seat allocation management</li>
                    <li>• Flexible payment terms</li>
                    <li>• Dedicated group coordinator and support</li>
                  </ul>
                </CardContent>
              </Card>
            </FadeinWrapper>

            <FadeinWrapper effect="animate-fade-in-l400">
              <Card className="border-green-200 bg-white">
                <CardHeader>
                  <Headphones className="w-12 h-12 text-green-600 mb-4" />
                  <CardTitle className="text-green-700">
                    Management Tools
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4 text-green-600">
                    Various tools for management systems, travel agencies, and
                    corporate platforms.
                  </CardDescription>
                  <ul className="space-y-2 text-sm text-green-600">
                    <li>• Comprehensive dashboard for management</li>
                    <li>• Monitoring tools for real-time analytics</li>
                    <li>• Seamless integration with existing systems</li>
                    <li>• Powerfull resource management tools</li>
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
            {popularRoutes.slice(0, 6).map((route: BusifyRoute) => (
              <BusifyRouteItem key={route.routeId} item={route} />
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
            <Card className="border-green-200 bg-white">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback className="bg-green-100 text-green-700">
                      JD
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg text-green-800">
                      John Doe
                    </CardTitle>
                    <CardDescription className="text-green-600">
                      Frequent Traveler
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-green-400 text-green-400"
                    />
                  ))}
                </div>
                <p className="text-green-700">
                  &quot;Busify has made my business trips so much easier. I can
                  compare prices and book tickets in minutes!&quot;
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-white">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback className="bg-green-100 text-green-700">
                      SM
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg text-green-800">
                      Sarah Miller
                    </CardTitle>
                    <CardDescription className="text-green-600">
                      Bus Provider Owner
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-green-400 text-green-400"
                    />
                  ))}
                </div>
                <p className="text-green-700">
                  &quot;Since joining Busify, our bookings increased by 40%. The
                  platform is easy to use and the support is excellent.&quot;
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-white">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback className="bg-green-100 text-green-700">
                      MJ
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg text-green-800">
                      Mike Johnson
                    </CardTitle>
                    <CardDescription className="text-green-600">
                      Regular Commuter
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-green-400 text-green-400"
                    />
                  ))}
                </div>
                <p className="text-green-700">
                  &quot;Real-time tracking and reliable service. I always know
                  when my bus will arrive. Highly recommended!&quot;
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
                time, choose your seats, and complete the payment. You&apos;ll
                receive an e-ticket immediately via email.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>
                How can I become a bus provider partner?
              </AccordionTrigger>
              <AccordionContent>
                Click on “Become a Partner” and fill out our application form.
                We&apos;ll review your credentials, fleet quality, and safety
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
                apply according to the provider&apos;s policy.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>What if my bus is delayed?</AccordionTrigger>
              <AccordionContent>
                You&apos;ll receive real-time updates about any delays or
                changes to your trip. In case of significant delays, you may be
                eligible for compensation according to our passenger protection
                policy.
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

          <p className="text-sm text-green-200 mt-4 p-3">
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
