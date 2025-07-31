import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getComplaintsByTripId } from "@/lib/data/complaints";
import { Complaint } from "@/lib/types/widget_proptype";
import { MessageSquareWarning, User } from "lucide-react";


export default async function ComplaintSection({ tripId }: { tripId: number }) {
  const complaints: Complaint[] = await getComplaintsByTripId(tripId);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageSquareWarning className="w-5 h-5 text-red-500" />
          <span>Khiếu nại</span>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {complaints.length === 0 ? (
          <p className="text-sm text-gray-500">Chưa có khiếu nại nào.</p>
        ) : (
          <div className="space-y-4">
            {complaints.map((complaint) => (
              <div key={complaint.id} className="border-b pb-4 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{complaint.customerName}</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {new Date(complaint.createAt).toLocaleDateString()}
                  </p>
                </div>
                <p className="font-semibold text-gray-800 mb-1">
                  {complaint.title}
                </p>
                <p className="text-gray-600 text-sm">{complaint.description}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
