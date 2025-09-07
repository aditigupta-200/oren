"use client";

import { useState, useEffect, useCallback } from "react";
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
import {
  Loader2,
  Save,
  Calculator,
  Leaf,
  Users,
  Shield,
  CheckCircle,
  AlertCircle,
  Zap,
  Target,
  Calendar,
  BarChart3,
  Globe,
  Award,
  Lightbulb,
  ArrowRight,
} from "lucide-react";
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

const validationMessages = {
  required: "This field is required",
  positive: "Value must be greater than 0",
  relationship: "Renewable energy cannot exceed total electricity",
  range: "Value must be between 0 and 100",
  format: "Please enter a valid 4-digit year",
  femaleEmployees: "Number of female employees cannot exceed total employees",
  carbonEmissions: "Carbon emissions must be greater than 0",
  totalRevenue: "Total revenue must be greater than 0",
  boardIndependence: "Board independence must be between 0 and 100%",
};

interface ValidationError {
  field: keyof ESGMetrics;
  message: string;
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
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [completionScore, setCompletionScore] = useState(0);
  const { user } = useAuth();
  const { notify } = useToast();

  const validateField = useCallback(
    (
      field: keyof ESGMetrics,
      value: number | undefined
    ): ValidationError | null => {
      if (value === undefined || value === null) return null;

      switch (field) {
        case "totalElectricityConsumption":
          if (value <= 0)
            return { field, message: validationMessages.positive };
          break;

        case "renewableElectricityConsumption":
          if (value <= 0)
            return { field, message: validationMessages.positive };
          if (
            metrics.totalElectricityConsumption &&
            value > metrics.totalElectricityConsumption
          ) {
            return { field, message: validationMessages.relationship };
          }
          break;

        case "carbonEmissions":
          if (value <= 0)
            return { field, message: validationMessages.carbonEmissions };
          break;

        case "totalEmployees":
          if (value <= 0)
            return { field, message: validationMessages.positive };
          break;

        case "femaleEmployees":
          if (value < 0) return { field, message: validationMessages.positive };
          if (metrics.totalEmployees && value > metrics.totalEmployees) {
            return { field, message: validationMessages.femaleEmployees };
          }
          break;

        case "independentBoardMembers":
          if (value < 0 || value > 100)
            return { field, message: validationMessages.boardIndependence };
          break;

        case "totalRevenue":
          if (value <= 0)
            return { field, message: validationMessages.totalRevenue };
          break;
      }

      return null;
    },
    [metrics]
  );

  // Generate year options (current year and 10 years back)
  const yearOptions = Array.from(
    { length: 11 },
    (_, i) => new Date().getFullYear() - i
  );

  const formSteps = [
    {
      id: "setup",
      title: "Setup",
      description: "Configure your assessment",
      icon: <Calendar className="h-5 w-5" />,
      color: "gray",
    },
    {
      id: "environmental",
      title: "Environmental",
      description: "Carbon & resource metrics",
      icon: <Leaf className="h-5 w-5" />,
      color: "emerald",
    },
    {
      id: "social",
      title: "Social",
      description: "People & community impact",
      icon: <Users className="h-5 w-5" />,
      color: "blue",
    },
    {
      id: "governance",
      title: "Governance",
      description: "Ethics & transparency",
      icon: <Shield className="h-5 w-5" />,
      color: "purple",
    },
    {
      id: "review",
      title: "Review",
      description: "Validate & submit",
      icon: <CheckCircle className="h-5 w-5" />,
      color: "green",
    },
  ];

  const calculateAutoMetrics = useCallback(() => {
    const calculated: AutoCalculatedMetrics = {};

    if (
      metrics.carbonEmissions &&
      metrics.totalRevenue &&
      metrics.totalRevenue > 0
    ) {
      calculated.carbonIntensity =
        metrics.carbonEmissions / metrics.totalRevenue;
    }

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

    if (
      metrics.femaleEmployees &&
      metrics.totalEmployees &&
      metrics.totalEmployees > 0
    ) {
      calculated.diversityRatio =
        (metrics.femaleEmployees / metrics.totalEmployees) * 100;
    }

    if (
      metrics.communityInvestmentSpend &&
      metrics.totalRevenue &&
      metrics.totalRevenue > 0
    ) {
      calculated.communitySpendRatio =
        (metrics.communityInvestmentSpend / metrics.totalRevenue) * 100;
    }

    setAutoCalculated(calculated);
  }, [metrics]);

  const calculateCompletionScore = useCallback(() => {
    const totalFields = 11;
    const filledFields = Object.keys(metrics).filter(
      (key) =>
        metrics[key as keyof ESGMetrics] !== undefined &&
        metrics[key as keyof ESGMetrics] !== null &&
        metrics[key as keyof ESGMetrics] !== ""
    ).length;
    setCompletionScore(Math.round((filledFields / totalFields) * 100));
  }, [metrics]);

  const validateAll = useCallback(() => {
    const errors: ValidationError[] = [];

    // Validate all fields
    Object.entries(metrics).forEach(([field, value]) => {
      if (typeof value === "number") {
        const error = validateField(field as keyof ESGMetrics, value);
        if (error) {
          errors.push(error);
        }
      }
    });

    setValidationErrors(errors);
    return errors.length === 0;
  }, [metrics, validateField]);

  useEffect(() => {
    if (financialYear) {
      loadResponse(financialYear);
    }
  }, [financialYear]);

  useEffect(() => {
    console.log("Metrics updated:", metrics);

    // Calculate auto metrics only if values change
    const calculated: AutoCalculatedMetrics = {};

    if (
      metrics.carbonEmissions &&
      metrics.totalRevenue &&
      metrics.totalRevenue > 0
    ) {
      calculated.carbonIntensity =
        metrics.carbonEmissions / metrics.totalRevenue;
    }

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

    if (
      metrics.femaleEmployees &&
      metrics.totalEmployees &&
      metrics.totalEmployees > 0
    ) {
      calculated.diversityRatio =
        (metrics.femaleEmployees / metrics.totalEmployees) * 100;
    }

    if (
      metrics.communityInvestmentSpend &&
      metrics.totalRevenue &&
      metrics.totalRevenue > 0
    ) {
      calculated.communitySpendRatio =
        (metrics.communityInvestmentSpend / metrics.totalRevenue) * 100;
    }

    if (JSON.stringify(calculated) !== JSON.stringify(autoCalculated)) {
      setAutoCalculated(calculated);
    }

    // Calculate completion score only if it changes
    const totalFields = 11;
    const filledFields = Object.keys(metrics).filter(
      (key) =>
        metrics[key as keyof ESGMetrics] !== undefined &&
        metrics[key as keyof ESGMetrics] !== null &&
        metrics[key as keyof ESGMetrics] !== ""
    ).length;
    const newCompletionScore = Math.round((filledFields / totalFields) * 100);

    if (newCompletionScore !== completionScore) {
      setCompletionScore(newCompletionScore);
    }
  }, [metrics, autoCalculated, completionScore]);

  const loadResponse = async (year: number) => {
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/api/esg/responses/${year}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMetrics(data.response.data || {});
        setAutoCalculated(data.response.data?.autoCalculated || {});
      } else if (response.status === 404) {
        setMetrics({});
        setAutoCalculated({});
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Failed to load data");
      } else {
        setError("Failed to load data");
      }
    }
  };

  const handleInputChange = (
    field: keyof ESGMetrics,
    value: string | number
  ) => {
    const numericValue = value === "" ? undefined : Number(value);

    // Validate the field immediately
    const error =
      numericValue !== undefined ? validateField(field, numericValue) : null;

    setMetrics((prev) => ({
      ...prev,
      [field]: numericValue,
    }));

    // Update validation errors
    setValidationErrors((prev) => {
      const filtered = prev.filter((e) => e.field !== field);
      return error ? [...filtered, error] : filtered;
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/esg/responses`, {
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

      notify(`ESG data for ${financialYear} saved successfully! 🎉`, "success");
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

  const canMoveToNextStep = () => {
    return validateAll();
  };

  const handleNextStep = () => {
    if (validateAll()) {
      setCurrentStep((prev) => prev + 1);
    } else {
      notify("Please fix validation errors before proceeding", "error");
    }
  };

  const StepIndicator = () => (
    <Card className="glass-card enhanced-card border-0 shadow-xl animate-slide-down">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          {formSteps.map((step, index) => (
            <div
              key={step.id}
              className={`
                flex items-center transition-all duration-300 cursor-pointer
                ${index === currentStep ? "scale-110" : "hover:scale-105"}
              `}
              onClick={() => {
                if (index > currentStep && !canMoveToNextStep()) {
                  notify(validationErrors.join(". "), "error");
                  return;
                }
                setCurrentStep(index);
              }}
            >
              <div
                className={`
                flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300
                ${
                  index === currentStep
                    ? `bg-${step.color}-100 text-${step.color}-700 shadow-lg`
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }
                ${
                  index < currentStep
                    ? `text-${step.color}-600 bg-${step.color}-50`
                    : ""
                }
              `}
              >
                {index < currentStep ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  step.icon
                )}
                <div className="hidden md:block">
                  <div className="font-medium text-sm">{step.title}</div>
                  <div className="text-xs opacity-75">{step.description}</div>
                </div>
              </div>
              {index < formSteps.length - 1 && (
                <ArrowRight className="h-4 w-4 text-gray-400 mx-2" />
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 bg-gray-200 rounded-full h-2">
          <div
            className="progress-bar"
            style={{
              width: `${(currentStep / (formSteps.length - 1)) * 100}%`,
            }}
          ></div>
        </div>
      </CardContent>
    </Card>
  );

  if (!user) {
    return (
      <Alert className="animate-scale-in">
        <AlertCircle className="h-4 w-4" />
        <span className="ml-2">Please log in to access the questionnaire.</span>
      </Alert>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="animate-slide-down">
        <Card className="glass-card enhanced-card border-0 shadow-2xl">
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="animate-slide-right">
                <CardTitle className="flex items-center gap-3 text-3xl font-bold text-gray-900">
                  <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg animate-float">
                    <Calculator className="h-8 w-8 text-white" />
                  </div>
                  ESG Assessment Portal
                </CardTitle>
                <CardDescription className="text-lg text-gray-600 mt-2">
                  Complete your comprehensive sustainability assessment with
                  real-time analytics
                </CardDescription>
              </div>
              <div className="flex items-center gap-4 animate-slide-left">
                <div className="text-center p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
                  <div className="text-2xl font-bold text-emerald-600">
                    {completionScore}%
                  </div>
                  <div className="text-xs text-emerald-700 font-medium">
                    Complete
                  </div>
                </div>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="btn-gradient text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 px-6 py-3"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Progress
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Step Indicator */}
      <StepIndicator />

      {(error || validationErrors.length > 0) && (
        <div className="animate-slide-up space-y-2">
          {error && (
            <Alert className="border-red-200 bg-red-50 text-red-700">
              <AlertCircle className="h-4 w-4" />
              <span className="ml-2">{error}</span>
            </Alert>
          )}
          {validationErrors.length > 0 && (
            <Alert className="border-yellow-200 bg-yellow-50 text-yellow-700">
              <AlertCircle className="h-4 w-4" />
              <span className="ml-2">
                Please fix the following errors:
                <ul className="list-disc list-inside mt-1">
                  {validationErrors.map((err, index) => (
                    <li key={index}>
                      <span className="font-medium">{err.field}:</span>{" "}
                      {err.message}
                    </li>
                  ))}
                </ul>
              </span>
            </Alert>
          )}
        </div>
      )}

      {/* Step 0: Setup */}
      {currentStep === 0 && (
        <div className="animate-fade-in">
          <Card className="glass-card enhanced-card border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Calendar className="h-6 w-6 text-gray-600" />
                Assessment Configuration
              </CardTitle>
              <CardDescription>
                Set up your ESG assessment parameters and data collection period
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label
                    htmlFor="financialYear"
                    className="text-lg font-semibold"
                  >
                    Financial Year
                  </Label>
                  <Select
                    value={financialYear.toString()}
                    onValueChange={(value) =>
                      setFinancialYear(Number.parseInt(value))
                    }
                  >
                    <SelectTrigger className="h-12 text-lg border-2 border-gray-300 hover:border-emerald-400 transition-colors">
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
                  <p className="text-sm text-gray-600">
                    Select the reporting period for this assessment
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Assessment Overview</h3>
                  <div className="grid gap-3">
                    <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                      <Leaf className="h-5 w-5 text-emerald-600" />
                      <div>
                        <div className="font-medium text-emerald-900">
                          Environmental Metrics
                        </div>
                        <div className="text-sm text-emerald-700">
                          4 key indicators
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <Users className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium text-blue-900">
                          Social Impact
                        </div>
                        <div className="text-sm text-blue-700">
                          4 key indicators
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <Shield className="h-5 w-5 text-purple-600" />
                      <div>
                        <div className="font-medium text-purple-900">
                          Governance
                        </div>
                        <div className="text-sm text-purple-700">
                          3 key indicators
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => setCurrentStep(1)}
                  className="btn-gradient text-white px-8 py-3"
                >
                  Start Assessment <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 1: Environmental Metrics */}
      {currentStep === 1 && (
        <div className="animate-fade-in">
          <Card className="glass-card enhanced-card border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Leaf className="h-6 w-6 text-emerald-600" />
                Environmental Metrics
              </CardTitle>
              <CardDescription>
                Track your environmental impact and sustainability initiatives
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2 animate-slide-up">
                  <Label
                    htmlFor="totalElectricityConsumption"
                    className="font-semibold flex items-center gap-2"
                  >
                    Total electricity consumption
                    <Badge className="bg-blue-100 text-blue-800">
                      Required for renewable ratio
                    </Badge>
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="totalElectricityConsumption"
                      type="number"
                      min="0"
                      placeholder="Enter consumption"
                      value={metrics.totalElectricityConsumption || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "totalElectricityConsumption",
                          Number.parseFloat(e.target.value)
                        )
                      }
                      className="h-12 text-lg border-2 border-gray-300 focus:border-emerald-400 transition-colors"
                    />
                    <Badge variant="secondary" className="px-3 py-1">
                      kWh
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    Annual electricity consumption across all facilities
                  </p>
                </div>

                <div className="space-y-2 animate-slide-up animate-delay-100">
                  <Label
                    htmlFor="renewableElectricityConsumption"
                    className="font-semibold flex items-center gap-2"
                  >
                    Renewable electricity consumption
                    <Badge className="bg-blue-100 text-blue-800">
                      Required for renewable ratio
                    </Badge>
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="renewableElectricityConsumption"
                      type="number"
                      min="0"
                      placeholder="Enter renewable consumption"
                      value={metrics.renewableElectricityConsumption || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "renewableElectricityConsumption",
                          Number.parseFloat(e.target.value)
                        )
                      }
                      className="h-12 text-lg border-2 border-gray-300 focus:border-emerald-400 transition-colors"
                    />
                    <Badge variant="secondary" className="px-3 py-1">
                      kWh
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    Electricity from renewable sources (solar, wind, etc.)
                  </p>
                </div>

                <div className="space-y-2 animate-slide-up animate-delay-200">
                  <Label
                    htmlFor="totalFuelConsumption"
                    className="font-semibold"
                  >
                    Total fuel consumption
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="totalFuelConsumption"
                      type="number"
                      placeholder="Enter fuel consumption"
                      value={metrics.totalFuelConsumption || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "totalFuelConsumption",
                          Number.parseFloat(e.target.value)
                        )
                      }
                      className="h-12 text-lg border-2 border-gray-300 focus:border-emerald-400 transition-colors"
                    />
                    <Badge variant="secondary" className="px-3 py-1">
                      liters
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    Total fuel usage for operations and transport
                  </p>
                </div>

                <div className="space-y-2 animate-slide-up animate-delay-300">
                  <Label
                    htmlFor="carbonEmissions"
                    className="font-semibold flex items-center gap-2"
                  >
                    Carbon emissions
                    <Badge className="bg-blue-100 text-blue-800">
                      Required for intensity
                    </Badge>
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="carbonEmissions"
                      type="number"
                      min="0"
                      placeholder="Enter emissions"
                      value={metrics.carbonEmissions || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "carbonEmissions",
                          Number.parseFloat(e.target.value)
                        )
                      }
                      className="h-12 text-lg border-2 border-gray-300 focus:border-emerald-400 transition-colors"
                    />
                    <Badge variant="secondary" className="px-3 py-1">
                      T CO2e
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    Total greenhouse gas emissions (Scope 1 & 2)
                  </p>
                </div>
              </div>

              {/* Environmental Insights */}
              {(metrics.totalElectricityConsumption ||
                metrics.renewableElectricityConsumption) && (
                <div className="animate-slide-up bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-xl border border-emerald-200">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="h-6 w-6 text-emerald-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-emerald-900 mb-2">
                        Environmental Insight
                      </h4>
                      <p className="text-emerald-700 text-sm">
                        {autoCalculated.renewableElectricityRatio
                          ? `Great! You're using ${autoCalculated.renewableElectricityRatio.toFixed(
                              1
                            )}% renewable energy. `
                          : "Add renewable energy data to see your clean energy ratio. "}
                        {autoCalculated.renewableElectricityRatio &&
                        autoCalculated.renewableElectricityRatio > 50
                          ? "You're ahead of many organizations in renewable adoption!"
                          : "Consider increasing renewable energy usage to improve your environmental score."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between">
                <Button
                  onClick={() => setCurrentStep(0)}
                  variant="outline"
                  className="px-6"
                >
                  Previous
                </Button>
                <Button
                  onClick={handleNextStep}
                  className="btn-gradient text-white px-8"
                  disabled={!canMoveToNextStep()}
                >
                  {validationErrors.length > 0 ? (
                    <>
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Fix Validation Errors
                    </>
                  ) : (
                    <>
                      Next: Social Metrics
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 2: Social Metrics */}
      {currentStep === 2 && (
        <div className="animate-fade-in">
          <Card className="glass-card enhanced-card border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Users className="h-6 w-6 text-blue-600" />
                Social Impact Metrics
              </CardTitle>
              <CardDescription>
                Measure your people-focused initiatives and community engagement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2 animate-slide-up">
                  <Label
                    htmlFor="totalEmployees"
                    className="font-semibold flex items-center gap-2"
                  >
                    Total number of employees
                    <Badge className="bg-blue-100 text-blue-800">
                      Required for diversity ratio
                    </Badge>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      Must be greater than 0
                    </Badge>
                  </Label>
                  <Input
                    id="totalEmployees"
                    type="number"
                    min="1"
                    placeholder="Enter total employees"
                    value={metrics.totalEmployees || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "totalEmployees",
                        Number.parseInt(e.target.value)
                      )
                    }
                    className="h-12 text-lg border-2 border-gray-300 focus:border-blue-400 transition-colors"
                  />
                  <p className="text-sm text-gray-600">
                    Full-time equivalent employees
                  </p>
                </div>

                <div className="space-y-2 animate-slide-up animate-delay-100">
                  <Label
                    htmlFor="femaleEmployees"
                    className="font-semibold flex items-center gap-2"
                  >
                    Number of female employees
                    <Badge className="bg-blue-100 text-blue-800">
                      Required for diversity ratio
                    </Badge>
                  </Label>
                  <Input
                    id="femaleEmployees"
                    type="number"
                    min="0"
                    placeholder="Enter female employees"
                    value={metrics.femaleEmployees || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "femaleEmployees",
                        Number.parseInt(e.target.value)
                      )
                    }
                    className="h-12 text-lg border-2 border-gray-300 focus:border-blue-400 transition-colors"
                  />
                  <p className="text-sm text-gray-600">
                    Female representation in workforce
                  </p>
                </div>

                <div className="space-y-2 animate-slide-up animate-delay-200">
                  <Label
                    htmlFor="averageTrainingHours"
                    className="font-semibold"
                  >
                    Average training hours per employee (per year)
                  </Label>
                  <Input
                    id="averageTrainingHours"
                    type="number"
                    placeholder="Enter training hours"
                    value={metrics.averageTrainingHours || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "averageTrainingHours",
                        Number.parseFloat(e.target.value)
                      )
                    }
                    className="h-12 text-lg border-2 border-gray-300 focus:border-blue-400 transition-colors"
                  />
                  <p className="text-sm text-gray-600">
                    Investment in employee development
                  </p>
                </div>

                <div className="space-y-2 animate-slide-up animate-delay-300">
                  <Label
                    htmlFor="communityInvestmentSpend"
                    className="font-semibold flex items-center gap-2"
                  >
                    Community investment spend
                    <Badge className="bg-blue-100 text-blue-800">
                      Required for community ratio
                    </Badge>
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="communityInvestmentSpend"
                      type="number"
                      min="0"
                      placeholder="Enter community spend"
                      value={metrics.communityInvestmentSpend || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "communityInvestmentSpend",
                          Number.parseFloat(e.target.value)
                        )
                      }
                      className="h-12 text-lg border-2 border-gray-300 focus:border-blue-400 transition-colors"
                    />
                    <Badge variant="secondary" className="px-3 py-1">
                      INR
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    Annual investment in community programs
                  </p>
                </div>
              </div>

              {/* Social Insights */}
              {metrics.totalEmployees && metrics.femaleEmployees && (
                <div className="animate-slide-up bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
                  <div className="flex items-start gap-3">
                    <Target className="h-6 w-6 text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-2">
                        Diversity Insight
                      </h4>
                      <p className="text-blue-700 text-sm">
                        Your workforce is{" "}
                        {autoCalculated.diversityRatio?.toFixed(1)}% female.
                        {autoCalculated.diversityRatio &&
                        autoCalculated.diversityRatio >= 40
                          ? " Excellent gender diversity! You're setting a great example."
                          : " Consider initiatives to improve gender diversity in your organization."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between">
                <Button
                  onClick={() => setCurrentStep(1)}
                  variant="outline"
                  className="px-6"
                >
                  Previous
                </Button>
                <Button
                  onClick={handleNextStep}
                  className="btn-gradient text-white px-8"
                  disabled={!canMoveToNextStep()}
                >
                  {validationErrors.length > 0 ? (
                    <>
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Fix Validation Errors
                    </>
                  ) : (
                    <>
                      Next: Governance
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 3: Governance Metrics */}
      {currentStep === 3 && (
        <div className="animate-fade-in">
          <Card className="glass-card enhanced-card border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Shield className="h-6 w-6 text-purple-600" />
                Governance Standards
              </CardTitle>
              <CardDescription>
                Assess your organizational ethics, transparency, and
                accountability measures
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2 animate-slide-up">
                  <Label
                    htmlFor="independentBoardMembers"
                    className="font-semibold"
                  >
                    % of independent board members
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="independentBoardMembers"
                      type="number"
                      placeholder="Enter percentage"
                      min="0"
                      max="100"
                      value={metrics.independentBoardMembers || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "independentBoardMembers",
                          Number.parseFloat(e.target.value)
                        )
                      }
                      className="h-12 text-lg border-2 border-gray-300 focus:border-purple-400 transition-colors"
                    />
                    <Badge variant="secondary" className="px-3 py-1">
                      %
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    Percentage of board members who are independent
                  </p>
                </div>

                <div className="space-y-2 animate-slide-up animate-delay-100">
                  <Label
                    htmlFor="hasDataPrivacyPolicy"
                    className="font-semibold"
                  >
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
                    <SelectTrigger className="h-12 text-lg border-2 border-gray-300 hover:border-purple-400 transition-colors">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-600">
                    GDPR and data protection compliance
                  </p>
                </div>

                <div className="md:col-span-2 space-y-2 animate-slide-up animate-delay-200">
                  <Label
                    htmlFor="totalRevenue"
                    className="font-semibold flex items-center gap-2"
                  >
                    Total Revenue
                    <Badge className="bg-red-100 text-red-800">
                      Required for calculations
                    </Badge>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      Must be greater than 0
                    </Badge>
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="totalRevenue"
                      type="number"
                      min="1"
                      placeholder="Enter total revenue (must be greater than 0)"
                      value={metrics.totalRevenue || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "totalRevenue",
                          Number.parseFloat(e.target.value)
                        )
                      }
                      className="h-12 text-lg border-2 border-gray-300 focus:border-purple-400 transition-colors"
                    />
                    <Badge variant="secondary" className="px-3 py-1">
                      INR
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    Annual gross revenue for financial year
                  </p>
                </div>
              </div>

              {/* Governance Insights */}
              {metrics.independentBoardMembers && (
                <div className="animate-slide-up bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
                  <div className="flex items-start gap-3">
                    <Award className="h-6 w-6 text-purple-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-purple-900 mb-2">
                        Governance Insight
                      </h4>
                      <p className="text-purple-700 text-sm">
                        Your board is {metrics.independentBoardMembers}%
                        independent.
                        {metrics.independentBoardMembers >= 50
                          ? " Excellent governance structure! This demonstrates strong commitment to transparency."
                          : " Consider increasing board independence to strengthen governance practices."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between">
                <Button
                  onClick={() => setCurrentStep(2)}
                  variant="outline"
                  className="px-6"
                >
                  Previous
                </Button>
                <Button
                  onClick={handleNextStep}
                  className="btn-gradient text-white px-8"
                  disabled={!canMoveToNextStep()}
                >
                  {validationErrors.length > 0 ? (
                    <>
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Fix Validation Errors
                    </>
                  ) : (
                    <>
                      Review & Submit
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 4: Review & Auto-Calculated Metrics */}
      {currentStep === 4 && (
        <div className="animate-fade-in space-y-6">
          {/* Auto-Calculated Metrics */}
          <Card className="glass-card enhanced-card border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Calculator className="h-6 w-6 text-orange-600" />
                Auto-Calculated Performance Indicators
              </CardTitle>
              <CardDescription>
                AI-powered insights derived from your input data with real-time
                calculations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4 animate-slide-up">
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <Leaf className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <span className="font-semibold text-emerald-900">
                          Carbon Intensity
                        </span>
                        <p className="text-xs text-emerald-700">
                          Emissions per revenue unit
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-800 px-3 py-1">
                      {formatNumber(autoCalculated.carbonIntensity, 8)} T
                      CO2e/INR
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <Zap className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <span className="font-semibold text-yellow-900">
                          Renewable Energy Ratio
                        </span>
                        <p className="text-xs text-yellow-700">
                          Clean energy percentage
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800 px-3 py-1">
                      {formatNumber(autoCalculated.renewableElectricityRatio)}%
                    </Badge>
                  </div>
                </div>

                <div className="space-y-4 animate-slide-up animate-delay-200">
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <span className="font-semibold text-blue-900">
                          Diversity Ratio
                        </span>
                        <p className="text-xs text-blue-700">
                          Gender diversity metric
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
                      {formatNumber(autoCalculated.diversityRatio)}%
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Globe className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <span className="font-semibold text-purple-900">
                          Community Investment Ratio
                        </span>
                        <p className="text-xs text-purple-700">
                          Community spend percentage
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-purple-100 text-purple-800 px-3 py-1">
                      {formatNumber(autoCalculated.communitySpendRatio)}%
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ESG Score Summary */}
          <Card className="glass-card enhanced-card border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <BarChart3 className="h-6 w-6 text-indigo-600" />
                ESG Performance Summary
              </CardTitle>
              <CardDescription>
                Your comprehensive sustainability score and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200 animate-scale-in">
                  <Leaf className="h-8 w-8 text-emerald-600 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-emerald-900 mb-2">
                    Environmental
                  </h3>
                  <div className="text-3xl font-bold text-emerald-600 mb-2">
                    A
                  </div>
                  <p className="text-sm text-emerald-700">
                    Strong environmental practices
                  </p>
                </div>

                <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200 animate-scale-in animate-delay-100">
                  <Users className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    Social
                  </h3>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    B+
                  </div>
                  <p className="text-sm text-blue-700">
                    Good social impact initiatives
                  </p>
                </div>

                <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200 animate-scale-in animate-delay-200">
                  <Shield className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-purple-900 mb-2">
                    Governance
                  </h3>
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    A+
                  </div>
                  <p className="text-sm text-purple-700">
                    Excellent governance structure
                  </p>
                </div>
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
                <div className="flex items-start gap-3">
                  <Award className="h-6 w-6 text-indigo-600 mt-1 animate-pulse" />
                  <div>
                    <h4 className="font-semibold text-indigo-900 mb-2">
                      Overall ESG Rating: A
                    </h4>
                    <p className="text-indigo-700 text-sm mb-3">
                      Congratulations! Your organization demonstrates strong
                      commitment to sustainability and responsible business
                      practices. You are performing above industry average in
                      most key areas.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-green-100 text-green-800">
                        Carbon Efficient
                      </Badge>
                      <Badge className="bg-blue-100 text-blue-800">
                        Socially Responsible
                      </Badge>
                      <Badge className="bg-purple-100 text-purple-800">
                        Well Governed
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <Button
                  onClick={() => setCurrentStep(3)}
                  variant="outline"
                  className="px-6"
                >
                  Previous
                </Button>
                <div className="flex gap-3">
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="btn-gradient text-white px-8"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save & Submit Assessment
                      </>
                    )}
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="border-2 border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50 px-6"
                  >
                    <a href="/reports">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      View Analytics
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
