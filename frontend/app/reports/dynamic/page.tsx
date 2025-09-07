"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import { ESGCharts } from "@/components/charts/ESGCharts";
import { ExportButtons } from "@/components/reports/ExportButtons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import {
  Loader2,
  BarChart3,
  Activity,
  Calendar,
  Target,
  Zap,
  RefreshCw,
  LineChart,
  Leaf,
  Users,
  Globe,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Types matching backend
interface AutoCalculated {
  carbonIntensity?: number;
  renewableElectricityRatio?: number;
  diversityRatio?: number;
  communitySpendRatio?: number;
  [key: string]: number | undefined;
}
interface ESGData {
  autoCalculated?: AutoCalculated;
  [key: string]: any;
}
interface ESGResponse {
  id: string;
  financialYear: number;
  data: ESGData;
  createdAt: string;
  updatedAt: string;
}
interface TrendMetric {
  trend: number;
  average: number;
  min: number;
  max: number;
  improvement: boolean;
}
interface Analysis {
  autoCalculated: Record<string, TrendMetric>;
  [key: string]: any;
}
type Insights = Record<string, Record<string, number | string | null>>;

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://oren-nror.onrender.com";

export default function ReportsPage() {
  const [responses, setResponses] = useState<ESGResponse[]>([]);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [insights, setInsights] = useState<Insights | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadReportData();
    }
  }, [user]);

  const loadReportData = async () => {
    setIsLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/responses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to load report data");
      const data = await response.json();
      setResponses(data.responses || []);
      setAnalysis(data.analysis || null);
      setInsights(data.insights || null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load report data"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    await loadReportData();
    setIsRefreshing(false);
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <Card className="glass-card animate-pulse-glow border-0">
            <CardContent className="flex items-center gap-3 py-12 px-16">
              <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
              <span className="text-lg font-medium text-gray-700">
                Loading analytics...
              </span>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // Helper: get latest response
  const latestResponse: ESGResponse | null =
    responses.length > 0 ? responses[0] : null;

  // Helper: get completeness
  const getDataCompleteness = (response: ESGResponse | null): number => {
    if (!response) return 0;
    const totalFields = 11;
    const filledFields = Object.keys(response.data).filter(
      (key) =>
        key !== "autoCalculated" &&
        response.data[key] !== undefined &&
        response.data[key] !== null &&
        response.data[key] !== ""
    ).length;
    return Math.round((filledFields / totalFields) * 100);
  };
  const completenessRate = latestResponse
    ? getDataCompleteness(latestResponse)
    : 0;

  // Helper: ESG Score (example: use average of all available autoCalculated metrics)
  const getESGScore = (): string => {
    if (!latestResponse) return "N/A";
    const auto = latestResponse.data.autoCalculated || {};
    const values = Object.values(auto).filter(
      (v): v is number => typeof v === "number"
    );
    if (!values.length) return "N/A";
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    if (avg >= 85) return "A+";
    if (avg >= 75) return "A";
    if (avg >= 65) return "B+";
    if (avg >= 55) return "B";
    if (avg >= 45) return "C+";
    return "C";
  };
  const esgScore = getESGScore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <Card className="glass-card border-0">
            <CardHeader>
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-3xl font-bold">
                    ESG Analytics Dashboard
                  </CardTitle>
                  <CardDescription>
                    Track and analyze your sustainability metrics
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    onClick={refreshData}
                    disabled={isRefreshing}
                    variant="outline"
                    size="sm"
                  >
                    <RefreshCw
                      className={`mr-2 h-4 w-4 ${
                        isRefreshing ? "animate-spin" : ""
                      }`}
                    />
                    Refresh
                  </Button>
                  {responses.length > 0 && (
                    <ExportButtons responses={responses} userName={user.name} />
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50 text-red-700">
            <AlertCircle className="h-4 w-4" />
            <span className="ml-2">{error}</span>
          </Alert>
        )}

        {responses.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <BarChart3 className="h-24 w-24 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                No Data Available
              </h3>
              <p className="text-gray-600 mb-8">
                Complete your first ESG assessment to see analytics
              </p>
              <Button asChild size="lg">
                <a href="/questionnaire">
                  <Target className="mr-2 h-5 w-5" />
                  Start Assessment in dynamic page
                </a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Metric Cards: show all autoCalculated metrics and their trends */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {latestResponse &&
                latestResponse.data.autoCalculated &&
                Object.entries(latestResponse.data.autoCalculated).map(
                  ([key, value]) => (
                    <Card key={key}>
                      <CardHeader>
                        <CardTitle className="text-sm font-medium capitalize">
                          {key.replace(/([A-Z])/g, " $1")}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold mb-1">
                          {typeof value === "number"
                            ? value.toFixed(2)
                            : String(value)}
                        </div>
                        {analysis &&
                          analysis.autoCalculated &&
                          analysis.autoCalculated[key] && (
                            <div className="flex items-center gap-1 text-sm">
                              <span
                                className={
                                  analysis.autoCalculated[key].trend > 0
                                    ? "text-green-600"
                                    : analysis.autoCalculated[key].trend < 0
                                    ? "text-red-600"
                                    : "text-gray-600"
                                }
                              >
                                {analysis.autoCalculated[key].trend > 0
                                  ? "↑"
                                  : analysis.autoCalculated[key].trend < 0
                                  ? "↓"
                                  : "→"}{" "}
                                {Math.abs(
                                  analysis.autoCalculated[key].trend
                                ).toFixed(1)}
                                %
                              </span>
                              <span className="text-xs text-gray-500">
                                vs last year
                              </span>
                            </div>
                          )}
                      </CardContent>
                    </Card>
                  )
                )}
            </div>

            {/* Charts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  Performance Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ESGCharts responses={responses} />
              </CardContent>
            </Card>

            {/* Data Quality */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Data Coverage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">
                    {responses.length} Years
                  </div>
                  <p className="text-sm text-gray-600">
                    Latest: FY{" "}
                    {responses.length > 0
                      ? Math.max(...responses.map((r) => r.financialYear))
                      : "N/A"}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Data Completeness
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">
                    {completenessRate}%
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: `${completenessRate}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    ESG Rating
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">{esgScore}</div>
                  <p className="text-sm text-gray-600">
                    Based on latest metrics
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Insights: show backend-provided insights */}
            <Card>
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {insights &&
                    Object.entries(insights).map(([category, catInsights]) =>
                      Object.entries(
                        catInsights as Record<string, number | string | null>
                      ).map(([name, value], idx) => (
                        <div
                          key={category + name}
                          className="p-4 rounded-lg bg-gray-50"
                        >
                          <h4 className="font-semibold mb-1 capitalize">
                            {category} - {name.replace(/([A-Z])/g, " $1")}
                          </h4>
                          <p className="text-sm">
                            {typeof value === "number"
                              ? value.toFixed(2) + "%"
                              : String(value)}
                          </p>
                        </div>
                      ))
                    )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
