"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

export function AssessmentView({ year }: { year: string }) {
  const { user } = useAuth();
  const router = useRouter();
  const [assessment, setAssessment] = useState<ESGResponse | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const loadAssessment = async () => {
      try {
        setError("");
        setIsLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Authentication required");
        }

        const response = await fetch(`${API_BASE_URL}/api/responses/${year}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(`Assessment for year ${year} not found`);
          }
          throw new Error("Failed to load assessment");
        }

        const data = await response.json();

        if (!data || !data.data) {
          throw new Error("Invalid assessment data received");
        }

        setAssessment(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load assessment"
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadAssessment();
  }, [user, router, year]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-pulse flex items-center gap-2 text-teal-600">
            <Calendar className="h-5 w-5 animate-spin" />
            <span>Loading assessment details...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
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
    );
  }

  if (!assessment || !assessment.data) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-gray-600">No assessment data available</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            FY {assessment.financialYear} Assessment
          </h1>
          <p className="text-gray-600">
            Last updated: {formatDate(assessment.updatedAt)}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <Button asChild>
            <Link
              href={`/questionnaire?year=${assessment.financialYear}&mode=edit`}
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Update Assessment
            </Link>
          </Button>
        </div>
      </div>

      {/* Environmental Metrics */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-100 rounded-xl">
              <Leaf className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <CardTitle>Environmental Metrics</CardTitle>
              <CardDescription>
                Carbon footprint & resource efficiency
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700">
                  Total Electricity Consumption
                </span>
                <Badge variant="secondary">
                  {assessment.data?.totalElectricityConsumption?.toLocaleString() ||
                    0}{" "}
                  kWh
                </Badge>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Renewable Electricity</span>
                <Badge variant="secondary">
                  {assessment.data?.renewableElectricityConsumption?.toLocaleString() ||
                    0}{" "}
                  kWh
                </Badge>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Total Fuel Consumption</span>
                <Badge variant="secondary">
                  {assessment.data?.totalFuelConsumption?.toLocaleString() || 0}{" "}
                  L
                </Badge>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Carbon Emissions</span>
                <Badge variant="secondary">
                  {assessment.data?.carbonEmissions?.toLocaleString() || 0}{" "}
                  tCO2e
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Metrics */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle>Social Metrics</CardTitle>
              <CardDescription>
                Workforce diversity & community impact
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Total Employees</span>
                <Badge variant="secondary">
                  {assessment.data?.totalEmployees?.toLocaleString() || 0}
                </Badge>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Female Employees</span>
                <Badge variant="secondary">
                  {assessment.data?.femaleEmployees?.toLocaleString() || 0}
                </Badge>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Average Training Hours</span>
                <Badge variant="secondary">
                  {assessment.data?.averageTrainingHours?.toLocaleString() || 0}{" "}
                  hrs
                </Badge>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Community Investment</span>
                <Badge variant="secondary">
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
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <CardTitle>Governance Metrics</CardTitle>
              <CardDescription>Ethics & transparency standards</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Independent Board Members</span>
                <Badge variant="secondary">
                  {assessment.data?.independentBoardMembers?.toLocaleString() ||
                    0}
                </Badge>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Data Privacy Policy</span>
                <Badge variant="secondary">
                  {assessment.data?.hasDataPrivacyPolicy ? "Yes" : "No"}
                </Badge>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Total Revenue</span>
                <Badge variant="secondary">
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
  );
}
