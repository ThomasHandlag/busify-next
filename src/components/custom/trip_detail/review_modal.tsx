"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Star } from "lucide-react";
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
import { useRouter } from "next/navigation";

type ReviewFormValues = {
  comment: string;
  rating: number;
};

const commentSchema = z.object({
  comment: z
    .string()
    .min(4, "At least 4 characters")
    .max(500, "Too long")
    .regex(/^[^<>/\\&*^@#+-:]*$/, "No special characters allowed"),
  rating: z.number().min(1, "Rating is required").max(5),
});

export function ReviewModal({ tripId }: { tripId: number }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const session = useSession();
  const t = useTranslations();
  const router = useRouter();

  const form = useForm<ReviewFormValues>({
    defaultValues: {
      comment: "",
      rating: 0,
    },
    mode: "onBlur",
    resolver: zodResolver(commentSchema),
  });

  const handleSubmit = async (values: ReviewFormValues) => {
    if (session.status !== "authenticated") {
      toast.error(t("TripDetail.reviewRequire"));
      router.push("/login");
      return;
    }
    setLoading(true);
    const review = {
      rating: values.rating,
      comment: values.comment,
      tripId: tripId,
    };

    try {
      await addReviewClient(
        review,
        session.data.user.accessToken,
        (message) => {
          toast.success(message);
        }
      );
      form.reset({ comment: "", rating: 0 });
      router.refresh();
      setOpen(false);
    } catch {
      toast.error(t("Review.submitError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{t("TripDetail.writeReview")}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {t("TripDetail.writeReview")}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("TripDetail.rating")}</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-8 h-8 cursor-pointer transition-colors ${
                            star <= field.value
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-muted-foreground/20"
                          }`}
                          onClick={() => field.onChange(star)}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("TripDetail.reviewContent")}</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={5}
                      placeholder={t("Review.yourReview")}
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
              disabled={!form.formState.isValid || loading}
            >
              {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
              {t("TripDetail.submitReview")}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
