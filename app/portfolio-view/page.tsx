"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Download, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RiskExposureChart } from "@/components/charts/RiskExposureChart"
import { GeographyExposureChart } from "@/components/charts/GeographyExposureChart"
import { PortfolioNOIChart } from "@/components/charts/PortfolioNOIChart"
import { InteractiveMap } from "@/components/maps/InteractiveMap"
import { useApp } from "@/contexts/AppContext"

export default function PortfolioViewPage() {
  const router = useRouter()
  const { portfolioData, scenario, setScenario, paymentPlan, setPaymentPlan } = useApp()
  const [loanTerm, setLoanTerm] = useState(25)
  const [interestRate, setInterestRate] = useState(5.5)
  const [showBreakdown, setShowBreakdown] = useState(false)
  const [sortColumn, setSortColumn] = useState<string>("")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const portfolioKPIs = [
    {
      postalCode: "M5V 3A8",
      riskRating: "High",
      dscrDelta: "-0.22",
      ltvDelta: "+0.12",
      energyDelta: "-30%",
      retrofitCost: "$15,000",
    },
    {
      postalCode: "V6B 1A1",
      riskRating: "Medium",
      dscrDelta: "-0.15",
      ltvDelta: "+0.08",
      energyDelta: "-25%",
      retrofitCost: "$12,500",
    },
    {
      postalCode: "H3B 2Y5",
      riskRating: "Low",
      dscrDelta: "-0.08",
      ltvDelta: "+0.04",
      energyDelta: "-15%",
      retrofitCost: "$8,000",
    },
    {
      postalCode: "T2P 2M5",
      riskRating: "Medium",
      dscrDelta: "-0.18",
      ltvDelta: "+0.10",
      energyDelta: "-28%",
      retrofitCost: "$13,200",
    },
    {
      postalCode: "K1P 1J1",
      riskRating: "High",
      dscrDelta: "-0.25",
      ltvDelta: "+0.15",
      energyDelta: "-35%",
      retrofitCost: "$16,800",
    },
  ]

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const sortedKPIs = [...portfolioKPIs].sort((a, b) => {
    if (!sortColumn) return 0

    const aValue = a[sortColumn as keyof typeof a]
    const bValue = b[sortColumn as keyof typeof b]

    if (sortDirection === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
    }
  })

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Postal Code,Risk Rating,DSCR Delta,LTV Delta,Energy Delta,Retrofit Cost\n" +
      portfolioKPIs
        .map(
          (kpi) =>
            `${kpi.postalCode},${kpi.riskRating},${kpi.dscrDelta},${kpi.ltvDelta},${kpi.energyDelta},${kpi.retrofitCost}`,
        )
        .join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "portfolio_analysis.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const portfolioMarkers = portfolioData.map((asset) => ({
    position: asset.coordinates,
    title: asset.address,
    type:
      asset.riskRating === "High"
        ? ("risk-high" as const)
        : asset.riskRating === "Medium"
          ? ("risk-medium" as const)
          : ("risk-low" as const),
  }))

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Here's What We Expect...</h1>
          <p className="text-gray-600">Portfolio-wide climate transition risk analysis</p>
        </div>
        <div className="flex space-x-3">
          <Button
            onClick={() => router.push("/filter")}
            variant="outline"
            className="border-rbc-blue text-rbc-blue hover:bg-rbc-blue/10 flex items-center space-x-2"
          >
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
          <Button
            onClick={handleExportCSV}
            className="bg-rbc-blue hover:bg-rbc-blue/90 text-white flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Summary Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Risk Exposure</CardTitle>
          </CardHeader>
          <CardContent>
            <RiskExposureChart groupBy="property-count" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Geographic Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <GeographyExposureChart dimension="geography" groupBy="property-count" />
          </CardContent>
        </Card>
      </div>

      {/* Portfolio NOI Chart */}
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Portfolio-Wide NOI Projection</CardTitle>
          <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="loanTerm">Loan Term (years)</Label>
              <Input
                id="loanTerm"
                type="number"
                value={loanTerm}
                onChange={(e) => setLoanTerm(Number.parseInt(e.target.value) || 25)}
                className="w-20"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="interestRate">Interest Rate (%)</Label>
              <Input
                id="interestRate"
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number.parseFloat(e.target.value) || 5.5)}
                className="w-20"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Popover open={showBreakdown} onOpenChange={setShowBreakdown}>
            <PopoverTrigger asChild>
              <div className="cursor-pointer">
                <PortfolioNOIChart />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-96">
              <div className="space-y-4">
                <h3 className="font-semibold">Portfolio Breakdown (2025)</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Total Revenue:</span>
                    <span className="font-medium">$12.8M</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total OpEx:</span>
                    <span className="font-medium">$5.2M</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Retrofit Costs:</span>
                    <span className="font-medium">$2.1M</span>
                  </div>
                  <div className="flex justify-between items-center border-t pt-2">
                    <span>Net Operating Income:</span>
                    <span className="font-semibold">$5.5M</span>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="flex space-x-6 mb-8">
        <div>
          <label className="block text-sm font-medium mb-2">Scenario</label>
          <Select value={scenario} onValueChange={setScenario}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1.5 Immediate">1.5°C Immediate</SelectItem>
              <SelectItem value="2.0 Immediate">2.0°C Immediate</SelectItem>
              <SelectItem value="1.5 Delayed">1.5°C Delayed</SelectItem>
              <SelectItem value="2.0 Delayed">2.0°C Delayed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Payment Plan</label>
          <Select value={paymentPlan} onValueChange={setPaymentPlan}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pay Upfront">Pay Upfront</SelectItem>
              <SelectItem value="Loan">Loan</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* KPI Table */}
        <Card>
          <CardHeader>
            <CardTitle>Properties by Postal Code</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-rbc-gray">
                    <th
                      className="text-left py-3 px-2 font-semibold cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort("postalCode")}
                    >
                      Postal Code
                    </th>
                    <th
                      className="text-left py-3 px-2 font-semibold cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort("riskRating")}
                    >
                      Risk
                    </th>
                    <th
                      className="text-left py-3 px-2 font-semibold cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort("dscrDelta")}
                    >
                      DSCR Δ
                    </th>
                    <th
                      className="text-left py-3 px-2 font-semibold cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort("ltvDelta")}
                    >
                      LTV Δ
                    </th>
                    <th
                      className="text-left py-3 px-2 font-semibold cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort("energyDelta")}
                    >
                      Energy Δ
                    </th>
                    <th
                      className="text-left py-3 px-2 font-semibold cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort("retrofitCost")}
                    >
                      Retrofit Cost
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedKPIs.map((kpi, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-2 font-mono text-sm">{kpi.postalCode}</td>
                      <td className="py-3 px-2">
                        <Badge
                          variant={
                            kpi.riskRating === "High"
                              ? "destructive"
                              : kpi.riskRating === "Medium"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {kpi.riskRating}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 font-medium text-red-600">{kpi.dscrDelta}</td>
                      <td className="py-3 px-2 font-medium text-red-600">{kpi.ltvDelta}</td>
                      <td className="py-3 px-2 font-medium text-green-600">{kpi.energyDelta}</td>
                      <td className="py-3 px-2 font-medium">{kpi.retrofitCost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Portfolio Map */}
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Properties & Risk Overlay</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-96">
              <InteractiveMap center={{ lat: 43.6532, lng: -79.3832 }} markers={portfolioMarkers} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
