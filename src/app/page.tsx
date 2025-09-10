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
import HomeSearchForm from "@/components/custom/home_search_form";
import { getAllLocations } from "@/lib/data/location";
import { toast } from "sonner";
import DiscountSlider from "@/components/custom/discount_slider";

const Home = async () => {
  const popularRoutes = await getPopularRoutes({
    callback: (msg: string) => toast.error(msg),
    localeMessage: "Failed to load popular routes",
  });
  const locations = await getAllLocations({
    callback: (msg: string) => toast.info(msg),
    localeMessage: "Failed to load locations",
  });
  return (
    <div className="h-full w-full">
      <section className="w-full relative">
        <div
          className="relative bg-gradient-to-r from-green-600 to-green-500 overflow-hidden rounded-b-3xl mx-4 md:mx-8"
          style={{ minHeight: "140px" }}
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-green-400/10 to-transparent"></div>
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-green-300/20 to-transparent"></div>
          </div>
        </div>

        <div
          className="relative flex justify-center px-4"
          style={{ zIndex: 20, marginTop: "-100px", marginBottom: "12px" }}
        >
          <div className="w-full max-w-6xl">
            <div className="relative z-10 flex flex-col items-center justify-center text-center">
              <div className="rounded-2xl px-6 py-8 md:px-12 md:py-10 flex flex-col items-center gap-4 shadow-2xl border border-white/20">
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 mb-4">
                  <span className="text-5xl md:text-7xl font-bold bg-gradient-to-br bg-green-500 bg-clip-text text-transparent drop-shadow-2xl">
                    Bustify
                  </span>
                  <div className="text-center md:text-left">
                    <div className="text-xl md:text-2xl font-bold text-green-500 drop-shadow-lg">
                      ĐỒNG HÀNH - PHÁT TRIỂN
                    </div>
                    <div className="text-xl md:text-3xl font-bold text-green-500 drop-shadow-lg">
                      VỮNG TIN - AN TOÀN
                    </div>
                  </div>
                </div>
                <div className="-z-1 rounded-2xl h-[30px]">
                  <Image
                    src="/copy.jpg"
                    fill
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL="..."
                    alt="Bus platform background"
                    className="object-cover rounded-2xl "
                  />
                  <div className="bg-black/10 backdrop:blur-xl absolute inset-0 rounded-2xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative py-8 z-30">
          <div className="max-w-6xl mx-auto px-4">
            <Card className="bg-white shadow-xl shadow-green-500/25 border-2 border-green-500 rounded-2xl backdrop-blur-sm">
              <CardContent className="p-6">
                <HomeSearchForm locations={locations} />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Discount Campaigns Slider Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              🎉 Ưu đãi đặc biệt
            </h2>
            <p className="text-xl text-gray-600">
              Khám phá những chương trình khuyến mãi hấp dẫn nhất
            </p>
          </div>
          <DiscountSlider />
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
                <Button className="bg-gray-900 text-white hover:bg-gray-800 flex items-center justify-center space-x-2 px-6 py-3 rounded-lg transition-colors">
                  <Download className="w-5 h-5" />
                  <span>Download on App Store</span>
                </Button>
                <Button className="bg-green-600 text-white hover:bg-green-700 flex items-center justify-center space-x-2 px-6 py-3 rounded-lg transition-colors">
                  <Download className="w-5 h-5" />
                  <span>Get it on Google Play</span>
                </Button>
              </div>
            </div>

            <div className="relative lg:pl-8">
              <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-2xl p-8 shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-300">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-md">
                      <Smartphone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-green-800 text-lg">
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
      <section className="bg-gradient-to-b from-green-50 to-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-green-800 mb-12">
            What Our Customers Say
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-green-200 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar className="ring-2 ring-green-200">
                    <AvatarImage src="/place-holder.png" />
                    <AvatarFallback className="bg-green-100 text-green-800 font-semibold">
                      JD
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg text-green-900">
                      John Doe
                    </CardTitle>
                    <CardDescription className="text-green-700">
                      Frequent Traveler
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={`testimonial1-star-${i}`}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 italic">
                  &quot;Busify has made my business trips so much easier. I can
                  compare prices and book tickets in minutes!&quot;
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar className="ring-2 ring-green-200">
                    <AvatarImage src="/place-holder.png" />
                    <AvatarFallback className="bg-green-100 text-green-800 font-semibold">
                      SM
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg text-green-900">
                      Sarah Miller
                    </CardTitle>
                    <CardDescription className="text-green-700">
                      Bus Provider Owner
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={`testimonial2-star-${i}`}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 italic">
                  &quot;Since joining Busify, our bookings increased by 40%. The
                  platform is easy to use and the support is excellent.&quot;
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar className="ring-2 ring-green-200">
                    <AvatarImage src="/place-holder.png" />
                    <AvatarFallback className="bg-green-100 text-green-800 font-semibold">
                      MJ
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg text-green-900">
                      Mike Johnson
                    </CardTitle>
                    <CardDescription className="text-green-700">
                      Regular Commuter
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={`testimonial3-star-${i}`}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 italic">
                  &quot;Real-time tracking and reliable service. I always know
                  when my bus will arrive. Highly recommended!&quot;
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-green-800 mb-12">
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
      <section className="py-16 bg-gradient-to-r from-green-700 via-green-600 to-green-700 text-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-white/10 to-transparent"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl font-bold mb-4 text-white">
            Stay Updated with Busify
          </h2>
          <p className="text-lg text-green-50 mb-8">
            Get the latest deals, new routes, and travel tips delivered to your
            inbox.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              placeholder="Enter your email address"
              className="bg-white/95 text-gray-900 border-0 flex-1 placeholder:text-gray-500 focus:bg-white transition-colors"
            />
            <Button className="bg-white text-green-700 hover:bg-green-50 font-semibold px-6 transition-colors">
              Subscribe
            </Button>
          </div>

          <p className="text-sm text-green-100 mt-6">
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
