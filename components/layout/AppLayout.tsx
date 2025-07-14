"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { AppSidebar } from "./AppSidebar"
import { SidebarInset } from "@/components/ui/sidebar"

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isHomePage = pathname === "/"

  if (isHomePage) {
    return <main className="min-h-screen bg-white">{children}</main>
  }

  return (
    <div className="flex min-h-screen bg-white">
      <AppSidebar />
      <SidebarInset className="flex-1">
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </div>
  )
}
