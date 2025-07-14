"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, MapPin, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useApp } from "@/contexts/AppContext"
import { mockAssets } from "@/lib/mockData"
import type { Asset } from "@/contexts/AppContext"

export default function AssetSearchPage() {
  const router = useRouter()
  const { selectedAssets, setSelectedAssets, setCurrentAssetIndex } = useApp()
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.length > 2) {
      const filtered = mockAssets.filter((asset) => asset.address.toLowerCase().includes(query.toLowerCase()))
      setFilteredAssets(filtered)
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }

  const handleAssetSelect = (asset: Asset) => {
    if (selectedAssets.length < 3 && !selectedAssets.find((a) => a.id === asset.id)) {
      setSelectedAssets([...selectedAssets, asset])
    }
    setShowSuggestions(false)
    setSearchQuery("")
  }

  const handleAssetRemove = (assetId: string) => {
    setSelectedAssets(selectedAssets.filter((a) => a.id !== assetId))
  }

  const handleProceed = () => {
    setCurrentAssetIndex(0)
    router.push("/asset-overview")
  }

  const handleAddYourOwn = () => {
    router.push("/asset-overview")
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Asset Search</h1>
        <p className="text-gray-600">Search and select up to 3 commercial real estate assets for analysis</p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Search by address..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 h-12 text-lg border-rbc-gray focus:border-rbc-blue"
          />
        </div>

        {/* Search Suggestions */}
        {showSuggestions && filteredAssets.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-white border border-rbc-gray rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
            {filteredAssets.map((asset) => (
              <div
                key={asset.id}
                onClick={() => handleAssetSelect(asset)}
                className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="font-medium">{asset.address}</div>
                    <div className="text-sm text-gray-500">
                      {asset.propertyType} • {asset.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Assets */}
      {selectedAssets.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Selected Assets ({selectedAssets.length}/3)</h3>
          <div className="space-y-3">
            {selectedAssets.map((asset) => (
              <Card key={asset.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="font-medium">{asset.address}</div>
                        <div className="text-sm text-gray-500">
                          {asset.propertyType} • {asset.company}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          asset.riskRating === "High"
                            ? "destructive"
                            : asset.riskRating === "Medium"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {asset.riskRating} Risk
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAssetRemove(asset.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-4 mb-8">
        <Button
          onClick={handleAddYourOwn}
          variant="outline"
          className="border-rbc-blue text-rbc-blue hover:bg-rbc-blue/10 bg-transparent"
        >
          Add Your Own
        </Button>
        <Button variant="outline" disabled className="opacity-50 cursor-not-allowed bg-transparent">
          Extract from PDF
        </Button>
      </div>

      {/* Proceed Button */}
      {selectedAssets.length > 0 && (
        <div className="fixed bottom-6 right-6">
          <Button
            onClick={handleProceed}
            className="bg-rbc-blue hover:bg-rbc-blue/90 text-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-2"
          >
            <span>Proceed to Overview</span>
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  )
}
