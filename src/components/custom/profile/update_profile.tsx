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

type UserProfileForm = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
};

type UpdateProfileDialogProps = {
  userProfile: Partial<UserProfileResponse> | null | undefined;
};

const UpdateProfileDialog = ({ userProfile }: UpdateProfileDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
        <Button className="bg-green-600 hover:bg-green-700">
          <Edit className="w-4 h-4 mr-2" />
          Update Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile information here.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              {...form.register("fullName", { required: true })}
              placeholder="Enter your full name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...form.register("email", { required: true })}
              placeholder="Enter your email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              {...form.register("phone")}
              placeholder="Enter your phone number"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              type="date"
              {...form.register("dateOfBirth")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              {...form.register("address")}
              placeholder="Enter your address"
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="animate-spin mr-2" />}
              Update Profile
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileDialog;
