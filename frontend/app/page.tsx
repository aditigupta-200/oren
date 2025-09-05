import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Navbar } from "@/components/layout/Navbar";
import {
  BarChart3,
  Shield,
  Users,
  Leaf,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 text-balance">
            Comprehensive <span className="text-green-600">ESG Reporting</span>{" "}
            Made Simple
          </h1>
          <p className="text-xl text-gray-600 mb-8 text-pretty max-w-2xl mx-auto">
            Track your Environmental, Social, and Governance metrics with our
            intuitive questionnaire platform. Generate insights, monitor
            progress, and create professional reports.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-green-600 text-white hover:bg-green-700"
              asChild
            >
              <Link href="/register">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-50"
              asChild
            >
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Everything you need for ESG reporting
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-2 hover:border-green-600 hover:shadow-lg transition-all">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Leaf className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  Environmental Metrics
                </CardTitle>
                <CardDescription className="text-gray-600 mt-2">
                  Track electricity consumption, renewable energy usage, fuel
                  consumption, and carbon emissions
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center border-2 hover:border-blue-600 hover:shadow-lg transition-all">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  Social Impact
                </CardTitle>
                <CardDescription className="text-gray-600 mt-2">
                  Monitor employee diversity, training hours, and community
                  investment initiatives
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center border-2 hover:border-purple-600 hover:shadow-lg transition-all">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  Governance Standards
                </CardTitle>
                <CardDescription className="text-gray-600 mt-2">
                  Assess board independence, data privacy policies, and
                  corporate governance practices
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Auto-calculated insights and real-time analytics
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 hover:bg-green-50 rounded-lg transition-colors border border-gray-100 hover:border-green-200 shadow-sm">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">
                      Carbon Intensity Tracking
                    </p>
                    <p className="text-sm text-gray-600">
                      Automatically calculate emissions per revenue unit
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 hover:bg-green-50 rounded-lg transition-colors border border-gray-100 hover:border-green-200 shadow-sm">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">
                      Renewable Energy Ratio
                    </p>
                    <p className="text-sm text-gray-600">
                      Monitor your clean energy adoption progress
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 hover:bg-green-50 rounded-lg transition-colors border border-gray-100 hover:border-green-200 shadow-sm">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">
                      Diversity Metrics
                    </p>
                    <p className="text-sm text-gray-600">
                      Track workplace diversity and inclusion
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 hover:bg-green-50 rounded-lg transition-colors border border-gray-100 hover:border-green-200 shadow-sm">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">
                      Community Impact
                    </p>
                    <p className="text-sm text-gray-600">
                      Measure community investment as percentage of revenue
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl p-8 text-center">
              <BarChart3 className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Professional Reports
              </h4>
              <p className="text-gray-600">
                Generate comprehensive PDF and Excel reports for stakeholders
                and compliance requirements
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to start your ESG journey?
          </h3>
          <p className="text-gray-600 mb-8">
            Join organizations worldwide in building a more sustainable future
            through comprehensive ESG reporting.
          </p>
          <Button
            size="lg"
            className="bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl transition-all"
            asChild
          >
            <Link href="/register">
              Create Free Account <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
