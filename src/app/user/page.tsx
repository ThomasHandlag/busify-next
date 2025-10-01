import { getUserProfile } from "@/lib/data/users";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Phone, MapPin, User } from "lucide-react";
import UpdateProfileDialog from "@/components/custom/profile/update_profile";
import ComplaintManagement from "@/components/custom/profile/complaint_management";
import React from "react";
import { auth } from "@/lib/data/auth";
import PreferencesForm from "@/components/custom/preferences/preferences_form";
import { getComplaintsByCurrentUser } from "@/lib/data/complaints";
import { toast } from "sonner";
import LocaleText from "@/components/custom/locale_text";
import Loading from "../loading";

const ProfilePage = async () => {
  const session = await auth();
  const complaints = await getComplaintsByCurrentUser(
    session?.user.accessToken || ""
  ); // Lưu vào biến complaints thay vì result
  if (!session) {
    return (
      <div className="container mx-auto p-6 max-w-4xl mb-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            <LocaleText name="UserPage" string="notAuthenticated" />
          </h1>
          <p>
            <LocaleText name="UserPage" string="loginToView" />
          </p>
        </div>
      </div>
    );
  }

  const userProfile = await getUserProfile({
    accessToken: session?.user.accessToken,
    callback: (message: string) => {
      toast.error(message);
    },
  });

  if (!userProfile) {
    return <Loading />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h1 className="text-3xl font-bold">
            <LocaleText name="UserDashboard" string="profile" />
          </h1>
          <p className="mt-2">
            <LocaleText name="UserPage" string="manageAccountInfo" />
          </p>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Card className="mb-6">
          <CardHeader className="flex flex-col lg:flex-row items-center justify-between space-y-0 pb-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-primary/50 text-primary text-xl">
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
          <CardFooter>
            <PreferencesForm />
          </CardFooter>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                <LocaleText name="Profile" string="personalInfo" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">
                    <LocaleText name="Form" string="email" />
                  </p>
                  <p className="font-medium">
                    {userProfile?.email || (
                      <LocaleText name="UserPage" string="notProvided" />
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">
                    <LocaleText name="Form" string="phone" />
                  </p>
                  <p className="font-medium">
                    {userProfile?.phoneNumber || (
                      <LocaleText name="UserPage" string="notProvided" />
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                <LocaleText name="UserPage" string="addressInfo" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">
                    <LocaleText name="UserPage" string="address" />
                  </p>
                  <p className="font-medium">
                    {userProfile?.address || (
                      <LocaleText name="UserPage" string="notProvided" />
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>
              <LocaleText name="UserPage" string="accountStatistics" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">0</p>
                <p className="text-sm text-gray-600">
                  <LocaleText name="UserPage" string="totalBookings" />
                </p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">0</p>
                <p className="text-sm text-gray-600">
                  <LocaleText name="UserPage" string="completedTrips" />
                </p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">
                  <LocaleText name="UserPage" string="member" />
                </p>
                <p className="text-sm text-gray-600">
                  <LocaleText name="UserPage" string="accountStatus" />
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="mt-6">
          <ComplaintManagement
            userId={session.user?.id}
            complaints={complaints}
          />{" "}
          {/* Truyền complaints như prop */}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfilePage;
