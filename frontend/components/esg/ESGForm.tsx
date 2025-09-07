"use client";

import { useState } from "react";
import { ESGInputData } from "@/types/esg";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface ESGFormProps {
  onSubmit: (data: ESGInputData) => void;
  initialData?: Partial<ESGInputData>;
}

export function ESGForm({ onSubmit, initialData = {} }: ESGFormProps) {
  const [formData, setFormData] = useState<Partial<ESGInputData>>({
    financialYear: new Date().getFullYear().toString(),
    ...initialData,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as ESGInputData);
  };

  const handleChange = (field: keyof ESGInputData, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]:
        typeof value === "string" &&
        field !== "financialYear" &&
        field !== "hasDataPrivacyPolicy"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Environmental Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Environmental Metrics</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="totalElectricityConsumption">
                Total Electricity (kWh)
              </Label>
              <Input
                id="totalElectricityConsumption"
                type="number"
                value={formData.totalElectricityConsumption || ""}
                onChange={(e) =>
                  handleChange("totalElectricityConsumption", e.target.value)
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="renewableElectricityConsumption">
                Renewable Electricity (kWh)
              </Label>
              <Input
                id="renewableElectricityConsumption"
                type="number"
                value={formData.renewableElectricityConsumption || ""}
                onChange={(e) =>
                  handleChange(
                    "renewableElectricityConsumption",
                    e.target.value
                  )
                }
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="totalFuelConsumption">
                Fuel Consumption (liters)
              </Label>
              <Input
                id="totalFuelConsumption"
                type="number"
                value={formData.totalFuelConsumption || ""}
                onChange={(e) =>
                  handleChange("totalFuelConsumption", e.target.value)
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="carbonEmissions">Carbon Emissions (T CO2e)</Label>
              <Input
                id="carbonEmissions"
                type="number"
                value={formData.carbonEmissions || ""}
                onChange={(e) =>
                  handleChange("carbonEmissions", e.target.value)
                }
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Social Metrics</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="totalEmployees">Total Employees</Label>
              <Input
                id="totalEmployees"
                type="number"
                value={formData.totalEmployees || ""}
                onChange={(e) => handleChange("totalEmployees", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="femaleEmployees">Female Employees</Label>
              <Input
                id="femaleEmployees"
                type="number"
                value={formData.femaleEmployees || ""}
                onChange={(e) =>
                  handleChange("femaleEmployees", e.target.value)
                }
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="averageTrainingHours">
                Training Hours per Employee
              </Label>
              <Input
                id="averageTrainingHours"
                type="number"
                value={formData.averageTrainingHours || ""}
                onChange={(e) =>
                  handleChange("averageTrainingHours", e.target.value)
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="communityInvestmentSpend">
                Community Investment (INR)
              </Label>
              <Input
                id="communityInvestmentSpend"
                type="number"
                value={formData.communityInvestmentSpend || ""}
                onChange={(e) =>
                  handleChange("communityInvestmentSpend", e.target.value)
                }
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Governance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Governance Metrics</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="independentBoardMembers">
                Board Independence (%)
              </Label>
              <Input
                id="independentBoardMembers"
                type="number"
                min="0"
                max="100"
                value={formData.independentBoardMembers || ""}
                onChange={(e) =>
                  handleChange("independentBoardMembers", e.target.value)
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="totalRevenue">Total Revenue (INR)</Label>
              <Input
                id="totalRevenue"
                type="number"
                value={formData.totalRevenue || ""}
                onChange={(e) => handleChange("totalRevenue", e.target.value)}
                required
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="hasDataPrivacyPolicy"
              checked={formData.hasDataPrivacyPolicy === "Yes"}
              onCheckedChange={(checked: boolean) =>
                handleChange("hasDataPrivacyPolicy", checked ? "Yes" : "No")
              }
            />
            <Label htmlFor="hasDataPrivacyPolicy">
              Has Data Privacy Policy
            </Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" className="w-full md:w-auto">
          Submit ESG Data
        </Button>
      </div>
    </form>
  );
}
