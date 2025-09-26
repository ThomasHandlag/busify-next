import {
  ConditionType,
  getPromotionConditions,
  Promotion,
  PromotionCondition,
  updateConditionProgress,
  updateConditionProgressClient,
  getUserConditionProgress,
} from "@/lib/data/promotion";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Info,
  Loader2,
  Video,
  BarChart2,
  Users,
  CheckCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Script from "next/script";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

// Define YouTube API types
interface YouTubePlayer {
  getCurrentTime: () => number;
  getDuration: () => number;
}

interface YouTubeAPI {
  Player: new (el: string | HTMLElement, opts: unknown) => YouTubePlayer;
}

declare global {
  interface Window {
    YT?: YouTubeAPI;
    onYouTubeIframeAPIReady?: () => void;
  }
}

const PromotionRow = ({
  promotion,
  isUsed,
}: {
  promotion: Promotion & { campaignTitle?: string };
  isUsed?: boolean;
}) => {
  const session = useSession();

  const [conditions, setConditions] = useState<PromotionCondition[] | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [activeVideoConditionId, setActiveVideoConditionId] = useState<
    number | null
  >(null);
  const [localProgress, setLocalProgress] = useState<Record<number, boolean>>(
    {}
  );
  const [serverProgress, setServerProgress] = useState<Record<number, boolean>>(
    {}
  );
  // keep progress per conditionId in case multiple videos exist
  const [videoProgress, setVideoProgress] = useState<Record<number, number>>(
    {}
  );

  // Refs to avoid effect re-runs and preserve latest values inside callbacks
  const ytPlayerRef = useRef<YouTubePlayer | null>(null);
  const videoTrackerRef = useRef<number | null>(null);
  const activeVideoConditionIdRef = useRef<number | null>(null);
  const conditionsRef = useRef<PromotionCondition[] | null>(null);
  const localProgressRef = useRef<Record<number, boolean>>({});
  const sessionTokenRef = useRef<string | undefined>(undefined);
  const [videoPlayer, setVideoPlayer] = useState<YouTubePlayer | null>(null);
  const isPercentage = promotion.discountType === "PERCENTAGE";
  const [isClaimed, setIsClaimed] = useState(false);
  const claimedToastShownRef = useRef(false);
  const t = useTranslations("Promotion");

  const formatCurrency = (value: number) =>
    `${value?.toLocaleString("vi-VN")}đ`;

  const hasConditions =
    Array.isArray(promotion.conditions) && promotion.conditions.length > 0;
  const minOrderText =
    typeof promotion.minOrderValue === "number" && promotion.minOrderValue > 0
      ? formatCurrency(promotion.minOrderValue)
      : t("noLimit") ?? "Không giới hạn";
  const playerReady = useRef<((player: YouTubePlayer) => void)[]>([]);
  const progressSentRef = useRef<Record<number, boolean>>({});

  // keep refs in sync with state
  useEffect(() => {
    conditionsRef.current = conditions;
  }, [conditions]);

  useEffect(() => {
    localProgressRef.current = localProgress;
  }, [localProgress]);

  useEffect(() => {
    activeVideoConditionIdRef.current = activeVideoConditionId;
  }, [activeVideoConditionId]);

  useEffect(() => {
    sessionTokenRef.current = session.data?.user?.accessToken;
  }, [session.data?.user?.accessToken]);

  const fetchConditions = async () => {
    try {
      setLoading(true);
      const conds = await getPromotionConditions(promotion.id);
      setConditions(conds);
      // If promotion has no conditions, mark as claimed immediately
      if (!conds || conds.length === 0) {
        if (!claimedToastShownRef.current) {
          toast.success(t("claimedToast"));
          claimedToastShownRef.current = true;
        }
        setIsClaimed(true);
      }
      // hydrate progress from server for current user
      if (session.data?.user?.accessToken) {
        const progresses = await getUserConditionProgress(
          session.data.user.accessToken
        );
        const map: Record<number, boolean> = {};
        progresses
          .filter((p) => p.promotionId === promotion.id)
          .forEach((p) => {
            map[p.conditionId] = !!p.isCompleted;
          });
        setServerProgress(map);
        setLocalProgress((prev) => ({ ...map, ...prev }));
      }
    } finally {
      setLoading(false);
    }
  };

  // Prefetch conditions and user progress so the claimed state is visible without opening dialog
  useEffect(() => {
    let isMounted = true;
    const prefetch = async () => {
      try {
        const conds = await getPromotionConditions(promotion.id);
        if (!isMounted) return;
        setConditions(conds);

        if (!conds || conds.length === 0) {
          setIsClaimed(true);
          return;
        }

        if (session.data?.user?.accessToken) {
          const progresses = await getUserConditionProgress(
            session.data.user.accessToken
          );
          if (!isMounted) return;
          const map: Record<number, boolean> = {};
          progresses
            .filter((p) => p.promotionId === promotion.id)
            .forEach((p) => {
              map[p.conditionId] = !!p.isCompleted;
            });
          setServerProgress(map);
          setLocalProgress((prev) => ({ ...map, ...prev }));

          // Compute claimed status
          const isAllRequiredDone = (conds || [])
            .filter((c) => c.isRequired)
            .every((c) => !!map[c.conditionId]);
          if (isAllRequiredDone) {
            setIsClaimed(true);
          }
        }
      } catch {
        // ignore prefetch errors
      }
    };
    prefetch();
    return () => {
      isMounted = false;
    };
  }, [promotion.id, session.data?.user?.accessToken]);

  // Watch progress changes and mark as claimed when all required conditions are completed
  useEffect(() => {
    if (!conditions || conditions.length === 0) return;
    const isAllRequiredDone = conditions
      .filter((c) => c.isRequired)
      .every(
        (c) => !!(localProgress[c.conditionId] || serverProgress[c.conditionId])
      );

    if (isAllRequiredDone && !isClaimed) {
      setIsClaimed(true);
      if (!claimedToastShownRef.current) {
        toast.success(t("claimedToast"));
        claimedToastShownRef.current = true;
      }
    }
  }, [conditions, localProgress, serverProgress, isClaimed]);

  useEffect(() => {
    return () => {
      if (videoTrackerRef.current) {
        clearInterval(videoTrackerRef.current);
        videoTrackerRef.current = null;
      }
      // destroy player on unmount
      try {
        if (
          ytPlayerRef.current &&
          "destroy" in
            (ytPlayerRef.current as unknown as { destroy?: () => void }) &&
          typeof (ytPlayerRef.current as unknown as { destroy?: () => void })
            .destroy === "function"
        ) {
          (ytPlayerRef.current as unknown as { destroy: () => void }).destroy();
          ytPlayerRef.current = null;
        }
      } catch {}
    };
  }, []);

  const initializePlayer = useCallback(
    (videoId: string) => {
      if (!window.YT || !window.YT.Player) {
        // Queue the player creation until the API is ready
        playerReady.current.push((player) => {
          setVideoPlayer(player);
          ytPlayerRef.current = player;
        });
        return;
      }

      new window.YT.Player(`yt-player-${promotion.id}`, {
        videoId,
        events: {
          onReady: (e: { target: YouTubePlayer }) => {
            // create an interval to track progress
            const tracker = window.setInterval(() => {
              try {
                const current = e.target.getCurrentTime();
                const total = e.target.getDuration() || 0;
                if (total > 0) {
                  const ratio = Math.min(1, current / total);
                  // update progress only for the active condition id
                  const condId = activeVideoConditionIdRef.current ?? null;
                  if (condId != null) {
                    setVideoProgress((prev) => ({ ...prev, [condId]: ratio }));
                  }

                  // use refs to access latest values
                  // prefer the active condition id (the one user clicked), otherwise try to match by videoId
                  const cond =
                    (conditionsRef.current || []).find(
                      (x) => x.conditionId === activeVideoConditionIdRef.current
                    ) ||
                    (conditionsRef.current || []).find(
                      (x) =>
                        extractYouTubeId(String(x.conditionValue)) === videoId
                    );
                  const localProg = localProgressRef.current || {};
                  if (
                    cond &&
                    ratio >= 0.8 &&
                    !localProg[cond.conditionId] &&
                    !progressSentRef.current[cond.conditionId]
                  ) {
                    progressSentRef.current[cond.conditionId] = true;
                    // optimistically set local progress
                    setLocalProgress((s) => ({
                      ...s,
                      [cond.conditionId]: true,
                    }));

                    updateConditionProgressClient(
                      cond.conditionId,
                      JSON.stringify({ viewed: true, progress: ratio }),
                      sessionTokenRef.current ?? ""
                    )
                      .catch(() => {
                        // revert flag on failure
                        progressSentRef.current[cond.conditionId] = false;
                        setLocalProgress((s) => ({
                          ...s,
                          [cond.conditionId]: false,
                        }));
                      })
                      .finally(() => {
                        // stop tracking further once sent successfully
                        if (videoTrackerRef.current) {
                          clearInterval(videoTrackerRef.current);
                          videoTrackerRef.current = null;
                        }
                      });
                  }
                }
              } catch {}
            }, 1000);

            videoTrackerRef.current = tracker;
            setVideoPlayer(e.target);
            ytPlayerRef.current = e.target;
            playerReady.current.forEach((cb) => cb(e.target));
            playerReady.current = [];
          },
          onStateChange: (ev: { data: number }) => {
            if (ev?.data === 0 && videoTrackerRef.current) {
              clearInterval(videoTrackerRef.current);
              videoTrackerRef.current = null;
            }
          },
        },
      });
    },
    [promotion.id]
  );

  function extractYouTubeId(input: string): string | null {
    if (!input) return null;

    try {
      const params = new URLSearchParams(input);
      const v = params.get("v");
      if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) {
        return v;
      }
      return null;
    } catch {
      return null;
    }
  }

  useEffect(() => {
    if (!activeVideoId) return;

    // destroy any existing player/tracker before creating a new one
    try {
      if (
        ytPlayerRef.current &&
        "destroy" in
          (ytPlayerRef.current as unknown as { destroy?: () => void }) &&
        typeof (ytPlayerRef.current as unknown as { destroy?: () => void })
          .destroy === "function"
      ) {
        (ytPlayerRef.current as unknown as { destroy: () => void }).destroy();
        ytPlayerRef.current = null;
      }
    } catch {}

    if (videoTrackerRef.current) {
      clearInterval(videoTrackerRef.current);
      videoTrackerRef.current = null;
    }

    // reset progress map when switching videos
    setVideoProgress({});

    // Nếu API đã load thì khởi tạo luôn
    if (window.YT && window.YT.Player) {
      initializePlayer(activeVideoId);
    } else {
      // Nếu chưa load, đợi callback
      window.onYouTubeIframeAPIReady = () => {
        initializePlayer(activeVideoId);
      };
    }
    // only run when activeVideoId changes or initializePlayer identity changes
  }, [activeVideoId, initializePlayer]);

  return (
    <>
      <Script
        src="https://www.youtube.com/iframe_api"
        strategy="afterInteractive"
      />
      <Card className="border border-border">
        <CardContent className="p-4 flex items-start justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              {promotion.campaignTitle && (
                <Badge
                  variant="outline"
                  className="border-primary/30 text-primary"
                >
                  {promotion.campaignTitle}
                </Badge>
              )}
              <Badge className="bg-primary text-primary-foreground">
                {isPercentage
                  ? `${promotion.discountValue}%`
                  : `${formatCurrency(promotion.discountValue)}`}
              </Badge>
              <Badge variant="secondary">
                {t("minOrderPrefix")} {minOrderText}
              </Badge>
              {promotion.code && (
                <Badge variant="outline">
                  {t("codeLabel")}: {promotion.code}
                </Badge>
              )}
              {isUsed && (
                <Badge
                  variant="outline"
                  className="border-gray-300 text-gray-600"
                >
                  {t("usedBadge")}
                </Badge>
              )}
              {isClaimed && !isUsed && (
                <Badge
                  variant="outline"
                  className="border-emerald-300 text-emerald-700"
                >
                  {t("claimedBadge")}
                </Badge>
              )}
              {!hasConditions && (
                <Badge
                  variant="outline"
                  className="border-green-200 text-green-700"
                >
                  {t("noRequirementBadge")}
                </Badge>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              {t("validity")}{" "}
              {new Date(promotion.startDate).toLocaleDateString("vi-VN")} -{" "}
              {new Date(promotion.endDate).toLocaleDateString("vi-VN")}
            </div>
          </div>
          {hasConditions && (
            <Dialog
              onOpenChange={(open) => {
                if (!open) {
                  setActiveVideoId(null);
                  setActiveVideoConditionId(null);
                  if (
                    videoPlayer &&
                    "destroy" in
                      (videoPlayer as unknown as { destroy?: () => void }) &&
                    typeof (videoPlayer as unknown as { destroy?: () => void })
                      .destroy === "function"
                  ) {
                    (
                      videoPlayer as unknown as { destroy: () => void }
                    ).destroy();
                    setVideoPlayer(null);
                  }
                  // reset all in-flight flags when dialog closes
                  progressSentRef.current = {};
                  setLocalProgress({});
                }
              }}
            >
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" onClick={fetchConditions}>
                  <Info className="w-4 h-4 mr-1" /> {t("conditionsButton")}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{t("conditionsTitle")}</DialogTitle>
                </DialogHeader>
                {loading ? (
                  <div className="flex items-center gap-2 text-primary">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t("loading")}</span>
                  </div>
                ) : conditions && conditions.length > 0 ? (
                  <div className="space-y-4">
                    <ul className="space-y-3">
                      {conditions.map((c) => {
                        const isVideo =
                          c.conditionType === ConditionType.VIEW_VIDEO;
                        const isAd = c.conditionType === ConditionType.WATCH_AD;
                        const isSurvey =
                          c.conditionType === ConditionType.COMPLETE_SURVEY;
                        const isReferral =
                          c.conditionType === ConditionType.REFERRAL_COUNT;
                        const isFirst =
                          c.conditionType === ConditionType.FIRST_PURCHASE;
                        const youTubeId = isVideo
                          ? extractYouTubeId(String(c.conditionValue))
                          : null;

                        const adUrl = isAd
                          ? `https://ads.busify.vn/watch/${c.conditionValue}`
                          : undefined;
                        const surveyUrl = isSurvey
                          ? `https://survey.busify.vn/s/${c.conditionValue}`
                          : undefined;

                        const completed = !!(
                          localProgress[c.conditionId] ||
                          serverProgress[c.conditionId]
                        );

                        const icon = isVideo
                          ? Video
                          : isAd
                          ? BarChart2
                          : isSurvey
                          ? Users
                          : CheckCircle;

                        const label = isVideo
                          ? t("viewVideoLabel")
                          : isAd
                          ? t("watchAdLabel")
                          : isSurvey
                          ? t("surveyLabel")
                          : isReferral
                          ? t("referralLabel", { count: c.conditionValue })
                          : isFirst
                          ? t("firstPurchaseLabel")
                          : t("activityLabel");

                        return (
                          <li
                            key={c.conditionId}
                            className="flex items-start justify-between gap-4"
                          >
                            <div className="flex items-start gap-3">
                              <div className="mt-1">
                                {React.createElement(icon, {
                                  className: `w-5 h-5 text-muted-foreground ${
                                    completed ? "text-emerald-500" : ""
                                  }`,
                                })}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <div className="font-medium text-sm">
                                    {label}
                                  </div>
                                  {c.isRequired && (
                                    <Badge variant="secondary">
                                      {t("requiredBadge")}
                                    </Badge>
                                  )}
                                  {completed && (
                                    <Badge className="ml-1" variant="outline">
                                      {t("completedBadge")}
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {isVideo && youTubeId
                                    ? t("viewAtLeast")
                                    : isAd
                                    ? t("watchAdDesc")
                                    : isSurvey
                                    ? t("surveyDesc")
                                    : isReferral
                                    ? t("referralDesc", {
                                        count: c.conditionValue,
                                      })
                                    : isFirst
                                    ? t("firstPurchaseDesc")
                                    : c.conditionValue}
                                </div>
                                {isVideo && (
                                  <div className="mt-2">
                                    <div className="h-2 bg-muted rounded overflow-hidden">
                                      <div
                                        className={`h-full bg-primary transition-all`}
                                        style={{
                                          width: `${Math.round(
                                            (videoProgress[c.conditionId] ??
                                              0) * 100
                                          )}%`,
                                        }}
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="shrink-0 flex items-center gap-2">
                              {isVideo && youTubeId && (
                                <Button
                                  size="sm"
                                  variant={completed ? "ghost" : "outline"}
                                  disabled={completed}
                                  onClick={() => {
                                    // open this video and associate it with the specific condition
                                    setActiveVideoConditionId(c.conditionId);
                                    setActiveVideoId(youTubeId);
                                  }}
                                >
                                  {completed ? (
                                    <span className="flex items-center gap-1">
                                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                                      {t("doneLabel")}
                                    </span>
                                  ) : (
                                    t("viewVideoLabel")
                                  )}
                                </Button>
                              )}
                              {isAd && adUrl && (
                                <Button
                                  size="sm"
                                  variant={completed ? "ghost" : "outline"}
                                  disabled={completed}
                                  onClick={() => {
                                    window.open(adUrl, "_blank");
                                    setTimeout(() => {
                                      updateConditionProgressClient(
                                        c.conditionId,
                                        JSON.stringify({
                                          watched: true,
                                          dwellSeconds: 15,
                                        }),
                                        session.data?.user?.accessToken ?? ""
                                      )
                                        .then(() =>
                                          setLocalProgress((s) => ({
                                            ...s,
                                            [c.conditionId]: true,
                                          }))
                                        )
                                        .catch(() => {});
                                    }, 15000);
                                  }}
                                >
                                  {completed
                                    ? t("doneLabel")
                                    : t("watchAdLabel")}
                                </Button>
                              )}
                              {isSurvey && surveyUrl && (
                                <Button
                                  size="sm"
                                  variant={completed ? "ghost" : "outline"}
                                  disabled={completed}
                                  onClick={() => {
                                    window.open(surveyUrl, "_blank");
                                    updateConditionProgress(
                                      c.conditionId,
                                      JSON.stringify({ completed: true }),
                                      session.data?.user?.accessToken ?? ""
                                    )
                                      .then(() =>
                                        setLocalProgress((s) => ({
                                          ...s,
                                          [c.conditionId]: true,
                                        }))
                                      )
                                      .catch(() => {});
                                  }}
                                >
                                  {completed
                                    ? t("doneLabel")
                                    : t("surveyLabel")}
                                </Button>
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                    {activeVideoId && (
                      <div className="mt-2">
                        <div
                          className="relative w-full"
                          style={{ paddingTop: "56.25%" }}
                        >
                          <div
                            id={`yt-player-${promotion.id}`}
                            className="absolute inset-0 w-full h-full rounded overflow-hidden"
                          />
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                          {t("viewProgress", {
                            percent: Math.round(
                              (videoProgress[activeVideoConditionId ?? -1] ??
                                0) * 100
                            ),
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {t("noConditions")}
                  </p>
                )}
              </DialogContent>
            </Dialog>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default PromotionRow;
