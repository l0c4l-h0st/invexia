"use client"

import { useState, useEffect } from "react"
import { Package, AlertCircle, User, Truck, Loader2, Activity } from "lucide-react"
import { useAuth, ProtectedComponent } from "@/lib/auth-context"
import { getRecentActivity, type RecentActivityItem } from "@/lib/actions/dashboard"

export function RecentActivity() {
  const { hasPermission, profil } = useAuth()
  const [activities, setActivities] = useState<RecentActivityItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadActivity() {
      if (!profil) return
      setIsLoading(true)
      const result = await getRecentActivity()
      if (result.data) {
        setActivities(result.data)
      }
      setIsLoading(false)
    }
    loadActivity()
  }, [profil])

  // Mapper les actions aux icônes et couleurs
  const getActivityStyle = (action: string) => {
    const lowerAction = action.toLowerCase()
    if (lowerAction.includes("create") || lowerAction.includes("ajout")) {
      return {
        icon: Package,
        color: "bg-blue-100/80 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300",
      }
    }
    if (lowerAction.includes("alert") || lowerAction.includes("stock")) {
      return {
        icon: AlertCircle,
        color: "bg-orange-100/80 dark:bg-orange-900/40 text-orange-600 dark:text-orange-300",
      }
    }
    if (lowerAction.includes("user") || lowerAction.includes("membre")) {
      return {
        icon: User,
        color: "bg-green-100/80 dark:bg-green-900/40 text-green-600 dark:text-green-300",
      }
    }
    if (lowerAction.includes("commande") || lowerAction.includes("expedition")) {
      return {
        icon: Truck,
        color: "bg-purple-100/80 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300",
      }
    }
    return {
      icon: Activity,
      color: "bg-gray-100/80 dark:bg-gray-900/40 text-gray-600 dark:text-gray-300",
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `Il y a ${diffMins} min`
    if (diffHours < 24) return `Il y a ${diffHours} h`
    if (diffDays < 7) return `Il y a ${diffDays} j`
    return date.toLocaleDateString("fr-FR")
  }

  if (isLoading) {
    return (
      <div className="glass rounded-xl border border-border/40 p-5 md:p-6 flex items-center justify-center min-h-[300px]">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <ProtectedComponent permission="audit:view">
      <div className="glass rounded-xl border border-border/40 p-5 md:p-6 flex flex-col h-full">
        <h2 className="text-lg md:text-xl font-bold mb-4">Activités Récentes</h2>
        <div className="space-y-3 flex-1">
          {activities.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Aucune activité récente</p>
            </div>
          ) : (
            activities.map((activity) => {
              const style = getActivityStyle(activity.action)
              const Icon = style.icon
              return (
                <div key={activity.id} className="flex gap-3 p-3 rounded-lg hover:bg-muted/40 transition-colors group">
                  <div className={`p-2.5 rounded-lg flex-shrink-0 ${style.color}`}>
                    <Icon size={16} className="md:size-18" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-xs md:text-sm">{activity.action}</p>
                    <p className="text-xs text-muted-foreground truncate">{activity.details || "Aucun détail"}</p>
                    <p className="text-xs text-muted-foreground mt-1">{formatTime(activity.created_at)}</p>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </ProtectedComponent>
  )
}
