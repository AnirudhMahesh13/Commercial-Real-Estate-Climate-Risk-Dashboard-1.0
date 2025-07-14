"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RiskExposureChart } from "@/components/charts/RiskExposureChart"
import { GeographyExposureChart } from "@/components/charts/GeographyExposureChart"
import { useApp } from "@/contexts/AppContext"
import { mockPortfolioData } from "@/lib/mockData"

export default function HomePage() {
  const router = useRouter()
  const { setPortfolioData } = useApp()
  const [groupBy, setGroupBy] = useState("property-count")
  const [dimension, setDimension] = useState("geography")
  const [showPortfolioPopover, setShowPortfolioPopover] = useState(false)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Mock CSV parsing - in real app would parse actual CSV
      setPortfolioData(mockPortfolioData)
      setShowPortfolioPopover(false)
      router.push("/portfolio-view")
    }
  }

  const handleFilterPage = () => {
    setShowPortfolioPopover(false)
    router.push("/filter")
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-rbc-gray bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-rbc-blue rounded flex items-center justify-center">
                <span className="text-white font-bold">RBC</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold rbc-blue">ARC</h1>
                <p className="text-sm text-gray-600">Amplify Risk Console</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to ARC</h1>
          <p className="text-gray-600">
            Assess climate transition risk for commercial real estate assets and portfolios
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 mb-8">
          <Button
            onClick={() => router.push("/asset-search")}
            className="bg-rbc-blue hover:bg-rbc-blue/90 text-white px-6 py-3"
          >
            Asset-Level Analysis
          </Button>

          <Popover open={showPortfolioPopover} onOpenChange={setShowPortfolioPopover}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="border-rbc-blue text-rbc-blue hover:bg-rbc-blue/10 px-6 py-3 bg-transparent"
              >
                Portfolio Breakdown
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h3 className="font-semibold">Portfolio Analysis Options</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">Upload CSV</label>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-rbc-blue file:text-white hover:file:bg-rbc-blue/90"
                    />
                  </div>
                  <div className="text-center text-gray-500">or</div>
                  <Button onClick={handleFilterPage} className="w-full bg-rbc-blue hover:bg-rbc-blue/90 text-white">
                    Navigate to Filter Page
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Risk Exposure</CardTitle>
              <div className="flex space-x-2">
                <Select value={groupBy} onValueChange={setGroupBy}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="property-count">Property Count</SelectItem>
                    <SelectItem value="value">Value</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <RiskExposureChart groupBy={groupBy} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Exposure by Geography</CardTitle>
              <div className="flex space-x-2">
                <Select value={dimension} onValueChange={setDimension}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="geography">Geography</SelectItem>
                    <SelectItem value="lob">LOB/Sub-LOB</SelectItem>
                    <SelectItem value="type">Type</SelectItem>
                    <SelectItem value="certifications">Certifications</SelectItem>
                    <SelectItem value="energy-source">Energy Source</SelectItem>
                    <SelectItem value="intensity">Intensity</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <GeographyExposureChart dimension={dimension} groupBy={groupBy} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
