import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FileText, Table, Loader2 } from "lucide-react";
import {
  calculatePercentageChange,
  average,
  max,
  sum,
  calculateTotalChange,
} from "@/utils/export-calculations";

interface AutoCalculated {
  carbonIntensity?: number;
  renewableElectricityRatio?: number;
  diversityRatio?: number;
  communitySpendRatio?: number;
  [key: string]: number | undefined;
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

interface ESGData {
  financialYear: number;
  data: {
    autoCalculated?: AutoCalculated;
    carbonEmissions?: number;
    totalElectricityConsumption?: number;
    renewableElectricityConsumption?: number;
    totalFuelConsumption?: number;
    totalEmployees?: number;
    femaleEmployees?: number;
    averageTrainingHours?: number;
    communityInvestmentSpend?: number;
    independentBoardMembers?: number;
    hasDataPrivacyPolicy?: "Yes" | "No";
    totalRevenue?: number;
    [key: string]: unknown;
  };
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
      doc.text("ESG Analytics Report", 20, 30);

      // User info and date
      doc.setFontSize(12);
      doc.text(`Generated for: ${userName}`, 20, 50);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 60);

      let yPosition = 80;

      // Executive Summary
      if (responses.length > 1) {
        doc.setFontSize(16);
        doc.text("Executive Summary", 20, yPosition);
        yPosition += 10;

        doc.setFontSize(10);
        const latestYear = responses[0];
        const previousYear = responses[1];

        // Calculate key changes
        const carbonChange = calculatePercentageChange(
          previousYear.data.carbonEmissions as number,
          latestYear.data.carbonEmissions as number
        );
        const renewableChange = calculatePercentageChange(
          previousYear.data.renewableElectricityConsumption as number,
          latestYear.data.renewableElectricityConsumption as number
        );
        const diversityChange = calculatePercentageChange(
          previousYear.data.autoCalculated?.diversityRatio as number,
          latestYear.data.autoCalculated?.diversityRatio as number
        );

        // Add summary points
        doc.text(
          [
            `• Carbon Emissions: ${
              carbonChange === "N/A"
                ? "No data"
                : `${carbonChange}% change from previous year`
            }`,
            `• Renewable Energy: ${
              renewableChange === "N/A"
                ? "No data"
                : `${renewableChange}% increase in renewable energy usage`
            }`,
            `• Workforce Diversity: ${
              diversityChange === "N/A"
                ? "No data"
                : `${diversityChange}% change in diversity ratio`
            }`,
          ],
          25,
          yPosition
        );

        yPosition += 40;
      }

      // Process each year's data with detailed analysis
      responses.forEach((response) => {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 30;
        }

        // Year header
        doc.setFontSize(16);
        doc.text(
          `Financial Year ${response.financialYear} Analysis`,
          20,
          yPosition
        );
        yPosition += 20;

        // Environmental metrics with analysis
        doc.setFontSize(14);
        doc.text("Environmental Performance", 20, yPosition);
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

        // Social metrics with insights
        doc.setFontSize(14);
        doc.text("Social Impact Analysis", 20, yPosition);
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

        // Governance metrics with analysis
        doc.setFontSize(14);
        doc.text("Governance & Performance Metrics", 20, yPosition);
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

        // Auto-calculated insights
        const auto = response.data.autoCalculated;
        if (isAutoCalculated(auto)) {
          doc.setFontSize(14);
          doc.text("Key Performance Indicators", 20, yPosition);
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
        `ESG_Analytics_Report_${userName.replace(/\s+/g, "_")}_${
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

      // Create workbook
      const wb = XLSX.utils.book_new();

      // Prepare main metrics data
      const metricsData = responses.map((response) => ({
        "Financial Year": response.financialYear,

        // Environmental Metrics
        "Total Electricity Consumption (kWh)":
          response.data.totalElectricityConsumption || "",
        "Renewable Electricity Consumption (kWh)":
          response.data.renewableElectricityConsumption || "",
        "Total Fuel Consumption (liters)":
          response.data.totalFuelConsumption || "",
        "Carbon Emissions (T CO2e)": response.data.carbonEmissions || "",

        // Social Metrics
        "Total Employees": response.data.totalEmployees || "",
        "Female Employees": response.data.femaleEmployees || "",
        "Average Training Hours": response.data.averageTrainingHours || "",
        "Community Investment Spend (INR)":
          response.data.communityInvestmentSpend || "",

        // Governance Metrics
        "Independent Board Members (%)":
          response.data.independentBoardMembers || "",
        "Data Privacy Policy": response.data.hasDataPrivacyPolicy || "",
        "Total Revenue (INR)": response.data.totalRevenue || "",

        // Auto-calculated Metrics
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

      // Add metrics worksheet
      const wsMetrics = XLSX.utils.json_to_sheet(metricsData);
      XLSX.utils.book_append_sheet(wb, wsMetrics, "ESG Metrics");

      // Add trends worksheet if more than one year of data
      if (responses.length > 1) {
        const trendData = responses.slice(0, -1).map((response, index) => {
          const currentYear = responses[index];
          const nextYear = responses[index + 1];

          return {
            Period: `${currentYear.financialYear} to ${nextYear.financialYear}`,

            // Environmental Trends
            "Carbon Emissions Change (%)": calculatePercentageChange(
              currentYear.data.carbonEmissions as number,
              nextYear.data.carbonEmissions as number
            ),
            "Renewable Energy Progress (%)": calculatePercentageChange(
              currentYear.data.renewableElectricityConsumption as number,
              nextYear.data.renewableElectricityConsumption as number
            ),

            // Social Trends
            "Employee Growth (%)": calculatePercentageChange(
              currentYear.data.totalEmployees as number,
              nextYear.data.totalEmployees as number
            ),
            "Diversity Change (%)": calculatePercentageChange(
              currentYear.data.femaleEmployees !== undefined && currentYear.data.totalEmployees !== undefined
                ? ((currentYear.data.femaleEmployees || 0) /
                    (currentYear.data.totalEmployees || 1)) * 100
                : null,
              nextYear.data.femaleEmployees !== undefined && nextYear.data.totalEmployees !== undefined
                ? ((nextYear.data.femaleEmployees || 0) /
                    (nextYear.data.totalEmployees || 1)) * 100
                : null
            ),

            // Governance Trends
            "Revenue Growth (%)": calculatePercentageChange(
              currentYear.data.totalRevenue as number,
              nextYear.data.totalRevenue as number
            ),
            "Board Independence Change (%)": calculatePercentageChange(
              currentYear.data.independentBoardMembers as number,
              nextYear.data.independentBoardMembers as number
            ),
          };
        });

        const wsTrends = XLSX.utils.json_to_sheet(trendData);
        XLSX.utils.book_append_sheet(wb, wsTrends, "Trends Analysis");

        // Add statistics worksheet
        const statsData = [
          {
            Metric: "Environmental Performance",
            "Average Carbon Emissions (T CO2e)": average(
              responses.map((r) => r.data.carbonEmissions as number)
            ),
            "Peak Renewable Ratio (%)": max(
              responses.map((r) =>
                isAutoCalculated(r.data.autoCalculated) && r.data.autoCalculated.renewableElectricityRatio !== undefined
                  ? r.data.autoCalculated.renewableElectricityRatio
                  : null
              )
            ),
            "Total Carbon Reduction (%)": calculateTotalChange(
              responses[responses.length - 1].data.carbonEmissions as number,
              responses[0].data.carbonEmissions as number
            ),
          },
          {
            Metric: "Social Impact",
            "Average Workforce Size": average(
              responses.map((r) => r.data.totalEmployees as number)
            ),
            "Peak Diversity Ratio (%)": max(
              responses.map((r) =>
                r.data.femaleEmployees && r.data.totalEmployees
                  ? ((r.data.femaleEmployees as number) /
                      (r.data.totalEmployees as number)) *
                    100
                  : null
              )
            ),
            "Total Community Investment (INR)": sum(
              responses.map((r) => r.data.communityInvestmentSpend as number)
            ),
          },
          {
            Metric: "Governance Metrics",
            "Average Board Independence (%)": average(
              responses.map((r) => r.data.independentBoardMembers as number)
            ),
            "Revenue Growth Rate (%)": calculateTotalChange(
              responses[responses.length - 1].data.totalRevenue as number,
              responses[0].data.totalRevenue as number
            ),
          },
        ];

        const wsStats = XLSX.utils.json_to_sheet(statsData);
        XLSX.utils.book_append_sheet(wb, wsStats, "Statistics & Analysis");
      }

      // Save the workbook
      XLSX.writeFile(
        wb,
        `ESG_Analytics_Report_${userName.replace(/\s+/g, "_")}_${
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
