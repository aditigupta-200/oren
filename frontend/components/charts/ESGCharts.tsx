interface AutoCalculated {
  carbonIntensity?: number;
  renewableElectricityRatio?: number;
  diversityRatio?: number;
  communitySpendRatio?: number;
}

function isAutoCalculated(obj: unknown): obj is AutoCalculated {
  return (
    typeof obj === "object" &&
    obj !== null &&
    ("carbonIntensity" in obj ||
      "renewableElectricityRatio" in obj ||
      "diversityRatio" in obj ||
      "communitySpendRatio" in obj)
  );
}

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface ESGData {
  financialYear: number;
  data: Record<string, unknown>;
}

interface ESGChartsProps {
  responses: ESGData[];
}

const COLORS = {
  primary: "#16a34a",
  secondary: "#059669",
  accent: "#0d9488",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#3b82f6",
};

export function ESGCharts({ responses }: ESGChartsProps) {
  if (!responses || responses.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-gray-600">No data available for charts</p>
        </CardContent>
      </Card>
    );
  }

  // Prepare data for charts
  const chartData = responses
    .map((response) => ({
      year: response.financialYear,
      carbonEmissions: response.data.carbonEmissions || 0,
      totalRevenue: response.data.totalRevenue || 0,
      totalEmployees: response.data.totalEmployees || 0,
      femaleEmployees: response.data.femaleEmployees || 0,
      renewableElectricityConsumption:
        response.data.renewableElectricityConsumption || 0,
      totalElectricityConsumption:
        response.data.totalElectricityConsumption || 0,
      communityInvestmentSpend: response.data.communityInvestmentSpend || 0,
      carbonIntensity:
        isAutoCalculated(response.data.autoCalculated) &&
        typeof response.data.autoCalculated.carbonIntensity === "number"
          ? response.data.autoCalculated.carbonIntensity
          : 0,
      renewableRatio:
        isAutoCalculated(response.data.autoCalculated) &&
        typeof response.data.autoCalculated.renewableElectricityRatio ===
          "number"
          ? response.data.autoCalculated.renewableElectricityRatio
          : 0,
      diversityRatio:
        isAutoCalculated(response.data.autoCalculated) &&
        typeof response.data.autoCalculated.diversityRatio === "number"
          ? response.data.autoCalculated.diversityRatio
          : 0,
      communitySpendRatio:
        isAutoCalculated(response.data.autoCalculated) &&
        typeof response.data.autoCalculated.communitySpendRatio === "number"
          ? response.data.autoCalculated.communitySpendRatio
          : 0,
    }))
    .sort((a, b) => a.year - b.year);

  // Latest year data for pie charts
  const latestData = chartData[chartData.length - 1];

  // Diversity pie chart data
  const diversityData = latestData
    ? [
        {
          name: "Female Employees",
          value: latestData.femaleEmployees,
          color: COLORS.primary,
        },
        {
          name: "Male Employees",
          value:
            typeof latestData.totalEmployees === "number" &&
            typeof latestData.femaleEmployees === "number"
              ? latestData.totalEmployees - latestData.femaleEmployees
              : 0,
          color: COLORS.secondary,
        },
      ]
    : [];

  // Energy consumption pie chart data
  const energyData = latestData
    ? [
        {
          name: "Renewable Energy",
          value: latestData.renewableElectricityConsumption,
          color: COLORS.primary,
        },
        {
          name: "Non-Renewable Energy",
          value:
            typeof latestData.totalElectricityConsumption === "number" &&
            typeof latestData.renewableElectricityConsumption === "number"
              ? latestData.totalElectricityConsumption -
                latestData.renewableElectricityConsumption
              : 0,
          color: COLORS.warning,
        },
      ]
    : [];

  // Calculate trends
  const getTrend = (current: number, previous: number) => {
    if (!previous || previous === 0) return null;
    const change = ((current - previous) / previous) * 100;
    return {
      direction: change > 0 ? "up" : change < 0 ? "down" : "stable",
      percentage: Math.abs(change).toFixed(1),
    };
  };

  const getNumber = (v: unknown): number => (typeof v === "number" ? v : 0);
  const carbonTrend =
    chartData.length >= 2
      ? getTrend(
          getNumber(chartData[chartData.length - 1].carbonEmissions),
          getNumber(chartData[chartData.length - 2].carbonEmissions)
        )
      : null;

  const revenueTrend =
    chartData.length >= 2
      ? getTrend(
          getNumber(chartData[chartData.length - 1].totalRevenue),
          getNumber(chartData[chartData.length - 2].totalRevenue)
        )
      : null;

  return (
    <div className="space-y-6">
      {/* Key Metrics Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Carbon Emissions
            </CardTitle>
            {carbonTrend && (
              <div className="flex items-center gap-1">
                {carbonTrend.direction === "up" && (
                  <TrendingUp className="h-4 w-4 text-red-500" />
                )}
                {carbonTrend.direction === "down" && (
                  <TrendingDown className="h-4 w-4 text-green-500" />
                )}
                {carbonTrend.direction === "stable" && (
                  <Minus className="h-4 w-4 text-gray-500" />
                )}
                <span className="text-xs text-muted-foreground">
                  {carbonTrend.percentage}%
                </span>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {typeof latestData?.carbonEmissions === "number"
                ? latestData.carbonEmissions
                : 0}
            </div>
            <p className="text-xs text-muted-foreground">T CO2e</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            {revenueTrend && (
              <div className="flex items-center gap-1">
                {revenueTrend.direction === "up" && (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                )}
                {revenueTrend.direction === "down" && (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                {revenueTrend.direction === "stable" && (
                  <Minus className="h-4 w-4 text-gray-500" />
                )}
                <span className="text-xs text-muted-foreground">
                  {revenueTrend.percentage}%
                </span>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹
              {typeof latestData?.totalRevenue === "number"
                ? latestData.totalRevenue.toLocaleString()
                : 0}
            </div>
            <p className="text-xs text-muted-foreground">INR</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Diversity Ratio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(latestData?.diversityRatio || 0).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Female employees</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Renewable Energy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(latestData?.renewableRatio || 0).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Of total consumption
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Carbon Emissions Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Carbon Emissions Trend</CardTitle>
            <CardDescription>
              Track your carbon footprint over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`${value} T CO2e`, "Carbon Emissions"]}
                />
                <Line
                  type="monotone"
                  dataKey="carbonEmissions"
                  stroke={COLORS.danger}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue vs Community Investment */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue vs Community Investment</CardTitle>
            <CardDescription>
              Compare revenue growth with community spending
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    name === "totalRevenue"
                      ? `₹${value.toLocaleString()}`
                      : `₹${value.toLocaleString()}`,
                    name === "totalRevenue"
                      ? "Total Revenue"
                      : "Community Investment",
                  ]}
                />
                <Legend />
                <Bar
                  dataKey="totalRevenue"
                  fill={COLORS.primary}
                  name="Total Revenue"
                />
                <Bar
                  dataKey="communityInvestmentSpend"
                  fill={COLORS.accent}
                  name="Community Investment"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Employee Diversity */}
        <Card>
          <CardHeader>
            <CardTitle>
              Employee Diversity ({latestData?.year || "N/A"})
            </CardTitle>
            <CardDescription>
              Gender distribution in your workforce
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={diversityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    percent !== undefined
                      ? `${name}: ${(percent * 100).toFixed(0)}%`
                      : String(name)
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {diversityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} employees`, ""]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Energy Consumption */}
        <Card>
          <CardHeader>
            <CardTitle>
              Energy Consumption ({latestData?.year || "N/A"})
            </CardTitle>
            <CardDescription>
              Renewable vs non-renewable energy usage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={energyData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    percent !== undefined
                      ? `${name}: ${(percent * 100).toFixed(0)}%`
                      : String(name)
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {energyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} kWh`, ""]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Auto-Calculated Metrics Trend */}
      <Card>
        <CardHeader>
          <CardTitle>ESG Performance Indicators</CardTitle>
          <CardDescription>
            Track your key ESG ratios and performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip
                formatter={(value, name) => {
                  const formatters = {
                    carbonIntensity: (v: number) =>
                      `${v.toFixed(8)} T CO2e/INR`,
                    renewableRatio: (v: number) => `${v.toFixed(1)}%`,
                    diversityRatio: (v: number) => `${v.toFixed(1)}%`,
                    communitySpendRatio: (v: number) => `${v.toFixed(2)}%`,
                  };
                  const formatter = formatters[name as keyof typeof formatters];
                  return [formatter ? formatter(value as number) : value, name];
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="renewableRatio"
                stroke={COLORS.primary}
                strokeWidth={2}
                name="Renewable Energy %"
              />
              <Line
                type="monotone"
                dataKey="diversityRatio"
                stroke={COLORS.info}
                strokeWidth={2}
                name="Diversity Ratio %"
              />
              <Line
                type="monotone"
                dataKey="communitySpendRatio"
                stroke={COLORS.accent}
                strokeWidth={2}
                name="Community Spend %"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
