"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import { QuestionnaireHistory } from "@/components/questionnaire/QuestionnaireHistory";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Plus,
  BarChart3,
  FileText,
  Users,
  TrendingUp,
  Leaf,
  Shield,
  Target,
  Activity,
  Calendar,
  Award,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface ESGResponseData {
  totalElectricityConsumption?: number;
  renewableElectricityConsumption?: number;
  totalFuelConsumption?: number;
  carbonEmissions?: number;
  totalEmployees?: number;
  femaleEmployees?: number;
  averageTrainingHours?: number;
  communityInvestmentSpend?: number;
  independentBoardMembers?: number;
  hasDataPrivacyPolicy?: boolean;
  totalRevenue?: number;
  autoCalculated?: boolean;
  [key: string]: number | boolean | undefined; // More specific index signature
}

interface ESGResponse {
  id: string;
  userId: string;
  financialYear: number;
  data: ESGResponseData;
  createdAt: string;
  updatedAt: string;
}

interface ESGMetrics {
  carbonIntensity: { value: number; trend: "up" | "down" | "none" };
  renewableEnergy: { value: number; trend: "up" | "down" | "none" };
  diversityRatio: { value: number; trend: "up" | "down" | "none" };
  trainingHours: { value: number; trend: "up" | "down" | "none" };
  boardIndependence: { value: number; trend: "up" | "down" | "none" };
  policyCompliance: { value: number; trend: "up" | "down" | "none" };
}

interface DashboardStats {
  totalResponses: number;
  completionRate: number;
  latestYear: number;
  lastUpdated: string;
  esgScore: string;
  metrics: ESGMetrics;
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalResponses: 0,
    completionRate: 0,
    latestYear: new Date().getFullYear(),
    lastUpdated: new Date().toISOString(),
    esgScore: "N/A",
    metrics: {
      carbonIntensity: { value: 0, trend: "none" },
      renewableEnergy: { value: 0, trend: "none" },
      diversityRatio: { value: 0, trend: "none" },
      trainingHours: { value: 0, trend: "none" },
      boardIndependence: { value: 0, trend: "none" },
      policyCompliance: { value: 0, trend: "none" },
    },
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const loadDashboardStats = async () => {
      if (user) {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(
            `${
              process.env.NEXT_PUBLIC_API_URL ||
              "https://oren-nror.onrender.com"
            }/api/responses`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to load responses");
          }

          const data = await response.json();
          const responses = data.responses || [];

          // Calculate stats
          const totalResponses = responses.length;

          // Calculate average completion rate
          const completionRates = responses.map((response: ESGResponse) => {
            const totalFields = 11; // Total number of input fields
            const filledFields = Object.keys(response.data).filter(
              (key) =>
                key !== "autoCalculated" &&
                response.data[key] !== undefined &&
                response.data[key] !== null
            ).length;
            return (filledFields / totalFields) * 100;
          });
          const averageCompletion = completionRates.length
            ? Math.round(
                completionRates.reduce((a: number, b: number) => a + b, 0) /
                  completionRates.length
              )
            : 0;

          // Get latest year
          const latestYear = responses.length
            ? Math.max(...responses.map((r: ESGResponse) => r.financialYear))
            : new Date().getFullYear();

          // Calculate ESG Score based on latest response
          const latestResponse = responses.find(
            (r: ESGResponse) => r.financialYear === latestYear
          );
          let esgScore = "N/A";
          if (latestResponse) {
            const data = latestResponse.data;
            // Simple scoring example - can be made more sophisticated
            const sustainabilityScore = data.renewableElectricityConsumption
              ? (data.renewableElectricityConsumption /
                  data.totalElectricityConsumption) *
                100
              : 0;
            const diversityScore = data.femaleEmployees
              ? (data.femaleEmployees / data.totalEmployees) * 100
              : 0;
            const governanceScore = data.independentBoardMembers
              ? data.independentBoardMembers * 10
              : 0;

            const totalScore =
              (sustainabilityScore + diversityScore + governanceScore) / 3;

            // Convert score to letter grade
            if (totalScore >= 90) esgScore = "A+";
            else if (totalScore >= 80) esgScore = "A";
            else if (totalScore >= 70) esgScore = "B+";
            else if (totalScore >= 60) esgScore = "B";
            else if (totalScore >= 50) esgScore = "C+";
            else esgScore = "C";
          }

          // Calculate metrics
          const calculateMetrics = (
            currentResponse: ESGResponse,
            previousResponse?: ESGResponse
          ) => {
            const current = currentResponse.data;
            const previous = previousResponse?.data;

            // Carbon Intensity (CO2 emissions per revenue) - Lower is better
            const rawCarbonIntensity =
              current.carbonEmissions && current.totalRevenue
                ? current.carbonEmissions / current.totalRevenue
                : 0;
            const previousRawCarbonIntensity =
              previous?.carbonEmissions && previous?.totalRevenue
                ? previous.carbonEmissions / previous.totalRevenue
                : 0;
            // Convert to a 0-100 scale where lower is better
            const carbonIntensity = Math.max(
              0,
              Math.min(100, (1 - rawCarbonIntensity) * 100)
            );
            const previousCarbonIntensity = Math.max(
              0,
              Math.min(100, (1 - previousRawCarbonIntensity) * 100)
            );

            // Renewable Energy Percentage (already 0-100)
            const renewableEnergy =
              current.renewableElectricityConsumption &&
              current.totalElectricityConsumption
                ? Math.min(
                    100,
                    (current.renewableElectricityConsumption /
                      current.totalElectricityConsumption) *
                      100
                  )
                : 0;
            const previousRenewableEnergy =
              previous?.renewableElectricityConsumption &&
              previous?.totalElectricityConsumption
                ? Math.min(
                    100,
                    (previous.renewableElectricityConsumption /
                      previous.totalElectricityConsumption) *
                      100
                  )
                : 0;

            // Diversity Ratio (should be 0-100)
            const diversityRatio =
              current.femaleEmployees && current.totalEmployees
                ? Math.min(
                    100,
                    (current.femaleEmployees / current.totalEmployees) * 100
                  )
                : 0;
            const previousDiversityRatio =
              previous?.femaleEmployees && previous?.totalEmployees
                ? Math.min(
                    100,
                    (previous.femaleEmployees / previous.totalEmployees) * 100
                  )
                : 0;

            // Training Hours - Convert to a percentage based on target
            const targetTrainingHours = 40; // Standard annual training hours target
            const trainingHoursPercent = current.averageTrainingHours
              ? Math.min(
                  100,
                  (current.averageTrainingHours / targetTrainingHours) * 100
                )
              : 0;
            const previousTrainingHoursPercent = previous?.averageTrainingHours
              ? Math.min(
                  100,
                  (previous.averageTrainingHours / targetTrainingHours) * 100
                )
              : 0;
            const trainingHours = current.averageTrainingHours || 0;
            const previousTrainingHours = previous?.averageTrainingHours || 0;

            // Board Independence (should be 0-100)
            const boardIndependence = current.independentBoardMembers
              ? Math.min(100, current.independentBoardMembers * 10) // Assuming scale of 0-10
              : 0;
            const previousBoardIndependence = previous?.independentBoardMembers
              ? Math.min(100, previous.independentBoardMembers * 10)
              : 0;

            // Policy Compliance
            const policyCompliance = current.hasDataPrivacyPolicy ? 100 : 0;
            const previousPolicyCompliance = previous?.hasDataPrivacyPolicy
              ? 100
              : 0;

            return {
              carbonIntensity: {
                value: Math.round(carbonIntensity),
                trend:
                  carbonIntensity < previousCarbonIntensity
                    ? ("down" as const)
                    : carbonIntensity > previousCarbonIntensity
                    ? ("up" as const)
                    : ("none" as const),
              },
              renewableEnergy: {
                value: Math.round(renewableEnergy),
                trend:
                  renewableEnergy > previousRenewableEnergy
                    ? ("up" as const)
                    : renewableEnergy < previousRenewableEnergy
                    ? ("down" as const)
                    : ("none" as const),
              },
              diversityRatio: {
                value: Math.round(diversityRatio),
                trend:
                  diversityRatio > previousDiversityRatio
                    ? ("up" as const)
                    : diversityRatio < previousDiversityRatio
                    ? ("down" as const)
                    : ("none" as const),
              },
              trainingHours: {
                value: Math.round(trainingHours),
                trend:
                  trainingHours > previousTrainingHours
                    ? ("up" as const)
                    : trainingHours < previousTrainingHours
                    ? ("down" as const)
                    : ("none" as const),
              },
              boardIndependence: {
                value: Math.round(boardIndependence),
                trend:
                  boardIndependence > previousBoardIndependence
                    ? ("up" as const)
                    : boardIndependence < previousBoardIndependence
                    ? ("down" as const)
                    : ("none" as const),
              },
              policyCompliance: {
                value: policyCompliance,
                trend:
                  policyCompliance > previousPolicyCompliance
                    ? ("up" as const)
                    : policyCompliance < previousPolicyCompliance
                    ? ("down" as const)
                    : ("none" as const),
              },
            };
          };

          // Get current and previous responses for trend calculation
          const sortedResponses = responses.sort(
            (a: ESGResponse, b: ESGResponse) =>
              b.financialYear - a.financialYear
          );
          const currentResponse = sortedResponses[0];
          const previousResponse = sortedResponses[1];

          const metrics = calculateMetrics(currentResponse, previousResponse);

          setStats({
            totalResponses,
            completionRate: averageCompletion,
            latestYear,
            lastUpdated: new Date().toISOString(),
            esgScore,
            metrics,
          });
        } catch (error) {
          console.error("Error loading dashboard stats:", error);
        }
      }
    };

    loadDashboardStats();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Card className="glass-card animate-pulse-glow border-0">
            <CardContent className="flex items-center gap-3 py-8 px-12">
              <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
              <span className="text-lg font-medium text-gray-700">
                Loading your dashboard...
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-emerald-200/20 to-teal-200/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-tr from-cyan-200/20 to-blue-200/20 rounded-full blur-2xl animate-float animate-delay-300"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-emerald-100/10 to-teal-100/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <Navbar />

      <div className="relative z-10 py-8 px-4">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Welcome Header with Animation */}
          <div className="animate-slide-down">
            <Card className="glass-card enhanced-card border-0 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 animate-gradient"></div>
              <CardHeader className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-3xl font-bold text-gray-900 animate-slide-right animate-delay-200">
                      Welcome back, {user.name}! 🌱
                    </CardTitle>
                    <CardDescription className="text-lg text-gray-600 animate-slide-right animate-delay-300">
                      Track your sustainability journey and ESG performance in
                      real-time
                    </CardDescription>
                  </div>
                  <div className="hidden md:block animate-scale-in animate-delay-500">
                    <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg animate-float">
                      <Activity className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="flex flex-col sm:flex-row gap-4 animate-slide-up animate-delay-500">
                  <Button
                    asChild
                    className="btn-gradient text-white shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 group"
                  >
                    <Link href="/questionnaire">
                      <Plus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform" />
                      New Assessment
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    asChild
                    className="border-2 border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50 interactive-hover"
                  >
                    <Link href="/reports">
                      <FileText className="mr-2 h-4 w-4" />
                      View Analytics
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Dashboard Stats Grid */}
          <div className="dashboard-stats animate-slide-up animate-delay-200">
            <Card className="enhanced-card dashboard-metric animate-delay-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">
                  Total Assessments
                </CardTitle>
                <BarChart3 className="h-5 w-5 text-emerald-600 animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 animate-scale-in animate-delay-300">
                  {stats.totalResponses}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  <TrendingUp className="inline h-3 w-3 mr-1 text-emerald-500" />
                  Across all years
                </p>
              </CardContent>
            </Card>

            <Card className="enhanced-card dashboard-metric animate-delay-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">
                  Completion Rate
                </CardTitle>
                <Award className="h-5 w-5 text-blue-600 animate-bounce" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 animate-scale-in animate-delay-400">
                  {stats.completionRate}%
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full mt-2">
                  <div
                    className={`h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500 w-[${stats.completionRate}%]`}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Average data quality
                </p>
              </CardContent>
            </Card>

            <Card className="enhanced-card dashboard-metric animate-delay-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">
                  Latest Assessment
                </CardTitle>
                <Calendar className="h-5 w-5 text-purple-600 animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 animate-scale-in animate-delay-500">
                  {stats.latestYear}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  <Zap className="inline h-3 w-3 mr-1 text-purple-500" />
                  Current fiscal year
                </p>
              </CardContent>
            </Card>

            <Card className="enhanced-card dashboard-metric animate-delay-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">
                  ESG Score
                </CardTitle>
                <Award className="h-5 w-5 text-amber-600" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-amber-600 animate-pulse-glow">
                  {stats.esgScore}
                </div>
                <p className="text-sm text-gray-600 mt-2">Overall Rating</p>
                {stats.metrics && (
                  <div className="flex flex-col gap-4 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Environmental
                      </span>
                      <span className="text-sm font-bold text-emerald-600">
                        {Math.round(stats.metrics.renewableEnergy.value)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Social</span>
                      <span className="text-sm font-bold text-blue-600">
                        {Math.round(stats.metrics.diversityRatio.value)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Governance</span>
                      <span className="text-sm font-bold text-purple-600">
                        {Math.round(stats.metrics.boardIndependence.value)}%
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* ESG Categories Overview */}
          <div className="dashboard-grid animate-slide-up animate-delay-300">
            <Card className="enhanced-card border-0 shadow-xl animate-delay-100">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-100 rounded-xl">
                    <Leaf className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      Environmental
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Carbon footprint & resource efficiency
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Carbon Intensity
                    </span>
                    <span className="font-semibold text-emerald-600">
                      {stats.metrics.carbonIntensity.trend === "down"
                        ? "↓"
                        : stats.metrics.carbonIntensity.trend === "up"
                        ? "↑"
                        : "→"}{" "}
                      {Math.min(stats.metrics.carbonIntensity.value, 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Renewable Energy
                    </span>
                    <span className="font-semibold text-emerald-600">
                      {stats.metrics.renewableEnergy.trend === "up"
                        ? "↑"
                        : stats.metrics.renewableEnergy.trend === "down"
                        ? "↓"
                        : "→"}{" "}
                      {stats.metrics.renewableEnergy.value}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full">
                    <div
                      className={`h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500 w-[${Math.min(
                        stats.metrics.renewableEnergy.value,
                        100
                      )}%]`}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="enhanced-card border-0 shadow-xl animate-delay-200">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      Social
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Workforce diversity & community impact
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Diversity Ratio
                    </span>
                    <span className="font-semibold text-blue-600">
                      {stats.metrics.diversityRatio.trend === "up"
                        ? "↑"
                        : stats.metrics.diversityRatio.trend === "down"
                        ? "↓"
                        : "→"}{" "}
                      {stats.metrics.diversityRatio.value}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Training Hours
                    </span>
                    <span className="font-semibold text-blue-600">
                      {stats.metrics.trainingHours.trend === "up"
                        ? "↑"
                        : stats.metrics.trainingHours.trend === "down"
                        ? "↓"
                        : "→"}{" "}
                      {stats.metrics.trainingHours.value}h
                    </span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full">
                    <div
                      className={`h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500 w-[${Math.min(
                        stats.metrics.diversityRatio.value,
                        100
                      )}%]`}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="enhanced-card border-0 shadow-xl animate-delay-300">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Shield className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      Governance
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Ethics & transparency standards
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Board Independence
                    </span>
                    <span className="font-semibold text-purple-600">
                      {stats.metrics.boardIndependence.trend === "up"
                        ? "↑"
                        : stats.metrics.boardIndependence.trend === "down"
                        ? "↓"
                        : "→"}{" "}
                      {Math.min(stats.metrics.boardIndependence.value, 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Policy Compliance
                    </span>
                    <span className="font-semibold text-purple-600">
                      {stats.metrics.policyCompliance.value === 100 ? "✓" : "×"}{" "}
                      {stats.metrics.policyCompliance.value}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full">
                    <div
                      className={`h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500 w-[${Math.min(
                        stats.metrics.boardIndependence.value,
                        100
                      )}%]`}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="animate-slide-up animate-delay-500">
            <Card className="glass-card enhanced-card border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Zap className="h-6 w-6 text-amber-500 animate-pulse" />
                  Quick Actions
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Fast-track your ESG management tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button
                    asChild
                    variant="outline"
                    className="h-auto p-6 flex-col gap-3 border-2  border-emerald-300 bg-emerald-50 interactive-hover group"
                  >
                    <Link href="/questionnaire">
                      <div className="p-3 bg-emerald-100 rounded-xl group-hover:scale-110 transition-transform">
                        <Plus className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-gray-900">
                          New Assessment
                        </div>
                        <div className="text-sm text-gray-600">
                          Create new ESG report
                        </div>
                      </div>
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="h-auto p-6 flex-col gap-3 border-2 border-blue-300 bg-blue-50 interactive-hover group"
                  >
                    <Link href="/reports">
                      <div className="p-3 bg-blue-100 rounded-xl group-hover:scale-110 transition-transform">
                        <BarChart3 className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-gray-900">
                          Analytics
                        </div>
                        <div className="text-sm text-gray-600">
                          View performance data
                        </div>
                      </div>
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="h-auto p-6 flex-col gap-3 border-2 border-amber-300 bg-white hover:bg-amber-50 interactive-hover group"
                  >
                    <Link href="/reports">
                      <div className="p-3 bg-amber-100 rounded-xl group-hover:scale-110 transition-transform">
                        <FileText className="h-6 w-6 text-amber-600" />
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-amber-700">
                          Export Reports
                        </div>
                        <div className="text-sm text-amber-600">
                          Download PDFs & Excel
                        </div>
                      </div>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Questionnaire History */}
          <div className="animate-slide-up animate-delay-500">
            <Card className="glass-card enhanced-card border-0 shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                      <Calendar className="h-6 w-6 text-teal-500 animate-pulse" />
                      Assessment History
                    </CardTitle>
                    <CardDescription className="text-gray-600 mt-1">
                      Track your ESG progress over time
                    </CardDescription>
                  </div>
                  <div className="hidden md:block">
                    <div className="flex items-center gap-2 bg-gradient-to-r from-teal-100 to-cyan-100 px-4 py-2 rounded-full">
                      <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-teal-700">
                        Real-time Updates
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="p-6">
                  <QuestionnaireHistory />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
