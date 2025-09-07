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
  Download,
  TrendingUp,
  Activity,
  Calendar,
  Target,
  Zap,
  RefreshCw,
  FileText,
  PieChart,
  LineChart,
  BarChart2,
  Leaf,
  Users,
  Shield,
  Globe,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Types
interface AutoCalculated {
  carbonIntensity?: number;
  renewableElectricityRatio?: number;
  diversityRatio?: number;
  communitySpendRatio?: number;
}

interface ESGData {
  autoCalculated?: AutoCalculated;
  totalElectricityConsumption?: number;
  renewableElectricityConsumption?: number;
  totalFuelConsumption?: number;
  carbonEmissions?: number;
  totalEmployees?: number;
  femaleEmployees?: number;
  averageTrainingHours?: number;
  communityInvestmentSpend?: number;
  independentBoardMembers?: number;
  hasDataPrivacyPolicy?: "Yes" | "No";
  totalRevenue?: number;
  [key: string]: unknown;
}

interface ESGResponse {
  id: string;
  financialYear: number;
  data: ESGData;
  createdAt: string;
  updatedAt: string;
}

interface MetricCard {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
  color: string;
}

// Helper functions
const calculatePercentageChange = (
  current: number | undefined,
  previous: number | undefined
): {
  value: string;
  type: "positive" | "negative" | "neutral";
} => {
  if (!current || !previous || previous === 0) {
    return { value: "No data", type: "neutral" };
  }

  const change = ((current - previous) / previous) * 100;
  return {
    value: `${change > 0 ? "↑" : "↓"} ${Math.abs(change).toFixed(1)}%`,
    type: change > 0 ? "positive" : change < 0 ? "negative" : "neutral",
  };
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://oren-nror.onrender.com";

type ViewType = "overview" | "environmental" | "social" | "governance";

export default function ReportsPage() {
  const [responses, setResponses] = useState<ESGResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [selectedView, setSelectedView] = useState<ViewType>("overview");
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadResponses();
    }
  }, [user]);

  const loadResponses = async () => {
    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/responses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load responses");
      }

      const data = await response.json();
      setResponses(data.responses || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load responses");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    await loadResponses();
    setIsRefreshing(false);
  };

  // Calculate metrics based on actual data
  const getMetricCards = (): MetricCard[] => {
    if (responses.length < 2) return [];

    const sortedResponses = [...responses].sort(
      (a, b) => b.financialYear - a.financialYear
    );
    const current = sortedResponses[0];
    const previous = sortedResponses[1];

    const cards: MetricCard[] = [];

    // Carbon Intensity
    const currentCarbonIntensity = current.data.autoCalculated?.carbonIntensity;
    const previousCarbonIntensity =
      previous.data.autoCalculated?.carbonIntensity;
    const carbonChange = calculatePercentageChange(
      currentCarbonIntensity,
      previousCarbonIntensity
    );

    cards.push({
      title: "Carbon Intensity",
      value: currentCarbonIntensity
        ? `${currentCarbonIntensity.toFixed(6)} T CO2e/INR`
        : "No data",
      change: carbonChange.value,
      changeType: carbonChange.type === "positive" ? "negative" : "positive", // Lower is better for carbon
      icon: <Leaf className="h-5 w-5" />,
      color: "emerald",
    });

    // Renewable Energy
    const currentRenewable =
      current.data.autoCalculated?.renewableElectricityRatio;
    const previousRenewable =
      previous.data.autoCalculated?.renewableElectricityRatio;
    const renewableChange = calculatePercentageChange(
      currentRenewable,
      previousRenewable
    );

    cards.push({
      title: "Renewable Energy",
      value: currentRenewable ? `${currentRenewable.toFixed(1)}%` : "No data",
      change: renewableChange.value,
      changeType: renewableChange.type,
      icon: <Zap className="h-5 w-5" />,
      color: "yellow",
    });

    // Diversity Ratio
    const currentDiversity = current.data.autoCalculated?.diversityRatio;
    const previousDiversity = previous.data.autoCalculated?.diversityRatio;
    const diversityChange = calculatePercentageChange(
      currentDiversity,
      previousDiversity
    );

    cards.push({
      title: "Diversity Ratio",
      value: currentDiversity ? `${currentDiversity.toFixed(1)}%` : "No data",
      change: diversityChange.value,
      changeType: diversityChange.type,
      icon: <Users className="h-5 w-5" />,
      color: "blue",
    });

    // Community Investment
    const currentCommunity = current.data.autoCalculated?.communitySpendRatio;
    const previousCommunity = previous.data.autoCalculated?.communitySpendRatio;
    const communityChange = calculatePercentageChange(
      currentCommunity,
      previousCommunity
    );

    cards.push({
      title: "Community Investment",
      value: currentCommunity ? `${currentCommunity.toFixed(2)}%` : "No data",
      change: communityChange.value,
      changeType: communityChange.type,
      icon: <Globe className="h-5 w-5" />,
      color: "purple",
    });

    return cards;
  };

  // Calculate completion rate
  const getDataCompleteness = (response: ESGResponse): number => {
    const totalFields = 11; // Number of main ESG metrics
    const filledFields = Object.keys(response.data).filter(
      (key) =>
        key !== "autoCalculated" &&
        response.data[key] !== undefined &&
        response.data[key] !== null &&
        response.data[key] !== ""
    ).length;

    return Math.round((filledFields / totalFields) * 100);
  };

  // Calculate ESG score based on actual metrics
  const calculateESGScore = (response: ESGResponse): string => {
    let score = 0;
    let metrics = 0;

    // Environmental score (0-100)
    if (response.data.autoCalculated?.renewableElectricityRatio !== undefined) {
      score += response.data.autoCalculated.renewableElectricityRatio;
      metrics++;
    }

    if (
      response.data.carbonEmissions !== undefined &&
      response.data.totalRevenue
    ) {
      const carbonIntensityScore = Math.max(
        0,
        100 -
          (response.data.carbonEmissions / response.data.totalRevenue) * 1000
      );
      score += carbonIntensityScore;
      metrics++;
    }

    // Social score (0-100)
    if (response.data.autoCalculated?.diversityRatio !== undefined) {
      score += response.data.autoCalculated.diversityRatio;
      metrics++;
    }

    if (response.data.averageTrainingHours !== undefined) {
      const trainingScore = Math.min(
        100,
        (response.data.averageTrainingHours / 40) * 100
      );
      score += trainingScore;
      metrics++;
    }

    if (response.data.autoCalculated?.communitySpendRatio !== undefined) {
      score += response.data.autoCalculated.communitySpendRatio * 20; // Scale up since it's usually a small percentage
      metrics++;
    }

    // Governance score (0-100)
    if (response.data.independentBoardMembers !== undefined) {
      score += response.data.independentBoardMembers;
      metrics++;
    }

    if (response.data.hasDataPrivacyPolicy === "Yes") {
      score += 100;
      metrics++;
    }

    if (metrics === 0) return "N/A";

    const finalScore = score / metrics;

    if (finalScore >= 85) return "A+";
    if (finalScore >= 75) return "A";
    if (finalScore >= 65) return "B+";
    if (finalScore >= 55) return "B";
    if (finalScore >= 45) return "C+";
    return "C";
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

  if (!user) {
    return null;
  }

  const metricCards = getMetricCards();
  const latestResponse =
    responses.length > 0
      ? responses.reduce((latest, current) =>
          current.financialYear > latest.financialYear ? current : latest
        )
      : null;

  const completenessRate = latestResponse
    ? getDataCompleteness(latestResponse)
    : 0;

  const esgScore = latestResponse ? calculateESGScore(latestResponse) : "N/A";

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
                  Start Assessment in page.new
                </a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {metricCards.map((metric) => (
                <Card key={metric.title}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-sm font-medium">
                        {metric.title}
                      </CardTitle>
                      <div className={`p-2 bg-${metric.color}-100 rounded-lg`}>
                        {metric.icon}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold mb-1">
                      {metric.value}
                    </div>
                    <div className="flex items-center gap-1">
                      <span
                        className={`text-sm font-medium ${
                          metric.changeType === "positive"
                            ? "text-green-600"
                            : metric.changeType === "negative"
                            ? "text-red-600"
                            : "text-gray-600"
                        }`}
                      >
                        {metric.change}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
                    {Math.max(...responses.map((r) => r.financialYear))}
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
                      className="h-full bg-emerald-500 rounded-full"
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
          </div>
        )}
      </div>
    </div>
  );
}
