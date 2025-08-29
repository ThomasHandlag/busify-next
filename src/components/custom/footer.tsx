import Link from "next/link";
import Image from "next/image";
import { SiFacebook, SiZalo, SiDiscord, SiInstagram } from "react-icons/si";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-green-800 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Image src="/logo.svg" width={40} height={40} alt="Busify Logo" />
              <span className="text-2xl font-bold text-green-300">Busify</span>
            </div>
            <p className="text-green-100 text-sm leading-relaxed">
              Your trusted platform connecting travelers with reliable bus providers across the nation. 
              Book tickets easily and travel with confidence.
            </p>
            <div className="flex space-x-3">
              <Link aria-label="Facebook" href="#" className="text-green-300 hover:text-white transition-colors">
                <SiFacebook size={24} />
              </Link>
              <Link aria-label="Instagram" href="#" className="text-green-300 hover:text-white transition-colors">
                <SiInstagram size={24} />
              </Link>
              <Link aria-label="Discord" href="#" className="text-green-300 hover:text-white transition-colors">
                <SiDiscord size={24} />
              </Link>
              <Link aria-label="Zalo" href="#" className="text-green-300 hover:text-white transition-colors">
                <SiZalo size={24} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-300">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link aria-label="Home" href="/" className="text-green-100 hover:text-white transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link aria-label="Tickets" href="/trips" className="text-green-100 hover:text-white transition-colors text-sm">
                  Book Tickets
                </Link>
              </li>
              <li>
                <Link aria-label="Bus Providers" href="/providers" className="text-green-100 hover:text-white transition-colors text-sm">
                  Bus Providers
                </Link>
              </li>
              <li>
                <Link aria-label="Become a Partner" href="/partner" className="text-green-100 hover:text-white transition-colors text-sm">
                  Become a Partner
                </Link>
              </li>
              <li>
                <Link aria-label="About Us" href="/about" className="text-green-100 hover:text-white transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link aria-label="Contact" href="/contact" className="text-green-100 hover:text-white transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-300">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link aria-label="Help Center" href="/help" className="text-green-100 hover:text-white transition-colors text-sm">
                  Help Center
                </Link>
              </li>
              <li>
                <Link aria-label="FAQ" href="/faq" className="text-green-100 hover:text-white transition-colors text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link aria-label="Booking Guide" href="/booking-guide" className="text-green-100 hover:text-white transition-colors text-sm">
                  Booking Guide
                </Link>
              </li>
              <li>
                <Link aria-label="Privacy Policy" href="/privacy" className="text-green-100 hover:text-white transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link aria-label="Terms of Service" href="/terms" className="text-green-100 hover:text-white transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link aria-label="Refund Policy" href="/refund" className="text-green-100 hover:text-white transition-colors text-sm">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-300">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-green-300 mt-0.5 flex-shrink-0" />
                <p className="text-green-100 text-sm">
                  123 Transportation Hub<br />
                  Ho Chi Minh City, Vietnam
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-green-300 flex-shrink-0" />
                <p className="text-green-100 text-sm">+84 123 456 789</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-green-300 flex-shrink-0" />
                <p className="text-green-100 text-sm">support@busify.com</p>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-green-300 mt-0.5 flex-shrink-0" />
                <div className="text-green-100 text-sm">
                  <p>24/7 Customer Support</p>
                  <p className="text-xs text-green-200">Always here to help</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-green-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-green-200 text-sm">
              © 2025 Busify. All rights reserved. | Connecting travelers with trusted bus providers.
            </p>
            <div className="flex space-x-6">
              <Link aria-label="Sitemap" href="/sitemap" className="text-green-200 hover:text-white text-sm transition-colors">
                Sitemap
              </Link>
              <Link aria-label="Accessibility" href="/accessibility" className="text-green-200 hover:text-white text-sm transition-colors">
                Accessibility
              </Link>
              <Link aria-label="Cookies" href="/cookies" className="text-green-200 hover:text-white text-sm transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;