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

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FileText, Table, Loader2 } from "lucide-react";

interface ESGData {
  financialYear: number;
  data: Record<string, unknown>;
}

interface ExportButtonsProps {
  responses: ESGData[];
  userName: string;
}

export function ExportButtons({ responses, userName }: ExportButtonsProps) {
  const [isExporting, setIsExporting] = useState<"pdf" | "excel" | null>(null);
  const { notify } = useToast();

  const generatePDFReport = async () => {
    setIsExporting("pdf");
    try {
      // Import jsPDF dynamically to avoid SSR issues
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();

      // Title
      doc.setFontSize(20);
      doc.text("ESG Questionnaire Report", 20, 30);

      // User info
      doc.setFontSize(12);
      doc.text(`Generated for: ${userName}`, 20, 50);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 60);

      let yPosition = 80;

      // Process each year's data
      responses.forEach((response) => {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 30;
        }

        // Year header
        doc.setFontSize(16);
        doc.text(`Financial Year: ${response.financialYear}`, 20, yPosition);
        yPosition += 20;

        // Environmental metrics
        doc.setFontSize(14);
        doc.text("Environmental Metrics:", 20, yPosition);
        yPosition += 10;

        doc.setFontSize(10);
        const envMetrics = [
          `Total Electricity Consumption: ${
            response.data.totalElectricityConsumption || "N/A"
          } kWh`,
          `Renewable Electricity: ${
            response.data.renewableElectricityConsumption || "N/A"
          } kWh`,
          `Total Fuel Consumption: ${
            response.data.totalFuelConsumption || "N/A"
          } liters`,
          `Carbon Emissions: ${response.data.carbonEmissions || "N/A"} T CO2e`,
        ];

        envMetrics.forEach((metric) => {
          doc.text(metric, 25, yPosition);
          yPosition += 8;
        });

        yPosition += 5;

        // Social metrics
        doc.setFontSize(14);
        doc.text("Social Metrics:", 20, yPosition);
        yPosition += 10;

        doc.setFontSize(10);
        const socialMetrics = [
          `Total Employees: ${response.data.totalEmployees || "N/A"}`,
          `Female Employees: ${response.data.femaleEmployees || "N/A"}`,
          `Average Training Hours: ${
            response.data.averageTrainingHours || "N/A"
          }`,
          `Community Investment: ₹${(
            response.data.communityInvestmentSpend || 0
          ).toLocaleString()}`,
        ];

        socialMetrics.forEach((metric) => {
          doc.text(metric, 25, yPosition);
          yPosition += 8;
        });

        yPosition += 5;

        // Governance metrics
        doc.setFontSize(14);
        doc.text("Governance Metrics:", 20, yPosition);
        yPosition += 10;

        doc.setFontSize(10);
        const govMetrics = [
          `Independent Board Members: ${
            response.data.independentBoardMembers || "N/A"
          }%`,
          `Data Privacy Policy: ${response.data.hasDataPrivacyPolicy || "N/A"}`,
          `Total Revenue: ₹${(
            response.data.totalRevenue || 0
          ).toLocaleString()}`,
        ];

        govMetrics.forEach((metric) => {
          doc.text(metric, 25, yPosition);
          yPosition += 8;
        });

        yPosition += 5;

        // Auto-calculated metrics
        const auto = response.data.autoCalculated;
        if (isAutoCalculated(auto)) {
          doc.setFontSize(14);
          doc.text("Auto-Calculated Metrics:", 20, yPosition);
          yPosition += 10;

          doc.setFontSize(10);
          const autoMetrics = [
            `Carbon Intensity: ${
              typeof auto.carbonIntensity === "number"
                ? auto.carbonIntensity.toFixed(8)
                : "N/A"
            } T CO2e/INR`,
            `Renewable Energy Ratio: ${
              typeof auto.renewableElectricityRatio === "number"
                ? auto.renewableElectricityRatio.toFixed(1)
                : "N/A"
            }%`,
            `Diversity Ratio: ${
              typeof auto.diversityRatio === "number"
                ? auto.diversityRatio.toFixed(1)
                : "N/A"
            }%`,
            `Community Spend Ratio: ${
              typeof auto.communitySpendRatio === "number"
                ? auto.communitySpendRatio.toFixed(2)
                : "N/A"
            }%`,
          ];

          autoMetrics.forEach((metric) => {
            doc.text(metric, 25, yPosition);
            yPosition += 8;
          });
        }

        yPosition += 15;
      });

      // Save the PDF
      doc.save(
        `ESG_Report_${userName.replace(/\s+/g, "_")}_${
          new Date().toISOString().split("T")[0]
        }.pdf`
      );

      notify("PDF report generated successfully", "success");
    } catch (error) {
      console.error("PDF generation error:", error);
      notify("Failed to generate PDF report", "error");
    } finally {
      setIsExporting(null);
    }
  };

  const generateExcelReport = async () => {
    setIsExporting("excel");
    try {
      // Import xlsx dynamically
      const XLSX = await import("xlsx");

      // Prepare data for Excel
      const excelData = responses.map((response) => ({
        "Financial Year": response.financialYear,
        "Total Electricity Consumption (kWh)":
          response.data.totalElectricityConsumption || "",
        "Renewable Electricity Consumption (kWh)":
          response.data.renewableElectricityConsumption || "",
        "Total Fuel Consumption (liters)":
          response.data.totalFuelConsumption || "",
        "Carbon Emissions (T CO2e)": response.data.carbonEmissions || "",
        "Total Employees": response.data.totalEmployees || "",
        "Female Employees": response.data.femaleEmployees || "",
        "Average Training Hours": response.data.averageTrainingHours || "",
        "Community Investment Spend (INR)":
          response.data.communityInvestmentSpend || "",
        "Independent Board Members (%)":
          response.data.independentBoardMembers || "",
        "Data Privacy Policy": response.data.hasDataPrivacyPolicy || "",
        "Total Revenue (INR)": response.data.totalRevenue || "",
        "Carbon Intensity (T CO2e/INR)": (() => {
          const auto = response.data.autoCalculated;
          return isAutoCalculated(auto) &&
            typeof auto.carbonIntensity === "number"
            ? auto.carbonIntensity.toFixed(8)
            : "";
        })(),
        "Renewable Energy Ratio (%)": (() => {
          const auto = response.data.autoCalculated;
          return isAutoCalculated(auto) &&
            typeof auto.renewableElectricityRatio === "number"
            ? auto.renewableElectricityRatio.toFixed(1)
            : "";
        })(),
        "Diversity Ratio (%)": (() => {
          const auto = response.data.autoCalculated;
          return isAutoCalculated(auto) &&
            typeof auto.diversityRatio === "number"
            ? auto.diversityRatio.toFixed(1)
            : "";
        })(),
        "Community Spend Ratio (%)": (() => {
          const auto = response.data.autoCalculated;
          return isAutoCalculated(auto) &&
            typeof auto.communitySpendRatio === "number"
            ? auto.communitySpendRatio.toFixed(2)
            : "";
        })(),
      }));

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, "ESG Data");

      // Save the file
      XLSX.writeFile(
        wb,
        `ESG_Report_${userName.replace(/\s+/g, "_")}_${
          new Date().toISOString().split("T")[0]
        }.xlsx`
      );

      notify("Excel report generated successfully", "success");
    } catch (error) {
      console.error("Excel generation error:", error);
      notify("Failed to generate Excel report", "error");
    } finally {
      setIsExporting(null);
    }
  };

  if (responses.length === 0) {
    return (
      <div className="flex gap-2">
        <Button disabled variant="outline">
          <FileText className="mr-2 h-4 w-4" />
          Export PDF
        </Button>
        <Button disabled variant="outline">
          <Table className="mr-2 h-4 w-4" />
          Export Excel
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Button
        onClick={generatePDFReport}
        disabled={isExporting === "pdf"}
        variant="outline"
      >
        {isExporting === "pdf" ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <FileText className="mr-2 h-4 w-4" />
            Export PDF
          </>
        )}
      </Button>

      <Button
        onClick={generateExcelReport}
        disabled={isExporting === "excel"}
        variant="outline"
      >
        {isExporting === "excel" ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Table className="mr-2 h-4 w-4" />
            Export Excel
          </>
        )}
      </Button>
    </div>
  );
}
