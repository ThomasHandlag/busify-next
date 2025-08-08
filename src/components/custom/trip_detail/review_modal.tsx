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
import { Loader2, Star } from "lucide-react";
import { DialogHeader } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { addReviewClient, Review } from "@/lib/data/reviews";
import { toast } from "sonner";

type ReviewFormValues = {
  comment: string;
  rating: number;
};

export function ReviewModal({ tripId }: { tripId: number }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const form = useForm<ReviewFormValues>({
    defaultValues: {
      comment: "",
      rating: 5,
    },
  });

  const handleSubmit = async (values: ReviewFormValues) => {
    if (!values.comment.trim()) return;
    setLoading(true);
    try {
      const review = {
        customerId: 2,
        rating: values.rating,
        comment: values.comment,
        tripId: tripId, // Add the tripId to associate with the trip
      };

      await addReviewClient(review);
      toast.success("Đánh giá đã được gửi thành công!");
      form.reset({
        comment: "",
        rating: 5,
      });
      setOpen(false);
    } catch (error) {
      toast.error("Không thể gửi đánh giá. Vui lòng thử lại sau.");
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        type="button"
        className="bg-primary text-white px-4 py-2 rounded-md ml-2 lg:inset-0"
      >
        Viết đánh giá
      </DialogTrigger>
      <DialogOverlay className="fixed h-screen inset-0 bg-black/50 z-40" />
      <DialogContent className="fixed top-1/2 left-1/2 z-50 w-full max-w-md p-6 bg-white rounded-md shadow-lg transform -translate-x-1/2 -translate-y-1/2">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold mb-4">
            Viết đánh giá chuyến đi
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block mb-1 font-medium">
                    Số sao
                  </FormLabel>
                  <FormControl>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-6 h-6 cursor-pointer ${
                            star <= field.value
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                          onClick={() => field.onChange(star)}
                        />
                      ))}
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block mb-1 font-medium">
                    Nội dung đánh giá
                  </FormLabel>
                  <FormControl>
                    <textarea
                      className="w-full border rounded p-2"
                      rows={3}
                      placeholder="Nhập nhận xét của bạn..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={form.getValues().comment.trim() === ""}
            >
              {loading && <Loader2 className="animate-spin mr-2" />}
              Gửi đánh giá
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
