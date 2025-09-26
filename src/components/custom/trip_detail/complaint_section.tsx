import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Complaint, getComplaintsByTripId } from "@/lib/data/complaints";
import { MessageSquareWarning, User } from "lucide-react";
import LocaleText from "../locale_text";

export default async function ComplaintSection({ tripId }: { tripId: number }) {
  const complaints: Complaint[] = await getComplaintsByTripId(tripId);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageSquareWarning className="w-5 h-5 text-destructive" />
          <span>
            <LocaleText string="complaint" name="Complaint" />
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {complaints.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            <LocaleText string="noComplaints" name="No Complaints" />
          </p>
        ) : (
          <div className="space-y-4">
            {complaints.map((complaint) => (
              <ComplaintItem key={complaint.id} complaint={complaint} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

const ComplaintItem = ({ complaint }: { complaint: Complaint }) => {
  return (
    <div key={complaint.id} className="border-b pb-4 last:border-b-0">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <User className="w-4 h-4 text-muted-foreground" />
        </div>
        <p className="text-xs text-muted-foreground">
          {new Date(complaint.createdAt).toLocaleDateString()}
        </p>
      </div>
      <p className="font-semibold text-foreground mb-1">{complaint.title}</p>
      <p className="text-muted-foreground text-sm">{complaint.description}</p>
    </div>
  );
};

export { ComplaintItem };
