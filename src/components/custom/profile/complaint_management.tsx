"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquareWarning,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface UserComplaint {
  id: number;
  title: string;
  description: string;
  status: "pending" | "resolved" | "rejected";
  createdAt: string;
  updatedAt: string;
  tripId?: number;
  response?: string;
}

interface ComplaintManagementProps {
  userId?: string;
}

const complaintSchema = z.object({
  title: z.string().min(1, "Vui lòng nhập tiêu đề khiếu nại"),
  description: z.string().min(10, "Mô tả phải có ít nhất 10 ký tự"),
  tripId: z.string().optional(),
});

type ComplaintFormData = z.infer<typeof complaintSchema>;

export default function ComplaintManagement({
  userId,
}: ComplaintManagementProps) {
  const [complaints, setComplaints] = useState<UserComplaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<ComplaintFormData>({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      title: "",
      description: "",
      tripId: "",
    },
  });

  // Mock data - trong thực tế sẽ fetch từ API
  useEffect(() => {
    const fetchUserComplaints = async () => {
      setLoading(true);
      try {
        // Giả lập API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockComplaints: UserComplaint[] = [
          {
            id: 1,
            title: "Xe đến muộn",
            description:
              "Xe đến muộn 30 phút so với giờ dự kiến, gây ảnh hưởng đến lịch trình của tôi.",
            status: "pending",
            createdAt: "2024-01-15T10:30:00Z",
            updatedAt: "2024-01-15T10:30:00Z",
            tripId: 123,
          },
          {
            id: 2,
            title: "Ghế ngồi không sạch sẽ",
            description: "Ghế ngồi có vết bẩn và mùi khó chịu.",
            status: "resolved",
            createdAt: "2024-01-10T14:20:00Z",
            updatedAt: "2024-01-12T09:15:00Z",
            tripId: 456,
            response:
              "Chúng tôi đã xử lý vấn đề và sẽ cải thiện chất lượng vệ sinh xe. Xin lỗi vì sự bất tiện này.",
          },
          {
            id: 3,
            title: "Tài xế lái xe không an toàn",
            description: "Tài xế lái xe quá nhanh và phanh gấp nhiều lần.",
            status: "rejected",
            createdAt: "2024-01-05T16:45:00Z",
            updatedAt: "2024-01-08T11:30:00Z",
            tripId: 789,
            response:
              "Sau khi kiểm tra camera hành trình, chúng tôi thấy tài xế đã tuân thủ đúng tốc độ quy định.",
          },
        ];

        setComplaints(mockComplaints);
      } catch {
        toast.error("Không thể tải danh sách khiếu nại");
      } finally {
        setLoading(false);
      }
    };

    fetchUserComplaints();
  }, [userId]);

  const getStatusBadge = (status: UserComplaint["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="text-yellow-600 border-yellow-600"
          >
            <Clock className="w-3 h-3 mr-1" />
            Đang xử lý
          </Badge>
        );
      case "resolved":
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            <CheckCircle className="w-3 h-3 mr-1" />
            Đã giải quyết
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="text-red-600 border-red-600">
            <XCircle className="w-3 h-3 mr-1" />
            Bị từ chối
          </Badge>
        );
      default:
        return null;
    }
  };

  const onSubmit = async (data: ComplaintFormData) => {
    try {
      // Giả lập API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newComplaint: UserComplaint = {
        id: Date.now(),
        title: data.title,
        description: data.description,
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tripId: data.tripId ? parseInt(data.tripId) : undefined,
      };

      setComplaints((prev) => [newComplaint, ...prev]);
      form.reset();
      setIsDialogOpen(false);
      toast.success("Khiếu nại đã được gửi thành công");
    } catch {
      toast.error("Có lỗi xảy ra khi gửi khiếu nại");
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquareWarning className="w-5 h-5 text-orange-500" />
            <span>Quản lý khiếu nại</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center space-x-2">
          <MessageSquareWarning className="w-5 h-5 text-orange-500" />
          <span>Quản lý khiếu nại</span>
        </CardTitle>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
              <Plus className="w-4 h-4 mr-2" />
              Tạo khiếu nại
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Tạo khiếu nại mới</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tiêu đề khiếu nại</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tiêu đề..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tripId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mã chuyến đi (tùy chọn)</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập mã chuyến đi..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mô tả chi tiết</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Mô tả vấn đề bạn gặp phải..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    Gửi khiếu nại
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent>
        {complaints.length === 0 ? (
          <div className="text-center py-8">
            <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Bạn chưa có khiếu nại nào</p>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Tạo khiếu nại đầu tiên
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        ) : (
          <div className="space-y-4">
            {complaints.map((complaint) => (
              <div
                key={complaint.id}
                className="border rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-gray-900">
                        {complaint.title}
                      </h4>
                      {getStatusBadge(complaint.status)}
                    </div>
                    {complaint.tripId && (
                      <p className="text-xs text-gray-500 mb-2">
                        Chuyến đi #{complaint.tripId}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(complaint.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>

                <p className="text-gray-700 text-sm mb-3">
                  {complaint.description}
                </p>

                {complaint.response && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-xs font-medium text-blue-800 mb-1">
                      Phản hồi:
                    </p>
                    <p className="text-sm text-blue-700">
                      {complaint.response}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
