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

const EMPTY_ARRAY: any[] = [];

export default function OperatingSystemChart({
  osBreakdown = EMPTY_ARRAY,
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
            <Bar dataKey="count" fill="#3a86ff" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
