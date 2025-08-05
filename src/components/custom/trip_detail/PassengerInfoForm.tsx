"use client";

import { Form, Input } from "antd";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface PassengerInfo {
  phone: string;
  fullName: string;
  email: string;
}

interface PassengerInfoFormProps {
  onInfoSubmit: (info: PassengerInfo) => void;
}

export function PassengerInfoForm({ onInfoSubmit }: PassengerInfoFormProps) {
  const [form] = Form.useForm();

  const handleSubmit = async (values: PassengerInfo) => {
    onInfoSubmit(values);
  };

  return (
    <Card className="mt-4">
      <CardContent>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          validateTrigger="onBlur"
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
              onChange={() => form.validateFields(["phone"]).then(() => form.submit())}
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
            <Input
              placeholder="Nhập họ và tên"
              className="rounded-md"
              onChange={() => form.validateFields(["fullName"]).then(() => form.submit())}
            />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không đúng định dạng" },
            ]}
          >
            <Input
              placeholder="Nhập email"
              className="rounded-md"
              onChange={() => form.validateFields(["email"]).then(() => form.submit())}
            />
          </Form.Item>
        </Form>
      </CardContent>
    </Card>
  );
}