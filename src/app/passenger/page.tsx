import Footer from "@/components/custom/footer";
import Tips from "@/components/custom/tips";
import TripItem from "@/components/custom/trip_item";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ShoppingCart,
  CreditCard,
  Gift,
  Shield,
  Smartphone,
  MapPin,
  CheckCircle,
  Wallet,
  Ticket,
  Globe,
  HeartHandshake,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getUpcomingTrips } from "../../lib/data/trip";
import { getBusOperatorsRating } from "@/lib/data/bus_operator";
import BusOperatorItem, { BusOperatorItemProps } from "@/components/custom/bus_operator_item";

export interface TripItemProps {
  trip_id: number;
  operator_name: string;
  route: {
    start_location: string;
    end_location: string;
  };
  departure_time: string;
  arrival_time: string;
  available_seats: number;
  average_rating: number;
  price: number;
}
const Passenger = async () => {
  const res = await getUpcomingTrips();
  const busOperators = await getBusOperatorsRating();
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-600 to-green-700 text-white flex items-center">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to Busify</h1>
          <p className="text-green-100 mb-6">
            Your complete bus booking platform with secure payments, rewards,
            and seamless travel experience.
          </p>
          <Button
            size="lg"
            className="bg-white text-green-600 hover:bg-green-50"
          >
            <ShoppingCart className="mr-2 w-5 h-5" />
            <Link href="/passenger/app">Start Booking Now</Link>
          </Button>
        </div>
        <div className="sm::hidden mr-20">
          <Image
            src={"/busify-icon-white.png"}
            alt="Busify Logo"
            width={200}
            height={200}
          />
        </div>
      </div>

      {/* Platform Features */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
          Everything You Need for Seamless Travel
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Payment Features */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CreditCard className="w-12 h-12 text-green-600 mb-4" />
              <CardTitle className="text-green-700">Secure Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 mb-4">
                Multiple payment options with bank-level security. Pay with
                credit cards, digital wallets, or bank transfers.
              </CardDescription>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  SSL Encrypted Transactions
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Multiple Payment Methods
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Instant Payment Confirmation
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Rewards & Redemption */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Gift className="w-12 h-12 text-green-600 mb-4" />
              <CardTitle className="text-green-700">
                Rewards & Redemption
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 mb-4">
                Earn points with every booking and redeem them for discounts,
                free tickets, and exclusive perks.
              </CardDescription>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Earn 5% Points on Every Trip
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Instant Discount Redemption
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Member-Only Promotions
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Mobile App */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Smartphone className="w-12 h-12 text-green-600 mb-4" />
              <CardTitle className="text-green-700">
                Mobile Experience
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 mb-4">
                Book, track, and manage your trips on the go with our
                feature-rich mobile application.
              </CardDescription>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Real-time Bus Tracking
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Offline Ticket Access
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Push Notifications
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Customer Protection */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Shield className="w-12 h-12 text-green-600 mb-4" />
              <CardTitle className="text-green-700">
                Travel Protection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 mb-4">
                Comprehensive protection for your bookings with flexible
                cancellation and refund policies.
              </CardDescription>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Free Cancellation Options
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Trip Delay Compensation
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  24/7 Customer Support
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Digital Wallet */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Wallet className="w-12 h-12 text-green-600 mb-4" />
              <CardTitle className="text-green-700">Digital Wallet</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 mb-4">
                Store money securely in your Busify wallet for faster bookings
                and exclusive wallet-only deals.
              </CardDescription>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Instant Payments
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Wallet-Only Discounts
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Auto-Refunds to Wallet
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Loyalty Program */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <HeartHandshake className="w-12 h-12 text-green-600 mb-4" />
              <CardTitle className="text-green-700">Loyalty Program</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 mb-4">
                Join our loyalty program and unlock exclusive benefits as you
                travel more with Busify.
              </CardDescription>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Tier-Based Benefits
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Priority Customer Service
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Exclusive Route Access
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Payment Methods Section */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Flexible Payment Options
          </h2>

          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="text-center p-6">
              <CreditCard className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Credit & Debit Cards</h3>
              <p className="text-sm text-gray-600">
                Visa, Mastercard, American Express
              </p>
            </Card>

            <Card className="text-center p-6">
              <Smartphone className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Mobile Wallets</h3>
              <p className="text-sm text-gray-600">
                Apple Pay, Google Pay, Samsung Pay
              </p>
            </Card>

            <Card className="text-center p-6">
              <Wallet className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Digital Wallets</h3>
              <p className="text-sm text-gray-600">
                PayPal, Skrill, Busify Wallet
              </p>
            </Card>

            <Card className="text-center p-6">
              <Globe className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Bank Transfer</h3>
              <p className="text-sm text-gray-600">
                Direct bank transfers & UPI
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
          How Busify Works
        </h2>

        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">1. Search Routes</h3>
            <p className="text-sm text-gray-600">
              Find buses for your desired route and travel date
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Ticket className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">2. Select & Book</h3>
            <p className="text-sm text-gray-600">
              Choose your preferred bus and book your seats
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">3. Secure Payment</h3>
            <p className="text-sm text-gray-600">
              Pay securely using your preferred payment method
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">4. Travel & Enjoy</h3>
            <p className="text-sm text-gray-600">
              Get e-ticket and track your bus in real-time
            </p>
          </div>
        </div>
      </section>

      {/* Featured Trips */}
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Popular Trips Today
            </h2>
            <Button
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-50"
            >
              View All Trips
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
            {res.result
              .slice(0, 4)
              .map((trip: TripItemProps, index: number) => (
                <TripItem key={index} trip={trip} />
              ))}
          </div>
        </div>
      </section>

      {/* Trusted Operators */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Trusted Bus Operators
          </h2>
          <Button
            variant="outline"
            className="border-green-600 text-green-600 hover:bg-green-50"
          >
            View All Operators
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* {trips.slice(0, 6).map((busOperator) => (
            <BusOperatorItem key={busOperator.id} busOperator={busOperator} />
          ))} */}
          {busOperators.result.map((operator: BusOperatorItemProps) => (
            <BusOperatorItem key={operator.id} busOperator={operator} />
          ))}
        </div>
      </section>
      <Tips />
      <Footer />
    </div>
  );
};

export default Passenger;
