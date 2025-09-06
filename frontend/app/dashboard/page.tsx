// "use client";

// import { useAuth } from "@/contexts/AuthContext";
// import { Navbar } from "@/components/layout/Navbar";
// import { QuestionnaireHistory } from "@/components/questionnaire/QuestionnaireHistory";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Loader2, Plus, BarChart3, FileText, Users } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";
// import Link from "next/link";

// export default function DashboardPage() {
//   const { user, loading } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (!loading && !user) {
//       router.push("/login");
//     }
//   }, [user, loading, router]);

//   if (loading) {
//     return (
//       <div className="h-screen flex flex-col bg-gradient-to-br from-green-50 to-blue-50">
//         <Navbar />
//         <div className="flex-1 flex items-center justify-center">
//           <Card className="bg-white/95 backdrop-blur shadow-lg border-0">
//             <CardContent className="flex items-center gap-2 py-8">
//               <Loader2 className="h-5 w-5 animate-spin text-green-600" />
//               <span className="text-gray-700">Loading dashboard...</span>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     );
//   }

//   if (!user) {
//     return null;
//   }

//   return (
//     <div className="h-screen flex flex-col bg-gradient-to-br from-green-50 to-blue-50">
//       <Navbar />
//       <div className="flex-1 overflow-auto">
//         <div className="py-8 px-4">
//           <div className="max-w-6xl mx-auto space-y-6">
//             {/* Welcome Header */}
//             <Card className="bg-white/95 backdrop-blur shadow-lg border-0">
//               <CardHeader>
//                 <CardTitle className="text-2xl font-bold text-gray-900">
//                   Welcome back, {user.name}!
//                 </CardTitle>
//                 <CardDescription className="text-gray-600">
//                   Manage your ESG reporting and track your sustainability
//                   progress
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex flex-col sm:flex-row gap-4">
//                   <Button
//                     asChild
//                     className="bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl transition-all"
//                   >
//                     <Link href="/questionnaire">
//                       <Plus className="mr-2 h-4 w-4" />
//                       New Questionnaire
//                     </Link>
//                   </Button>
//                   <Button
//                     variant="outline"
//                     asChild
//                     className="border-2 border-green-200 hover:border-green-300 hover:bg-green-50"
//                   >
//                     <Link href="/reports">
//                       <FileText className="mr-2 h-4 w-4" />
//                       View Reports
//                     </Link>
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Quick Stats */}
//             <div className="grid md:grid-cols-3 gap-6">
//               <Card className="bg-white/95 backdrop-blur shadow-lg border-0">
//                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                   <CardTitle className="text-sm font-medium text-gray-700">
//                     Total Responses
//                   </CardTitle>
//                   <BarChart3 className="h-4 w-4 text-green-600" />
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold text-gray-900">-</div>
//                   <p className="text-xs text-gray-500">Across all years</p>
//                 </CardContent>
//               </Card>

//               <Card className="bg-white/95 backdrop-blur shadow-lg border-0">
//                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                   <CardTitle className="text-sm font-medium text-gray-700">
//                     Latest Year
//                   </CardTitle>
//                   <FileText className="h-4 w-4 text-blue-600" />
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold text-gray-900">
//                     {new Date().getFullYear()}
//                   </div>
//                   <p className="text-xs text-gray-500">
//                     Current financial year
//                   </p>
//                 </CardContent>
//               </Card>

//               <Card className="bg-white/95 backdrop-blur shadow-lg border-0">
//                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                   <CardTitle className="text-sm font-medium text-gray-700">
//                     Account Status
//                   </CardTitle>
//                   <Users className="h-4 w-4 text-purple-600" />
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold text-gray-900">Active</div>
//                   <p className="text-xs text-gray-500">ESG reporting enabled</p>
//                 </CardContent>
//               </Card>
//             </div>

//             {/* Questionnaire History */}
//             <Card className="bg-white/95 backdrop-blur shadow-lg border-0">
//               <CardHeader>
//                 <CardTitle className="text-xl font-bold text-gray-900">
//                   Questionnaire History
//                 </CardTitle>
//                 <CardDescription className="text-gray-600">
//                   Your previous ESG questionnaire submissions
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <QuestionnaireHistory />
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



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
  Globe,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface DashboardStats {
  totalResponses: number;
  completionRate: number;
  latestYear: number;
  lastUpdated: string;
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalResponses: 0,
    completionRate: 0,
    latestYear: new Date().getFullYear(),
    lastUpdated: new Date().toISOString(),
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      // Load dashboard stats here
      // This would typically fetch from your API
    }
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
                  <Button
                    variant="outline"
                    asChild
                    className="border-2 border-teal-200 hover:border-teal-300 hover:bg-teal-50 interactive-hover"
                  >
                    <Link href="/benchmarks">
                      <Target className="mr-2 h-4 w-4" />
                      Benchmarks
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
                <div
                  className="progress-bar mt-2"
                  style={{ width: `${stats.completionRate}%` }}
                ></div>
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
                <Globe
                  className="h-5 w-5 text-teal-600 animate-spin"
                  style={{ animationDuration: "3s" }}
                />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 animate-scale-in animate-delay-600">
                  A+
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Sustainability rating
                </p>
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
                      ↓ 15%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Renewable Energy
                    </span>
                    <span className="font-semibold text-emerald-600">
                      ↑ 23%
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div className="w-3/4 h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
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
                    <span className="font-semibold text-blue-600">↑ 8%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Training Hours
                    </span>
                    <span className="font-semibold text-blue-600">↑ 32%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="w-4/5 h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
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
                    <span className="font-semibold text-purple-600">85%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Policy Compliance
                    </span>
                    <span className="font-semibold text-purple-600">
                      ✓ 100%
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div className="w-5/6 h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
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
                    className="h-auto p-6 flex-col gap-3 border-2 border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50 interactive-hover group"
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
                    className="h-auto p-6 flex-col gap-3 border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 interactive-hover group"
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
                    className="h-auto p-6 flex-col gap-3 border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50 interactive-hover group"
                  >
                    <Link href="/benchmarks">
                      <div className="p-3 bg-purple-100 rounded-xl group-hover:scale-110 transition-transform">
                        <Target className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-gray-900">
                          Benchmarks
                        </div>
                        <div className="text-sm text-gray-600">
                          Compare with peers
                        </div>
                      </div>
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="h-auto p-6 flex-col gap-3 border-2 border-amber-200 hover:border-amber-300 hover:bg-amber-50 interactive-hover group"
                  >
                    <Link href="/reports">
                      <div className="p-3 bg-amber-100 rounded-xl group-hover:scale-110 transition-transform">
                        <FileText className="h-6 w-6 text-amber-600" />
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-gray-900">
                          Export Reports
                        </div>
                        <div className="text-sm text-gray-600">
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

          {/* Recent Activity Feed */}
          <div className="animate-slide-up animate-delay-700">
            <Card className="glass-card enhanced-card border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Activity className="h-6 w-6 text-indigo-500 animate-pulse" />
                  Recent Activity
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Latest updates and achievements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl animate-slide-right animate-delay-100">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        Carbon intensity improved by 15%
                      </p>
                      <p className="text-sm text-gray-600">
                        Compared to last quarter
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">2 days ago</span>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl animate-slide-right animate-delay-200">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        New diversity training program launched
                      </p>
                      <p className="text-sm text-gray-600">
                        Targeting 500+ employees
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">1 week ago</span>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl animate-slide-right animate-delay-300">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Shield className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        Data privacy policy updated
                      </p>
                      <p className="text-sm text-gray-600">
                        Enhanced GDPR compliance
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">2 weeks ago</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    className="w-full interactive-hover border-2 border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50"
                  >
                    <Activity className="mr-2 h-4 w-4" />
                    View All Activity
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}