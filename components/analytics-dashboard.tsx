"use client"

import { useState, useEffect } from "react"
import { LineChart, BarChart, PieChart } from "./charts"
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth, ProtectedComponent } from "@/lib/auth-context"
import { getAnalyticsData, type AnalyticsData } from "@/lib/actions/analytics"

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("7d")
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const { hasPermission } = useAuth()

  const loadData = async () => {
    setLoading(true)
    try {
      const analyticsData = await getAnalyticsData(timeRange)
      setData(analyticsData)
    } catch (error) {
      console.error("Erreur chargement analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [timeRange])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const metrics = data
    ? [
        {
          label: "Valeur Inventaire",
          value: formatCurrency(data.revenue),
          change: `+${data.revenueChange}%`,
          trend: "up" as const,
          color: "from-blue-500 to-cyan-500",
        },
        {
          label: "Produits en Stock",
          value: data.orders.toLocaleString("fr-FR"),
          change: `+${data.ordersChange}%`,
          trend: "up" as const,
          color: "from-purple-500 to-pink-500",
        },
        {
          label: "Prix Moyen",
          value: formatCurrency(data.avgOrderValue),
          change: `${data.avgOrderValueChange}%`,
          trend: data.avgOrderValueChange >= 0 ? ("up" as const) : ("down" as const),
          color: "from-orange-500 to-red-500",
        },
        {
          label: "Taux Rotation",
          value: `${data.conversionRate}%`,
          change: `+${data.conversionRateChange}%`,
          trend: "up" as const,
          color: "from-green-500 to-emerald-500",
        },
      ]
    : []

  return (
    <ProtectedComponent permission="analytics:view">
      <div className="p-4 md:p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Analytics</h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Métriques de performance en temps réel pour l'inventaire
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadData}
              disabled={loading}
              className="border-border/40 bg-transparent"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </Button>
            <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1 overflow-x-auto">
              {["24h", "7d", "30d", "90d"].map((range) => (
                <Button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  variant={timeRange === range ? "default" : "ghost"}
                  size="sm"
                  className={timeRange === range ? "bg-primary hover:bg-primary/90" : "hover:bg-muted"}
                >
                  {range}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw size={32} className="animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="glass rounded-xl p-5 md:p-6 border border-border/40 hover:border-border/60 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-1.5 h-8 rounded-full bg-gradient-to-b ${metric.color}`}></div>
                    <div
                      className={`flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded-lg ${
                        metric.trend === "up"
                          ? "bg-green-100/80 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                          : "bg-red-100/80 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                      }`}
                    >
                      {metric.trend === "up" ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      {metric.change}
                    </div>
                  </div>
                  <p className="text-muted-foreground text-xs md:text-sm mb-2">{metric.label}</p>
                  <p className="text-2xl md:text-3xl font-bold">{metric.value}</p>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <LineChart data={data?.revenueByDay} />
              <BarChart data={data?.ordersByMonth} />
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <PieChart data={data?.productMix} />
              </div>
              <div className="lg:col-span-2">
                <TopProducts products={data?.topProducts || []} />
              </div>
            </div>
          </>
        )}
      </div>
    </ProtectedComponent>
  )
}

function TopProducts({ products }: { products: { name: string; revenue: number; units: number; growth: number }[] }) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="glass rounded-xl border border-border/40 p-5 md:p-6">
      <h3 className="text-lg md:text-xl font-bold mb-6">Produits les Plus Valorisés</h3>
      <div className="space-y-3">
        {products.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">Aucun produit trouvé</p>
        ) : (
          products.map((product) => (
            <div
              key={product.name}
              className="flex items-center justify-between p-3 md:p-4 bg-muted/40 rounded-lg hover:bg-muted/60 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm md:text-base truncate">{product.name}</p>
                <p className="text-xs text-muted-foreground">{product.units} unités en stock</p>
              </div>
              <div className="text-right flex-shrink-0 ml-4">
                <p className="font-bold text-sm md:text-base">{formatCurrency(product.revenue)}</p>
                <p
                  className={`text-xs font-semibold ${
                    product.growth >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {product.growth >= 0 ? "+" : ""}
                  {product.growth}%
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
