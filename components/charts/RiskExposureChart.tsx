"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface RiskExposureChartProps {
  groupBy: string
}

const data = [
  { name: "Low Risk", value: 35, color: "#10B981" },
  { name: "Medium Risk", value: 45, color: "#F59E0B" },
  { name: "High Risk", value: 20, color: "#EF4444" },
]

const valueData = [
  { name: "Low Risk", value: 42, color: "#10B981" },
  { name: "Medium Risk", value: 38, color: "#F59E0B" },
  { name: "High Risk", value: 20, color: "#EF4444" },
]

export function RiskExposureChart({ groupBy }: RiskExposureChartProps) {
  const chartData = groupBy === "value" ? valueData : data

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value}%`, "Exposure"]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
