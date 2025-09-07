
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
  Award,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { ESGResponse } from "@/types/esg";

interface MetricCard {
  title: string;
  value: string | number;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
  color: string;
}

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
      if (err instanceof Error) {
        setError(err.message || "Failed to load responses");
      } else {
        setError("Failed to load responses");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    await loadResponses();
    setIsRefreshing(false);
  };

  const getMetricCards = (): MetricCard[] => {
    if (responses.length === 0) return [];

    const latestResponse = responses.reduce((latest, current) =>
      current.financialYear > latest.financialYear ? current : latest
    );

    return [
      {
        title: "Carbon Intensity",
        value: latestResponse.data.autoCalculated?.carbonIntensity
          ? `${Number(
              latestResponse.data.autoCalculated.carbonIntensity
            ).toFixed(6)} T CO2e/INR`
          : "N/A",
        change: "↓ 15%",
        changeType: "positive",
        icon: <Leaf className="h-5 w-5" />,
        color: "emerald",
      },
      {
        title: "Renewable Energy",
        value: latestResponse.data.autoCalculated?.renewableElectricityRatio
          ? `${Number(
              latestResponse.data.autoCalculated.renewableElectricityRatio
            ).toFixed(1)}%`
          : "N/A",
        change: "↑ 23%",
        changeType: "positive",
        icon: <Zap className="h-5 w-5" />,
        color: "yellow",
      },
      {
        title: "Diversity Ratio",
        value: latestResponse.data.autoCalculated?.diversityRatio
          ? `${Number(
              latestResponse.data.autoCalculated.diversityRatio
            ).toFixed(1)}%`
          : "N/A",
        change: "↑ 8%",
        changeType: "positive",
        icon: <Users className="h-5 w-5" />,
        color: "blue",
      },
      {
        title: "Community Investment",
        value: latestResponse.data.autoCalculated?.communitySpendRatio
          ? `${Number(
              latestResponse.data.autoCalculated.communitySpendRatio
            ).toFixed(2)}%`
          : "N/A",
        change: "↑ 12%",
        changeType: "positive",
        icon: <Globe className="h-5 w-5" />,
        color: "purple",
      },
    ];
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-emerald-200/15 to-teal-200/15 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-tr from-cyan-200/15 to-blue-200/15 rounded-full blur-2xl animate-float animate-delay-300"></div>
      </div>

      <Navbar />

      <div className="relative z-10 py-8 px-4">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="animate-slide-down">
            <Card className="glass-card enhanced-card border-0 shadow-2xl">
              <CardHeader>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="animate-slide-right">
                    <CardTitle className="flex items-center gap-3 text-3xl font-bold text-gray-900">
                      <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg animate-float">
                        <BarChart3 className="h-8 w-8 text-white" />
                      </div>
                      ESG Analytics Dashboard
                    </CardTitle>
                    <CardDescription className="text-lg text-gray-600 mt-2">
                      Comprehensive insights into your sustainability
                      performance
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-3 animate-slide-left">
                    <Button
                      onClick={refreshData}
                      disabled={isRefreshing}
                      variant="outline"
                      size="sm"
                      className="border-2 border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50 interactive-hover"
                    >
                      <RefreshCw
                        className={`mr-2 h-4 w-4 ${
                          isRefreshing ? "animate-spin" : ""
                        }`}
                      />
                      Refresh
                    </Button>
                    <div className="flex items-center gap-2">
                      <Download className="h-4 w-4 text-gray-600" />
                      <ExportButtons
                        responses={responses}
                        userName={user.name}
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="animate-slide-up">
              <Alert className="border-red-200 bg-red-50 text-red-700">
                <AlertCircle className="h-4 w-4" />
                <span className="ml-2">{error}</span>
              </Alert>
            </div>
          )}

          {/* View Selector */}
          <div className="animate-slide-up animate-delay-200">
            <Card className="glass-card enhanced-card border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-2">
                  {[
                    {
                      key: "overview",
                      label: "Overview",
                      icon: <BarChart3 className="h-4 w-4" />,
                    },
                    {
                      key: "environmental",
                      label: "Environmental",
                      icon: <Leaf className="h-4 w-4" />,
                    },
                    {
                      key: "social",
                      label: "Social",
                      icon: <Users className="h-4 w-4" />,
                    },
                    {
                      key: "governance",
                      label: "Governance",
                      icon: <Shield className="h-4 w-4" />,
                    },
                  ].map((view, index) => (
                    <Button
                      key={view.key}
                      variant={
                        selectedView === view.key ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setSelectedView(view.key as ViewType)}
                      className={`
                        animate-scale-in transition-all duration-300
                        ${
                          selectedView === view.key
                            ? "btn-gradient text-white shadow-lg"
                            : "border-2 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50"
                        }
                      `}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {view.icon}
                      <span className="ml-2">{view.label}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {responses.length === 0 ? (
            <div className="animate-scale-in">
              <Card className="glass-card enhanced-card border-0 shadow-xl">
                <CardContent className="text-center py-16">
                  <div className="animate-float">
                    <BarChart3 className="h-24 w-24 text-gray-400 mx-auto mb-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 animate-slide-up">
                    No Data Available
                  </h3>
                  <p className="text-gray-600 mb-8 text-lg animate-slide-up animate-delay-200">
                    Complete your first ESG assessment to unlock powerful
                    analytics and insights
                  </p>
                  <div className="animate-slide-up animate-delay-500">
                    <Button
                      asChild
                      size="lg"
                      className="btn-gradient text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-1 px-8 py-4"
                    >
                      <a href="/questionnaire">
                        <Target className="mr-2 h-5 w-5" />
                        Start Assessment in page
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <>
              {/* Key Metrics Cards */}
              <div className="dashboard-stats animate-slide-up animate-delay-300">
                {metricCards.map((metric, index) => (
                  <Card
                    key={metric.title}
                    className={`enhanced-card dashboard-metric border-0 shadow-xl animate-scale-in`}
                    style={{ animationDelay: `${(index + 1) * 100}ms` }}
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-700">
                        {metric.title}
                      </CardTitle>
                      <div
                        className={`p-2 bg-${metric.color}-100 rounded-lg text-${metric.color}-600`}
                      >
                        {metric.icon}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {metric.value}
                      </div>
                      <div className="flex items-center gap-1">
                        <span
                          className={`
                          text-sm font-medium
                          ${
                            metric.changeType === "positive"
                              ? "text-green-600"
                              : metric.changeType === "negative"
                              ? "text-red-600"
                              : "text-gray-600"
                          }
                        `}
                        >
                          {metric.change}
                        </span>
                        <span className="text-xs text-gray-500">
                          vs last period
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Summary Stats */}
              <div className="dashboard-grid animate-slide-up animate-delay-500">
                <Card className="enhanced-card border-0 shadow-xl">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      Data Coverage
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Total Years
                        </span>
                        <span className="text-2xl font-bold text-blue-600">
                          {responses.length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Latest Year
                        </span>
                        <span className="text-2xl font-bold text-blue-600">
                          {Math.max(...responses.map((r) => r.financialYear))}
                        </span>
                      </div>
                      <div className="progress-bar">
                        <div className="w-full h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                      </div>
                      <p className="text-xs text-gray-500 text-center">
                        Complete data coverage
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="enhanced-card border-0 shadow-xl">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <Target className="h-5 w-5 text-green-600" />
                      Data Quality
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Completion Rate
                        </span>
                        <span className="text-2xl font-bold text-green-600">
                          {Math.round(
                            (responses.reduce((acc, r) => {
                              const filledFields = Object.keys(r.data).filter(
                                (key) =>
                                  key !== "autoCalculated" &&
                                  r.data[key] !== undefined &&
                                  r.data[key] !== null &&
                                  r.data[key] !== ""
                              ).length;
                              return acc + filledFields / 11;
                            }, 0) /
                              responses.length) *
                              100
                          )}
                          %
                        </span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                          style={{
                            width: `${Math.round(
                              (responses.reduce((acc, r) => {
                                const filledFields = Object.keys(r.data).filter(
                                  (key) =>
                                    key !== "autoCalculated" &&
                                    r.data[key] !== undefined &&
                                    r.data[key] !== null &&
                                    r.data[key] !== ""
                                ).length;
                                return acc + filledFields / 11;
                              }, 0) /
                                responses.length) *
                                100
                            )}%`,
                          }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 text-center">
                        Average data completeness
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="enhanced-card border-0 shadow-xl">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <Activity className="h-5 w-5 text-purple-600" />
                      Last Updated
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {new Date(
                            Math.max(
                              ...responses.map((r) =>
                                new Date(r.updatedAt).getTime()
                              )
                            )
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          Most recent update
                        </p>
                      </div>
                      <div className="progress-bar">
                        <div className="w-full h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
                      </div>
                      <p className="text-xs text-gray-500 text-center">
                        Data is current
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="enhanced-card border-0 shadow-xl">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <Award className="h-5 w-5 text-amber-600" />
                      ESG Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-amber-600 animate-pulse-glow">
                          A+
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          Overall Rating
                        </p>
                      </div>
                      <div className="flex justify-center">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <div
                              key={star}
                              className="w-4 h-4 bg-amber-400 rounded-full animate-pulse"
                              style={{ animationDelay: `${star * 100}ms` }}
                            ></div>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 text-center">
                        Top performance tier
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Chart Section */}
              <div className="animate-slide-up animate-delay-700">
                <Card className="glass-card enhanced-card border-0 shadow-2xl">
                  <CardHeader>
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div>
                        <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                            <LineChart className="h-6 w-6 text-white" />
                          </div>
                          Performance Analytics
                        </CardTitle>
                        <CardDescription className="text-gray-600 mt-1">
                          Interactive visualizations of your ESG metrics over
                          time
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-2 border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50"
                        >
                          <PieChart className="mr-2 h-4 w-4" />
                          Pie View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-2 border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50"
                        >
                          <BarChart2 className="mr-2 h-4 w-4" />
                          Bar View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50"
                        >
                          <LineChart className="mr-2 h-4 w-4" />
                          Line View
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="dashboard-chart">
                      <ESGCharts responses={responses} />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Insights */}
              <div className="dashboard-grid animate-slide-up animate-delay-1000">
                <Card className="enhanced-card border-0 shadow-xl lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      Key Insights & Recommendations
                    </CardTitle>
                    <CardDescription>
                      AI-powered analysis of your ESG performance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-l-4 border-green-500 animate-slide-right">
                        <div className="flex items-start gap-3">
                          <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-green-900">
                              Environmental Excellence
                            </h4>
                            <p className="text-green-700 text-sm">
                              Your carbon intensity has improved by 15% compared
                              to industry average. Continue investing in
                              renewable energy initiatives.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-l-4 border-blue-500 animate-slide-right animate-delay-200">
                        <div className="flex items-start gap-3">
                          <Users className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-blue-900">
                              Social Impact Growth
                            </h4>
                            <p className="text-blue-700 text-sm">
                              Diversity ratio shows positive trend. Consider
                              expanding training programs to accelerate
                              progress.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-l-4 border-purple-500 animate-slide-right animate-delay-500">
                        <div className="flex items-start gap-3">
                          <Shield className="h-5 w-5 text-purple-600 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-purple-900">
                              Governance Strength
                            </h4>
                            <p className="text-purple-700 text-sm">
                              Strong governance framework in place. Board
                              independence exceeds best practices standards.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border-l-4 border-amber-500 animate-slide-right animate-delay-700">
                        <div className="flex items-start gap-3">
                          <Target className="h-5 w-5 text-amber-600 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-amber-900">
                              Action Items
                            </h4>
                            <p className="text-amber-700 text-sm">
                              Focus on increasing community investment ratio and
                              implementing additional sustainability initiatives
                              for Q4.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="enhanced-card border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <Globe className="h-5 w-5 text-teal-600" />
                      Industry Benchmarks
                    </CardTitle>
                    <CardDescription>
                      Compare your performance with industry peers
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            Carbon Intensity
                          </span>
                          <span className="text-sm font-bold text-green-600">
                            25% Better
                          </span>
                        </div>
                        <div className="progress-bar">
                          <div className="w-3/4 h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            Diversity Ratio
                          </span>
                          <span className="text-sm font-bold text-blue-600">
                            12% Above
                          </span>
                        </div>
                        <div className="progress-bar">
                          <div className="w-3/5 h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            Renewable Energy
                          </span>
                          <span className="text-sm font-bold text-yellow-600">
                            8% Above
                          </span>
                        </div>
                        <div className="progress-bar">
                          <div className="w-2/3 h-full bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full"></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            Governance Score
                          </span>
                          <span className="text-sm font-bold text-purple-600">
                            Top 10%
                          </span>
                        </div>
                        <div className="progress-bar">
                          <div className="w-5/6 h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Action Center */}
              <div className="animate-slide-up animate-delay-1000">
                <Card className="glass-card enhanced-card border-0 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl shadow-lg animate-pulse">
                        <Zap className="h-6 w-6 text-white" />
                      </div>
                      Action Center
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Quick actions to improve your ESG performance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <Button
                        asChild
                        variant="outline"
                        className="h-auto p-6 flex-col gap-3 border-2 border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50 interactive-hover group"
                      >
                        <a href="/questionnaire">
                          <div className="p-3 bg-emerald-100 rounded-xl group-hover:scale-110 transition-transform">
                            <FileText className="h-6 w-6 text-emerald-600" />
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-gray-900">
                              Update Data
                            </div>
                            <div className="text-sm text-gray-600">
                              Add latest metrics
                            </div>
                          </div>
                        </a>
                      </Button>

                      <Button
                        variant="outline"
                        className="h-auto p-6 flex-col gap-3 border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 interactive-hover group"
                      >
                        <div className="p-3 bg-blue-100 rounded-xl group-hover:scale-110 transition-transform">
                          <Target className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-gray-900">
                            Set Goals
                          </div>
                          <div className="text-sm text-gray-600">
                            Define ESG targets
                          </div>
                        </div>
                      </Button>

                      <Button
                        variant="outline"
                        className="h-auto p-6 flex-col gap-3 border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50 interactive-hover group"
                      >
                        <div className="p-3 bg-purple-100 rounded-xl group-hover:scale-110 transition-transform">
                          <Globe className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-gray-900">
                            Benchmarks
                          </div>
                          <div className="text-sm text-gray-600">
                            Compare with peers
                          </div>
                        </div>
                      </Button>

                      <Button
                        onClick={() => window.print()}
                        variant="outline"
                        className="h-auto p-6 flex-col gap-3 border-2 border-amber-200 hover:border-amber-300 hover:bg-amber-50 interactive-hover group"
                      >
                        <div className="p-3 bg-amber-100 rounded-xl group-hover:scale-110 transition-transform">
                          <Download className="h-6 w-6 text-amber-600" />
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-gray-900">
                            Export Report
                          </div>
                          <div className="text-sm text-gray-600">
                            Download insights
                          </div>
                        </div>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
