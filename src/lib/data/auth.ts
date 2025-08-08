import api from "./axios-instance";

interface RegisterFormData {
  name: string;
  phoneNumber: string;
  email: string;
  password: string;
}

export const register = async (data: RegisterFormData): Promise<any> => {
  try {
    const response = await api.post("api/auth/register", data);
    return response.data;
  } catch (error) {
    console.error("Error during registration:", error);
    throw error;
  }
};
