import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Star, User } from "lucide-react";
import { Separator } from "@radix-ui/react-separator";
import { TripDetailProps } from "./trip_overview_card";

export interface ReviewProps {
  id: number;
  user_name: string;
  rating: number;
  comment: string;
  date: string;
}
const ReviewSection = ({
  mockTripDetail,
  mockReviews,
}: {
  mockTripDetail: TripDetailProps;
  mockReviews: ReviewProps[];
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Star className="w-5 h-5 text-yellow-400" />
          <span>Đánh giá</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-3 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-500">
              {mockTripDetail.average_rating}
            </div>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= mockTripDetail.average_rating
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
              Dựa trên {mockTripDetail.total_reviews} đánh giá
            </p>
          </div>
        </div>

        <Separator className="my-4" />
        <div className="space-y-4">
          {mockReviews.map((review) => (
            <div key={review.id} className="border-b pb-4 last:border-b-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">{review.user_name}</span>
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
              <p className="text-sm text-gray-500">{review.date}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewSection;
