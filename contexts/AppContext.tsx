"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface Asset {
  id: string
  address: string
  company: string
  lob: string
  propertyType: string
  size: number
  age: number
  value: number
  heatSource: string
  certifications: string[]
  loan: {
    amount: number
    ttm: number
    payment: number
  }
  noi: {
    revenue2024: number
    opex2024: number
  }
  coordinates: {
    lat: number
    lng: number
  }
  riskRating: "Low" | "Medium" | "High"
  postalCode: string
}

export interface PortfolioFilters {
  geography: string[]
  propertyType: string[]
  lob: string[]
  energySource: string[]
  certifications: string[]
  efficiencyRange: string[]
}

interface AppContextType {
  selectedAssets: Asset[]
  setSelectedAssets: (assets: Asset[]) => void
  currentAssetIndex: number
  setCurrentAssetIndex: (index: number) => void
  portfolioFilters: PortfolioFilters
  setPortfolioFilters: (filters: PortfolioFilters) => void
  portfolioData: Asset[]
  setPortfolioData: (data: Asset[]) => void
  scenario: string
  setScenario: (scenario: string) => void
  paymentPlan: string
  setPaymentPlan: (plan: string) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [selectedAssets, setSelectedAssets] = useState<Asset[]>([])
  const [currentAssetIndex, setCurrentAssetIndex] = useState(0)
  const [portfolioFilters, setPortfolioFilters] = useState<PortfolioFilters>({
    geography: [],
    propertyType: [],
    lob: [],
    energySource: [],
    certifications: [],
    efficiencyRange: [],
  })
  const [portfolioData, setPortfolioData] = useState<Asset[]>([])
  const [scenario, setScenario] = useState("1.5 Immediate")
  const [paymentPlan, setPaymentPlan] = useState("Pay Upfront")

  return (
    <AppContext.Provider
      value={{
        selectedAssets,
        setSelectedAssets,
        currentAssetIndex,
        setCurrentAssetIndex,
        portfolioFilters,
        setPortfolioFilters,
        portfolioData,
        setPortfolioData,
        scenario,
        setScenario,
        paymentPlan,
        setPaymentPlan,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
