"use client";
import { Button } from "../ui/button";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { FaEye, FaEyeSlash, FaCheck } from "react-icons/fa";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { register } from "@/lib/data/auth";
import { createContract, ContractFormData } from "@/lib/data/contract";
import React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Building2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Policy from "./policy/policy";
import { busOperatorSchema, userSchema } from "@/lib/scheams/scheams";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
export const RegisterForm = () => {
  const t = useTranslations("Form");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isBusOperator, setIsBusOperator] = React.useState(false);
  const [acceptedPolicy, setAcceptedPolicy] = React.useState(false);
  const [passwordRequirements, setPasswordRequirements] = React.useState({
    requirements: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false,
    },
    unmetRequirements: [] as string[],
    strength: 0,
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [registrationSuccess, setRegistrationSuccess] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState("");

  // Define the form schema using Zod

  const form = useForm({
    resolver: zodResolver(isBusOperator ? busOperatorSchema : userSchema),
    defaultValues: {
      email: "",
      phone: "",
      address: "",
      startDate: "",
      endDate: "",
      operationArea: "",
      VATCode: "",
      attachmentUrl: null,
      fullName: "",
      password: "",
      confirmPassword: "",
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // If registering as bus operator, validate contract fields
      if (isBusOperator) {
        if (!acceptedPolicy) {
          toast.error(t("Register.errors.acceptPolicy"));
          setIsSubmitting(false);
          return;
        }

        // Validate required contract fields
        if (
          !data.phone ||
          !data.address ||
          !data.startDate ||
          !data.endDate ||
          !data.operationArea ||
          !data.VATCode
        ) {
          toast.error(t("Register.errors.fillContract"));
          setIsSubmitting(false);
          return;
        }

        // Validate phone format
        const PHONE_PATTERN = /^[\+]?[0-9]{10,15}$/;
        if (!PHONE_PATTERN.test(data.phone)) {
          toast.error(t("Register.errors.invalidPhone"));
          setIsSubmitting(false);
          return;
        }

        // Validate VAT code format
        const VAT_CODE_PATTERN = /^[0-9]{10,15}$/;
        if (!VAT_CODE_PATTERN.test(data.VATCode)) {
          toast.error(t("Register.errors.invalidVat"));
          setIsSubmitting(false);
          return;
        }

        // Validate dates
        const startDate = new Date(data.startDate);
        const endDate = new Date(data.endDate);
        const now = new Date();

        if (startDate < now) {
          toast.error(t("Register.errors.startDateInvalid"));
          setIsSubmitting(false);
          return;
        }

        if (endDate <= startDate) {
          toast.error(t("Register.errors.endDateInvalid"));
          setIsSubmitting(false);
          return;
        }

        // For bus operator, create contract directly without user registration
        const contractData: ContractFormData = {
          email: data.email,
          phone: data.phone || "",
          address: data.address || "",
          startDate: data.startDate || "",
          endDate: data.endDate || "",
          operationArea: data.operationArea || "",
          VATCode: data.VATCode || "",
          attachmentUrl: data.attachmentUrl || null,
        };

        const contractResponse = await createContract(contractData);

        if (contractResponse.code === 201 || contractResponse.code === 200) {
          toast.success(t("Register.errors.contractSuccess"));
          setUserEmail(data.email);
          setRegistrationSuccess(true);
        } else {
          toast.error(t("Register.errors.contractFailed"));
        }
      } else {
        // Regular user registration
        const response = await register({
          name: data.fullName,
          phoneNumber: data.phone ?? "",
          email: data.email,
          password: data.password,
        });

        if (response.code === 200) {
          setUserEmail(data.email);
          toast.success(t("Register.errors.regSuccess"));
          setRegistrationSuccess(true);
        } else {
          // Handle error
          toast.error(
            (response.message as string) || t("Register.errors.regFailed")
          );
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(t("Register.errors.regError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const checkPasswordRequirements = (password: string) => {
    const requirements = {
      length: password.length >= 6,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };

    const unmetRequirements: string[] = [];
    if (!requirements.length) unmetRequirements.push("length");
    if (!requirements.uppercase) unmetRequirements.push("uppercase");
    if (!requirements.lowercase) unmetRequirements.push("lowercase");
    if (!requirements.number) unmetRequirements.push("number");
    if (!requirements.special) unmetRequirements.push("special");

    const strength = Object.values(requirements).filter(Boolean).length;

    return { requirements, unmetRequirements, strength };
  };

  const isPasswordStrong = passwordRequirements.strength >= 3;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-gray-100">
        {!registrationSuccess ? (
          <>
            {/* Header */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl sm:text-2xl font-bold">
                  B
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                {t("Register.title")}
              </h2>
              <p className="text-sm sm:text-base text-gray-500">
                {t("Register.subtitle")}
              </p>
            </div>

            {/* Register Form */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 sm:space-y-5"
              >
                {/* Full Name - Only show when not bus operator */}
                {!isBusOperator && (
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          {t("fullName")}{" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <Input
                          {...field}
                          type="text"
                          placeholder={t("fullName")}
                          required
                          className="h-12 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">
                        {t("email")} <span className="text-red-500">*</span>
                      </FormLabel>
                      <Input
                        {...field}
                        type="email"
                        placeholder={t("email")}
                        required
                        className="h-12 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phone Number - Show for both regular users and bus operators */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">
                        {t("phone")}{" "}
                        {isBusOperator && (
                          <span className="text-red-500">*</span>
                        )}
                      </FormLabel>
                      <Input
                        {...field}
                        type="tel"
                        placeholder={
                          isBusOperator
                            ? t("Register.placeholderPhoneOperator")
                            : t("Register.placeholderPhone")
                        }
                        className="h-12 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      />
                      {isBusOperator && (
                        <p className="text-xs text-gray-500">
                          {t("Register.phoneOperatorNote")}
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password - Only show when not bus operator */}
                {!isBusOperator && (
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          {t("password")}{" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder={t("Register.placeholderPassword")}
                            required
                            className="h-12 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 pr-12"
                            onChange={(e) => {
                              field.onChange(e);
                              setPasswordRequirements(
                                checkPasswordRequirements(e.target.value)
                              );
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? (
                              <FaEyeSlash size={18} />
                            ) : (
                              <FaEye size={18} />
                            )}
                          </button>
                        </div>
                        {field.value && (
                          <div className="mt-2">
                            <p className="text-xs">
                              {passwordRequirements.strength >= 3 ? (
                                <span className="text-green-600">
                                  {t("Register.passwordStrong")}
                                </span>
                              ) : (
                                <span className="text-red-500">
                                  {t("Register.passwordNeeds", {
                                    requirements:
                                      passwordRequirements.unmetRequirements
                                        .map((k) =>
                                          t(
                                            `Register.passwordRequirements.${k}`
                                          )
                                        )
                                        .join(", "),
                                  })}
                                </span>
                              )}
                            </p>
                          </div>
                        )}
                      </FormItem>
                    )}
                  />
                )}

                {/* Confirm Password - Only show when not bus operator */}
                {!isBusOperator && (
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          {t("confirmPassword")}{" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder={t("confirmPassword")}
                            required
                            className="h-12 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 pr-12"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showConfirmPassword ? (
                              <FaEyeSlash size={18} />
                            ) : (
                              <FaEye size={18} />
                            )}
                          </button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Bus Operator Checkbox */}
                <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <Checkbox
                    id="busOperator"
                    checked={isBusOperator}
                    onCheckedChange={(checked) =>
                      setIsBusOperator(checked as boolean)
                    }
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <label
                      htmlFor="busOperator"
                      className="text-sm font-medium text-blue-900 cursor-pointer flex items-center gap-2"
                    >
                      <Building2 className="w-4 h-4" />
                      {t("Register.busOperatorLabel")}
                    </label>
                    <p className="text-xs text-blue-700 mt-1">
                      {t("Register.busOperatorNote")}
                    </p>
                  </div>
                </div>

                {/* Bus Operator Fields - Only show when checkbox is checked */}
                {isBusOperator && (
                  <div className="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      {t("Register.contractInfoTitle")}
                    </h3>

                    {/* Address */}
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">
                            {t("Register.addressLabel")}{" "}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <Textarea
                            {...field}
                            placeholder={t("Register.addressPlaceholder")}
                            className="bg-white border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Start Date and End Date */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel className="text-gray-700 font-medium">
                              {t("Register.startDateLabel")}{" "}
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  aria-label={t("Register.startDateLabel")}
                                  variant={"outline"}
                                  className={cn(
                                    "h-12 bg-white border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 justify-start text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value ? (
                                    format(
                                      new Date(field.value),
                                      "dd/MM/yyyy HH:mm"
                                    )
                                  ) : (
                                    <span>
                                      {t("Register.startDatePlaceholder")}
                                    </span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={
                                    field.value
                                      ? new Date(field.value)
                                      : undefined
                                  }
                                  onSelect={(date) => {
                                    if (date) {
                                      // Set time to current time
                                      const now = new Date();
                                      date.setHours(
                                        now.getHours(),
                                        now.getMinutes()
                                      );
                                      field.onChange(
                                        date.toISOString().slice(0, 16)
                                      );
                                    }
                                  }}
                                  disabled={(date) =>
                                    date <
                                    new Date(new Date().setHours(0, 0, 0, 0))
                                  }
                                  initialFocus
                                />
                                <div className="p-3 border-t">
                                  <Input
                                    type="time"
                                    value={
                                      field.value
                                        ? field.value.slice(11, 16)
                                        : ""
                                    }
                                    onChange={(e) => {
                                      if (field.value) {
                                        const [date] = field.value.split("T");
                                        field.onChange(
                                          `${date}T${e.target.value}`
                                        );
                                      }
                                    }}
                                    className="w-full"
                                  />
                                </div>
                              </PopoverContent>
                            </Popover>
                            <p className="text-xs text-gray-500">
                              {t("Register.startDateNote")}
                            </p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel className="text-gray-700 font-medium">
                              {t("Register.endDateLabel")}{" "}
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  aria-label={t("Register.endDateLabel")}
                                  variant={"outline"}
                                  className={cn(
                                    "h-12 bg-white border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 justify-start text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value ? (
                                    format(
                                      new Date(field.value),
                                      "dd/MM/yyyy HH:mm"
                                    )
                                  ) : (
                                    <span>
                                      {t("Register.endDatePlaceholder")}
                                    </span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={
                                    field.value
                                      ? new Date(field.value)
                                      : undefined
                                  }
                                  onSelect={(date) => {
                                    if (date) {
                                      // Set time to current time
                                      const now = new Date();
                                      date.setHours(
                                        now.getHours(),
                                        now.getMinutes()
                                      );
                                      field.onChange(
                                        date.toISOString().slice(0, 16)
                                      );
                                    }
                                  }}
                                  disabled={(date) => {
                                    const startDate = form.watch("startDate");
                                    const minDate = startDate
                                      ? new Date(startDate)
                                      : new Date();
                                    return date < minDate;
                                  }}
                                  initialFocus
                                />
                                <div className="p-3 border-t">
                                  <Input
                                    type="time"
                                    value={
                                      field.value
                                        ? field.value.slice(11, 16)
                                        : ""
                                    }
                                    onChange={(e) => {
                                      if (field.value) {
                                        const [date] = field.value.split("T");
                                        field.onChange(
                                          `${date}T${e.target.value}`
                                        );
                                      }
                                    }}
                                    className="w-full"
                                  />
                                </div>
                              </PopoverContent>
                            </Popover>
                            <p className="text-xs text-gray-500">
                              {t("Register.endDateNote")}
                            </p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Operation Area */}
                    <FormField
                      control={form.control}
                      name="operationArea"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">
                            {t("Register.operationAreaLabel")}{" "}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <Input
                            {...field}
                            placeholder={t("Register.operationAreaPlaceholder")}
                            className="h-12 bg-white border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* VAT Code */}
                    <FormField
                      control={form.control}
                      name="VATCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">
                            {t("Register.vatCodeLabel")}{" "}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <Input
                            {...field}
                            placeholder={t("Register.vatCodePlaceholder")}
                            className="h-12 bg-white border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                          />
                          <p className="text-xs text-gray-500">
                            {t("Register.vatCodeNote")}
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* File Upload */}
                    <FormField
                      control={form.control}
                      name="attachmentUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">
                            {t("Register.attachmentLabel")}
                          </FormLabel>
                          <Input
                            type="file"
                            accept=".pdf,.doc,.docx,.jpg,.png"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              field.onChange(file);
                            }}
                            className="h-12 bg-white border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                          />
                          <p className="text-xs text-gray-500">
                            {t("Register.attachmentNote")}
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Policy Checkbox for Bus Operator */}
                    <div className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-gray-200">
                      <Checkbox
                        id="policy"
                        checked={acceptedPolicy}
                        onCheckedChange={(checked) =>
                          setAcceptedPolicy(checked as boolean)
                        }
                        className="mt-1"
                      />
                      <label htmlFor="policy" className="text-sm text-gray-700">
                        {t("Register.policyAgreement1")}
                        <Policy />
                        {t("Register.policyAgreement2")}
                        <span className="text-red-500">*</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Terms and Conditions - Only show when not bus operator */}
                {!isBusOperator && (
                  <>
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        required
                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 mt-1 flex-shrink-0"
                      />
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                        {t("Register.termsAgreement")}
                      </p>
                    </div>

                    {/* Newsletter Subscription */}
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 mt-1 flex-shrink-0"
                      />
                      <p className="text-xs sm:text-sm text-gray-600">
                        {t("Register.newsletterText")}
                      </p>
                    </div>
                  </>
                )}

                <Button
                  aria-label={t("Register.creatingAccount")}
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  disabled={
                    isSubmitting ||
                    (!isBusOperator && !isPasswordStrong) ||
                    (isBusOperator && !acceptedPolicy)
                  }
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      {isBusOperator
                        ? t("Register.creatingContract")
                        : t("Register.creatingAccount")}
                    </div>
                  ) : isBusOperator ? (
                    t("Register.createContractButton")
                  ) : (
                    t("Register.createAccountButton")
                  )}
                </Button>
              </form>
            </Form>

            {/* Sign in link */}
            <div className="text-center mt-6">
              <p className="text-sm sm:text-base text-gray-600">
                {t("Register.alreadyHaveAccount")}{" "}
                <Link
                  href="/login"
                  aria-label="Sign in"
                  className="text-green-600 hover:text-green-700 font-semibold"
                >
                  {t("Register.signIn")}
                </Link>
              </p>
            </div>

            {/* Security Features */}
            <div className="mt-6 p-4 bg-green-50 rounded-xl">
              <div className="flex items-center space-x-2 text-green-700">
                <FaCheck size={16} />
                <span className="text-sm font-medium">
                  {t("Register.securityTitle")}
                </span>
              </div>
              <p className="text-xs text-green-600 mt-1">
                {t("Register.securityDesc")}
              </p>
            </div>
          </>
        ) : (
          /* Success State */
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {t("Register.successTitle")}
            </h2>
            <p className="text-gray-600 mb-6">
              {t("Register.successSent")} <br />
              <span className="font-semibold text-gray-800">{userEmail}</span>
            </p>
            <p className="text-sm text-gray-500 mb-6">
              {t("Register.successInstruction")}
            </p>
            <Button
              aria-label={t("Register.registerAnother")}
              onClick={() => {
                setRegistrationSuccess(false);
                setIsBusOperator(false);
                setAcceptedPolicy(false);
                form.reset();
              }}
              variant="outline"
              className="text-green-600 border-green-600 hover:bg-green-50"
            >
              {t("Register.registerAnother")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterForm;
