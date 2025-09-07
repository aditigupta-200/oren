"use client";

import { ESGScores } from "@/types/esg";

interface HeaderSectionProps {
  companyName?: string;
  yearRange: string;
  dataEntries: number;
  scores: ESGScores;
}

export function HeaderSection({
  companyName = "Your Company",
  yearRange,
  dataEntries,
  scores,
}: HeaderSectionProps) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-6 rounded-lg mb-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">ESG Performance Dashboard</h1>
          <p>
            {companyName} • {yearRange} • {dataEntries} year(s) of data
          </p>
        </div>
        <div className="text-center">
          <div className="text-5xl font-bold">
            {scores.overallScore.toFixed(1)}
          </div>
          <p className="text-xl">Overall ESG Score</p>
        </div>
      </div>
    </div>
  );
}
