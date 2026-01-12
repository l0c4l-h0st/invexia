"use server"

import { createClient } from "@/lib/supabase/server"

export interface DashboardStats {
  totalProduits: number
  stockFaible: number
  valeurStock: number
  membres: number
  produitsChange: string
  stockFaibleChange: string
  valeurChange: string
  membresChange: string
}

export interface RecentProduct {
  id: string
  nom: string
  sku: string
  quantite: number
  categorie: string
  prix_vente: number
}

export interface RecentActivityItem {
  id: string
  action: string
  details: string
  created_at: string
  user_id: string
  user_name?: string
}

export async function getDashboardStats(): Promise<{ error: string | null; data: DashboardStats | null }> {
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()

  if (!user.user) {
    return { error: "Non authentifié", data: null }
  }

  // Récupérer l'entreprise de l'utilisateur
  const { data: profil } = await supabase.from("profils").select("entreprise_id, role").eq("id", user.user.id).single()

  if (!profil?.entreprise_id && profil?.role !== "admin") {
    return { error: "Aucune entreprise associée", data: null }
  }

  const entrepriseId = profil.entreprise_id

  // Compter les produits
  let produitsQuery = supabase.from("produits").select("*", { count: "exact", head: false })
  if (profil.role !== "admin" && entrepriseId) {
    produitsQuery = produitsQuery.eq("entreprise_id", entrepriseId)
  }
  const { data: produits, count: totalProduits } = await produitsQuery

  // Compter stock faible (quantité < 20)
  let stockFaibleQuery = supabase.from("produits").select("*", { count: "exact", head: true }).lt("quantite", 20)
  if (profil.role !== "admin" && entrepriseId) {
    stockFaibleQuery = stockFaibleQuery.eq("entreprise_id", entrepriseId)
  }
  const { count: stockFaible } = await stockFaibleQuery

  const valeurStock = produits?.reduce((acc, p) => acc + (p.quantite || 0) * (p.prix_vente || 0), 0) || 0

  // Compter les membres de l'équipe
  let membresQuery = supabase.from("profils").select("*", { count: "exact", head: true })
  if (profil.role !== "admin" && entrepriseId) {
    membresQuery = membresQuery.eq("entreprise_id", entrepriseId)
  }
  const { count: membres } = await membresQuery

  return {
    error: null,
    data: {
      totalProduits: totalProduits || 0,
      stockFaible: stockFaible || 0,
      valeurStock,
      membres: membres || 0,
      produitsChange: "+0%",
      stockFaibleChange: "0",
      valeurChange: "+0%",
      membresChange: "0",
    },
  }
}

export async function getRecentProducts(): Promise<{ error: string | null; data: RecentProduct[] | null }> {
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()

  if (!user.user) {
    return { error: "Non authentifié", data: null }
  }

  // Récupérer l'entreprise de l'utilisateur
  const { data: profil } = await supabase.from("profils").select("entreprise_id, role").eq("id", user.user.id).single()

  if (!profil?.entreprise_id && profil?.role !== "admin") {
    return { error: "Aucune entreprise associée", data: null }
  }

  let query = supabase
    .from("produits")
    .select("id, nom, sku, quantite, prix_vente, categories(nom)")
    .order("created_at", { ascending: false })
    .limit(5)

  if (profil.role !== "admin" && profil.entreprise_id) {
    query = query.eq("entreprise_id", profil.entreprise_id)
  }

  const { data, error } = await query

  if (error) {
    return { error: error.message, data: null }
  }

  const products: RecentProduct[] = (data || []).map((p: any) => ({
    id: p.id,
    nom: p.nom,
    sku: p.sku || "N/A",
    quantite: p.quantite || 0,
    categorie: p.categories?.nom || "Non catégorisé",
    prix_vente: p.prix_vente || 0,
  }))

  return { error: null, data: products }
}

export async function getRecentActivity(): Promise<{ error: string | null; data: RecentActivityItem[] | null }> {
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()

  if (!user.user) {
    return { error: "Non authentifié", data: null }
  }

  // Récupérer l'entreprise de l'utilisateur
  const { data: profil } = await supabase.from("profils").select("entreprise_id, role").eq("id", user.user.id).single()

  if (!profil?.entreprise_id && profil?.role !== "admin") {
    return { error: "Aucune entreprise associée", data: null }
  }

  let query = supabase
    .from("audit_logs")
    .select("id, action, details, created_at, user_id")
    .order("created_at", { ascending: false })
    .limit(10)

  if (profil.role !== "admin" && profil.entreprise_id) {
    query = query.eq("entreprise_id", profil.entreprise_id)
  }

  const { data, error } = await query

  if (error) {
    return { error: error.message, data: null }
  }

  return { error: null, data: data as RecentActivityItem[] }
}
