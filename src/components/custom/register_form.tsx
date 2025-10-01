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
import RegistSVG from "./regist_svg";
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
    <div className="w-full mx-auto">
      <div>
        {!registrationSuccess ? (
          <div className="grid grid-cols-1 lg:grid-cols-6 lg:space-x-6">
            <div className="hidden lg:block col-span-4"><RegistSVG /></div>
            <div className="bg-background lg:p-10 p-2 col-span-2">
              <div className="text-center mb-5">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                    {t("Register.title")}
                  </h2>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    {t("Register.subtitle")}
                  </p>
                </div>
              </div>

              {/* Register Form */}
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4 sm:space-y-5 grid grid-cols-1 lg:grid-cols-2 gap-2"
                >
                  {/* Full Name - Only show when not bus operator */}
                  {!isBusOperator && (
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t("fullName")}{" "}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <Input
                            {...field}
                            type="text"
                            placeholder={t("fullName")}
                            required
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
                        <FormLabel className="text-foreground font-medium">
                          {t("email")} <span className="text-red-500">*</span>
                        </FormLabel>
                        <Input
                          {...field}
                          type="email"
                          placeholder={t("email")}
                          required
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
                        <FormLabel className="text-foreground font-medium">
                          {t("phone")}{" "}
                          {isBusOperator && (
                            <span className="text-red-500">*</span>
                          )}
                        </FormLabel>
                        <Input
                          {...field}
                          type="tel"
                          placeholder={t("Register.placeholderPhone")}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div></div>

                  {/* Password - Only show when not bus operator */}
                  {!isBusOperator && (
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground font-medium">
                            {t("password")}{" "}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <div className="relative">
                            <Input
                              {...field}
                              type={showPassword ? "text" : "password"}
                              placeholder={t("Register.placeholderPassword")}
                              required
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
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
                                  <span className="text-primary">
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
                          <FormLabel className="text-foreground font-medium">
                            {t("confirmPassword")}{" "}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <div className="relative">
                            <Input
                              {...field}
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder={t("confirmPassword")}
                              required
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
                  <div className="flex items-start space-x-3 p-4 bg-primary/5 rounded-xl border border-primary/20">
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
                        className="text-sm font-medium text-primary cursor-pointer flex items-center gap-2"
                      >
                        <Building2 className="w-4 h-4" />
                        {t("Register.busOperatorLabel")}
                      </label>
                      <p className="text-xs text-primary mt-1">
                        {t("Register.busOperatorNote")}
                      </p>
                    </div>
                  </div>
                  <div></div>
                  {/* Bus Operator Fields - Only show when checkbox is checked */}
                  {isBusOperator && (
                    <div className="space-y-4 col-span-1 lg:col-span-2">
                      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                        <Building2 className="w-5 h-5" />
                        {t("Register.contractInfoTitle")}
                      </h3>
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground font-medium">
                              {t("Register.addressLabel")}{" "}
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <Textarea
                              {...field}
                              placeholder={t("Register.addressPlaceholder")}
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
                              <FormLabel className="text-foreground font-medium">
                                {t("Register.startDateLabel")}{" "}
                                <span className="text-red-500">*</span>
                              </FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    aria-label={t("Register.startDateLabel")}
                                    variant={"outline"}
                                    className={cn(
                                      "h-12 bg-background border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 justify-start text-left font-normal",
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
                                    autoFocus
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
                              <p className="text-xs text-muted-foreground">
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
                              <FormLabel className="text-foreground font-medium">
                                {t("Register.endDateLabel")}{" "}
                                <span className="text-red-500">*</span>
                              </FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    aria-label={t("Register.endDateLabel")}
                                    variant={"outline"}
                                    className={cn(
                                      "h-12 bg-background border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 justify-start text-left font-normal",
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
                              <p className="text-xs text-muted-foreground">
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
                            <FormLabel className="text-foreground font-medium">
                              {t("Register.operationAreaLabel")}{" "}
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <Input
                              {...field}
                              placeholder={t(
                                "Register.operationAreaPlaceholder"
                              )}
                              className="h-12 bg-background border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
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
                            <FormLabel className="text-foreground font-medium">
                              {t("Register.vatCodeLabel")}{" "}
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <Input
                              {...field}
                              placeholder={t("Register.vatCodePlaceholder")}
                              className="h-12 bg-background border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                            />
                            <p className="text-xs text-muted-foreground">
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
                            <FormLabel className="text-foreground font-medium">
                              {t("Register.attachmentLabel")}
                            </FormLabel>
                            <Input
                              type="file"
                              accept=".pdf,.doc,.docx,.jpg,.png"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                field.onChange(file);
                              }}
                              className="h-12 bg-background border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-accent-foreground hover:file:bg-accent/80"
                            />
                            <p className="text-xs text-muted-foreground">
                              {t("Register.attachmentNote")}
                            </p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Policy Checkbox for Bus Operator */}
                      <div className="flex items-start space-x-3 p-3 bg-background rounded-lg border border-border">
                        <Checkbox
                          id="policy"
                          checked={acceptedPolicy}
                          onCheckedChange={(checked) =>
                            setAcceptedPolicy(checked as boolean)
                          }
                          className="mt-1"
                        />
                        <label
                          htmlFor="policy"
                          className="text-sm text-foreground"
                        >
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
                          className="w-4 h-4 text-primary border-border rounded focus:ring-primary mt-1 flex-shrink-0"
                        />
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          {t("Register.termsAgreement")}
                        </p>
                      </div>

                      {/* Newsletter Subscription */}
                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-primary border-border rounded focus:ring-primary mt-1 flex-shrink-0"
                        />
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {t("Register.newsletterText")}
                        </p>
                      </div>
                    </>
                  )}

                  <Button
                    aria-label={t("Register.creatingAccount")}
                    type="submit"
                    className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
                <p className="text-sm sm:text-base text-muted-foreground">
                  {t("Register.alreadyHaveAccount")}{" "}
                  <Link
                    href="/login"
                    aria-label="Sign in"
                    className="text-primary hover:text-primary/80 font-semibold"
                  >
                    {t("Register.signIn")}
                  </Link>
                </p>
              </div>

              {/* Security Features */}
              <div>
                <div className="mt-6 p-4 bg-accent rounded-xl">
                  <div className="flex items-center space-x-2 text-accent-foreground">
                    <FaCheck size={16} />
                    <span className="text-sm font-medium">
                      {t("Register.securityTitle")}
                    </span>
                  </div>
                  <p className="text-xs text-primary mt-1">
                    {t("Register.securityDesc")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Success State */
          <div className="text-center">
            <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-primary"
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
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {t("Register.successTitle")}
            </h2>
            <p className="text-muted-foreground mb-6">
              {t("Register.successSent")} <br />
              <span className="font-semibold text-foreground">{userEmail}</span>
            </p>
            <p className="text-sm text-muted-foreground mb-6">
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
              className="text-primary border-primary hover:bg-accent"
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
