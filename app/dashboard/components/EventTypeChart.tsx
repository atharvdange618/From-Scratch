"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface EventTypeChartProps {
  eventTypeDistribution: Array<{ _id: string; count: number }>;
}

const COLORS = [
  "#2563eb",
  "#7c3aed",
  "#db2777",
  "#ea580c",
  "#ca8a04",
  "#16a34a",
  "#0891b2",
  "#4f46e5",
];

export default function EventTypeChart({
  eventTypeDistribution = [],
}: EventTypeChartProps) {
  const chartData = eventTypeDistribution.map((item) => ({
    name: item._id.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    value: item.count,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Type Distribution</CardTitle>
        <p className="text-sm text-muted-foreground">
          Breakdown of all tracked event types
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name} (${(percent * 100).toFixed(0)}%)`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
