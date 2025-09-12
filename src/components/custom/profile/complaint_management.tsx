"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquareWarning,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { Complaint } from "@/lib/data/complaints"; // Import Complaint từ complaints.ts
import { useTranslations } from "next-intl";

interface ComplaintManagementProps {
  userId?: string;
  complaints?: Complaint[]; // Sử dụng Complaint thay vì UserComplaint
}

export default function ComplaintManagement({
  complaints = [], // Mặc định là mảng rỗng nếu không truyền
}: ComplaintManagementProps) {
  const t = useTranslations();
  const getStatusBadge = (status: Complaint["status"]) => {
    switch (status) {
      case "New":
        return (
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            <Clock className="w-3 h-3 mr-1" />
            {t("Complaint.status.new")}
          </Badge>
        );
      case "in_progress":
        return (
          <Badge
            variant="outline"
            className="text-orange-600 border-orange-600"
          >
            <Clock className="w-3 h-3 mr-1" />
            {t("Complaint.status.in_progress")}
          </Badge>
        );
      case "pending":
        return (
          <Badge
            variant="outline"
            className="text-yellow-600 border-yellow-600"
          >
            <Clock className="w-3 h-3 mr-1" />
            {t("Complaint.status.pending")}
          </Badge>
        );
      case "resolved":
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            <CheckCircle className="w-3 h-3 mr-1" />
            {t("Complaint.status.resolved")}
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="text-red-600 border-red-600">
            <XCircle className="w-3 h-3 mr-1" />
            {t("Complaint.status.rejected")}
          </Badge>
        );
      default:
        return null;
    }
  };

  if (complaints.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquareWarning className="w-5 h-5 text-orange-500" />
            <span>{t("Complaint.management")}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">{t("Complaint.noComplaints")}</p>
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
          <span>{t("Complaint.management")}</span>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="max-h-96 overflow-y-auto space-y-4">
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
            {t("Complaint.tripId", { id: complaint.tripId })}
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
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
