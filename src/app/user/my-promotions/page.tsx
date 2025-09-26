"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import {
  getCurrentPromotionCampaigns,
  getCurrentPromotions,
  type Promotion,
} from "@/lib/data/promotion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Gift, Loader2, Tag } from "lucide-react";
import Script from "next/script";
import PromotionRow from "@/components/custom/promotion/PromotionRow";
import { useTranslations } from "next-intl";
import { BASE_URL } from "@/lib/constants/constants";

export default function PromotionsPage() {
  const [allPromotions, setAllPromotions] = useState<
    (Promotion & { campaignTitle?: string })[]
  >([]);
  const [usedPromotionIds, setUsedPromotionIds] = useState<number[]>([]);
  const [hideUsed, setHideUsed] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<"start" | "discount" | "minOrder">(
    "start"
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const t = useTranslations("Promotion");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const [camps, promos] = await Promise.all([
          getCurrentPromotionCampaigns(),
          getCurrentPromotions(),
        ]);
        const standalone = (promos || []).filter(
          (p) => !p.campaignId && p.status === "active"
        );
        const campaignPromos: (Promotion & { campaignTitle?: string })[] = (
          camps || []
        )
          .filter((c) => c.active && !c.deleted)
          .flatMap((c) =>
            (c.promotions || [])
              .filter((p) => p.status === "active")
              .map((p) => ({ ...p, campaignTitle: c.title }))
          );
        const standaloneWith: (Promotion & { campaignTitle?: string })[] =
          standalone.map((p) => ({ ...p, campaignTitle: undefined }));
        const merged: (Promotion & { campaignTitle?: string })[] = [
          ...campaignPromos,
          ...standaloneWith,
        ];
        merged.sort((a, b) => {
          const aCamp = a.campaignTitle ? 1 : 0;
          const bCamp = b.campaignTitle ? 1 : 0;
          if (aCamp !== bCamp) return bCamp - aCamp;
          return (
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
          );
        });
        setAllPromotions(merged);
        if (session?.user?.accessToken) {
          try {
            const res = await fetch(
              `${BASE_URL}api/promotions/user/used`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${session.user.accessToken}`,
                },
                credentials: "include",
              }
            );
            if (res.ok) {
              const data = await res.json();
              if (data?.code === 200 && Array.isArray(data.result)) {
                const ids = data.result.map(
                  (item: { promotionId: number }) => item.promotionId
                );
                setUsedPromotionIds(ids);
              }
            }
          } catch {
            // Ignore errors
          }
        } else {
          setUsedPromotionIds([]);
        }
      } catch (e: unknown) {
        const message =
          e instanceof Error ? e.message : "Failed to load promotions";
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [session?.user?.accessToken]);

  const hasAny = useMemo(
    () => (allPromotions?.length || 0) > 0,
    [allPromotions]
  );

  const visiblePromotions = useMemo(() => {
    let items = [...allPromotions];
    if (hideUsed) {
      items = items.filter((p) => !usedPromotionIds.includes(p.id));
    }
    if (sortBy === "discount") {
      items.sort((a, b) => {
        const av =
          a.discountType === "PERCENTAGE"
            ? a.discountValue
            : a.discountValue / 1000;
        const bv =
          b.discountType === "PERCENTAGE"
            ? b.discountValue
            : b.discountValue / 1000;
        return bv - av;
      });
    } else if (sortBy === "minOrder") {
      items.sort((a, b) => {
        const av = typeof a.minOrderValue === "number" ? a.minOrderValue : 0;
        const bv = typeof b.minOrderValue === "number" ? b.minOrderValue : 0;
        return av - bv;
      });
    } else {
      items.sort(
        (a, b) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );
    }
    return items;
  }, [allPromotions, hideUsed, sortBy, usedPromotionIds]);

  return (
    <>
      <Script
        src="https://www.youtube.com/iframe_api"
        strategy="afterInteractive"
      />
      <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Tag className="w-6 h-6 text-primary" />
            {t("pageTitle")}
          </h1>
          <p className="text-muted-foreground">{t("pageSubtitle")}</p>
          <div className="mt-3 flex items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={hideUsed}
                onCheckedChange={(v) => setHideUsed(Boolean(v))}
              />
              {t("hideUsedLabel")}
            </label>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">{t("sortLabel")}</span>
              <Select
                value={sortBy}
                onValueChange={(v: "start" | "discount" | "minOrder") =>
                  setSortBy(v)
                }
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder={t("sortLabel")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="start">{t("sortStart")}</SelectItem>
                  <SelectItem value="discount">{t("sortDiscount")}</SelectItem>
                  <SelectItem value="minOrder">{t("sortMinOrder")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {loading ? (
            <div className="flex items-center gap-2 text-primary">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>{t("loading")}</span>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">
              {error}
            </div>
          ) : !hasAny ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-primary" />
                  {t("pageTitle")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{t("noActivePromotions")}</p>
              </CardContent>
            </Card>
          ) : (
            visiblePromotions.map((p) => (
              <PromotionRow
                key={p.id}
                promotion={p as Promotion & { campaignTitle?: string }}
                isUsed={usedPromotionIds.includes(p.id)}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
}
