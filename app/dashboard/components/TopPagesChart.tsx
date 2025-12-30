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

interface TopPagesChartProps {
  topPages: Array<{ _id: string; count: number }>;
}

export default function TopPagesChart({ topPages = [] }: TopPagesChartProps) {
  const chartData = topPages.slice(0, 10).map((item) => ({
    page: item._id.length > 30 ? item._id.substring(0, 30) + "..." : item._id,
    views: item.count,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Pages</CardTitle>
        <p className="text-sm text-muted-foreground">
          Most visited pages (top 10)
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tick={{ fontSize: 12 }} />
            <YAxis
              dataKey="page"
              type="category"
              width={150}
              tick={{ fontSize: 10 }}
            />
            <Tooltip />
            <Bar dataKey="views" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
