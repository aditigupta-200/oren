// ESG Metric Types
export interface ESGMetrics {
  // Environmental
  totalElectricityConsumption?: number // kWh
  renewableElectricityConsumption?: number // kWh
  totalFuelConsumption?: number // liters
  carbonEmissions?: number // T CO2e

  // Social
  totalEmployees?: number
  femaleEmployees?: number
  averageTrainingHours?: number
  communityInvestmentSpend?: number // INR

  // Governance
  independentBoardMembers?: number // %
  hasDataPrivacyPolicy?: "Yes" | "No"
  totalRevenue?: number // INR
}

export interface AutoCalculatedMetrics {
  carbonIntensity?: number // T CO2e / INR
  renewableElectricityRatio?: number // %
  diversityRatio?: number // %
  communitySpendRatio?: number // %
}

export interface ESGResponseData extends ESGMetrics {
  autoCalculated?: AutoCalculatedMetrics
}

export interface ESGFormData {
  financialYear: number
  data: ESGResponseData
}

// Validation schemas
export const ESG_METRICS_CONFIG = {
  environmental: [
    {
      key: "totalElectricityConsumption",
      title: "Total electricity consumption",
      type: "number",
      unit: "kWh",
      required: false,
    },
    {
      key: "renewableElectricityConsumption",
      title: "Renewable electricity consumption",
      type: "number",
      unit: "kWh",
      required: false,
    },
    {
      key: "totalFuelConsumption",
      title: "Total fuel consumption",
      type: "number",
      unit: "liters",
      required: false,
    },
    {
      key: "carbonEmissions",
      title: "Carbon emissions",
      type: "number",
      unit: "T CO2e",
      required: false,
    },
  ],
  social: [
    {
      key: "totalEmployees",
      title: "Total number of employees",
      type: "number",
      unit: "",
      required: false,
    },
    {
      key: "femaleEmployees",
      title: "Number of female employees",
      type: "number",
      unit: "",
      required: false,
    },
    {
      key: "averageTrainingHours",
      title: "Average training hours per employee (per year)",
      type: "number",
      unit: "",
      required: false,
    },
    {
      key: "communityInvestmentSpend",
      title: "Community investment spend",
      type: "number",
      unit: "INR",
      required: false,
    },
  ],
  governance: [
    {
      key: "independentBoardMembers",
      title: "% of independent board members",
      type: "number",
      unit: "%",
      required: false,
    },
    {
      key: "hasDataPrivacyPolicy",
      title: "Does the company have a data privacy policy?",
      type: "dropdown",
      unit: "",
      options: ["Yes", "No"],
      required: false,
    },
    {
      key: "totalRevenue",
      title: "Total Revenue",
      type: "number",
      unit: "INR",
      required: false,
    },
  ],
} as const

export const AUTO_CALCULATED_METRICS = [
  {
    key: "carbonIntensity",
    title: "Carbon Intensity",
    formula: "Carbon emissions / Total revenue",
    unit: "T CO2e / INR",
  },
  {
    key: "renewableElectricityRatio",
    title: "Renewable Electricity Ratio",
    formula: "100 * (Renewable electricity consumption / Total electricity consumption)",
    unit: "%",
  },
  {
    key: "diversityRatio",
    title: "Diversity Ratio",
    formula: "100 * (Female Employees / Total Employees)",
    unit: "%",
  },
  {
    key: "communitySpendRatio",
    title: "Community Spend Ratio",
    formula: "100 * (Community investment spend / Total Revenue)",
    unit: "%",
  },
] as const
