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
} from "recharts";

interface EventsOverTimeChartProps {
  dailyEvents: Array<{ _id: string; count: number }>;
}

export default function EventsOverTimeChart({
  dailyEvents = [],
}: EventsOverTimeChartProps) {
  const chartData = dailyEvents
    .map((item) => ({
      date: new Date(item._id).toLocaleDateString("en-IN", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      events: item.count,
    }))
    .reverse();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Events Over Time</CardTitle>
        <p className="text-sm text-muted-foreground">
          Daily event count for the last 30 days
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
            <Tooltip />
            <Line
              type="monotone"
              dataKey="events"
              stroke="#2563eb"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
