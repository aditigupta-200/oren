"use client";

import { CalculatedMetrics } from "@/types/esg";
import { Card, CardContent } from "@/components/ui/card";

interface MetricsCardsGridProps {
  metrics: CalculatedMetrics;
}

export function MetricsCardsGrid({ metrics }: MetricsCardsGridProps) {
  const metricsCards = [
    {
      title: "Carbon Intensity",
      value: metrics.carbonIntensity.toFixed(6),
      unit: "T CO2e/INR",
      icon: "🏭",
      color: "text-red-600",
      benchmark: 0.02,
      status: metrics.carbonIntensity < 0.02 ? "good" : "needs improvement",
    },
    {
      title: "Renewable Energy",
      value: metrics.renewableRatio.toFixed(1),
      unit: "%",
      icon: "⚡",
      color: "text-green-600",
      benchmark: 50,
      status:
        metrics.renewableRatio >= 50
          ? "excellent"
          : metrics.renewableRatio >= 25
          ? "good"
          : "needs improvement",
    },
    {
      title: "Gender Diversity",
      value: metrics.diversityRatio.toFixed(1),
      unit: "%",
      icon: "👥",
      color: "text-purple-600",
      benchmark: 30,
      status:
        metrics.diversityRatio >= 30
          ? "excellent"
          : metrics.diversityRatio >= 20
          ? "good"
          : "needs improvement",
    },
    {
      title: "Community Investment",
      value: metrics.communitySpendRatio.toFixed(2),
      unit: "% of Revenue",
      icon: "🤝",
      color: "text-blue-600",
      benchmark: 2,
      status:
        metrics.communitySpendRatio >= 2
          ? "excellent"
          : metrics.communitySpendRatio >= 1
          ? "good"
          : "needs improvement",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {metricsCards.map((card, index) => (
        <Card key={index} className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl">{card.icon}</span>
              <span
                className={`text-sm font-medium px-2 py-1 rounded-full ${
                  card.status === "excellent"
                    ? "bg-green-100 text-green-800"
                    : card.status === "good"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {card.status}
              </span>
            </div>
            <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
            <div className={`text-2xl font-bold ${card.color} mb-1`}>
              {card.value}
              <span className="text-sm text-gray-500 ml-1">{card.unit}</span>
            </div>
            <p className="text-sm text-gray-500">
              Benchmark: {card.benchmark} {card.unit}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
