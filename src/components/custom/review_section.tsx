import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Star, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { getReviewsByTripId } from "@/lib/data/reviews";
import { Review } from "@/lib/data/reviews";
import { TripDetail } from "@/lib/data/trip";
import LocaleText from "./locale_text";
import { Progress } from "@/components/ui/progress";

export interface ReviewProps {
  id: number;
  user_name: string;
  rating: number;
  comment: string;
  date: string;
}

const tripAvgRating = (reviews: Review[]) => {
  if (reviews.length === 0) return 0;
  const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
  return parseFloat((totalRating / reviews.length).toFixed(1));
};

const ReviewSection = async ({
  mockTripDetail,
}: {
  mockTripDetail: TripDetail;
}) => {
  const reviews = await getReviewsByTripId(mockTripDetail.trip_id);
  const avgRating = tripAvgRating(reviews);

  const ratingDistribution = [
    { star: 5, count: 0 },
    { star: 4, count: 0 },
    { star: 3, count: 0 },
    { star: 2, count: 0 },
    { star: 1, count: 0 },
  ];

  reviews.forEach((review) => {
    const star = Math.floor(review.rating);
    if (star >= 1 && star <= 5) {
      const ratingIndex = ratingDistribution.findIndex((r) => r.star === star);
      if (ratingIndex !== -1) {
        ratingDistribution[ratingIndex].count++;
      }
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          <LocaleText string="reviewTrip" name="Review" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="flex flex-col items-center justify-center space-y-2 md:border-r md:pr-8">
            <div className="text-5xl font-bold text-primary">
              {avgRating.toFixed(1)}
            </div>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-6 h-6 ${
                    star <= avgRating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-muted-foreground/20"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              <LocaleText string="basedOn" name="Review" /> {reviews.length}{" "}
              <LocaleText string="reviews" name="TripDetail" />
            </p>
          </div>
          <div className="col-span-2 space-y-2">
            {ratingDistribution.map(({ star, count }) => (
              <div key={star} className="flex items-center gap-4">
                <span className="flex items-center gap-1 text-sm text-muted-foreground w-12">
                  {star} <Star className="w-4 h-4" />
                </span>
                <Progress
                  value={reviews.length > 0 ? (count / reviews.length) * 100 : 0}
                  className="w-full h-2"
                />
                <span className="text-sm text-muted-foreground w-16 text-right">
                  {count} {<LocaleText string="reviews" name="TripDetail" />}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-6" />

        <div className="space-y-6">
          {reviews.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center">
              <LocaleText string="noReviews" name="Review" />.
            </p>
          ) : (
            reviews.map((review) => (
              <ReviewItem key={review.reviewId} review={review} />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

function formatDate(date: Date | undefined) {
  if (!date) {
    return "";
  }

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

const ReviewItem = ({ review }: { review: Review }) => {
  return (
    <div
      key={review.reviewId}
      className="border-b border-border pb-6 last:border-b-0 last:pb-0"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <User className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <span className="font-semibold text-foreground">
              {review.customerName}
            </span>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= review.rating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-muted-foreground/20"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {formatDate(new Date(review.createdAt))}
        </p>
      </div>
      <p className="text-muted-foreground text-sm ml-13">{review.comment}</p>
    </div>
  );
};

export { ReviewSection, ReviewItem, tripAvgRating };

export default ReviewSection;
