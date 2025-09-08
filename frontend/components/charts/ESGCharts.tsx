"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  RadialBarChart,
  RadialBar,
  ScatterChart,
  Scatter,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Zap,
  Users,
  Leaf,
  Shield,
  Globe,
  Target,
} from "lucide-react";

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    color: string;
  }>;
  label?: string;
}

import { ESGResponse } from "@/types/esg";

interface ESGChartsProps {
  responses: ESGResponse[];
}

const COLORS = {
  primary: "#10b981",
  secondary: "#3b82f6",
  accent: "#8b5cf6",
  warning: "#f59e0b",
  danger: "#ef4444",
  success: "#10b981",
  environmental: ["#10b981", "#059669", "#047857", "#065f46"],
  social: ["#3b82f6", "#2563eb", "#1d4ed8", "#1e40af"],
  governance: ["#8b5cf6", "#7c3aed", "#6d28d9", "#5b21b6"],
};

export function ESGCharts({ responses }: ESGChartsProps) {
  const [activeChart, setActiveChart] = useState<
    "overview" | "environmental" | "social" | "governance"
  >("overview");

  if (!responses || responses.length === 0) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <Activity className="h-16 w-16 text-gray-400 mx-auto mb-4 animate-float" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Data to Visualize
        </h3>
        <p className="text-gray-600">
          Complete ESG assessments to see interactive charts and analytics
        </p>
      </div>
    );
  }

  // Prepare data for charts
  const prepareChartData = () => {
    return responses
      .sort((a, b) => a.financialYear - b.financialYear)
      .map((response) => ({
        year: response.financialYear,
        // Environmental metrics
        carbonEmissions: response.data.carbonEmissions || 0,
        totalElectricity: response.data.totalElectricityConsumption || 0,
        renewableElectricity:
          response.data.renewableElectricityConsumption || 0,
        totalFuel: response.data.totalFuelConsumption || 0,
        carbonIntensity: response.data.autoCalculated?.carbonIntensity || 0,
        renewableRatio:
          response.data.autoCalculated?.renewableElectricityRatio || 0,

        // Social metrics
        totalEmployees: response.data.totalEmployees || 0,
        femaleEmployees: response.data.femaleEmployees || 0,
        trainingHours: response.data.averageTrainingHours || 0,
        communitySpend: response.data.communityInvestmentSpend || 0,
        diversityRatio: response.data.autoCalculated?.diversityRatio || 0,
        communitySpendRatio:
          response.data.autoCalculated?.communitySpendRatio || 0,

        // Governance metrics
        independentBoard: response.data.independentBoardMembers || 0,
        totalRevenue: response.data.totalRevenue || 0,
        hasDataPolicy: response.data.hasDataPrivacyPolicy === "Yes" ? 1 : 0,
      }));
  };

  const chartData = prepareChartData();

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-lg p-4 rounded-xl shadow-2xl border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">{`Year: ${label}`}</p>
          {payload?.map((entry, index) => (
            <p
              key={index}
              className="tooltip-text"
              style={{ color: entry.color }} // This is required for dynamic colors from the chart
            >
              {`${entry.name}: ${
                typeof entry.value === "number"
                  ? entry.value.toLocaleString()
                  : entry.value
              }`}
              {entry.name.includes("Ratio") || entry.name.includes("Percentage")
                ? "%"
                : ""}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Chart type selector
  const ChartSelector = () => (
    <div className="flex flex-wrap gap-2 mb-6">
      {[
        {
          key: "overview",
          label: "Overview",
          icon: <Activity className="h-4 w-4" />,
        },
        {
          key: "environmental",
          label: "Environmental",
          icon: <Leaf className="h-4 w-4" />,
        },
        { key: "social", label: "Social", icon: <Users className="h-4 w-4" /> },
        {
          key: "governance",
          label: "Governance",
          icon: <Shield className="h-4 w-4" />,
        },
      ].map((chart, index) => (
        <Button
          key={chart.key}
          variant={activeChart === chart.key ? "default" : "outline"}
          size="sm"
          onClick={() =>
            setActiveChart(
              chart.key as
                | "overview"
                | "environmental"
                | "social"
                | "governance"
            )
          }
          className={`
            animate-scale-in transition-all duration-300
            ${
              activeChart === chart.key
                ? "btn-gradient text-white shadow-lg"
                : "border-2 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50"
            }
          `}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {chart.icon}
          <span className="ml-2">{chart.label}</span>
        </Button>
      ))}
    </div>
  );

  // Overview Charts
  const OverviewCharts = () => (
    <div className="space-y-8">
      {/* ESG Score Trend */}
      <Card className="enhanced-card animate-slide-up">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            ESG Performance Trend
          </CardTitle>
          <CardDescription>
            Overall sustainability performance over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={COLORS.primary}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor={COLORS.primary}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="renewableRatio"
                stroke={COLORS.primary}
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorScore)"
              />
              <Area
                type="monotone"
                dataKey="diversityRatio"
                stroke={COLORS.secondary}
                strokeWidth={3}
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Multi-metric Comparison */}
      <Card className="enhanced-card animate-slide-up animate-delay-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Key Metrics Comparison
          </CardTitle>
          <CardDescription>
            Compare multiple ESG metrics across years
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="renewableRatio"
                fill={COLORS.environmental[0]}
                name="Renewable Energy %"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="diversityRatio"
                fill={COLORS.social[0]}
                name="Diversity Ratio %"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="independentBoard"
                fill={COLORS.governance[0]}
                name="Board Independence %"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );

  // Environmental Charts
  const EnvironmentalCharts = () => (
    <div className="space-y-8">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Carbon Emissions Trend */}
        <Card className="enhanced-card animate-slide-left">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-emerald-600" />
              Carbon Emissions
            </CardTitle>
            <CardDescription>
              Carbon footprint over time (T CO2e)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="carbonEmissions"
                  stroke={COLORS.environmental[0]}
                  strokeWidth={3}
                  dot={{ fill: COLORS.environmental[0], strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, fill: COLORS.environmental[1] }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Energy Mix */}
        <Card className="enhanced-card animate-slide-right">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-600" />
              Energy Consumption Mix
            </CardTitle>
            <CardDescription>
              Renewable vs Total electricity (kWh)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="totalElectricity"
                  stackId="1"
                  stroke={COLORS.warning}
                  fill={COLORS.warning}
                  fillOpacity={0.6}
                  name="Total Electricity"
                />
                <Area
                  type="monotone"
                  dataKey="renewableElectricity"
                  stackId="1"
                  stroke={COLORS.success}
                  fill={COLORS.success}
                  fillOpacity={0.8}
                  name="Renewable Electricity"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Environmental KPIs */}
      <Card className="enhanced-card animate-slide-up">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            Environmental KPIs
          </CardTitle>
          <CardDescription>
            Key environmental performance indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="20%"
              outerRadius="90%"
              data={[
                {
                  name: "Carbon Intensity",
                  value:
                    chartData[chartData.length - 1]?.carbonIntensity *
                      1000000 || 0,
                  fill: COLORS.environmental[0],
                },
                {
                  name: "Renewable Ratio",
                  value: chartData[chartData.length - 1]?.renewableRatio || 0,
                  fill: COLORS.environmental[1],
                },
                {
                  name: "Fuel Efficiency",
                  value: Math.max(
                    0,
                    100 -
                      (chartData[chartData.length - 1]?.totalFuel || 0) / 100
                  ),
                  fill: COLORS.environmental[2],
                },
              ]}
            >
              <RadialBar dataKey="value" cornerRadius={10} fill="#8884d8" />
              <Tooltip content={<CustomTooltip />} />
            </RadialBarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );

  // Social Charts
  const SocialCharts = () => (
    <div className="space-y-8">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Workforce Diversity */}
        <Card className="enhanced-card animate-slide-left">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Workforce Composition
            </CardTitle>
            <CardDescription>
              Employee diversity metrics over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="totalEmployees"
                  fill={COLORS.social[0]}
                  name="Total Employees"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="femaleEmployees"
                  fill={COLORS.social[1]}
                  name="Female Employees"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Training & Development */}
        <Card className="enhanced-card animate-slide-right">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-600" />
              Training Hours
            </CardTitle>
            <CardDescription>
              Average training hours per employee
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="trainingHours"
                  stroke={COLORS.social[0]}
                  strokeWidth={4}
                  dot={{ fill: COLORS.social[0], strokeWidth: 2, r: 8 }}
                  activeDot={{ r: 10, fill: COLORS.social[1] }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Community Investment */}
      <Card className="enhanced-card animate-slide-up">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-teal-600" />
            Community Investment Trend
          </CardTitle>
          <CardDescription>
            Investment in community programs over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorCommunity" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={COLORS.social[0]}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={COLORS.social[0]}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="communitySpend"
                stroke={COLORS.social[0]}
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorCommunity)"
                name="Community Spend (INR)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Social Impact Pie Chart */}
      <Card className="enhanced-card animate-slide-up animate-delay-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="h-5 w-5 text-indigo-600" />
            Social Impact Distribution
          </CardTitle>
          <CardDescription>
            Current year social metrics breakdown
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  {
                    name: "Training Investment",
                    value: chartData[chartData.length - 1]?.trainingHours || 0,
                    fill: COLORS.social[0],
                  },
                  {
                    name: "Community Programs",
                    value:
                      (chartData[chartData.length - 1]?.communitySpendRatio ||
                        0) * 10,
                    fill: COLORS.social[1],
                  },
                  {
                    name: "Diversity Initiatives",
                    value: chartData[chartData.length - 1]?.diversityRatio || 0,
                    fill: COLORS.social[2],
                  },
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {[0, 1, 2].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS.social[index]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );

  // Governance Charts
  const GovernanceCharts = () => (
    <div className="space-y-8">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Board Independence */}
        <Card className="enhanced-card animate-slide-left">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-600" />
              Board Independence
            </CardTitle>
            <CardDescription>
              Percentage of independent board members
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" stroke="#64748b" />
                <YAxis domain={[0, 100]} stroke="#64748b" />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="independentBoard"
                  fill={COLORS.governance[0]}
                  name="Independent Board %"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Growth */}
        <Card className="enhanced-card animate-slide-right">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Revenue Trend
            </CardTitle>
            <CardDescription>
              Total revenue growth over time (INR)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={COLORS.governance[0]}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={COLORS.governance[0]}
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="totalRevenue"
                  stroke={COLORS.governance[0]}
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  name="Total Revenue (INR)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Governance Compliance */}
      <Card className="enhanced-card animate-slide-up">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-indigo-600" />
            Governance Compliance Score
          </CardTitle>
          <CardDescription>
            Overall governance performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            {(() => {
              // ✅ Pre-calculate governance data with complianceScore + revenueGrowth
              const governanceData = chartData.map((d) => ({
                ...d,
                complianceScore:
                  (d.independentBoard + d.hasDataPolicy * 100) / 2,
                revenueGrowth: d.totalRevenue,
              }));

              return (
                <ScatterChart data={governanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="complianceScore"
                    name="Compliance Score"
                    stroke="#64748b"
                    domain={[0, 100]} // ✅ keep it percentage scale
                  />
                  <YAxis
                    type="number"
                    dataKey="revenueGrowth"
                    name="Revenue"
                    stroke="#64748b"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Scatter
                    name="Governance Performance"
                    data={governanceData} // ✅ enriched dataset
                    fill={COLORS.governance[0]}
                  />
                </ScatterChart>
              );
            })()}
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Policy Compliance */}
      <Card className="enhanced-card animate-slide-up animate-delay-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-emerald-600" />
            Policy Compliance Over Time
          </CardTitle>
          <CardDescription>
            Data privacy policy implementation status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" stroke="#64748b" />
              <YAxis domain={[0, 1]} stroke="#64748b" />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white/95 backdrop-blur-lg p-4 rounded-xl shadow-2xl border border-gray-200">
                        <p className="font-semibold text-gray-900 mb-2">{`Year: ${label}`}</p>
                        <p
                          className="text-sm"
                          style={{ color: payload[0].color }}
                        >
                          {`Data Privacy Policy: ${
                            payload[0].value === 1 ? "Yes" : "No"
                          }`}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="stepAfter"
                dataKey="hasDataPolicy"
                stroke={COLORS.governance[0]}
                strokeWidth={4}
                dot={{ fill: COLORS.governance[0], strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, fill: COLORS.governance[1] }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <ChartSelector />

      <div className="animate-fade-in">
        {activeChart === "overview" && <OverviewCharts />}
        {activeChart === "environmental" && <EnvironmentalCharts />}
        {activeChart === "social" && <SocialCharts />}
        {activeChart === "governance" && <GovernanceCharts />}
      </div>

      {/* Chart Summary Statistics */}
      <Card className="enhanced-card animate-slide-up glass-card border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-200 flex items-center gap-2">
            <Activity className="h-5 w-5 text-indigo-600" />
            Performance Summary
          </CardTitle>
          <CardDescription>
            Key insights from your ESG data visualization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl animate-scale-in">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
                <span className="font-semibold text-emerald-900">
                  Environmental
                </span>
              </div>
              <div className="text-2xl font-bold text-emerald-700">
                {chartData.length > 1
                  ? chartData[chartData.length - 1]?.renewableRatio >
                    chartData[0]?.renewableRatio
                    ? "↗️"
                    : "↘️"
                  : "📊"}
              </div>
              <p className="text-xs text-emerald-600">
                Renewable energy trending up
              </p>
            </div>

            <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl animate-scale-in animate-delay-100">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="font-semibold text-blue-900">Social</span>
              </div>
              <div className="text-2xl font-bold text-blue-700">
                {chartData.length > 1
                  ? chartData[chartData.length - 1]?.diversityRatio >
                    chartData[0]?.diversityRatio
                    ? "↗️"
                    : "↘️"
                  : "👥"}
              </div>
              <p className="text-xs text-blue-600">Diversity improving</p>
            </div>

            <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl animate-scale-in animate-delay-200">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-purple-600" />
                <span className="font-semibold text-purple-900">
                  Governance
                </span>
              </div>
              <div className="text-2xl font-bold text-purple-700">⭐</div>
              <p className="text-xs text-purple-600">
                Strong compliance record
              </p>
            </div>

            <div className="text-center p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl animate-scale-in animate-delay-300">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Target className="h-4 w-4 text-amber-600" />
                <span className="font-semibold text-amber-900">Overall</span>
              </div>
              <div className="text-2xl font-bold text-amber-700">A+</div>
              <p className="text-xs text-amber-600">
                Excellent ESG performance
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
