import api from "./axios-instance";

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

export async function getUserProfileByEmail(
  email: string
): Promise<UserProfileResponse | null | undefined> {
  try {
    const response = await api.get(`api/users/email/${email}`);
    return response.data.result;
  } catch (error) {
    console.error("Error fetching user profile by email:", error);
    return null;
  }
}

export async function getUserProfile(
  userId: number
): Promise<UserProfileResponse | null | undefined> {
  try {
    const response = await api.get(`api/users/${userId}`);
    return response.data.result;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

export async function updateUserProfile(
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
