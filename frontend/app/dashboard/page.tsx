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
import { Loader2, Plus, BarChart3, FileText, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="h-screen flex flex-col bg-gradient-to-br from-green-50 to-blue-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Card className="bg-white/95 backdrop-blur shadow-lg border-0">
            <CardContent className="flex items-center gap-2 py-8">
              <Loader2 className="h-5 w-5 animate-spin text-green-600" />
              <span className="text-gray-700">Loading dashboard...</span>
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
    <div className="h-screen flex flex-col bg-gradient-to-br from-green-50 to-blue-50">
      <Navbar />
      <div className="flex-1 overflow-auto">
        <div className="py-8 px-4">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Welcome Header */}
            <Card className="bg-white/95 backdrop-blur shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Welcome back, {user.name}!
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Manage your ESG reporting and track your sustainability
                  progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    asChild
                    className="bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl transition-all"
                  >
                    <Link href="/questionnaire">
                      <Plus className="mr-2 h-4 w-4" />
                      New Questionnaire
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    asChild
                    className="border-2 border-green-200 hover:border-green-300 hover:bg-green-50"
                  >
                    <Link href="/reports">
                      <FileText className="mr-2 h-4 w-4" />
                      View Reports
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-white/95 backdrop-blur shadow-lg border-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">
                    Total Responses
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">-</div>
                  <p className="text-xs text-gray-500">Across all years</p>
                </CardContent>
              </Card>

              <Card className="bg-white/95 backdrop-blur shadow-lg border-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">
                    Latest Year
                  </CardTitle>
                  <FileText className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {new Date().getFullYear()}
                  </div>
                  <p className="text-xs text-gray-500">
                    Current financial year
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/95 backdrop-blur shadow-lg border-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">
                    Account Status
                  </CardTitle>
                  <Users className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">Active</div>
                  <p className="text-xs text-gray-500">ESG reporting enabled</p>
                </CardContent>
              </Card>
            </div>

            {/* Questionnaire History */}
            <Card className="bg-white/95 backdrop-blur shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">
                  Questionnaire History
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Your previous ESG questionnaire submissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <QuestionnaireHistory />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
