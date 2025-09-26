import Link from "next/link";
import { SiFacebook, SiZalo, SiDiscord, SiInstagram } from "react-icons/si";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useTranslations } from "next-intl";
import Logo from "./logo";

const Footer = () => {
  const t = useTranslations();
  return (
    <footer className="text-foreground bg-background">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Logo width={32} height={32} />
              <span className="text-2xl font-bold text-accent">Busify</span>
            </div>
            <p className="text-accent text-sm leading-relaxed">
              {t("Footer.companyInfo")}
            </p>
            <div className="flex space-x-3">
              <Link
                aria-label="Facebook"
                href="#"
                className="text-accent hover:text-secondary-foreground transition-colors"
              >
                <SiFacebook size={24} />
              </Link>
              <Link
                aria-label="Instagram"
                href="#"
                className="text-accent hover:text-secondary-foreground transition-colors"
              >
                <SiInstagram size={24} />
              </Link>
              <Link
                aria-label="Discord"
                href="#"
                className="text-accent hover:text-secondary-foreground transition-colors"
              >
                <SiDiscord size={24} />
              </Link>
              <Link
                aria-label="Zalo"
                href="#"
                className="text-accent hover:text-secondary-foreground transition-colors"
              >
                <SiZalo size={24} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-accent">
              {t("Footer.usefulLinks")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  aria-label={t("Header.home")}
                  href="/"
                  className="text-accent-foreground hover:text-secondary-foreground transition-colors text-sm"
                >
                  {t("Header.home")}
                </Link>
              </li>
              <li>
                <Link
                  aria-label={t("Trips.tripItem.bookTrip")}
                  href="/trips"
                  className="text-accent-foreground hover:text-secondary-foreground transition-colors text-sm"
                >
                  {t("Trips.tripItem.bookTrip")}
                </Link>
              </li>
              <li>
                <Link
                  aria-label={t("Trips.operators")}
                  href="/providers"
                  className="text-accent-foreground hover:text-secondary-foreground transition-colors text-sm"
                >
                  {t("Trips.operators")}
                </Link>
              </li>
              <li>
                <Link
                  aria-label={t("Footer.partners")}
                  href="/partner"
                  className="text-accent-foreground hover:text-secondary-foreground transition-colors text-sm"
                >
                  {t("Footer.partners")}
                </Link>
              </li>
              <li>
                <Link
                  aria-label={t("Header.about")}
                  href="/about"
                  className="text-accent-foreground hover:text-secondary-foreground transition-colors text-sm"
                >
                  {t("Header.about")}
                </Link>
              </li>
              <li>
                <Link
                  aria-label={t("Header.about")}
                  href="/blog"
                  className="text-accent-foreground hover:text-secondary-foreground transition-colors text-sm"
                >
                  {t("Header.blog")}
                </Link>
              </li>
              <li>
                <Link
                  aria-label={t("Header.contact")}
                  href="/contact"
                  className="text-accent-foreground hover:text-secondary-foreground transition-colors text-sm"
                >
                  {t("Header.contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-accent">
              {t("Footer.support")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  aria-label={t("Footer.helpCenter")}
                  href="/help"
                  className="text-accent-foreground hover:text-secondary-foreground transition-colors text-sm"
                >
                  {t("Footer.helpCenter")}
                </Link>
              </li>
              <li>
                <Link
                  aria-label={t("Footer.faq")}
                  href="/faq"
                  className="text-accent-foreground hover:text-secondary-foreground transition-colors text-sm"
                >
                  {t("Footer.faq")}
                </Link>
              </li>
              <li>
                <Link
                  aria-label={t("Footer.guides")}
                  href="/booking-guide"
                  className="text-accent-foreground hover:text-secondary-foreground transition-colors text-sm"
                >
                  {t("Footer.guides")}
                </Link>
              </li>
              <li>
                <Link
                  aria-label={t("Header.privacyPolicy")}
                  href="/privacy"
                  className="text-accent-foreground hover:text-secondary-foreground transition-colors text-sm"
                >
                  {t("Header.privacyPolicy")}
                </Link>
              </li>
              <li>
                <Link
                  aria-label={t("Header.termsOfService")}
                  href="/terms"
                  className="text-accent-foreground hover:text-secondary-foreground transition-colors text-sm"
                >
                  {t("Header.termsOfService")}
                </Link>
              </li>
              <li>
                <Link
                  aria-label={t("Header.refundPolicy")}
                  href="/refund"
                  className="text-accent-foreground hover:text-secondary-foreground transition-colors text-sm"
                >
                  {t("Header.refundPolicy")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-accent">
              {t("Header.contact")}
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <p className="text-accent-foreground text-sm">
                  {t("Footer.address")}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-accent flex-shrink-0" />
                <p className="text-accent-foreground text-sm">
                  {t("Footer.phone")}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-accent flex-shrink-0" />
                <p className="text-accent-foreground text-sm">
                  {t("Footer.email")}
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <div className="text-accent-foreground text-sm">
                  <p>{t("Footer.supportHours")}</p>
                  <p className="text-xs text-accent-foreground">
                    {t("Footer.supportMessage")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-accent">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-accent-foreground text-sm">
              {t("Footer.copyright")}
            </p>
            <div className="flex space-x-6">
              <Link
                aria-label={t("Footer.sitemap")}
                href="/sitemap"
                className="text-accent-foreground hover:text-secondary-foreground text-sm transition-colors"
              >
                {t("Footer.sitemap")}
              </Link>
              <Link
                aria-label={t("Footer.accessibility")}
                href="/accessibility"
                className="text-accent-foreground hover:text-secondary-foreground text-sm transition-colors"
              >
                {t("Footer.accessibility")}
              </Link>
              <Link
                aria-label={t("Footer.cookies")}
                href="/cookies"
                className="text-accent-foreground hover:text-secondary-foreground text-sm transition-colors"
              >
                {t("Footer.cookies")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
