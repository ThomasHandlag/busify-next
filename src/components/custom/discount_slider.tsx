"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import {
  getCurrentPromotionCampaigns,
  type PromotionCampaign,
} from "@/lib/data/promotion";

interface DiscountCampaign {
  id: string;
  title: string;
  description: string;
  banner: string;
}

import { useTranslations } from "next-intl";

export default function DiscountSlider() {
  const t = useTranslations();
  const [campaigns, setCampaigns] = useState<DiscountCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: campaigns.length > 1, // Only loop if more than 1 campaign
    align: "center",
    slidesToScroll: 1,
  });

  // Update selected index when slide changes
  useEffect(() => {
    if (!emblaApi) return;

    const updateSelectedIndex = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", updateSelectedIndex);
    updateSelectedIndex(); // Set initial index

    return () => {
      emblaApi.off("select", updateSelectedIndex);
    };
  }, [emblaApi]);

  // Fetch promotion campaigns from API
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const apiCampaigns = await getCurrentPromotionCampaigns();

        console.log("API campaigns fetched:", apiCampaigns); // Debug log

        if (apiCampaigns.length > 0) {
          const mappedCampaigns: DiscountCampaign[] = apiCampaigns.map(
            (campaign: PromotionCampaign) => ({
              id: campaign.campaignId.toString(),
              title: campaign.title,
              description: campaign.description,
              banner: campaign.bannerUrl,
            })
          );
          console.log("Mapped campaigns:", mappedCampaigns); // Debug log
          setCampaigns(mappedCampaigns);
        } else {
          // No active campaigns found
          setCampaigns([]);
        }
        setError(null);
      } catch (err) {
        console.error("Failed to fetch campaigns:", err);
        setError("Không thể tải dữ liệu khuyến mãi");
        // Set empty campaigns on error
        setCampaigns([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  // Simple autoplay with setInterval
  useEffect(() => {
    if (!emblaApi || campaigns.length <= 1) return; // Don't autoplay with single item

    const autoplay = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);

    return () => clearInterval(autoplay);
  }, [emblaApi, campaigns.length]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (loading) {
    return (
      <div className="relative">
        <div className="rounded-2xl overflow-hidden h-64 md:h-72 lg:h-80 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-3" />
              <span className="text-gray-500 text-base font-medium">
                {t("Promotion.loading")}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && campaigns.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-red-600 mb-4">{t("Promotion.loadErrorShort")}</p>
        <p className="text-gray-600">{t("Promotion.loadErrorLong")}</p>
      </div>
    );
  }

  // Don't render if no campaigns
  if (!loading && campaigns.length === 0) {
    return null;
  }

  return (
    <div className="relative group">
      <div className="overflow-hidden rounded-2xl shadow-lg" ref={emblaRef}>
        <div className="flex">
          {campaigns.map((campaign, index) => (
            <div key={campaign.id} className="flex-[0_0_100%] min-w-0">
              <div className="relative overflow-hidden h-64 md:h-72 lg:h-80">
                <Image
                  aria-label="Image41"
                  src={campaign.banner}
                  alt={campaign.title ?? "Promotion Banner"}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  priority={index === 0}
                  quality={90}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
                {/* Gradient overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/15 via-transparent to-black/15"></div>

                <div className="relative z-10 flex items-center justify-center h-full p-6 md:p-8">
                  <div className="text-center text-white max-w-3xl animate-fade-in">
                    <div className="mb-3">
                      <span className="inline-block px-3 py-1.5 bg-red-500/90 backdrop-blur-sm rounded-full text-xs font-semibold uppercase tracking-wider shadow-lg">
                        🔥 Khuyến mãi hot
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 drop-shadow-2xl leading-tight">
                      {campaign.title}
                    </h2>
                    <p className="text-sm md:text-base lg:text-lg mb-6 drop-shadow-lg opacity-90 leading-relaxed">
                      {campaign.description}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                      <Button
                        aria-label="Book Discounted Ticket"
                        size="default"
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold px-6 py-2.5 rounded-full shadow-xl transform hover:scale-105 transition-all duration-300 border-0 text-sm"
                        asChild
                      >
                        <Link href="/trips?promotion=active">
                          🎫 Đặt vé ngay
                        </Link>
                      </Button>
                      <Button
                        aria-label="Learn More About Promotion"
                        variant="outline"
                        size="default"
                        className="border-2 border-white/50 text-white hover:bg-white/10 backdrop-blur-sm font-semibold px-5 py-2.5 rounded-full shadow-lg transition-all duration-300 text-sm"
                        asChild
                      >
                        <Link href="/about">Tìm hiểu thêm</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation buttons - Only show if more than 1 campaign */}
      {campaigns.length > 1 && (
        <>
          <button
            onClick={scrollPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-md transition-all duration-300 shadow-lg border border-white/20 hover:scale-110 opacity-0 group-hover:opacity-100"
            aria-label={t("Promotion.prevCampaign")}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-md transition-all duration-300 shadow-lg border border-white/20 hover:scale-110 opacity-0 group-hover:opacity-100"
            aria-label={t("Promotion.nextCampaign")}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dots indicator - Only show if more than 1 campaign */}
      {campaigns.length > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {campaigns.map((_, index) => (
            <button
              key={index}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 shadow-md hover:scale-125 ${
                selectedIndex === index
                  ? "bg-white shadow-white/50"
                  : "bg-white/40 hover:bg-white/80"
              }`}
              aria-label={t("Promotion.gotoCampaign", { number: index + 1 })}
              onClick={() => emblaApi?.scrollTo(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
