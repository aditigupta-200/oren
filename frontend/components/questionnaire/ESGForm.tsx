"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, Save, Calculator, Leaf, Users, Shield } from "lucide-react";
import { useToast } from "../../hooks/use-toast";

interface ESGMetrics {
  // Environmental
  totalElectricityConsumption?: number;
  renewableElectricityConsumption?: number;
  totalFuelConsumption?: number;
  carbonEmissions?: number;
  // Social
  totalEmployees?: number;
  femaleEmployees?: number;
  averageTrainingHours?: number;
  communityInvestmentSpend?: number;
  // Governance
  independentBoardMembers?: number;
  hasDataPrivacyPolicy?: "Yes" | "No" | "";
  totalRevenue?: number;
}

interface AutoCalculatedMetrics {
  carbonIntensity?: number;
  renewableElectricityRatio?: number;
  diversityRatio?: number;
  communitySpendRatio?: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export function ESGForm() {
  const [financialYear, setFinancialYear] = useState<number>(
    new Date().getFullYear()
  );
  const [metrics, setMetrics] = useState<ESGMetrics>({});
  const [autoCalculated, setAutoCalculated] = useState<AutoCalculatedMetrics>(
    {}
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const { notify } = useToast();

  // Generate year options (current year and 10 years back)
  const yearOptions = Array.from(
    { length: 11 },
    (_, i) => new Date().getFullYear() - i
  );

  useEffect(() => {
    if (financialYear) {
      loadResponse(financialYear);
    }
  }, [financialYear]);

  useEffect(() => {
    calculateAutoMetrics();
  }, [metrics]);

  const loadResponse = async (year: number) => {
    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/responses/${year}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMetrics(data.response.data || {});
        setAutoCalculated(data.response.data?.autoCalculated || {});
      } else if (response.status === 404) {
        // No data for this year, reset form
        {
          /* End of form content */
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Failed to load data");
      } else {
        setError("Failed to load data");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const calculateAutoMetrics = () => {
    const calculated: AutoCalculatedMetrics = {};

    // Carbon Intensity = (Carbon emissions / Total revenue) T CO2e / INR
    if (
      metrics.carbonEmissions &&
      metrics.totalRevenue &&
      metrics.totalRevenue > 0
    ) {
      calculated.carbonIntensity =
        metrics.carbonEmissions / metrics.totalRevenue;
    }

    // Renewable Electricity Ratio = 100 * (Renewable electricity consumption / Total electricity consumption) %
    if (
      metrics.renewableElectricityConsumption &&
      metrics.totalElectricityConsumption &&
      metrics.totalElectricityConsumption > 0
    ) {
      calculated.renewableElectricityRatio =
        (metrics.renewableElectricityConsumption /
          metrics.totalElectricityConsumption) *
        100;
    }

    // Diversity Ratio = 100 * (Female Employees / Total Employees) %
    if (
      metrics.femaleEmployees &&
      metrics.totalEmployees &&
      metrics.totalEmployees > 0
    ) {
      calculated.diversityRatio =
        (metrics.femaleEmployees / metrics.totalEmployees) * 100;
    }

    // Community Spend Ratio = 100 * (Community investment spend / Total Revenue) %
    if (
      metrics.communityInvestmentSpend &&
      metrics.totalRevenue &&
      metrics.totalRevenue > 0
    ) {
      calculated.communitySpendRatio =
        (metrics.communityInvestmentSpend / metrics.totalRevenue) * 100;
    }

    setAutoCalculated(calculated);
  };

  const handleInputChange = (
    field: keyof ESGMetrics,
    value: string | number
  ) => {
    setMetrics((prev) => ({
      ...prev,
      [field]: value === "" ? undefined : value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/responses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          financialYear,
          data: {
            ...metrics,
            autoCalculated,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save response");
      }

      notify(`ESG data for ${financialYear} saved successfully`, "success");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Failed to save data");
      } else {
        setError("Failed to save data");
      }
      notify(
        err instanceof Error ? err.message : "Failed to save data",
        "error"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const formatNumber = (value: number | undefined, decimals = 2) => {
    if (value === undefined || value === null) return "N/A";
    return value.toFixed(decimals);
  };

  if (!user) {
    return <Alert>Please log in to access the questionnaire.</Alert>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-green-600" />
            ESG Questionnaire
          </CardTitle>
          <CardDescription>
            Complete your Environmental, Social, and Governance metrics for
            comprehensive reporting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="financialYear">Financial Year</Label>
              <Select
                value={financialYear.toString()}
                onValueChange={(value) =>
                  setFinancialYear(Number.parseInt(value))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select financial year" />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="btn-primary"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Data
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      {error && <Alert>{error}</Alert>}
      {/* The rest of your form goes here. Remove any stray CardContent/Card/JSX fragments left from previous error handling. */}
      {/* Environmental Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-green-600" />
            Environmental Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="totalElectricityConsumption">
                Total electricity consumption
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="totalElectricityConsumption"
                  type="number"
                  placeholder="0"
                  value={metrics.totalElectricityConsumption || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "totalElectricityConsumption",
                      Number.parseFloat(e.target.value)
                    )
                  }
                />
                <Badge variant="secondary">kWh</Badge>
              </div>
            </div>

            <div>
              <Label htmlFor="renewableElectricityConsumption">
                Renewable electricity consumption
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="renewableElectricityConsumption"
                  type="number"
                  placeholder="0"
                  value={metrics.renewableElectricityConsumption || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "renewableElectricityConsumption",
                      Number.parseFloat(e.target.value)
                    )
                  }
                />
                <Badge variant="secondary">kWh</Badge>
              </div>
            </div>

            <div>
              <Label htmlFor="totalFuelConsumption">
                Total fuel consumption
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="totalFuelConsumption"
                  type="number"
                  placeholder="0"
                  value={metrics.totalFuelConsumption || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "totalFuelConsumption",
                      Number.parseFloat(e.target.value)
                    )
                  }
                />
                <Badge variant="secondary">liters</Badge>
              </div>
            </div>

            <div>
              <Label htmlFor="carbonEmissions">Carbon emissions</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="carbonEmissions"
                  type="number"
                  placeholder="0"
                  value={metrics.carbonEmissions || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "carbonEmissions",
                      Number.parseFloat(e.target.value)
                    )
                  }
                />
                <Badge variant="secondary">T CO2e</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Social Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="totalEmployees">Total number of employees</Label>
              <Input
                id="totalEmployees"
                type="number"
                placeholder="0"
                value={metrics.totalEmployees || ""}
                onChange={(e) =>
                  handleInputChange(
                    "totalEmployees",
                    Number.parseInt(e.target.value)
                  )
                }
              />
            </div>

            <div>
              <Label htmlFor="femaleEmployees">
                Number of female employees
              </Label>
              <Input
                id="femaleEmployees"
                type="number"
                placeholder="0"
                value={metrics.femaleEmployees || ""}
                onChange={(e) =>
                  handleInputChange(
                    "femaleEmployees",
                    Number.parseInt(e.target.value)
                  )
                }
              />
            </div>

            <div>
              <Label htmlFor="averageTrainingHours">
                Average training hours per employee (per year)
              </Label>
              <Input
                id="averageTrainingHours"
                type="number"
                placeholder="0"
                value={metrics.averageTrainingHours || ""}
                onChange={(e) =>
                  handleInputChange(
                    "averageTrainingHours",
                    Number.parseFloat(e.target.value)
                  )
                }
              />
            </div>

            <div>
              <Label htmlFor="communityInvestmentSpend">
                Community investment spend
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="communityInvestmentSpend"
                  type="number"
                  placeholder="0"
                  value={metrics.communityInvestmentSpend || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "communityInvestmentSpend",
                      Number.parseFloat(e.target.value)
                    )
                  }
                />
                <Badge variant="secondary">INR</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Governance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-purple-600" />
            Governance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="independentBoardMembers">
                % of independent board members
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="independentBoardMembers"
                  type="number"
                  placeholder="0"
                  min="0"
                  max="100"
                  value={metrics.independentBoardMembers || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "independentBoardMembers",
                      Number.parseFloat(e.target.value)
                    )
                  }
                />
                <Badge variant="secondary">%</Badge>
              </div>
            </div>

            <div>
              <Label htmlFor="hasDataPrivacyPolicy">
                Does the company have a data privacy policy?
              </Label>
              <Select
                value={metrics.hasDataPrivacyPolicy || ""}
                onValueChange={(value) =>
                  handleInputChange(
                    "hasDataPrivacyPolicy",
                    value as "Yes" | "No"
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="totalRevenue">Total Revenue</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="totalRevenue"
                  type="number"
                  placeholder="0"
                  value={metrics.totalRevenue || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "totalRevenue",
                      Number.parseFloat(e.target.value)
                    )
                  }
                />
                <Badge variant="secondary">INR</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Auto-Calculated Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-orange-600" />
            Auto-Calculated Metrics
          </CardTitle>
          <CardDescription>
            These metrics are automatically calculated based on your input data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Carbon Intensity</span>
                <Badge>
                  {formatNumber(autoCalculated.carbonIntensity, 8)} T CO2e / INR
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                Carbon emissions ÷ Total revenue
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Renewable Electricity Ratio</span>
                <Badge>
                  {formatNumber(autoCalculated.renewableElectricityRatio)}%
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                100 × (Renewable electricity ÷ Total electricity)
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Diversity Ratio</span>
                <Badge>{formatNumber(autoCalculated.diversityRatio)}%</Badge>
              </div>
              <p className="text-sm text-gray-600">
                100 × (Female employees ÷ Total employees)
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Community Spend Ratio</span>
                <Badge>
                  {formatNumber(autoCalculated.communitySpendRatio)}%
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                100 × (Community investment ÷ Total revenue)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
