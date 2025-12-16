"use client"

import type React from "react"
import { useState } from "react"
import { Sidebar } from "./sidebar"
import { TopBar } from "./topbar"
import { useAuth } from "@/lib/auth-context"
import { Loader2 } from "lucide-react"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { isLoading, isProfilLoading, user, profil } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground">Connexion en cours...</p>
        </div>
      </div>
    )
  }

  // Si non connecté, afficher un loader car le redirect va se faire
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground">Redirection vers la connexion...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
