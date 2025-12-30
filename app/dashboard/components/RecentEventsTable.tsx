import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDateTimeIST } from "@/lib/dateandnumbers";

interface AnalyticsEvent {
  _id: string;
  eventType: string;
  eventData: Record<string, any>;
  sessionId: string;
  timestamp: string;
  ipAddress: string;
  country: string;
  city: string;
  device: string;
  browser: string;
  os: string;
}

interface RecentEventsTableProps {
  events: AnalyticsEvent[];
}

export default function RecentEventsTable({
  events = [],
}: RecentEventsTableProps) {
  const formatEventType = (type: string) => {
    return type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const getEventTypeColor = (type: string) => {
    const colorMap: Record<string, string> = {
      page_view: "bg-blue-500",
      blog_search: "bg-purple-500",
      contact_form_submit: "bg-green-500",
      external_link_click: "bg-orange-500",
      scroll_depth: "bg-yellow-500",
      social_click: "bg-pink-500",
      search_opened: "bg-indigo-500",
      search_query: "bg-violet-500",
    };
    return colorMap[type] || "bg-gray-500";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Events</CardTitle>
        <p className="text-sm text-muted-foreground">
          Latest 10 tracked events
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event Type</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Device</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground"
                  >
                    No events tracked yet
                  </TableCell>
                </TableRow>
              ) : (
                events.map((event) => (
                  <TableRow key={event._id}>
                    <TableCell>
                      <Badge className={getEventTypeColor(event.eventType)}>
                        {formatEventType(event.eventType)}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-sm">
                      {event.eventData?.page ||
                        event.eventData?.query ||
                        event.eventData?.url ||
                        event.eventData?.postTitle ||
                        "-"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {event.city && event.country
                        ? `${event.city}, ${event.country}`
                        : event.country || "-"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {event.device || "-"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDateTimeIST(event.timestamp)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
