"use client"

import { useState } from "react"
import { MapPin, AlertTriangle, CheckCircle, AlertCircle } from "lucide-react"

interface MapMarker {
  position: { lat: number; lng: number }
  title: string
  type: "property" | "risk-high" | "risk-medium" | "risk-low"
}

interface InteractiveMapProps {
  center: { lat: number; lng: number }
  markers: MapMarker[]
}

export function InteractiveMap({ center, markers }: InteractiveMapProps) {
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null)

  const getMarkerIcon = (type: string) => {
    switch (type) {
      case "property":
        return <MapPin className="h-6 w-6 text-rbc-blue" />
      case "risk-high":
        return <AlertTriangle className="h-6 w-6 text-red-500" />
      case "risk-medium":
        return <AlertCircle className="h-6 w-6 text-yellow-500" />
      case "risk-low":
        return <CheckCircle className="h-6 w-6 text-green-500" />
      default:
        return <MapPin className="h-6 w-6 text-gray-500" />
    }
  }

  const getMarkerColor = (type: string) => {
    switch (type) {
      case "property":
        return "bg-rbc-blue"
      case "risk-high":
        return "bg-red-500"
      case "risk-medium":
        return "bg-yellow-500"
      case "risk-low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden">
      {/* Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" className="text-gray-300">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
        <button className="bg-white border border-gray-300 rounded p-2 shadow-sm hover:bg-gray-50">
          <span className="text-lg font-bold">+</span>
        </button>
        <button className="bg-white border border-gray-300 rounded p-2 shadow-sm hover:bg-gray-50">
          <span className="text-lg font-bold">−</span>
        </button>
      </div>

      {/* Markers */}
      {markers.map((marker, index) => (
        <div
          key={index}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20"
          style={{
            left: `${50 + (marker.position.lng - center.lng) * 1000}%`,
            top: `${50 - (marker.position.lat - center.lat) * 1000}%`,
          }}
          onClick={() => setSelectedMarker(marker)}
        >
          <div
            className={`w-8 h-8 rounded-full ${getMarkerColor(marker.type)} flex items-center justify-center shadow-lg border-2 border-white`}
          >
            {getMarkerIcon(marker.type)}
          </div>
        </div>
      ))}

      {/* Info Window */}
      {selectedMarker && (
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-xs z-30">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm">{selectedMarker.title}</h3>
            <button onClick={() => setSelectedMarker(null)} className="text-gray-400 hover:text-gray-600">
              ×
            </button>
          </div>
          <p className="text-xs text-gray-600 capitalize">{selectedMarker.type.replace("-", " ")} marker</p>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 z-10">
        <h4 className="font-semibold text-xs mb-2">Legend</h4>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-rbc-blue rounded-full"></div>
            <span className="text-xs">Property</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-xs">High Risk</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-xs">Medium Risk</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-xs">Low Risk</span>
          </div>
        </div>
      </div>
    </div>
  )
}
