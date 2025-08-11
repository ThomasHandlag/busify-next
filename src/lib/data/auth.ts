import api from "./axios-instance";
import ResponseError from "./response_error";

interface RegisterFormData {
  name: string;
  phoneNumber: string;
  email: string;
  password: string;
}
export const register = async (
  data: RegisterFormData
): Promise<ResponseError> => {
  try {
    const response = await api.post("api/auth/register", data);
    return response.data;
  } catch (error) {
    console.error("Error during registration:", error);
    throw error;
  }
};

export const forgotPassword = async (email: string): Promise<ResponseError> => {
  try {
    const response = await api.post("api/auth/forgot-password", { email });
    return response.data;
  } catch (error) {
    console.error("Error during password reset:", error);
    throw error;
  }
};

export const resetPassword = async (
  token: string,
  newPassword: string
): Promise<ResponseError> => {
  try {
    const response = await api.post("api/auth/reset-password", {
      token,
      newPassword,
    });
    return response.data;
  } catch (error) {
    console.error("Error during password reset:", error);
    throw error;
  }
};

export const verification = async (token: string): Promise<ResponseError> => {
  try {
    const response = await api.get("api/auth/verify-email", {
      params: { token },
    });
    return response.data;
  } catch (error) {
    console.error("Error during email verification:", error);
    throw error;
  }
};
