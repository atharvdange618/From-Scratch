import { AlertCircle, Calendar, Clock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatDate } from "@/lib/dateandnumbers";

interface RetentionIndicatorProps {
  retentionData?: {
    oldestEvent: string | null;
    newestEvent: string | null;
    totalDays: number;
    daysUntilDeletion: number;
  };
}

export default function RetentionIndicator({
  retentionData,
}: RetentionIndicatorProps) {
  if (!retentionData || !retentionData.oldestEvent) {
    return (
      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No Data</AlertTitle>
        <AlertDescription>
          No analytics events have been tracked yet. Start browsing your site to
          see data appear here.
        </AlertDescription>
      </Alert>
    );
  }

  const oldestDate = formatDate(retentionData.oldestEvent);

  const newestDate = formatDate(retentionData.newestEvent!);

  return (
    <Alert className="mb-6 border-blue-200 bg-blue-50">
      <Calendar className="h-4 w-4 text-blue-600" />
      <AlertTitle className="text-blue-900">Data Retention</AlertTitle>
      <AlertDescription className="text-blue-800">
        <div className="mt-2 space-y-1">
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3" />
            <span className="text-sm">
              Oldest event: <strong>{oldestDate}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3" />
            <span className="text-sm">
              Newest event: <strong>{newestDate}</strong>
            </span>
          </div>
          <div className="mt-2 text-sm">
            Events are automatically deleted after 90 days.{" "}
            <strong>{retentionData.daysUntilDeletion}</strong> days remaining
            until oldest events are removed.
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
}
