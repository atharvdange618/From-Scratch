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

interface TopCountriesChartProps {
  topCountries: Array<{ _id: string; count: number }>;
}

export default function TopCountriesChart({
  topCountries = [],
}: TopCountriesChartProps) {
  const chartData = topCountries.slice(0, 10).map((item) => ({
    country: item._id || "Unknown",
    visits: item.count,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Countries</CardTitle>
        <p className="text-sm text-muted-foreground">
          Visitors by country (top 10)
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="country" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="visits" fill="#16a34a" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
