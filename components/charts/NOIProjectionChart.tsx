"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface NOIProjectionChartProps {
  type: string
}

const retrofitData = [
  { year: 2025, noi: 1.2, benchmark: 1.1 },
  { year: 2030, noi: 1.4, benchmark: 1.3 },
  { year: 2035, noi: 1.6, benchmark: 1.5 },
  { year: 2040, noi: 1.8, benchmark: 1.7 },
  { year: 2045, noi: 2.0, benchmark: 1.9 },
  { year: 2050, noi: 2.2, benchmark: 2.1 },
]

const finesData = [
  { year: 2025, noi: 1.1, benchmark: 1.1 },
  { year: 2030, noi: 1.0, benchmark: 1.3 },
  { year: 2035, noi: 0.9, benchmark: 1.5 },
  { year: 2040, noi: 0.8, benchmark: 1.7 },
  { year: 2045, noi: 0.7, benchmark: 1.9 },
  { year: 2050, noi: 0.6, benchmark: 2.1 },
]

export function NOIProjectionChart({ type }: NOIProjectionChartProps) {
  const data = type === "fines" ? finesData : retrofitData

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip formatter={(value, name) => [`$${value}M`, name === "noi" ? "NOI" : "Benchmark"]} />
          <Legend />
          <Line type="monotone" dataKey="noi" stroke="#003DA5" strokeWidth={3} name="Projected NOI" />
          <Line
            type="monotone"
            dataKey="benchmark"
            stroke="#94A3B8"
            strokeWidth={2}
            strokeDasharray="5 5"
            name="Benchmark"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
