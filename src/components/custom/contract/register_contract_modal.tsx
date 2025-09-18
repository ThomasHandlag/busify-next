"use client";

import React, { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, Upload, Building2 } from "lucide-react";
import { toast } from "sonner";
import { ContractFormData, createContract } from "@/lib/data/contract";
import { DialogClose } from "@radix-ui/react-dialog";
import { useTranslations } from "next-intl";

// Validation patterns
export const VALIDATION_PATTERNS = {
  VAT_CODE: /^[0-9]{10,15}$/,
  PHONE: /^[\+]?[0-9]{10,15}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

// Validation messages
export const VALIDATION_MESSAGES = {
  VAT_CODE: "Mã số thuế phải từ 10-15 chữ số",
  PHONE: "Số điện thoại không đúng định dạng (10-15 chữ số, có thể có +)",
  EMAIL: "Email không đúng định dạng",
  START_DATE: "Ngày bắt đầu phải là ngày hiện tại hoặc tương lai",
  END_DATE: "Ngày kết thúc phải sau ngày bắt đầu",
  REQUIRED_FIELD: "Trường này là bắt buộc",
  POLICY_REQUIRED: "Vui lòng đồng ý với chính sách của website",
  FILE_TYPE: "Chỉ chấp nhận file PDF, DOC, DOCX, JPG, PNG",
  FILE_SIZE: "File không được vượt quá 10MB",
} as const;

const RegisterContractModal = () => {
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false);
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);
  const [formData, setFormData] = useState<ContractFormData>({
    email: "",
    phone: "",
    address: "",
    startDate: "",
    endDate: "",
    operationArea: "",
    VATCode: "",
    attachmentUrl: null,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInputFocus = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    // Ngăn modal đóng khi focus vào input với autofill
    e.stopPropagation();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        attachmentUrl: file,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!acceptedPolicy) {
      toast.error(t("Form.Register.errors.acceptPolicy"));
      return;
    }

    // Validate VATCode format
    if (!VALIDATION_PATTERNS.VAT_CODE.test(formData.VATCode)) {
      toast.error(t("Form.Register.errors.invalidVat"));
      return;
    }

    // Validate phone format
    if (!VALIDATION_PATTERNS.PHONE.test(formData.phone)) {
      toast.error(t("Form.Register.errors.invalidPhone"));
      return;
    }

    // Validate email format
    if (!VALIDATION_PATTERNS.EMAIL.test(formData.email)) {
      toast.error(t("Form.invalidEmail"));
      return;
    }

    // Validate dates
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const now = new Date();

    if (startDate < now) {
      toast.error(t("Form.Register.errors.startDateInvalid"));
      return;
    }

    if (endDate <= startDate) {
      toast.error(t("Form.Register.errors.endDateInvalid"));
      return;
    }

    setIsLoading(true);

    try {
      const formDataToSend = new FormData();

      // Append all text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "attachmentUrl" && value) {
          formDataToSend.append(key, value);
        }
      });

      // Append file if exists
      if (formData.attachmentUrl) {
        formDataToSend.append("attachmentUrl", formData.attachmentUrl);
      }

      const response = await createContract(formData);
      console.log("Contract created:", response);

      if (response.code === 201 || response.code === 200) {
        toast.success(t("Form.Register.errors.contractSuccess"));
        // Reset form
        setFormData({
          email: "",
          phone: "",
          address: "",
          startDate: "",
          endDate: "",
          operationArea: "",
          VATCode: "",
          attachmentUrl: null,
        });
        setAcceptedPolicy(false);
      } else {
        toast.error(t("Form.Register.errors.contractFailed"));
      }
    } catch (error) {
      console.error("Error submitting contract:", error);
      toast.error(t("Form.Register.errors.contractFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            aria-label="Register Contract"
            size="sm"
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <FileText className="w-4 h-4 mr-2" />
            {t("Form.Register.createContractButton")}
          </Button>
        </DialogTrigger>
        <DialogContent
          className="max-w-2xl max-h-[90vh] overflow-y-auto"
          onPointerDownOutside={(e) => {
            // Ngăn modal đóng khi click vào autofill suggestions
            const target = e.target as Element;
            if (target.closest("[data-radix-popper-content-wrapper]")) {
              e.preventDefault();
            }
          }}
          onInteractOutside={(e) => {
            // Ngăn modal đóng khi tương tác với autofill
            const target = e.target as Element;
            if (
              target.closest("input[autocomplete]") ||
              target.closest("[data-radix-popper-content-wrapper]")
            ) {
              e.preventDefault();
            }
          }}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              {t("Form.Register.contractInfoTitle")}
            </DialogTitle>
            <DialogDescription>
              {t("Form.Register.busOperatorNote")}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t("Form.email")} *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  placeholder={t("Form.Register.placeholderEmail")}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">{t("Form.phone")} *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  placeholder="0123456789"
                  pattern="^[\+]?[0-9]{10,15}$"
                  title={t("Form.Register.phoneOperatorNote")}
                  required
                />
                <p className="text-xs text-gray-500">
                  {t("Form.Register.phoneOperatorNote")}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">
                {t("Form.Register.addressLabel")} *
              </Label>
              <Textarea
                id="address"
                name="address"
                autoComplete="street-address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder={t("Form.Register.addressPlaceholder")}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">
                  {t("Form.Register.startDateLabel")} *
                </Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">
                  {t("Form.Register.endDateLabel")} *
                </Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="operationArea">
                {t("Form.Register.operationAreaLabel")} *
              </Label>
              <Input
                id="operationArea"
                name="operationArea"
                value={formData.operationArea}
                onChange={handleInputChange}
                placeholder={t("Form.Register.operationAreaPlaceholder")}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="VATCode">
                {t("Form.Register.vatCodeLabel")} *
              </Label>
              <Input
                id="VATCode"
                name="VATCode"
                value={formData.VATCode}
                onChange={handleInputChange}
                placeholder={t("Form.Register.vatCodePlaceholder")}
                pattern="^[0-9]{10,15}$"
                title="Mã số thuế phải từ 10-15 chữ số"
                required
              />
              <p className="text-xs text-gray-500">
                {t("Form.Register.vatCodeNote")}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="attachmentUrl">
                {t("Form.Register.attachmentLabel")}
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="attachmentUrl"
                  name="attachmentUrl"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.jpg,.png"
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
                <Upload className="w-4 h-4 text-gray-400" />
              </div>
              {formData.attachmentUrl && (
                <p className="text-sm text-green-600">
                  {formData.attachmentUrl.name}
                </p>
              )}
            </div>

            {/* Policy Checkbox */}
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="policy"
                  checked={acceptedPolicy}
                  onCheckedChange={(checked) =>
                    setAcceptedPolicy(checked as boolean)
                  }
                />
                <Label htmlFor="policy" className="text-sm">
                  {t("Form.Register.termsAgreement")}
                </Label>
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button aria-label="Cancel" variant="outline">
                  {t("Common.cancel")}
                </Button>
              </DialogClose>
              <Button
                aria-label="Register Contract"
                type="submit"
                disabled={!acceptedPolicy || isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                {isLoading
                  ? t("Common.processing")
                  : t("Form.Register.createContractButton")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RegisterContractModal;
