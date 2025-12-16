"use client"

import { StatsGrid } from "./stats-grid"
import { InventoryTable } from "./inventory-table"
import { RecentActivity } from "./recent-activity"
import { useAuth } from "@/lib/auth-context"
import { ProtectedComponent } from "@/lib/auth-context"
import { Loader2 } from "lucide-react"

export function DashboardContent() {
  const { profil, isLoading, isProfilLoading, user } = useAuth()

  if (isLoading || isProfilLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Chargement de votre profil...</p>
      </div>
    )
  }

  if (!profil && user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Configuration de votre compte en cours...</p>
        <p className="text-sm text-muted-foreground">Si cela persiste, veuillez vous reconnecter.</p>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold">Tableau de Bord</h1>
        <p className="text-muted-foreground">
          Bienvenue {profil?.prenom || "utilisateur"}, voici votre vue d'ensemble.
        </p>
      </div>

      {/* Stats Grid - Protected by permission */}
      <ProtectedComponent permission="inventory:view">
        <StatsGrid />
      </ProtectedComponent>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProtectedComponent permission="inventory:view">
            <InventoryTable />
          </ProtectedComponent>
        </div>
        <div>
          <ProtectedComponent permission="audit:view">
            <RecentActivity />
          </ProtectedComponent>
        </div>
      </div>
    </div>
  )
}
