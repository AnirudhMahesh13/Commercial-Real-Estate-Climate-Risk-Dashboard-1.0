"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

const data = [
  { year: 2025, retrofit: 6.2, fines: 5.8, benchmark: 6.0 },
  { year: 2030, retrofit: 7.1, fines: 5.2, benchmark: 6.8 },
  { year: 2035, retrofit: 8.0, fines: 4.6, benchmark: 7.6 },
  { year: 2040, retrofit: 8.9, fines: 4.0, benchmark: 8.4 },
  { year: 2045, retrofit: 9.8, fines: 3.4, benchmark: 9.2 },
  { year: 2050, retrofit: 10.7, fines: 2.8, benchmark: 10.0 },
]

export function PortfolioNOIChart() {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip
            formatter={(value, name) => [
              `$${value}M`,
              name === "retrofit" ? "Retrofit Path" : name === "fines" ? "Pay Fines" : "Benchmark",
            ]}
          />
          <Legend />
          <Line type="monotone" dataKey="retrofit" stroke="#10B981" strokeWidth={3} name="Retrofit Path" />
          <Line type="monotone" dataKey="fines" stroke="#EF4444" strokeWidth={3} name="Pay Fines" />
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
