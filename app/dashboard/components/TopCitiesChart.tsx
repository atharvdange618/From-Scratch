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

interface TopCitiesChartProps {
  topCities: Array<{ _id: string; count: number }>;
}

export default function TopCitiesChart({
  topCities = [],
}: TopCitiesChartProps) {
  const chartData = topCities.map((item) => ({
    city: item._id || "Unknown",
    visits: item.count,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Cities</CardTitle>
        <p className="text-sm text-muted-foreground">
          Visitors by city (top 10)
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis
              dataKey="city"
              type="category"
              width={100}
              tick={{ fontSize: 12 }}
            />
            <Tooltip />
            <Bar dataKey="visits" fill="#10b981" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
