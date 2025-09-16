import { z } from "zod";

// Schema base (chung cho cả user thường và bus operator)
const baseSchema = z.object({
  email: z.email("Địa chỉ email không hợp lệ").min(2).max(50),
  phone: z.string().optional(),
  address: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  operationArea: z.string().optional(),
  VATCode: z.string().optional(),
  attachmentUrl: z.any().optional(),
});

// Schema cho user thường
export const userSchema = baseSchema
  .extend({
    fullName: z.string().min(2, "Họ và tên là bắt buộc").max(50),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự").max(100),
    confirmPassword: z
      .string()
      .min(6, "Xác nhận mật khẩu phải có ít nhất 6 ký tự")
      .max(100),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp nhau",
    path: ["confirmPassword"],
  });

// Schema cho Bus Operator
export const busOperatorSchema = baseSchema.extend({
  phone: z.string().min(10, "Số điện thoại bắt buộc"),
  address: z.string().min(5, "Địa chỉ bắt buộc"),
  startDate: z.string().min(1, "Ngày bắt đầu bắt buộc"),
  endDate: z.string().min(1, "Ngày kết thúc bắt buộc"),
  operationArea: z.string().min(1, "Khu vực hoạt động bắt buộc"),
  VATCode: z.string().min(10, "Mã số thuế bắt buộc"),
});
