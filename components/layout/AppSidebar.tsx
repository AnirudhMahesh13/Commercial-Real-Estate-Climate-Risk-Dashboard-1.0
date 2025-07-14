"use client"

import { Home, Building, BarChart3, PanelLeftClose, PanelLeftOpen } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useApp } from "@/contexts/AppContext"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

export function AppSidebar() {
  const pathname = usePathname()
  const { selectedAssets, portfolioData, portfolioFilters } = useApp()
  const { state, toggleSidebar } = useSidebar()

  const isAssetViewEnabled = selectedAssets.length > 0
  const isPortfolioViewEnabled =
    portfolioData.length > 0 || Object.values(portfolioFilters).some((filter) => filter.length > 0)

  const menuItems = [
    {
      title: "Home",
      url: "/",
      icon: Home,
      enabled: true,
    },
    {
      title: "Asset View",
      url: "/asset-view",
      icon: Building,
      enabled: isAssetViewEnabled,
    },
    {
      title: "Portfolio View",
      url: "/portfolio-view",
      icon: BarChart3,
      enabled: isPortfolioViewEnabled,
    },
  ]

  return (
    <Sidebar className="border-r border-rbc-gray">
      <SidebarHeader className="p-4 border-b border-rbc-gray">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-rbc-blue rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">RBC</span>
            </div>
            {state === "expanded" && (
              <div>
                <h1 className="font-bold text-lg rbc-blue">ARC</h1>
                <p className="text-xs text-gray-600">Amplify Risk Console</p>
              </div>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={toggleSidebar} className="h-8 w-8 p-0">
            {state === "expanded" ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.url}
                className={`w-full justify-start ${!item.enabled ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={!item.enabled}
              >
                <Link href={item.enabled ? item.url : "#"} className="flex items-center space-x-3">
                  <item.icon className="h-5 w-5" />
                  {state === "expanded" && <span>{item.title}</span>}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
