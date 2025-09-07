"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ESGInputData,
  CalculatedMetrics,
  ESGScores,
  ESGResponse,
} from "@/types/esg";
import {
  calculateMetrics,
  calculateESGScores,
  generateInsights,
  prepareChartData,
} from "@/utils/esg-calculations";
import { HeaderSection } from "@/components/esg/HeaderSection";
import { MetricsCardsGrid } from "@/components/esg/MetricsCardsGrid";
import { InsightsSection } from "@/components/esg/InsightsSection";
import { ESGCharts } from "@/components/charts/ESGCharts";

export default function ESGDashboardPage() {
  const router = useRouter();
  const [currentData, setCurrentData] = useState<ESGResponse | null>(null);
  const [historicalData, setHistoricalData] = useState<ESGResponse[]>([]);
  const [calculatedMetrics, setCalculatedMetrics] =
    useState<CalculatedMetrics | null>(null);
  const [scores, setScores] = useState<ESGScores | null>(null);

  // Fetch data from your API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await fetch(
          "http://localhost:4000/api/esg/responses",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }

        const data: ESGResponse[] = await response.json();
        if (data && data.length > 0) {
          // Sort by year and get the most recent entry
          const sortedData = [...data].sort(
            (a, b) =>
              parseInt(b.financialYear.toString()) -
              parseInt(a.financialYear.toString())
          );
          setCurrentData(sortedData[0]);
          setHistoricalData(sortedData);

          // Calculate metrics and scores
          const metrics = calculateMetrics(sortedData[0].data);
          setCalculatedMetrics(metrics);
          setScores(calculateESGScores(sortedData[0].data, metrics));
        }
      } catch (error) {
        console.error("Error fetching ESG data:", error);
        if (
          error instanceof Error &&
          error.message.includes("authentication")
        ) {
          router.push("/login");
        }
      }
    };

    fetchData();
  }, [router]);

  if (!currentData || !calculatedMetrics || !scores) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ESG dashboard...</p>
        </div>
      </div>
    );
  }

  const yearRange =
    historicalData.length > 1
      ? `${historicalData[historicalData.length - 1].financialYear} - ${
          historicalData[0].financialYear
        }`
      : currentData.financialYear;

  const insights = generateInsights(
    currentData.data,
    calculatedMetrics,
    historicalData.map((d) => d.data)
  );
  const chartData = prepareChartData(
    currentData.data,
    calculatedMetrics,
    scores,
    historicalData.map((d) => d.data)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <HeaderSection
        yearRange={yearRange}
        dataEntries={historicalData.length}
        scores={scores}
      />

      <MetricsCardsGrid metrics={calculatedMetrics} />

      <div className="mb-8">
        <ESGCharts responses={historicalData} />
      </div>

      <InsightsSection insights={insights} />
    </div>
  );
}
