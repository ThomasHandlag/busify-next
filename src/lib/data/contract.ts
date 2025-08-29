import { BASE_URL } from "../constants/constants";

export interface ContractFormData {
  email: string;
  phone: string;
  address: string;
  startDate: string;
  endDate: string;
  operationArea: string;
  VATCode: string;
  attachmentUrl: File | null;
}

const createContract = async (data: ContractFormData) => {
  console.log("Creating contract with data:", data);
  try {
    // Use FormData like in Postman
    const formDataToSend = new FormData();

    // Helper function to format datetime for Java LocalDateTime
    const formatDateTimeForJava = (dateTimeString: string): string => {
      if (!dateTimeString) return "";

      const date = new Date(dateTimeString);

      return date.toISOString();
    };

    // Append all fields exactly like in Postman
    formDataToSend.append("email", data.email);
    formDataToSend.append("phone", data.phone);
    formDataToSend.append("address", data.address);
    formDataToSend.append("startDate", formatDateTimeForJava(data.startDate));
    formDataToSend.append("endDate", formatDateTimeForJava(data.endDate));
    formDataToSend.append("operationArea", data.operationArea);
    formDataToSend.append("VATCode", data.VATCode);

    // Append file if exists
    if (data.attachmentUrl) {
      formDataToSend.append("attachmentUrl", data.attachmentUrl);
    }

    console.log("Sending FormData to:", `${BASE_URL}api/contracts`);

    // Log FormData contents
    for (const [key, value] of formDataToSend.entries()) {
      console.log(`${key}:`, value);
    }

    const response = await fetch(`${BASE_URL}api/contracts`, {
      method: "POST",
      // Don't set Content-Type header - let browser set it with boundary for FormData
      body: formDataToSend,
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend error:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error creating contract:", error);
    throw error;
  }
};

export { createContract };
