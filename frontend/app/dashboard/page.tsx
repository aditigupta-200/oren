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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <Card>
            <CardContent className="flex items-center gap-2 py-8">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading dashboard...
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
          {/* Welcome Header */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Welcome back, {user.name}!
              </CardTitle>
              <CardDescription>
                Manage your ESG reporting and track your sustainability progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="btn-primary">
                  <Link href="/questionnaire">
                    <Plus className="mr-2 h-4 w-4" />
                    New Questionnaire
                  </Link>
                </Button>
                <Button variant="outline" asChild>
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
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Responses
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">-</div>
                <p className="text-xs text-muted-foreground">
                  Across all years
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Latest Year
                </CardTitle>
                <FileText className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Date().getFullYear()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Current financial year
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Account Status
                </CardTitle>
                <Users className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Active</div>
                <p className="text-xs text-muted-foreground">
                  ESG reporting enabled
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Questionnaire History */}
          <QuestionnaireHistory />
        </div>
      </div>
    </div>
  );
}
