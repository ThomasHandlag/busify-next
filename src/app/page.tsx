import Footer from "@/components/custom/footer";
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
  Smartphone,
  Download,
  Globe,
  CreditCard,
  Navigation,
} from "lucide-react";
import { getPopularRoutes } from "@/lib/data/route_api";
import type { BusifyRoute } from "@/lib/data/route_api";
import Link from "next/link";
import BusifyRouteItem from "@/components/custom/route/busify_route_item";
import Image from "next/image";

const Home = async () => {
  const popularRoutes = await getPopularRoutes({
    callback: (msg: string) => console.error(msg),
    localeMessage: "Failed to load popular routes",
  });
  return (
    <div className="h-full w-full">
      {/* Hero Section with Decorative Banner and Booking Form */}

      <section className="w-full relative">
        {/* Header background xanh bo góc */}
        <div
          className="relative bg-gradient-to-r from-green-600 to-green-500 overflow-hidden rounded-b-3xl mx-4 md:mx-8"
          style={{ minHeight: "120px" }}
        >
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Gradient overlay patterns */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-green-400/10 to-transparent"></div>
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-green-300/20 to-transparent"></div>
          </div>
        </div>
        {/* Bus image và overlay chữ tràn ra ngoài, không bị bo góc nền xanh cắt */}
        <div
          className="relative flex justify-center"
          style={{ zIndex: 20, marginTop: "-60px", marginBottom: "16px" }}
        >
          <div className="relative w-full max-w-6xl">
            <Image
              src="/bus-photo.jpg"
              fill
              loading="lazy"
              placeholder="blur"
              blurDataURL="..."
              alt="Bus platform logo"
              className="object-cover absolute h-sceen w-full opacity-50"
            />
            {/* Overlay text on image */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <div className="bg-black/40 rounded-2xl px-8 py-6 md:px-16 md:py-8 flex flex-col items-center gap-2">
                <div className="flex items-center justify-center gap-4 mb-2">
                  <span className="text-5xl md:text-7xl font-bold bg-gradient-to-br from-yellow-200 via-yellow-300 to-yellow-400 bg-clip-text text-transparent drop-shadow-lg">
                    24
                  </span>
                  <div className="text-left">
                    <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
                      NĂM
                    </div>
                    <div className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-white via-green-50 to-green-100 bg-clip-text text-transparent">
                      VỮNG TIN & PHÁT TRIỂN
                    </div>
                  </div>
                </div>
                <div className="text-transparent bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-lg md:text-xl font-semibold tracking-wide uppercase">
                  CHẤT LƯỢNG LÀ DANH DỰ
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 py-8">
          <div className="max-w-6xl mx-auto px-4">
            <Card className="bg-white shadow-lg shadow-green-500/20 border-2 border-green-500 rounded-2xl">
              <CardContent className="p-6">
                {/* Trip Type Selection - compact hơn */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id="one-way"
                        name="trip-type"
                        defaultChecked
                        className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                      />
                      <label
                        htmlFor="one-way"
                        className="text-green-700 font-medium text-sm"
                      >
                        Một chiều
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id="round-trip"
                        name="trip-type"
                        className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                      />
                      <label
                        htmlFor="round-trip"
                        className="text-gray-600 font-medium text-sm"
                      >
                        Khứ hồi
                      </label>
                    </div>
                  </div>
                </div>

                {/* Main booking form - compact layout như Phương Trang */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
                  {/* Departure Location */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">
                      ĐIỂM ĐI
                    </label>
                    <Input
                      placeholder="Bình Định"
                      className="h-10 text-sm border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>

                  {/* Arrival Location */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">
                      ĐIỂM ĐẾN
                    </label>
                    <Input
                      placeholder="TP. Hồ Chí Minh"
                      className="h-10 text-sm border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>

                  {/* Date */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">
                      NGÀY ĐI
                    </label>
                    <Input
                      type="date"
                      defaultValue="2025-08-26"
                      className="h-10 text-sm border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>

                  {/* Passenger Count */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">
                      SỐ VÉ
                    </label>
                    <select className="h-10 w-full border border-gray-300 rounded-md px-3 text-sm focus:border-green-500 focus:ring-green-500 bg-white">
                      <option value="1">1 vé</option>
                      <option value="2">2 vé</option>
                      <option value="3">3 vé</option>
                      <option value="4">4 vé</option>
                      <option value="5">5 vé</option>
                    </select>
                  </div>

                  {/* Search Button */}
                  <div className="flex items-end">
                    <Button
                      size="sm"
                      className="h-10 w-full bg-green-600 hover:bg-green-700 text-white px-6 rounded-md font-medium text-sm"
                    >
                      TÌM CHUYẾN
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
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
            {popularRoutes?.slice(0, 6).map((route: BusifyRoute) => (
              <BusifyRouteItem key={route.routeId} item={route} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Button
              size="lg"
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white bg-transparent"
              asChild
            >
              <Link href="/trips">View All Routes</Link>
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
                    <AvatarImage src="/place-holder.png" />
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
                      key={`testimonial1-star-${i}`}
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
                    <AvatarImage src="/place-holder.png" />
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
                      key={`testimonial2-star-${i}`}
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
                    <AvatarImage src="/place-holder.png" />
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
                      key={`testimonial3-star-${i}`}
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
