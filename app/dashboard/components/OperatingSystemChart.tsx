"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface OperatingSystemChartProps {
  osBreakdown: Array<{ _id: string; count: number }>;
}

export default function OperatingSystemChart({
  osBreakdown = [],
}: OperatingSystemChartProps) {
  const chartData = osBreakdown.map((item) => ({
    os: item._id || "Unknown",
    count: item.count,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Operating System Breakdown</CardTitle>
        <p className="text-sm text-muted-foreground">
          Visits by operating system
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="os" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="count" fill="#3a86ff" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
