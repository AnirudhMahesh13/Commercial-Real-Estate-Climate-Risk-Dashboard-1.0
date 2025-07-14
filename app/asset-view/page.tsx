"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Download, TrendingUp, TrendingDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { NOIProjectionChart } from "@/components/charts/NOIProjectionChart"
import { InteractiveMap } from "@/components/maps/InteractiveMap"
import { useApp } from "@/contexts/AppContext"

export default function AssetViewPage() {
  const router = useRouter()
  const { selectedAssets, scenario, setScenario, paymentPlan, setPaymentPlan } = useApp()
  const [showBreakdown, setShowBreakdown] = useState(false)
  const [chartType, setChartType] = useState("retrofit")

  const kpiData = [
    { metric: "Risk Rating", value: "Medium", change: "stable" },
    { metric: "DSCR Δ", value: "-0.15", change: "down" },
    { metric: "LTV Δ", value: "+0.08", change: "up" },
    { metric: "Energy Intensity Δ", value: "-25%", change: "down" },
    { metric: "Retrofit Cost/unit", value: "$12,500", change: "stable" },
  ]

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Asset,Risk Rating,DSCR Delta,LTV Delta,Energy Intensity Delta,Retrofit Cost\n" +
      selectedAssets.map((asset) => `${asset.address},${asset.riskRating},-0.15,+0.08,-25%,$12500`).join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "asset_analysis.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const riskZones = [
    { position: { lat: 43.6532, lng: -79.3832 }, title: "High Risk Zone", type: "risk-high" },
    { position: { lat: 43.65, lng: -79.38 }, title: "Medium Risk Zone", type: "risk-medium" },
    { position: { lat: 43.66, lng: -79.39 }, title: "Low Risk Zone", type: "risk-low" },
  ]

  const assetMarkers = selectedAssets.map((asset) => ({
    position: asset.coordinates,
    title: asset.address,
    type: "property" as const,
  }))

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Here's What We Expect...</h1>
          <p className="text-gray-600">Climate transition risk analysis for your selected assets</p>
        </div>
        <div className="flex space-x-3">
          <Button
            onClick={() => router.push("/asset-search")}
            variant="outline"
            className="border-rbc-blue text-rbc-blue hover:bg-rbc-blue/10"
          >
            Compare
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* NOI Projection Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>NOI Projection vs Benchmark</CardTitle>
            <div className="flex space-x-2">
              <Button
                variant={chartType === "retrofit" ? "default" : "outline"}
                size="sm"
                onClick={() => setChartType("retrofit")}
                className={chartType === "retrofit" ? "bg-rbc-blue hover:bg-rbc-blue/90" : ""}
              >
                Retrofit
              </Button>
              <Button
                variant={chartType === "fines" ? "default" : "outline"}
                size="sm"
                onClick={() => setChartType("fines")}
                className={chartType === "fines" ? "bg-rbc-blue hover:bg-rbc-blue/90" : ""}
              >
                Pay Fines
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Popover open={showBreakdown} onOpenChange={setShowBreakdown}>
              <PopoverTrigger asChild>
                <div className="cursor-pointer">
                  <NOIProjectionChart type={chartType} />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h3 className="font-semibold">Revenue vs OpEx Breakdown</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>2025 Revenue:</span>
                      <span className="font-medium">$2.1M</span>
                    </div>
                    <div className="flex justify-between">
                      <span>2025 OpEx:</span>
                      <span className="font-medium">$850K</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span>Net Operating Income:</span>
                      <span className="font-semibold">$1.25M</span>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </CardContent>
        </Card>

        {/* Interactive Map */}
        <Card>
          <CardHeader>
            <CardTitle>Asset Location & Risk Zones</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-96">
              <InteractiveMap center={{ lat: 43.6532, lng: -79.3832 }} markers={[...assetMarkers, ...riskZones]} />
            </div>
          </CardContent>
        </Card>
      </div>

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

      {/* KPI Table */}
      <Card>
        <CardHeader>
          <CardTitle>Key Performance Indicators</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-rbc-gray">
                  <th className="text-left py-3 px-4 font-semibold">Metric</th>
                  <th className="text-left py-3 px-4 font-semibold">Value</th>
                  <th className="text-left py-3 px-4 font-semibold">Trend</th>
                </tr>
              </thead>
              <tbody>
                {kpiData.map((kpi, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">{kpi.metric}</td>
                    <td className="py-3 px-4 font-medium">{kpi.value}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        {kpi.change === "up" && <TrendingUp className="h-4 w-4 text-red-500" />}
                        {kpi.change === "down" && <TrendingDown className="h-4 w-4 text-green-500" />}
                        <Badge
                          variant={
                            kpi.change === "up" ? "destructive" : kpi.change === "down" ? "default" : "secondary"
                          }
                        >
                          {kpi.change === "up" ? "Increase" : kpi.change === "down" ? "Decrease" : "Stable"}
                        </Badge>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
