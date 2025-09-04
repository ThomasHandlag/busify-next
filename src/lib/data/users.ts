import api, { ApiFnParams } from "./axios-instance";

export interface UserProfileResponse {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  roleName: string;
}

export async function getUserProfile(
  params: ApiFnParams
): Promise<UserProfileResponse | undefined> {
  const response = await api.get(`api/users/profile`, {
    headers: {
      Authorization: `Bearer ${params.accessToken}`,
    },
  });
  if (response.status !== 200) {
    console.error("Error fetching user profile:", response.data.message);
    params.callback(
      response.data.message ?? params.localeMessage ?? "Unknown error"
    );
    return undefined;
  }
  return response.data.result as UserProfileResponse;
}

export async function updateUserProfileServer(
  userId: number | null | undefined,
  data: Partial<UserProfileResponse>
): Promise<UserProfileResponse | null | undefined> {
  try {
    const response = await api.patch(`api/users/${userId}`, data);
    return response.data.result;
  } catch (error) {
    console.error("Error updating user profile:", error);
    return null;
  }
}

export async function updateUserProfileClient(
  userId: number | null | undefined,
  data: Partial<UserProfileResponse>
): Promise<UserProfileResponse | null | undefined> {
  try {
    const response = await fetch(`/api/profile/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        data,
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to update user profile");
    }
    const result = await response.json();
    return result.result;
  } catch (error) {
    console.error("Error updating user profile:", error);
    return null;
  }
}
