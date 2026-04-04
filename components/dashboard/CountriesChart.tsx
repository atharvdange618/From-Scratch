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

interface CountriesChartProps {
  countries: Array<{ _id: string; count: number }>;
}

const EMPTY_ARRAY: any[] = [];

export default function CountriesChart({
  countries: topCountries = EMPTY_ARRAY,
}: CountriesChartProps) {
  const chartData = topCountries.map((item) => ({
    country: item._id || "Unknown",
    visits: item.count,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Countries Breakdown</CardTitle>
        <p className="text-sm text-muted-foreground">Visitors by country</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="country" tick={{ fontSize: 12 }} />
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
            <Bar dataKey="visits" fill="#16a34a" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
