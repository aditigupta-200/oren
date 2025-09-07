export interface ESGInputData {
  id?: string;
  financialYear: string;
  createdAt?: string;
  updatedAt?: string;
  
  // Environmental Metrics
  totalElectricityConsumption: number; // kWh
  renewableElectricityConsumption: number; // kWh
  totalFuelConsumption: number; // liters
  carbonEmissions: number; // T CO2e
  
  // Social Metrics
  totalEmployees: number;
  femaleEmployees: number;
  averageTrainingHours: number;
  communityInvestmentSpend: number; // INR
  
  // Governance Metrics
  independentBoardMembers: number; // Percentage
  hasDataPrivacyPolicy: "Yes" | "No";
  totalRevenue: number; // INR
}

export interface ESGResponse {
  id: string;
  financialYear: string;
  data: ESGInputData;
  createdAt: string;
  updatedAt: string;
}

export interface CalculatedMetrics {
  carbonIntensity: number; // T CO2e/INR
  renewableRatio: number; // %
  diversityRatio: number; // %
  communitySpendRatio: number; // %
}

export interface ESGScores {
  envScore: number;
  socialScore: number;
  govScore: number;
  overallScore: number;
}

export interface MetricCard {
  title: string;
  value: string;
  unit: string;
  icon: string;
  color: string;
  benchmark: number;
  status: 'excellent' | 'good' | 'needs improvement';
}

export interface ChartData {
  radar: RadarChartData[];
  bars: RatioBarData[];
  donuts: DonutChartData[];
  trends: TrendData[];
}

export interface RadarChartData {
  category: string;
  score: number;
  fullMark: number;
}

export interface RatioBarData {
  name: string;
  current: number;
  benchmark: number;
  gap: number;
}

export interface DonutChartData {
  title: string;
  data: Array<{
    name: string;
    value: number;
    fill: string;
  }>;
  centerValue: string;
}

export interface TrendData {
  year: string;
  carbonIntensity: number;
  renewableRatio: number;
  diversityRatio: number;
  communitySpendRatio: number;
}

export interface Insight {
  type: 'achievement' | 'improvement' | 'trend';
  title: string;
  message: string;
  recommendation?: string;
  impact: 'high' | 'medium' | 'low';
  icon: string;
}
