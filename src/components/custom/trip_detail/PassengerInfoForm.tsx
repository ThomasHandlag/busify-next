"use client";

import { Form, Input, FormInstance } from "antd";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect } from "react";

export interface PassengerInfo {
  phone: string;
  fullName: string;
  email: string;
}

interface PassengerInfoFormProps {
  selectedSeats: string[];
  totalPrice: number;
  onFinishAction: (values: {
    fullName: string;
    phone: string;
    email: string;
  }) => void;
  onFormInstance?: (form: FormInstance) => void; // Thêm onFormInstance với kiểu FormInstance
}

export function PassengerInfoForm({
  onFinishAction,
  onFormInstance,
}: PassengerInfoFormProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (onFormInstance) {
      onFormInstance(form);
    }
  }, [form, onFormInstance]);

  const handleSubmit = async (values: PassengerInfo) => {
    console.log("Form submitted with values:", values);
    onFinishAction(values);
  };

  return (
    <Card className="mt-4">
      <CardContent>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          validateTrigger={["onBlur", "onChange"]}
        >
          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại" },
              { pattern: /^\d{10}$/, message: "Số điện thoại phải gồm 10 số" },
            ]}
          >
            <Input
              maxLength={10}
              placeholder="Nhập số điện thoại"
              className="rounded-md"
            />
          </Form.Item>

          <Form.Item
            label="Họ và tên"
            name="fullName"
            rules={[
              { required: true, message: "Vui lòng nhập họ và tên" },
              { min: 2, message: "Họ và tên ít nhất 2 ký tự" },
            ]}
          >
            <Input placeholder="Nhập họ và tên" className="rounded-md" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không đúng định dạng" },
            ]}
          >
            <Input placeholder="Nhập email" className="rounded-md" />
          </Form.Item>
        </Form>
      </CardContent>
    </Card>
  );
}
