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
import { Alert } from "@/components/ui/alert";
import { Loader2, BarChart3, Download } from "lucide-react";
import { useRouter } from "next/navigation";

interface ESGResponse {
  id: string;
  financialYear: number;
  data: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function ReportsPage() {
  const [responses, setResponses] = useState<ESGResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <Card>
            <CardContent className="flex items-center gap-2 py-8">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading reports...
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Navbar />
      <div className="py-8 px-4">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                    ESG Reports & Analytics
                  </CardTitle>
                  <CardDescription>
                    Comprehensive analysis of your Environmental, Social, and
                    Governance performance
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4 text-gray-600" />
                  <ExportButtons responses={responses} userName={user.name} />
                </div>
              </div>
            </CardHeader>
          </Card>

          {error && <Alert>{error}</Alert>}

          {isLoading ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                Loading analytics data...
              </CardContent>
            </Card>
          ) : responses.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Data Available
                </h3>
                <p className="text-gray-600 mb-4">
                  Complete your first ESG questionnaire to see reports and
                  analytics
                </p>
                <ExportButtons responses={[]} userName={user.name} />
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Summary Stats */}
              <div className="grid md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Years
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{responses.length}</div>
                    <p className="text-xs text-muted-foreground">
                      Years of data
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Latest Year
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {Math.max(...responses.map((r) => r.financialYear))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Most recent data
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Data Completeness
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {Math.round(
                        (responses.reduce((acc, r) => {
                          const filledFields = Object.keys(r.data).filter(
                            (key) =>
                              key !== "autoCalculated" &&
                              r.data[key] !== undefined &&
                              r.data[key] !== null &&
                              r.data[key] !== ""
                          ).length;
                          return acc + filledFields / 11; // 11 total input fields
                        }, 0) /
                          responses.length) *
                          100
                      )}
                      %
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Average completion
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Last Updated
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {new Date(
                        Math.max(
                          ...responses.map((r) =>
                            new Date(r.updatedAt).getTime()
                          )
                        )
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Most recent update
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <ESGCharts responses={responses} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
