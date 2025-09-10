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

import { addReviewClient } from "@/lib/data/reviews";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";

type ReviewFormValues = {
  comment: string;
  rating: number;
};

const commentSchema = z.object({
  comment: z.string().min(4, "At least 4 characters").max(500, "Too long"),
  rating: z.number().min(1).max(5),
});

export function ReviewModal({ tripId }: { tripId: number }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const session = useSession();
  const t = useTranslations();

  const form = useForm<ReviewFormValues>({
    defaultValues: {
      comment: "",
      rating: 5,
    },
    mode: "onBlur",
    resolver: zodResolver(commentSchema),
  });

  const handleSubmit = async (values: ReviewFormValues) => {
    if (!values.comment.trim()) return;
    if (session.status !== "authenticated") {
      toast.error(t("TripDetail.reviewRequire"));
      return;
    }
    setLoading(true);
    const review = {
      rating: values.rating,
      comment: values.comment,
      tripId: tripId, // Add the tripId to associate with the trip
    };

    await addReviewClient(review, session.data.user.accessToken, (message) => {
      toast.info(message);
    });
    form.reset({
      comment: "",
      rating: 5,
    });

    setOpen(false);
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        type="button"
        className="bg-primary text-white px-4 py-2 rounded-md ml-2 lg:inset-0"
      >
        {t("TripDetail.writeReview")}
      </DialogTrigger>
      <DialogOverlay className="fixed h-screen inset-0 bg-black/50 z-40" />
      <DialogContent className="fixed top-1/2 left-1/2 z-50 w-full max-w-md p-6 bg-white rounded-md shadow-lg transform -translate-x-1/2 -translate-y-1/2">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold mb-4">
            {t("TripDetail.writeReview")}
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
                    {t("TripDetail.rating")}
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
                    {t("TripDetail.reviewContent")}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      className="w-full border rounded p-2"
                      rows={3}
                      placeholder={t("TripDetail.writeReview")}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={form.getFieldState("comment").invalid || loading}
            >
              {loading && <Loader2 className="animate-spin mr-2" />}
              {t("TripDetail.submitReview")}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
