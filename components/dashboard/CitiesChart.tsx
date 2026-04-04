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

interface CitiesChartProps {
  cities: Array<{ _id: string; count: number }>;
}

const EMPTY_ARRAY: any[] = [];

export default function CitiesChart({
  cities: topCities = EMPTY_ARRAY,
}: CitiesChartProps) {
  const chartData = topCities.map((item) => ({
    city: item._id || "Unknown",
    visits: item.count,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cities Breakdown</CardTitle>
        <p className="text-sm text-muted-foreground">Visitors by city</p>
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
            <Bar dataKey="visits" fill="#10b981" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
