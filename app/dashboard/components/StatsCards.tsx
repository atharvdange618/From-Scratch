import { Activity, Users, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardsProps {
  totalEvents: number;
  uniqueSessions: number;
  uniqueVisitors: number;
}

export default function StatsCards({
  totalEvents = 0,
  uniqueSessions = 0,
  uniqueVisitors = 0,
}: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Events</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalEvents.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            All tracked interactions
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Unique Sessions</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {uniqueSessions.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            Distinct user sessions
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {uniqueVisitors.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">Distinct IP addresses</p>
        </CardContent>
      </Card>
    </div>
  );
}
