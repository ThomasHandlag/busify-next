"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { Edit, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateUserProfileClient, UserProfileResponse } from "@/lib/data/users";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

type UserProfileForm = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
};

type UpdateProfileDialogProps = {
  userProfile: Partial<UserProfileResponse> | null | undefined;
};

const UpdateProfileDialog = ({ userProfile }: UpdateProfileDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations("Profile");

  const form = useForm<UserProfileForm>({
    defaultValues: {
      fullName: userProfile?.fullName || "",
      email: userProfile?.email || "",
      phone: userProfile?.phoneNumber || "",
      address: userProfile?.address || "",
    },
  });

  const onSubmit = async (data: UserProfileForm) => {
    setIsLoading(true);
    try {
      const updatedProfile = await updateUserProfileClient(userProfile?.id, {
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phone,
        address: data.address,
      });
      if (!updatedProfile) {
        throw new Error("Failed to update profile");
      }

      setOpen(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          aria-label="Edit Profile"
          className="bg-green-600 hover:bg-green-700"
        >
          <Edit className="w-4 h-4 mr-2" />
          {t("editProfile")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("updateProfile")}</DialogTitle>
          <DialogDescription>{t("updateProfileDescription")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">{t("fullName")}</Label>
            <Input
              id="fullName"
              {...form.register("fullName", { required: true })}
              placeholder={t("enterFullName")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t("email")}</Label>
            <Input
              id="email"
              type="email"
              {...form.register("email", { required: true })}
              placeholder={t("enterEmail")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">{t("phone")}</Label>
            <Input
              id="phone"
              {...form.register("phone")}
              placeholder={t("enterPhone")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">{t("address")}</Label>
            <Textarea
              id="address"
              {...form.register("address")}
              placeholder={t("enterAddress")}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button
              aria-label="Cancel"
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              aria-label="Update Profile"
              type="submit"
              className="bg-green-600 hover:bg-green-700"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="animate-spin mr-2" />}
              {t("updateProfile")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileDialog;
