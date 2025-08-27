import { createContract, ContractFormData } from "@/lib/data/contract";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // Convert FormData to ContractFormData object
    const contractData: ContractFormData = {
      email: (formData.get("email") as string) || "",
      phone: (formData.get("phone") as string) || "",
      address: (formData.get("address") as string) || "",
      startDate: (formData.get("startDate") as string) || "",
      endDate: (formData.get("endDate") as string) || "",
      operationArea: (formData.get("operationArea") as string) || "",
      VATCode: (formData.get("VATCode") as string) || "",
      attachmentUrl: (formData.get("attachmentUrl") as File) || null,
    };

    const newContract = await createContract(contractData);
    return new Response(
      JSON.stringify({ result: newContract, success: true }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error adding contract:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Failed to add contract" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
