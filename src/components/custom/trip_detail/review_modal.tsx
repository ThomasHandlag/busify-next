"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogOverlay,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { Star } from "lucide-react";
import { DialogHeader } from "@/components/ui/dialog";

export function ReviewModal() {
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);

  const handleSubmit = () => {
    if (reviewText.trim() === "") return;

    // call api to submit review
    setReviewText("");
    setReviewRating(5);
  };

  return (
    <Dialog>
      <DialogTrigger type="button" className="bg-primary text-white px-4 py-2 rounded-md ml-2 lg:inset-0">
          Viết đánh giá
      </DialogTrigger>
      <DialogOverlay className="fixed h-screen inset-0 bg-black/50 z-40" />
      <DialogContent className="fixed top-1/2 left-1/2 z-50 w-full max-w-md p-6 bg-white rounded-md shadow-lg transform -translate-x-1/2 -translate-y-1/2">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold mb-4">
            Viết đánh giá chuyến đi
          </DialogTitle>
        </DialogHeader>
        <div className="mb-3">
          <label className="block mb-1 font-medium">Số sao</label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-6 h-6 cursor-pointer ${
                  star <= reviewRating
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
                onClick={() => setReviewRating(star)}
              />
            ))}
          </div>
        </div>
        <div className="mb-3">
          <label className="block mb-1 font-medium">Nội dung đánh giá</label>
          <textarea
            className="w-full border rounded p-2"
            rows={3}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Nhập nhận xét của bạn..."
          />
        </div>
        <Button
          className="w-full"
          disabled={reviewText.trim() === ""}
          onClick={handleSubmit}
        >
          Gửi đánh giá
        </Button>
      </DialogContent>
    </Dialog>
  );
}
