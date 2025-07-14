"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useApp } from "@/contexts/AppContext"
import { InteractiveMap } from "@/components/maps/InteractiveMap"
import type { Asset } from "@/contexts/AppContext"

export default function AssetOverviewPage() {
  const router = useRouter()
  const { selectedAssets, setSelectedAssets, currentAssetIndex, setCurrentAssetIndex } = useApp()
  const [currentAsset, setCurrentAsset] = useState<Asset | null>(null)

  useEffect(() => {
    if (selectedAssets.length > 0) {
      setCurrentAsset(selectedAssets[currentAssetIndex])
    } else {
      // Create blank asset for "Add Your Own" flow
      const blankAsset: Asset = {
        id: "new-asset",
        address: "",
        company: "",
        lob: "",
        propertyType: "",
        size: 0,
        age: 0,
        value: 0,
        heatSource: "",
        certifications: [],
        loan: { amount: 0, ttm: 0, payment: 0 },
        noi: { revenue2024: 0, opex2024: 0 },
        coordinates: { lat: 43.6532, lng: -79.3832 },
        riskRating: "Medium",
        postalCode: "",
      }
      setCurrentAsset(blankAsset)
    }
  }, [selectedAssets, currentAssetIndex])

  const handleFieldChange = (field: string, value: any) => {
    if (!currentAsset) return

    const updatedAsset = { ...currentAsset, [field]: value }
    setCurrentAsset(updatedAsset)

    if (selectedAssets.length > 0) {
      const updatedAssets = [...selectedAssets]
      updatedAssets[currentAssetIndex] = updatedAsset
      setSelectedAssets(updatedAssets)
    }
  }

  const handleNestedFieldChange = (parent: string, field: string, value: any) => {
    if (!currentAsset) return

    const updatedAsset = {
      ...currentAsset,
      [parent]: { ...currentAsset[parent as keyof Asset], [field]: value },
    }
    setCurrentAsset(updatedAsset)

    if (selectedAssets.length > 0) {
      const updatedAssets = [...selectedAssets]
      updatedAssets[currentAssetIndex] = updatedAsset
      setSelectedAssets(updatedAssets)
    }
  }

  const handleNext = () => {
    if (selectedAssets.length === 0) {
      // Add new asset to selected assets
      if (currentAsset) {
        setSelectedAssets([currentAsset])
        router.push("/asset-view")
      }
    } else if (currentAssetIndex < selectedAssets.length - 1) {
      setCurrentAssetIndex(currentAssetIndex + 1)
    } else {
      router.push("/asset-view")
    }
  }

  const handlePrevious = () => {
    if (currentAssetIndex > 0) {
      setCurrentAssetIndex(currentAssetIndex - 1)
    } else {
      router.push("/asset-search")
    }
  }

  if (!currentAsset) return null

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Asset Overview</h1>
          <p className="text-gray-600">Review and edit asset details</p>
        </div>
        {selectedAssets.length > 0 && (
          <Badge variant="outline" className="text-lg px-3 py-1">
            {currentAssetIndex + 1} / {selectedAssets.length}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Asset Details Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Property Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={currentAsset.address}
                  onChange={(e) => handleFieldChange("address", e.target.value)}
                  placeholder="Enter property address"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={currentAsset.company}
                    onChange={(e) => handleFieldChange("company", e.target.value)}
                    placeholder="Company name"
                  />
                </div>
                <div>
                  <Label htmlFor="lob">LOB</Label>
                  <Select value={currentAsset.lob} onValueChange={(value) => handleFieldChange("lob", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select LOB" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Commercial Banking">Commercial Banking</SelectItem>
                      <SelectItem value="Corporate Banking">Corporate Banking</SelectItem>
                      <SelectItem value="Real Estate Finance">Real Estate Finance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="propertyType">Property Type</Label>
                  <Select
                    value={currentAsset.propertyType}
                    onValueChange={(value) => handleFieldChange("propertyType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Office">Office</SelectItem>
                      <SelectItem value="Retail">Retail</SelectItem>
                      <SelectItem value="Industrial">Industrial</SelectItem>
                      <SelectItem value="Multi-Family">Multi-Family</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="heatSource">Heat Source</Label>
                  <Select
                    value={currentAsset.heatSource}
                    onValueChange={(value) => handleFieldChange("heatSource", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select heat source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Natural Gas">Natural Gas</SelectItem>
                      <SelectItem value="Electric">Electric</SelectItem>
                      <SelectItem value="Oil">Oil</SelectItem>
                      <SelectItem value="Heat Pump">Heat Pump</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="size">Size (sq ft)</Label>
                  <Input
                    id="size"
                    type="number"
                    value={currentAsset.size}
                    onChange={(e) => handleFieldChange("size", Number.parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="age">Age (years)</Label>
                  <Input
                    id="age"
                    type="number"
                    value={currentAsset.age}
                    onChange={(e) => handleFieldChange("age", Number.parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="value">Value ($)</Label>
                  <Input
                    id="value"
                    type="number"
                    value={currentAsset.value}
                    onChange={(e) => handleFieldChange("value", Number.parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Financial Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="loanAmount">Loan Amount ($)</Label>
                  <Input
                    id="loanAmount"
                    type="number"
                    value={currentAsset.loan.amount}
                    onChange={(e) => handleNestedFieldChange("loan", "amount", Number.parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="ttm">TTM</Label>
                  <Input
                    id="ttm"
                    type="number"
                    value={currentAsset.loan.ttm}
                    onChange={(e) => handleNestedFieldChange("loan", "ttm", Number.parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="payment">Payment ($)</Label>
                  <Input
                    id="payment"
                    type="number"
                    value={currentAsset.loan.payment}
                    onChange={(e) => handleNestedFieldChange("loan", "payment", Number.parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="revenue2024">2024 Revenue ($)</Label>
                  <Input
                    id="revenue2024"
                    type="number"
                    value={currentAsset.noi.revenue2024}
                    onChange={(e) =>
                      handleNestedFieldChange("noi", "revenue2024", Number.parseInt(e.target.value) || 0)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="opex2024">2024 OpEx ($)</Label>
                  <Input
                    id="opex2024"
                    type="number"
                    value={currentAsset.noi.opex2024}
                    onChange={(e) => handleNestedFieldChange("noi", "opex2024", Number.parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Map */}
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Property Location</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-96">
                <InteractiveMap
                  center={currentAsset.coordinates}
                  markers={[
                    {
                      position: currentAsset.coordinates,
                      title: currentAsset.address || "Property Location",
                      type: "property",
                    },
                  ]}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button onClick={handlePrevious} variant="outline" className="flex items-center space-x-2 bg-transparent">
          <ArrowLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>

        <Button
          onClick={handleNext}
          className="bg-rbc-blue hover:bg-rbc-blue/90 text-white flex items-center space-x-2"
        >
          <span>
            {selectedAssets.length === 0
              ? "Analyze Asset"
              : currentAssetIndex < selectedAssets.length - 1
                ? "Next Asset"
                : "View Analysis"}
          </span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
