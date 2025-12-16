"use server"

import { createClient } from "@/lib/supabase/server"

export interface AnalyticsData {
  revenue: number
  revenueChange: number
  orders: number
  ordersChange: number
  avgOrderValue: number
  avgOrderValueChange: number
  conversionRate: number
  conversionRateChange: number
  revenueByDay: { date: string; value: number }[]
  ordersByMonth: { month: string; value: number }[]
  productMix: { name: string; value: number; color: string }[]
  topProducts: { name: string; revenue: number; units: number; growth: number }[]
}

export async function getAnalyticsData(timeRange = "7d"): Promise<AnalyticsData> {
  const supabase = await createClient()

  // Calculer la date de début selon la période
  const now = new Date()
  const startDate = new Date()

  switch (timeRange) {
    case "24h":
      startDate.setDate(now.getDate() - 1)
      break
    case "7d":
      startDate.setDate(now.getDate() - 7)
      break
    case "30d":
      startDate.setDate(now.getDate() - 30)
      break
    case "90d":
      startDate.setDate(now.getDate() - 90)
      break
  }

  // Récupérer les produits pour calculer les stats
  const { data: produits } = await supabase.from("produits").select("*").gte("created_at", startDate.toISOString())

  // Calculer les métriques basées sur les produits
  const totalValue = produits?.reduce((sum, p) => sum + p.prix * p.stock, 0) || 0
  const totalStock = produits?.reduce((sum, p) => sum + p.stock, 0) || 0

  // Données simulées basées sur les vraies données
  return {
    revenue: totalValue,
    revenueChange: 18,
    orders: totalStock,
    ordersChange: 12,
    avgOrderValue: totalStock > 0 ? totalValue / totalStock : 0,
    avgOrderValueChange: -3,
    conversionRate: 3.24,
    conversionRateChange: 0.5,
    revenueByDay: [
      { date: "Lun", value: totalValue * 0.12 },
      { date: "Mar", value: totalValue * 0.15 },
      { date: "Mer", value: totalValue * 0.1 },
      { date: "Jeu", value: totalValue * 0.18 },
      { date: "Ven", value: totalValue * 0.2 },
      { date: "Sam", value: totalValue * 0.15 },
      { date: "Dim", value: totalValue * 0.1 },
    ],
    ordersByMonth: [
      { month: "Jan", value: 120 },
      { month: "Fév", value: 150 },
      { month: "Mar", value: 180 },
      { month: "Avr", value: 160 },
      { month: "Mai", value: 200 },
      { month: "Juin", value: 220 },
    ],
    productMix: [
      { name: "Électronique", value: 40, color: "#3b82f6" },
      { name: "Accessoires", value: 25, color: "#8b5cf6" },
      { name: "Mobilier", value: 20, color: "#f59e0b" },
      { name: "Autres", value: 15, color: "#10b981" },
    ],
    topProducts:
      produits?.slice(0, 4).map((p) => ({
        name: p.nom,
        revenue: p.prix * p.stock,
        units: p.stock,
        growth: Math.floor(Math.random() * 40) - 10,
      })) || [],
  }
}
