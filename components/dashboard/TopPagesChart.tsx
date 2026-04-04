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

const EMPTY_ARRAY: any[] = [];

export default function TopPagesChart({
  topPages = EMPTY_ARRAY,
}: TopPagesChartProps) {
  const chartData = topPages.slice(0, 10).map((item) => ({
    page: item._id.length > 30 ? item._id.substring(0, 30) + "..." : item._id,
    fullPage: item._id,
    views: item.count,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "6px",
            color: "#ffffff",
            padding: "8px 12px",
            maxWidth: "400px",
          }}
        >
          <p
            style={{
              fontWeight: 500,
              marginBottom: "4px",
              wordBreak: "break-all",
            }}
          >
            {payload[0].payload.fullPage}
          </p>
          <p style={{ color: "#60a5fa" }}>views: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

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
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
            />
            <Bar dataKey="views" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
