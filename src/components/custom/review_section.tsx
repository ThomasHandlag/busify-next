import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Star, User } from "lucide-react";
import { Separator } from "@radix-ui/react-separator";
import { TripDetailProps } from "./trip_overview_card";
import { getReviewsByTripId } from "@/lib/data/reviews";
import { Review } from "@/lib/types/widget_proptype";

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
  mockTripDetail: TripDetailProps;
}) => {
  const reviews = await getReviewsByTripId(mockTripDetail.trip_id);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Star className="w-5 h-5 text-yellow-400" />
          <span>Đánh giá chuyến đi</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-3 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-500">
              {tripAvgRating(reviews)}
            </div>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= tripAvgRating(reviews)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
          <div>
            <p className="font-medium">Đánh giá trung bình</p>
            <p className="text-sm text-gray-500">
              Dựa trên {reviews.length} đánh giá
            </p>
          </div>
        </div>

        <Separator className="my-4" />
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-sm text-gray-500">Chưa có đánh giá nào.</p>
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

const ReviewItem = ({ review }: { review: Review }) => {
  return (
    <div key={review.reviewId} className="border-b pb-4 last:border-b-0">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <User className="w-4 h-4 text-gray-400" />
          <span className="font-medium">{review.customerName}</span>
        </div>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-3 h-3 ${
                star <= review.rating
                  ? "text-yellow-400 fill-current"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
      <p className="text-gray-600 mb-2">{review.comment}</p>
      <p className="text-sm text-gray-500">{review.createdAt}</p>
    </div>
  );
};

export { ReviewSection, ReviewItem, tripAvgRating };

export default ReviewSection;
