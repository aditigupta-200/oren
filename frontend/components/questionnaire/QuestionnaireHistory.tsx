"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { Calendar, TrendingUp, Eye, Trash2 } from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import Link from "next/link";

interface ESGResponse {
  id: string;
  financialYear: number;
  data: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://oren-nror.onrender.com";

export function QuestionnaireHistory() {
  const [responses, setResponses] = useState<ESGResponse[]>([]);
  // const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const { notify } = useToast();

  useEffect(() => {
    if (user) {
      loadResponses();
    }
  }, [user]);

  const loadResponses = async () => {
    // setIsLoading(true);
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
    }
  };

  const deleteResponse = async (year: number) => {
    if (!confirm(`Are you sure you want to delete the response for ${year}?`)) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/responses/${year}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete response");
      }

      setResponses((prev) => prev.filter((r) => r.financialYear !== year));
      notify(`Response for ${year} deleted successfully`, "success");
    } catch (err) {
      notify(
        err instanceof Error ? err.message : "Failed to delete response",
        "error"
      );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCompletionScore = (data: Record<string, unknown>) => {
    const totalFields = 11; // Total number of input fields
    const filledFields = Object.keys(data).filter(
      (key) =>
        key !== "autoCalculated" &&
        data[key] !== undefined &&
        data[key] !== null &&
        data[key] !== ""
    ).length;
    return Math.round((filledFields / totalFields) * 100);
  };

  if (!user) {
    return <Alert>Please log in to view your questionnaire history.</Alert>;
  }

  return (
    <Card className="bg-white">
      <CardHeader className="border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl text-gray-900">
              <Calendar className="h-5 w-5 text-teal-600" />
              Assessment History
            </CardTitle>
            <CardDescription className="text-gray-600 mt-1">
              View and manage your ESG responses across different financial
              years
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {error && (
          <Alert className="mb-4">
            {typeof error === "string" ? error : "An error occurred"}
          </Alert>
        )}
        {responses.length === 0 ? (
          <div className="text-center py-12">
            <div className="p-4 bg-teal-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Calendar className="h-8 w-8 text-teal-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Assessments Found
            </h3>
            <p className="text-gray-600 mb-6">
              Start tracking your ESG performance by creating your first
              assessment
            </p>
            <Button
              asChild
              className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-600 hover:to-emerald-600 transition-all"
            >
              <Link href="/questionnaire">Create Your First Assessment</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {responses.map((response) => (
              <div
                key={response.id}
                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-teal-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      FY {response.financialYear}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Last updated: {formatDate(response.updatedAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-teal-100 text-teal-700 px-3 py-1">
                      {getCompletionScore(response.data)}% Complete
                    </Badge>
                    {typeof response.data.autoCalculated !== "undefined" && (
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1"
                      >
                        <TrendingUp className="h-3 w-3" />
                        Auto-calculated
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-2 border-teal-200 hover:border-teal-300 hover:bg-teal-50 transition-colors"
                    asChild
                  >
                    <Link href={`/assessment/${response.financialYear}`}>
                      <Eye className="h-4 w-4 mr-1 text-teal-600" />
                      View Details
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteResponse(response.financialYear)}
                    className="border-2 border-red-200 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
