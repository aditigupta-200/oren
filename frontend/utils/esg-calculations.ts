import { ESGInputData, CalculatedMetrics, ESGScores, Insight, ChartData } from "../types/esg";

export const calculateMetrics = (data: ESGInputData): CalculatedMetrics => ({
  carbonIntensity: data.carbonEmissions / data.totalRevenue,
  renewableRatio: (data.renewableElectricityConsumption / data.totalElectricityConsumption) * 100,
  diversityRatio: (data.femaleEmployees / data.totalEmployees) * 100,
  communitySpendRatio: (data.communityInvestmentSpend / data.totalRevenue) * 100
});

export const calculateESGScores = (data: ESGInputData, metrics: CalculatedMetrics): ESGScores => {
  // Environmental Score (0-100)
  const envScore = Math.min(100,
    (metrics.renewableRatio / 50 * 50) + // Max 50 points for 50%+ renewable
    (Math.max(0, (0.02 - metrics.carbonIntensity) / 0.02) * 50) // Max 50 points for low carbon
  );

  // Social Score (0-100)
  const socialScore = Math.min(100,
    (Math.min(metrics.diversityRatio / 30, 1) * 40) + // Max 40 points for 30%+ diversity
    (Math.min(metrics.communitySpendRatio * 20, 1) * 30) + // Max 30 points for community spend
    (Math.min(data.averageTrainingHours / 40, 1) * 30) // Max 30 points for training
  );

  // Governance Score (0-100)
  const govScore = Math.min(100,
    data.independentBoardMembers + // Direct percentage
    (data.hasDataPrivacyPolicy === "Yes" ? 25 : 0) // 25 bonus points for policy
  );

  // Overall ESG Score (Weighted Average)
  const overallScore = (envScore * 0.4) + (socialScore * 0.35) + (govScore * 0.25);

  return { envScore, socialScore, govScore, overallScore };
};

export const generateInsights = (
  currentData: ESGInputData, 
  calculatedMetrics: CalculatedMetrics,
  historicalData: ESGInputData[] = []
): Insight[] => {
  const insights: Insight[] = [];
  const { renewableRatio, carbonIntensity, diversityRatio } = calculatedMetrics;

  // Performance insights
  if (renewableRatio >= 50) {
    insights.push({
      type: "achievement",
      title: "Renewable Energy Leadership",
      message: `Excellent renewable energy adoption at ${renewableRatio.toFixed(1)}%, exceeding 50% benchmark`,
      impact: "high",
      icon: "🌱"
    });
  }

  if (carbonIntensity < 0.01) {
    insights.push({
      type: "achievement",
      title: "Low Carbon Operations",
      message: `Carbon intensity of ${carbonIntensity.toFixed(6)} is significantly below industry average`,
      impact: "high",
      icon: "✅"
    });
  }

  if (diversityRatio < 20) {
    insights.push({
      type: "improvement",
      title: "Diversity Opportunity",
      message: `Gender diversity at ${diversityRatio.toFixed(1)}% is below 30% best practice`,
      recommendation: "Implement targeted diversity hiring programs",
      impact: "medium",
      icon: "⚠️"
    });
  }

  // Trend insights
  if (historicalData.length >= 2) {
    const previousYear = historicalData[historicalData.length - 2];
    const prevMetrics = calculateMetrics(previousYear);
    const carbonImprovement = ((prevMetrics.carbonIntensity - carbonIntensity) / prevMetrics.carbonIntensity * 100);

    if (carbonImprovement > 0) {
      insights.push({
        type: "trend",
        title: "Carbon Intensity Improvement",
        message: `${carbonImprovement.toFixed(1)}% reduction in carbon intensity year-over-year`,
        impact: "high",
        icon: "📉"
      });
    }
  }

  return insights;
};

export const prepareChartData = (
  currentData: ESGInputData,
  calculatedMetrics: CalculatedMetrics,
  scores: ESGScores,
  historicalData: ESGInputData[] = []
): ChartData => {
  return {
    radar: [
      { category: "Environmental", score: scores.envScore, fullMark: 100 },
      { category: "Social", score: scores.socialScore, fullMark: 100 },
      { category: "Governance", score: scores.govScore, fullMark: 100 }
    ],
    bars: [
      {
        name: "Renewable Energy",
        current: calculatedMetrics.renewableRatio,
        benchmark: 50,
        gap: calculatedMetrics.renewableRatio - 50
      },
      {
        name: "Gender Diversity",
        current: calculatedMetrics.diversityRatio,
        benchmark: 30,
        gap: calculatedMetrics.diversityRatio - 30
      },
      {
        name: "Community Spend",
        current: calculatedMetrics.communitySpendRatio * 10,
        benchmark: 20,
        gap: (calculatedMetrics.communitySpendRatio - 2) * 10
      }
    ],
    donuts: [
      {
        title: "Energy Mix",
        data: [
          { name: "Renewable", value: calculatedMetrics.renewableRatio, fill: "#10B981" },
          { name: "Non-Renewable", value: 100 - calculatedMetrics.renewableRatio, fill: "#E5E7EB" }
        ],
        centerValue: `${calculatedMetrics.renewableRatio.toFixed(1)}%`
      },
      {
        title: "Employee Gender Split",
        data: [
          { name: "Female", value: calculatedMetrics.diversityRatio, fill: "#8B5CF6" },
          { name: "Male", value: 100 - calculatedMetrics.diversityRatio, fill: "#E5E7EB" }
        ],
        centerValue: `${calculatedMetrics.diversityRatio.toFixed(1)}%`
      },
      {
        title: "Board Independence",
        data: [
          { name: "Independent", value: currentData.independentBoardMembers, fill: "#F59E0B" },
          { name: "Non-Independent", value: 100 - currentData.independentBoardMembers, fill: "#E5E7EB" }
        ],
        centerValue: `${currentData.independentBoardMembers}%`
      },
      {
        title: "Revenue Allocation",
        data: [
          { name: "Community Investment", value: calculatedMetrics.communitySpendRatio, fill: "#EF4444" },
          { name: "Other", value: 100 - calculatedMetrics.communitySpendRatio, fill: "#E5E7EB" }
        ],
        centerValue: `${calculatedMetrics.communitySpendRatio.toFixed(2)}%`
      }
    ],
    trends: historicalData.map(year => {
      const metrics = calculateMetrics(year);
      return {
        year: year.financialYear.toString(), // Convert number to string
        carbonIntensity: metrics.carbonIntensity * 1000,
        renewableRatio: metrics.renewableRatio,
        diversityRatio: metrics.diversityRatio,
        communitySpendRatio: metrics.communitySpendRatio * 10
      };
    })
  };
};
