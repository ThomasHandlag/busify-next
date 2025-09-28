"use server";

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
import Link from "next/link";
import Image from "next/image";
import HomeSearchForm from "@/components/custom/home_search_form";
import { getAllLocations } from "@/lib/data/location";
import { toast } from "sonner";
import LocaleText from "@/components/custom/locale_text";
import DiscountSlider from "@/components/custom/discount_slider";
import { getTripsByRegions, TripItemProps } from "@/lib/data/trip";
import TripItem from "@/components/custom/trip/trip_item";
import { FadeinWrapper } from "@/components/custom/animation/fadein_wrapper";

// export const dynamic = 'force-static';
// export const revalidate = 3600; // Revalidate every hour

const Home = async () => {
  const trips = await getTripsByRegions({
    callback: (msg: string) => toast.error(msg),
    localeMessage: "Failed to load trips",
  });
  const locations = await getAllLocations({
    callback: (msg: string) => toast.info(msg),
    localeMessage: "Failed to load locations",
  });

  const northTrips = trips?.NORTH || [];
  const centralTrips = trips?.CENTRAL || [];
  const southTrips = trips?.SOUTH || [];

  return (
    <div className="h-full w-full bg-primary">
      <div className="bg-background w-full h-full absolute clip-bg lg:block hidden"></div>
      <div className="py-4 z-30 h-screen flex flex-col items-center justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 mx-auto items-center justify-center gap-6 md:gap-8 mb-6">
          <div className="text-wrap text-white">
            <h1 className="lg:text-8xl text-4xl font-extrabold mb-4 drop-shadow-lg font-[montserrat]">
              <FadeinWrapper effect="fade-in-left">Bustify</FadeinWrapper>
            </h1>
            <div className="text-2xl md:text-3xl font-bold drop-shadow-lg leading-tight">
              <FadeinWrapper effect="fade-in-l300">
                <LocaleText string="slogan" name="Home" />
              </FadeinWrapper>
            </div>
            <div className="text-lg md:text-xl font-semibold drop-shadow-md leading-tight">
              <FadeinWrapper effect="fade-in-l400">
                <LocaleText string="slogan2" name="Home" />
              </FadeinWrapper>
            </div>
          </div>
          <div className="relative aspect-video">
            <Image
              aria-label="background image2"
              src="/bus_img.png"
              fill
              // fetchPriority="high"
              loading="eager"
              placeholder="blur"
              blurDataURL="..."
              alt="Bus platform background"
            />
          </div>
        </div>
        <Card className="border-primary bg-background/95 backdrop-blur-sm shadow-2xl w-full max-w-5xl">
          <CardContent>
            <HomeSearchForm locations={locations} />
          </CardContent>
        </Card>
      </div>

      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              🎉 <LocaleText string="discountCampaigns" name="Home" />
            </h2>
            <p className="text-xl text-foreground/70">
              <LocaleText string="specialOffers" name="Home" />
            </p>
          </div>
          <DiscountSlider />
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 justify-center gap-6 w-full max-w-6xl mx-auto py-16 px-4 ">
        <div className="max-w-6xl mx-auto p-4 text-white">
          <h2 className="text-3xl font-bold text-center mb-2">
            <LocaleText string="north" name="Home" />
          </h2>
          <div className="flex flex-col justify-center items-center gap-6">
            {northTrips?.length < 1 ? (
              <p>
                <LocaleText string="noTrips" name="Home" />
              </p>
            ) : (
              northTrips.slice(0, 3).map((trip: TripItemProps) => (
                <div key={trip.trip_id} className="col-span-1">
                  <TripItem trip={trip} />
                </div>
              ))
            )}
          </div>
        </div>
        <div className="max-w-6xl mx-auto p-4 text-white">
          <h2 className="text-3xl font-bold text-center  mb-2">
            <LocaleText string="central" name="Home" />
          </h2>
          <div className="flex flex-col justify-center items-center gap-6">
            {centralTrips?.length < 1 ? (
              <p>
                <LocaleText string="noTrips" name="Home" />
              </p>
            ) : (
              centralTrips.slice(0, 3).map((trip: TripItemProps) => (
                <div key={trip.trip_id} className="col-span-1">
                  <TripItem trip={trip} />
                </div>
              ))
            )}
          </div>
        </div>
        <div className="max-w-6xl mx-auto p-4 text-white">
          <h2 className="text-3xl font-bold text-center mb-2">
            <LocaleText string="south" name="Home" />
          </h2>
          <div className="flex flex-col justify-center items-center gap-6">
            {southTrips?.length < 1 ? (
              <p>
                <LocaleText string="noTrips" name="Home" />
              </p>
            ) : (
              southTrips.slice(0, 3).map((trip: TripItemProps) => (
                <div key={trip.trip_id} className="col-span-1">
                  <TripItem trip={trip} />
                </div>
              ))
            )}
          </div>
        </div>
        <div className="text-center mt-12 col-span-full">
          <Button
            aria-label="See More Trips"
            size="lg"
            variant="outline"
            asChild
          >
            <Link href="/trips">
              <LocaleText string="moreTrips" name="Home" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Mobile App Section */}
      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-6">
                <LocaleText string="recommendText1" name="Home" />
              </h2>
              <p className="text-lg text-foreground mb-8">
                <LocaleText string="recommendText2" name="Home" />
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <Smartphone className="w-6 h-6 text-primary" />
                  <span className="text-foreground">
                    <LocaleText string="platformDesc1" name="Home" />
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Navigation className="w-6 h-6 text-primary" />
                  <span className="text-foreground">
                    <LocaleText string="platformDesc2" name="Home" />
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-6 h-6 text-primary" />
                  <span className="text-foreground">
                    <LocaleText string="platformDesc3" name="Home" />
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="w-6 h-6 text-primary" />
                  <span className="text-foreground">
                    <LocaleText string="platformDesc4" name="Home" />
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  aria-label="Download on App Store"
                  className="bg-secondary text-foreground hover:bg-accent/70 flex items-center justify-center space-x-2 px-6 py-3 rounded-lg transition-colors"
                >
                  <Download className="w-5 h-5" />
                  <span>
                    <LocaleText string="downloadAppStore" name="Home" />
                  </span>
                </Button>
                <Button
                  aria-label="Get it on Google Play"
                  className="bg-primary text-foreground hover:bg-primary/90 flex items-center justify-center space-x-2 px-6 py-3 rounded-lg transition-colors"
                >
                  <Download className="w-5 h-5" />
                  <span>
                    <LocaleText string="downloadGooglePlay" name="Home" />
                  </span>
                </Button>
              </div>
            </div>

            <div className="relative lg:pl-8">
              <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-8 shadow-2xl">
                <div className="bg-background rounded-xl p-6 shadow-lg">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-md">
                      <Smartphone className="w-6 h-6 text-foreground" />
                    </div>
                    <div>
                      <h3 className="font-bold text-primary text-lg">
                        Busify Mobile
                      </h3>
                      <p className="text-sm text-foreground">
                        Travel made simple
                      </p>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-foreground">
                        Ho Chi Minh → Da Lat
                      </span>
                      <Badge className="bg-primary text-foreground">
                        Booked
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground">Today, 8:30 AM</span>
                      <span className="font-semibold text-primary">$15</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-primary py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            <LocaleText string="customerReviews" name="Home" />
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-primary/20 bg-background shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar className="ring-2 ring-primary/20">
                    <AvatarImage alt="User Avatar" src="/avatar-holder.png" />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      JD
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg text-primary">
                      John Doe
                    </CardTitle>
                    <CardDescription className="text-primary/80">
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
                      className="w-4 h-4 fill-accent text-accent"
                    />
                  ))}
                </div>
                <p className="text-foreground italic">
                  &quot;
                  <LocaleText string="review1" name="Home" />
                  !&quot;
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-background shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar className="ring-2 ring-primary/20">
                    <AvatarImage alt="User Avatar" src="/avatar-holder.png" />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      SM
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg text-primary">
                      Sarah Miller
                    </CardTitle>
                    <CardDescription className="text-primary/80">
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
                      className="w-4 h-4 fill-accent text-accent"
                    />
                  ))}
                </div>
                <p className="text-foreground italic">
                  &quot;
                  <LocaleText string="review2" name="Home" />
                  .&quot;
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-background shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar className="ring-2 ring-primary/20">
                    <AvatarImage alt="User Avatar" src="/avatar-holder.png" />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      MJ
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg text-primary">
                      Mike Johnson
                    </CardTitle>
                    <CardDescription className="text-primary/80">
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
                      className="w-4 h-4 fill-accent text-accent"
                    />
                  ))}
                </div>
                <p className="text-foreground italic">
                  &quot;
                  <LocaleText string="review3" name="Home" />
                  &quot;
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-primary mb-12">
            <LocaleText string="frequentlyAskedQuestions" name="Home" />
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
      <section className="py-16 text-foreground relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-white/10 to-transparent"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl font-bold mb-4 text-white">
            <LocaleText string="getUpdate" name="Home" />
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8">
            <LocaleText string="getUpdateDesc" name="Home" />
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              placeholder="Enter your email address"
              className="bg-background text-foreground flex-1"
            />
            <Button
              aria-label="Subscribe to Newsletter"
              className="bg-background text-foreground font-semibold px-6 transition-colors"
            >
              <LocaleText string="subscribe" name="Home" />
            </Button>
          </div>

          <p className="text-sm text-primary-foreground/60 mt-6">
            <LocaleText string="subscribeTerm" name="Home" />
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Home;
