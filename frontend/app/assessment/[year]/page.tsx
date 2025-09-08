"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Edit3,
  Leaf,
  Users,
  Shield,
  ArrowLeft,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useCallback, useEffect, useState } from "react";

interface ESGData {
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
}

interface ESGResponse {
  id: string;
  userId: string;
  financialYear: number;
  data: ESGData;
  createdAt: string;
  updatedAt: string;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://oren-nror.onrender.com";

export default function AssessmentViewPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [assessment, setAssessment] = useState<ESGResponse | null>(null);
  const [error, setError] = useState("");

  const loadAssessment = useCallback(async () => {
    try {
      setError("");
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication required");
      }

      if (!params.year) {
        throw new Error("No assessment year specified");
      }

      const response = await fetch(
        `${API_BASE_URL}/api/responses/${params.year}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Assessment for year ${params.year} not found`);
        }
        throw new Error("Failed to load assessment");
      }

      const data = await response.json();
      console.log("Response data:", data); // Debug log

      if (!data) {
        throw new Error("No data received from server");
      }

      // Handle both possible API response formats
      const assessmentData = data.response || data;

      if (!assessmentData.data) {
        throw new Error("Assessment data is missing required fields");
      }

      setAssessment(assessmentData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load assessment"
      );
      console.error("Error loading assessment:", err);
    }
  }, [params.year]);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
        return;
      }

      if (user && params.year) {
        loadAssessment();
      }
    }
  }, [user, loading, params.year, router, loadAssessment]);

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <Navbar />
        <div className="py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <div className="animate-pulse flex items-center gap-2 text-teal-600">
                  <Calendar className="h-5 w-5 animate-spin" />
                  <span className="text-black">
                    Loading assessment details...
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <Navbar />
        <div className="py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <div className="text-red-600 mb-4">
                  <Shield className="h-8 w-8" />
                </div>
                <h2 className="text-lg font-semibold text-red-700 mb-2">
                  Error Loading Assessment
                </h2>
                <p className="text-red-600 mb-4">{error}</p>
                <Button asChild variant="outline" className="border-red-200">
                  <Link href="/dashboard">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Render loading state when assessment is not yet loaded
  if (!assessment || !assessment.data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <Navbar />
        <div className="py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <div className="animate-pulse flex items-center gap-2 text-teal-600">
                  <Calendar className="h-5 w-5 animate-spin" />
                  <span className="text-black">Loading assessment data...</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <Navbar />
      <div className="py-8 px-4">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between bg-white p-6 rounded-lg shadow-sm mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                FY {assessment.financialYear} Assessment
              </h1>
              <p className="text-gray-600 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Last updated: {formatDate(assessment.updatedAt)}
              </p>
            </div>
            <div className="flex gap-4">
              <Button
                variant="outline"
                asChild
                className="border-2 bg-gray-50 transition-colors"
              >
                <Link href="/dashboard" className="text-gray-700 font-medium">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <Button
                asChild
                className="bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                <Link
                  href={`/questionnaire?year=${assessment.financialYear}&mode=edit`}
                  className="text-white font-medium"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Update Assessment
                </Link>
              </Button>
            </div>
          </div>

          {/* Environmental Metrics */}
          <Card className="border-2 border-emerald-100 shadow-lg hover:border-emerald-200 transition-colors">
            <CardHeader className="border-b border-emerald-50">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-100 rounded-xl">
                  <Leaf className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-emerald-800">
                    Environmental Metrics
                  </CardTitle>
                  <CardDescription className="text-emerald-600">
                    Carbon footprint & resource efficiency
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-5 bg-emerald-50 rounded-lg border border-emerald-100 hover:bg-emerald-100 transition-colors">
                    <span className="text-emerald-800 font-medium">
                      Total Electricity Consumption
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-white text-emerald-700 border-emerald-200 text-lg px-4 py-1"
                    >
                      {assessment.data?.totalElectricityConsumption?.toLocaleString() ||
                        0}{" "}
                      kWh
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-5 bg-emerald-50 rounded-lg border border-emerald-100 hover:bg-emerald-100 transition-colors">
                    <span className="text-emerald-800 font-medium">
                      Renewable Electricity
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-white text-emerald-700 border-emerald-200 text-lg px-4 py-1"
                    >
                      {assessment.data?.renewableElectricityConsumption?.toLocaleString() ||
                        0}{" "}
                      kWh
                    </Badge>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-5 bg-emerald-50 rounded-lg border border-emerald-100 hover:bg-emerald-100 transition-colors">
                    <span className="text-emerald-800 font-medium">
                      Total Fuel Consumption
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-white text-emerald-700 border-emerald-200 text-lg px-4 py-1"
                    >
                      {assessment.data?.totalFuelConsumption?.toLocaleString() ||
                        0}{" "}
                      L
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-5 bg-emerald-50 rounded-lg border border-emerald-100 hover:bg-emerald-100 transition-colors">
                    <span className="text-emerald-800 font-medium">
                      Carbon Emissions
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-white text-emerald-700 border-emerald-200 text-lg px-4 py-1"
                    >
                      {assessment.data?.carbonEmissions?.toLocaleString() || 0}{" "}
                      tCO2e
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Metrics */}
          <Card className="border-2 border-blue-100 shadow-lg hover:border-blue-200 transition-colors">
            <CardHeader className="border-b border-blue-50">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-blue-800">
                    Social Metrics
                  </CardTitle>
                  <CardDescription className="text-blue-600">
                    Workforce diversity & community impact
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-5 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors">
                    <span className="text-blue-800 font-medium">
                      Total Employees
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-white text-blue-700 border-blue-200 text-lg px-4 py-1"
                    >
                      {assessment.data?.totalEmployees?.toLocaleString() || 0}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-5 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors">
                    <span className="text-blue-800 font-medium">
                      Female Employees
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-white text-blue-700 border-blue-200 text-lg px-4 py-1"
                    >
                      {assessment.data?.femaleEmployees?.toLocaleString() || 0}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-5 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors">
                    <span className="text-blue-800 font-medium">
                      Average Training Hours
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-white text-blue-700 border-blue-200 text-lg px-4 py-1"
                    >
                      {assessment.data.averageTrainingHours || 0} hrs
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-5 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors">
                    <span className="text-blue-800 font-medium">
                      Community Investment
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-white text-blue-700 border-blue-200 text-lg px-4 py-1"
                    >
                      ₹
                      {assessment.data?.communityInvestmentSpend?.toLocaleString() ||
                        0}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Governance Metrics */}
          <Card className="border-2 border-purple-100 shadow-lg hover:border-purple-200 transition-colors">
            <CardHeader className="border-b border-purple-50">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-purple-800">
                    Governance Metrics
                  </CardTitle>
                  <CardDescription className="text-purple-600">
                    Ethics & transparency standards
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-5 bg-purple-50 rounded-lg border border-purple-100 hover:bg-purple-100 transition-colors">
                    <span className="text-purple-800 font-medium">
                      Independent Board Members
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-white text-purple-700 border-purple-200 text-lg px-4 py-1"
                    >
                      {assessment.data?.independentBoardMembers?.toLocaleString() ||
                        0}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-5 bg-purple-50 rounded-lg border border-purple-100 hover:bg-purple-100 transition-colors">
                    <span className="text-purple-800 font-medium">
                      Data Privacy Policy
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-white text-purple-700 border-purple-200 text-lg px-4 py-1"
                    >
                      {assessment.data?.hasDataPrivacyPolicy ? "Yes" : "No"}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-5 bg-purple-50 rounded-lg border border-purple-100 hover:bg-purple-100 transition-colors">
                    <span className="text-purple-800 font-medium">
                      Total Revenue
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-white text-purple-700 border-purple-200 text-lg px-4 py-1"
                    >
                      ₹{assessment.data?.totalRevenue?.toLocaleString() || 0}
                    </Badge>
                  </div>
                  {assessment.data?.autoCalculated && (
                    <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-lg text-blue-700">
                      <TrendingUp className="h-4 w-4" />
                      <span>Metrics are auto-calculated</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
