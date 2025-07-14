"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface GeographyExposureChartProps {
  dimension: string
  groupBy: string
}

const geographyData = [
  { name: "CAD", value: 45 },
  { name: "US", value: 30 },
  { name: "UK", value: 15 },
  { name: "EU", value: 10 },
]

const lobData = [
  { name: "Commercial", value: 40 },
  { name: "Corporate", value: 35 },
  { name: "Real Estate", value: 25 },
]

const typeData = [
  { name: "Office", value: 35 },
  { name: "Retail", value: 25 },
  { name: "Industrial", value: 20 },
  { name: "Multi-Family", value: 20 },
]

export function GeographyExposureChart({ dimension, groupBy }: GeographyExposureChartProps) {
  let chartData = geographyData

  switch (dimension) {
    case "lob":
      chartData = lobData
      break
    case "type":
      chartData = typeData
      break
    default:
      chartData = geographyData
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => [`${value}%`, "Exposure"]} />
          <Bar dataKey="value" fill="#003DA5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
