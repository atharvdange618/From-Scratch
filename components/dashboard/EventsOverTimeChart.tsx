"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface EventsOverTimeChartProps {
  dailyEvents: Array<{ _id: string; count: number }>;
  dailyUniqueVisitors: Array<{ _id: string; uniqueVisitors: number }>;
}

const EMPTY_ARRAY: any[] = [];

export default function EventsOverTimeChart({
  dailyEvents = EMPTY_ARRAY,
  dailyUniqueVisitors = EMPTY_ARRAY,
}: EventsOverTimeChartProps) {
  const visitorsMap = new Map(
    dailyUniqueVisitors.map((item) => [item._id, item.uniqueVisitors]),
  );

  const chartData = dailyEvents
    .map((item) => ({
      date: new Date(item._id).toLocaleDateString("en-IN", {
        timeZone: "Asia/Kolkata",
        month: "short",
        day: "numeric",
      }),
      pageViews: item.count,
      uniqueVisitors: visitorsMap.get(item._id) || 0,
    }))
    .reverse();

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Traffic Over Time</CardTitle>
        <p className="text-sm text-muted-foreground">
          Page views vs unique visitors for the last 30 days
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={70}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0, 0, 0, 0.85)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "6px",
                color: "#ffffff",
                padding: "8px 12px",
              }}
              labelStyle={{ color: "#ffffff", fontWeight: 500 }}
              cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="uniqueVisitors"
              stroke="#2563eb"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              name="Unique Visitors"
            />
            <Line
              type="monotone"
              dataKey="pageViews"
              stroke="#16a34a"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              name="Page Views"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
