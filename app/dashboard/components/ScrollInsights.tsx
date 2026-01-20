"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, TrendingUp, CheckCircle2, Eye } from "lucide-react";

interface ScrollInsightsProps {
  scrollInsights: {
    averageDepth: number;
    engagementRate: number;
    completionRate: number;
    deepReadRate: number;
  };
}

export default function ScrollInsights({
  scrollInsights,
}: ScrollInsightsProps) {
  const insights = [
    {
      label: "Average Scroll Depth",
      value: scrollInsights.averageDepth,
      icon: Eye,
      color: "text-blue-600",
      description: "How far users scroll on average",
    },
    {
      label: "Engagement Rate",
      value: scrollInsights.engagementRate,
      icon: TrendingUp,
      color: "text-green-600",
      description: "Users who scroll past 50%",
    },
    {
      label: "Deep Read Rate",
      value: scrollInsights.deepReadRate,
      icon: BookOpen,
      color: "text-purple-600",
      description: "Users who scroll past 75%",
    },
    {
      label: "Completion Rate",
      value: scrollInsights.completionRate,
      icon: CheckCircle2,
      color: "text-orange-600",
      description: "Users who scroll to bottom (90%+)",
    },
  ];

  return (
    <Card className="col-span-2 mt-4">
      <CardHeader>
        <CardTitle>Reading Engagement</CardTitle>
        <p className="text-sm text-muted-foreground">
          Insights derived from scroll depth tracking
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {insights.map((insight) => {
            const Icon = insight.icon;
            return (
              <div key={insight.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${insight.color}`} />
                    <span className="text-sm font-medium text-muted-foreground">
                      {insight.label}
                    </span>
                  </div>
                  <span className="text-2xl font-bold">{insight.value}%</span>
                </div>
                <Progress value={insight.value} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {insight.description}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
