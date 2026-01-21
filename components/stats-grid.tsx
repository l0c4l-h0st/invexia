"use client"

import { useState, useEffect } from "react"
import { TrendingUp, Package, AlertCircle, Users } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { getDashboardStats, type DashboardStats } from "@/lib/actions/dashboard"

export function StatsGrid() {
  const { hasPermission, profil } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      if (!profil) return
      setIsLoading(true)
      const result = await getDashboardStats()
      if (result.data) {
        setStats(result.data)
      }
      setIsLoading(false)
    }
    loadStats()
  }, [profil])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass rounded-xl p-5 md:p-6 border border-border/40 animate-pulse">
            <div className="h-20 bg-muted/50 rounded" />
          </div>
        ))}
      </div>
    )
  }

  const statsConfig = [
    {
      icon: Package,
      label: "Total Produits",
      value: stats?.totalProduits.toString() || "0",
      change: stats?.produitsChange || "+0%",
      trend: "up",
      permission: "inventory:view" as const,
    },
    {
      icon: AlertCircle,
      label: "Stock Faible",
      value: stats?.stockFaible.toString() || "0",
      change: stats?.stockFaibleChange || "0",
      trend: "down",
      permission: "inventory:view" as const,
    },
    {
      icon: TrendingUp,
      label: "Valeur Stock",
      value: `${((stats?.valeurStock || 0) / 1000).toFixed(1)} K€`,
      change: stats?.valeurChange || "+0%",
      trend: "up",
      permission: "analytics:view" as const,
    },
    {
      icon: Users,
      label: "Membres",
      value: stats?.membres.toString() || "0",
      change: stats?.membresChange || "0",
      trend: "up",
      permission: "users:view" as const,
    },
  ]

  const visibleStats = statsConfig.filter((stat) => hasPermission(stat.permission))

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {visibleStats.map((stat) => (
        <div
          key={stat.label}
          className="glass rounded-xl p-5 md:p-6 border border-border/40 hover:border-border/60 transition-all duration-300 group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-2.5 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg group-hover:from-primary/30 group-hover:to-accent/30 transition-all">
              <stat.icon size={22} className="text-primary" />
            </div>
            <span
              className={`text-sm font-semibold px-2 py-1 rounded-lg ${
                stat.trend === "up"
                  ? "bg-green-100/80 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                  : "bg-blue-100/80 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
              }`}
            >
              {stat.change}
            </span>
          </div>
          <p className="text-muted-foreground text-xs md:text-sm mb-2">{stat.label}</p>
          <p className="text-2xl md:text-3xl font-bold">{stat.value}</p>
        </div>
      ))}
    </div>
  )
}
