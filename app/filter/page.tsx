"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useApp } from "@/contexts/AppContext"
import { mockPortfolioData } from "@/lib/mockData"

const filterOptions = {
  geography: [
    "Toronto, ON",
    "Vancouver, BC",
    "Montreal, QC",
    "Calgary, AB",
    "Ottawa, ON",
    "Edmonton, AB",
    "Winnipeg, MB",
  ],
  propertyType: ["Office", "Retail", "Industrial", "Multi-Family", "Hotel", "Mixed-Use", "Warehouse"],
  lob: ["Commercial Banking", "Corporate Banking", "Real Estate Finance", "Investment Banking", "Private Banking"],
  energySource: ["Natural Gas", "Electric", "Oil", "Heat Pump", "Solar", "Geothermal", "District Heating"],
  certifications: ["LEED Gold", "LEED Silver", "LEED Platinum", "ENERGY STAR", "BOMA BEST", "Green Globes", "None"],
  efficiencyRange: ["High (>80%)", "Medium (60-80%)", "Low (40-60%)", "Very Low (<40%)"],
}

export default function FilterPage() {
  const router = useRouter()
  const { portfolioFilters, setPortfolioFilters, setPortfolioData } = useApp()
  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({})
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    geography: true,
    propertyType: true,
    lob: true,
  })

  const handleFilterChange = (category: keyof typeof portfolioFilters, value: string, checked: boolean) => {
    const currentFilters = portfolioFilters[category]
    const updatedFilters = checked ? [...currentFilters, value] : currentFilters.filter((item) => item !== value)

    setPortfolioFilters({
      ...portfolioFilters,
      [category]: updatedFilters,
    })
  }

  const handleSearchChange = (category: string, term: string) => {
    setSearchTerms({
      ...searchTerms,
      [category]: term,
    })
  }

  const getFilteredOptions = (category: string, options: string[]) => {
    const searchTerm = searchTerms[category]?.toLowerCase() || ""
    return options.filter((option) => option.toLowerCase().includes(searchTerm))
  }

  const getVisibleOptions = (category: string, options: string[]) => {
    const filtered = getFilteredOptions(category, options)
    return expandedSections[category] ? filtered : filtered.slice(0, 3)
  }

  const toggleSection = (category: string) => {
    setExpandedSections({
      ...expandedSections,
      [category]: !expandedSections[category],
    })
  }

  const handleProceed = () => {
    // Filter mock data based on selected filters
    const filteredData = mockPortfolioData.filter((asset) => {
      const matchesGeography =
        portfolioFilters.geography.length === 0 ||
        portfolioFilters.geography.some((geo) => asset.address.includes(geo.split(",")[0]))

      const matchesPropertyType =
        portfolioFilters.propertyType.length === 0 || portfolioFilters.propertyType.includes(asset.propertyType)

      const matchesLOB = portfolioFilters.lob.length === 0 || portfolioFilters.lob.includes(asset.lob)

      return matchesGeography && matchesPropertyType && matchesLOB
    })

    setPortfolioData(filteredData)
    router.push("/portfolio-view")
  }

  const hasFiltersSelected = Object.values(portfolioFilters).some((filters) => filters.length > 0)

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Portfolio Filters</h1>
        <p className="text-gray-600">Select criteria to filter your portfolio analysis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {Object.entries(filterOptions).map(([category, options]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="capitalize">
                {category === "lob" ? "LOB/Sub-LOB" : category.replace(/([A-Z])/g, " $1").trim()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  placeholder={`Search ${category}...`}
                  value={searchTerms[category] || ""}
                  onChange={(e) => handleSearchChange(category, e.target.value)}
                  className="border-rbc-gray focus:border-rbc-blue"
                />

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {getVisibleOptions(category, options).map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${category}-${option}`}
                        checked={portfolioFilters[category as keyof typeof portfolioFilters].includes(option)}
                        onCheckedChange={(checked) =>
                          handleFilterChange(category as keyof typeof portfolioFilters, option, checked as boolean)
                        }
                      />
                      <label
                        htmlFor={`${category}-${option}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>

                {getFilteredOptions(category, options).length > 3 && (
                  <Collapsible>
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSection(category)}
                        className="w-full justify-center text-rbc-blue hover:text-rbc-blue/80"
                      >
                        {expandedSections[category] ? "Show Less" : "Show More"}
                        <ChevronDown
                          className={`h-4 w-4 ml-1 transition-transform ${
                            expandedSections[category] ? "rotate-180" : ""
                          }`}
                        />
                      </Button>
                    </CollapsibleTrigger>
                  </Collapsible>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Filters Summary */}
      {hasFiltersSelected && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Selected Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(portfolioFilters).map(
                ([category, filters]) =>
                  filters.length > 0 && (
                    <div key={category} className="flex flex-wrap gap-2">
                      <span className="font-medium capitalize text-sm">
                        {category === "lob" ? "LOB/Sub-LOB" : category.replace(/([A-Z])/g, " $1").trim()}:
                      </span>
                      {filters.map((filter) => (
                        <span key={filter} className="bg-rbc-blue/10 text-rbc-blue px-2 py-1 rounded text-sm">
                          {filter}
                        </span>
                      ))}
                    </div>
                  ),
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Proceed Button */}
      {hasFiltersSelected && (
        <div className="fixed bottom-6 right-6">
          <Button
            onClick={handleProceed}
            className="bg-rbc-blue hover:bg-rbc-blue/90 text-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-2"
          >
            <span>View Portfolio Analysis</span>
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  )
}
