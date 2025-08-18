import { UserProfileResponse } from "@/lib/data/users";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Phone, MapPin, Calendar, User } from "lucide-react";
import UpdateProfileDialog from "@/components/custom/profile/update_profile";
import React from "react";
import { auth } from "@/lib/data/auth";
import { BASE_URL } from "@/lib/constants/constants";

const ProfileSkeleton = () => {
  return (
    <div className="animate-pulse container mx-auto p-6 max-w-4xl mb-10">
      <div className="mb-8">
        <div className="h-8 w-48 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-64 bg-gray-200 rounded"></div>
      </div>
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <div className="h-20 w-20 bg-gray-200 rounded-full"></div>
          <div>
            <div className="h-6 w-40 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-100 rounded-lg p-6 space-y-4">
          <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-28 bg-gray-200 rounded"></div>
        </div>
        <div className="bg-gray-100 rounded-lg p-6">
          <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-40 bg-gray-200 rounded"></div>
        </div>
      </div>
      <div className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-16 bg-gray-100 rounded-lg"></div>
          <div className="h-16 bg-gray-100 rounded-lg"></div>
          <div className="h-16 bg-gray-100 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

const ProfilePage = async () => {
  const session = await auth();
  if (!session) {
    console.log("No session found - user not logged in");
    return (
      <div className="container mx-auto p-6 max-w-4xl mb-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Not Authenticated
          </h1>
          <p>Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  const response = await fetch(`${BASE_URL}/api/users/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.user.accessToken}`,

    },
  });
  

  if (!response.ok) {
    return <ProfileSkeleton />;
  }

  const data = await response.json();
  const userProfile = data.result as UserProfileResponse;

  return (
    <div className="container mx-auto p-6 max-w-4xl mb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600 mt-2">Manage your account information</p>
      </div>

      <Card className="mb-6">
        <CardHeader className="flex flex-col lg:flex-row items-center justify-between space-y-0 pb-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-green-100 text-green-700 text-xl">
                {userProfile?.fullName
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("") || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">
                {userProfile?.fullName}
              </CardTitle>
              <CardDescription className="text-lg">
                {userProfile?.email}
              </CardDescription>
            </div>
          </div>
          <UpdateProfileDialog userProfile={userProfile} />
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">
                  {userProfile?.email || "Not provided"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">
                  {userProfile?.phoneNumber || "Not provided"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="font-medium">
                  {new Date("1/2/2001").toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Address Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">
                  {userProfile?.address || "Not provided"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Account Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">0</p>
              <p className="text-sm text-gray-600">Total Bookings</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">0</p>
              <p className="text-sm text-gray-600">Completed Trips</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">Member</p>
              <p className="text-sm text-gray-600">Account Status</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
