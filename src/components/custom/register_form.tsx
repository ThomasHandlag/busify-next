"use client";
import { useForm } from "react-hook-form";
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
export const RegisterForm = () => {
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

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // If registering as bus operator, validate contract fields
      if (isBusOperator) {
        if (!acceptedPolicy) {
          toast.error("Vui lòng đồng ý với chính sách của website");
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
          toast.error("Vui lòng điền đầy đủ thông tin hợp đồng");
          setIsSubmitting(false);
          return;
        }

        // Validate phone format
        const PHONE_PATTERN = /^[\+]?[0-9]{10,15}$/;
        if (!PHONE_PATTERN.test(data.phone)) {
          toast.error(
            "Số điện thoại không đúng định dạng (10-15 chữ số, có thể có +)"
          );
          setIsSubmitting(false);
          return;
        }

        // Validate VAT code format
        const VAT_CODE_PATTERN = /^[0-9]{10,15}$/;
        if (!VAT_CODE_PATTERN.test(data.VATCode)) {
          toast.error("Mã số thuế phải từ 10-15 chữ số");
          setIsSubmitting(false);
          return;
        }

        // Validate dates
        const startDate = new Date(data.startDate);
        const endDate = new Date(data.endDate);
        const now = new Date();

        if (startDate < now) {
          toast.error("Ngày bắt đầu phải là ngày hiện tại hoặc tương lai");
          setIsSubmitting(false);
          return;
        }

        if (endDate <= startDate) {
          toast.error("Ngày kết thúc phải sau ngày bắt đầu");
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
          toast.success(
            "Đăng ký hợp đồng thành công! Chờ xác nhận từ quản trị viên."
          );
          setUserEmail(data.email);
          setRegistrationSuccess(true);
        } else {
          toast.error("Có lỗi xảy ra khi đăng ký hợp đồng");
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
          toast.success(
            "Đăng ký tài khoản thành công! Vui lòng kiểm tra email để xác thực tài khoản."
          );
          setRegistrationSuccess(true);
        } else {
          // Handle error
          toast.error((response.message as string) || "Registration failed");
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An error occurred during registration");
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

    const unmetRequirements = [];
    if (!requirements.length) unmetRequirements.push("Ít nhất 6 ký tự");
    if (!requirements.uppercase) unmetRequirements.push("Một chữ cái viết hoa");
    if (!requirements.lowercase)
      unmetRequirements.push("Một chữ cái viết thường");
    if (!requirements.number) unmetRequirements.push("Một chữ số");
    if (!requirements.special) unmetRequirements.push("Một ký tự đặc biệt");

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
                Create Account
              </h2>
              <p className="text-sm sm:text-base text-gray-500">
                Join Busify today and get started
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
                          Full Name <span className="text-red-500">*</span>
                        </FormLabel>
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter your full name"
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
                        Email Address <span className="text-red-500">*</span>
                      </FormLabel>
                      <Input
                        {...field}
                        type="email"
                        placeholder="Enter your email"
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
                        Phone Number{" "}
                        {isBusOperator && (
                          <span className="text-red-500">*</span>
                        )}
                      </FormLabel>
                      <Input
                        {...field}
                        type="tel"
                        placeholder={
                          isBusOperator
                            ? "0123456789"
                            : "Enter your phone number"
                        }
                        className="h-12 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      />
                      {isBusOperator && (
                        <p className="text-xs text-gray-500">
                          Số điện thoại từ 10-15 chữ số (có thể bắt đầu bằng +)
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
                          Password <span className="text-red-500">*</span>
                        </FormLabel>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a strong password"
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
                                  Mật khẩu đủ mạnh
                                </span>
                              ) : (
                                <span className="text-red-500">
                                  Cần:{" "}
                                  {[
                                    !passwordRequirements.requirements.length &&
                                      "6+ ký tự",
                                    !passwordRequirements.requirements
                                      .uppercase && "chữ hoa",
                                    !passwordRequirements.requirements
                                      .lowercase && "chữ thường",
                                    !passwordRequirements.requirements.number &&
                                      "số",
                                    !passwordRequirements.requirements
                                      .special && "ký tự đặc biệt",
                                  ]
                                    .filter(Boolean)
                                    .join(", ")}
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
                          Confirm Password{" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
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
                      Đăng ký với tư cách Bus Operator
                    </label>
                    <p className="text-xs text-blue-700 mt-1">
                      Tick vào đây nếu bạn muốn đăng ký trở thành đối tác nhà xe
                      của Busify
                    </p>
                  </div>
                </div>

                {/* Bus Operator Fields - Only show when checkbox is checked */}
                {isBusOperator && (
                  <div className="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      Thông tin hợp đồng nhà xe
                    </h3>

                    {/* Address */}
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">
                            Địa chỉ <span className="text-red-500">*</span>
                          </FormLabel>
                          <Textarea
                            {...field}
                            placeholder="123 ABC Street, Ho Chi Minh City"
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
                              Ngày bắt đầu{" "}
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
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
                                    <span>Chọn ngày bắt đầu</span>
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
                              Chọn ngày và giờ bắt đầu hợp đồng
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
                              Ngày kết thúc{" "}
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
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
                                    <span>Chọn ngày kết thúc</span>
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
                              Chọn ngày và giờ kết thúc hợp đồng
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
                            Khu vực hoạt động{" "}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <Input
                            {...field}
                            placeholder="Ho Chi Minh - Da Nang"
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
                            Mã số thuế <span className="text-red-500">*</span>
                          </FormLabel>
                          <Input
                            {...field}
                            placeholder="0101234562"
                            className="h-12 bg-white border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                          />
                          <p className="text-xs text-gray-500">
                            Mã số thuế phải từ 10-15 chữ số
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
                            Tài liệu đính kèm
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
                            Chấp nhận file PDF, DOC, DOCX, JPG, PNG (tối đa
                            10MB)
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
                        Tôi đồng ý với <Policy /> của Busify{" "}
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
                        I agree to the{" "}
                        <a
                          href="#"
                          className="text-green-600 hover:text-green-700 font-medium"
                        >
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a
                          href="#"
                          className="text-green-600 hover:text-green-700 font-medium"
                        >
                          Privacy Policy
                        </a>
                      </p>
                    </div>

                    {/* Newsletter Subscription */}
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 mt-1 flex-shrink-0"
                      />
                      <p className="text-xs sm:text-sm text-gray-600">
                        I want to receive updates and marketing communications
                      </p>
                    </div>
                  </>
                )}

                <Button
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
                        ? "Đang tạo hợp đồng..."
                        : "Creating Account..."}
                    </div>
                  ) : isBusOperator ? (
                    "Tạo hợp đồng"
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </Form>

            {/* Sign in link */}
            <div className="text-center mt-6">
              <p className="text-sm sm:text-base text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  aria-label="Sign in"
                  className="text-green-600 hover:text-green-700 font-semibold"
                >
                  Sign in
                </Link>
              </p>
            </div>

            {/* Security Features */}
            <div className="mt-6 p-4 bg-green-50 rounded-xl">
              <div className="flex items-center space-x-2 text-green-700">
                <FaCheck size={16} />
                <span className="text-sm font-medium">
                  Your data is secure with us
                </span>
              </div>
              <p className="text-xs text-green-600 mt-1">
                We use industry-standard encryption to protect your information
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
              Check your email
            </h2>
            <p className="text-gray-600 mb-6">
              We&apos;ve sent a verification link to <br />
              <span className="font-semibold text-gray-800">{userEmail}</span>
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Please check your email and click the verification link to
              activate your account.
            </p>
            <Button
              onClick={() => {
                setRegistrationSuccess(false);
                setIsBusOperator(false);
                setAcceptedPolicy(false);
                form.reset();
              }}
              variant="outline"
              className="text-green-600 border-green-600 hover:bg-green-50"
            >
              Register another account
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterForm;
