"use client";

import { Insight } from "@/types/esg";
import { Card, CardContent } from "@/components/ui/card";

interface InsightsSectionProps {
  insights: Insight[];
}

export function InsightsSection({ insights }: InsightsSectionProps) {
  const getInsightColor = (
    type: Insight["type"],
    impact: Insight["impact"]
  ) => {
    const colors = {
      achievement: {
        high: "bg-green-50 border-green-200 text-green-700",
        medium: "bg-green-50 border-green-200 text-green-600",
        low: "bg-green-50 border-green-200 text-green-500",
      },
      improvement: {
        high: "bg-yellow-50 border-yellow-200 text-yellow-700",
        medium: "bg-yellow-50 border-yellow-200 text-yellow-600",
        low: "bg-yellow-50 border-yellow-200 text-yellow-500",
      },
      trend: {
        high: "bg-blue-50 border-blue-200 text-blue-700",
        medium: "bg-blue-50 border-blue-200 text-blue-600",
        low: "bg-blue-50 border-blue-200 text-blue-500",
      },
    };
    return colors[type][impact];
  };

  return (
    <div className="space-y-4 mb-8">
      <h2 className="text-2xl font-bold mb-4">Key Insights</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight, index) => (
          <Card
            key={index}
            className={`border ${getInsightColor(
              insight.type,
              insight.impact
            )}`}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{insight.icon}</span>
                <div>
                  <h3 className="font-semibold mb-1">{insight.title}</h3>
                  <p className="text-sm mb-2">{insight.message}</p>
                  {insight.recommendation && (
                    <p className="text-sm font-medium">
                      Recommendation: {insight.recommendation}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
