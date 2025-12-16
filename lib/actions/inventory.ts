"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export interface Produit {
  id: string
  entreprise_id: string
  categorie_id: string | null
  nom: string
  description: string | null
  sku: string
  code_barre: string | null
  prix_achat: number
  prix_vente: number
  quantite: number
  quantite_min: number
  unite: string
  emplacement: string | null
  image_url: string | null
  statut: "actif" | "inactif" | "rupture" | "commande"
  created_at: string
  updated_at: string
  categorie?: Categorie | null
}

export interface Categorie {
  id: string
  entreprise_id: string
  nom: string
  description: string | null
  couleur: string
  icone: string
}

// Récupérer tous les produits
export async function getProduits() {
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()

  if (!user.user) {
    return { error: "Non authentifié", data: null }
  }

  const { data, error } = await supabase
    .from("produits")
    .select(
      `
      *,
      categorie:categories(*)
    `,
    )
    .order("created_at", { ascending: false })

  if (error) {
    return { error: error.message, data: null }
  }

  return { error: null, data: data as Produit[] }
}

// Récupérer un produit par ID
export async function getProduitById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("produits")
    .select(
      `
      *,
      categorie:categories(*)
    `,
    )
    .eq("id", id)
    .single()

  if (error) {
    return { error: error.message, data: null }
  }

  return { error: null, data: data as Produit }
}

// Créer un produit
export async function createProduit(formData: {
  nom: string
  description?: string
  sku: string
  code_barre?: string
  categorie_id?: string
  prix_achat: number
  prix_vente: number
  quantite: number
  quantite_min: number
  unite: string
  emplacement?: string
}) {
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()

  if (!user.user) {
    return { error: "Non authentifié", data: null }
  }

  // Récupérer l'entreprise de l'utilisateur
  const { data: profil } = await supabase.from("profils").select("entreprise_id").eq("id", user.user.id).single()

  if (!profil?.entreprise_id) {
    return { error: "Aucune entreprise associée", data: null }
  }

  const { data, error } = await supabase
    .from("produits")
    .insert({
      ...formData,
      entreprise_id: profil.entreprise_id,
      created_by: user.user.id,
    })
    .select()
    .single()

  if (error) {
    if (error.code === "23505") {
      return { error: "Ce SKU existe déjà", data: null }
    }
    return { error: error.message, data: null }
  }

  revalidatePath("/inventory")
  revalidatePath("/")
  return { error: null, data }
}

// Mettre à jour un produit
export async function updateProduit(
  id: string,
  updates: Partial<{
    nom: string
    description: string
    sku: string
    code_barre: string
    categorie_id: string
    prix_achat: number
    prix_vente: number
    quantite: number
    quantite_min: number
    unite: string
    emplacement: string
    statut: string
  }>,
) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("produits").update(updates).eq("id", id).select().single()

  if (error) {
    return { error: error.message, data: null }
  }

  revalidatePath("/inventory")
  revalidatePath("/")
  return { error: null, data }
}

// Supprimer un produit
export async function deleteProduit(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("produits").delete().eq("id", id)

  if (error) {
    return { error: error.message, success: false }
  }

  revalidatePath("/inventory")
  revalidatePath("/")
  return { error: null, success: true }
}

// Supprimer plusieurs produits
export async function deleteProduits(ids: string[]) {
  const supabase = await createClient()

  const { error } = await supabase.from("produits").delete().in("id", ids)

  if (error) {
    return { error: error.message, success: false }
  }

  revalidatePath("/inventory")
  revalidatePath("/")
  return { error: null, success: true }
}

// Mettre à jour la quantité (mouvement de stock)
export async function updateStock(id: string, nouvelleQuantite: number, raison?: string) {
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()

  // Récupérer le produit actuel
  const { data: produit } = await supabase.from("produits").select("*").eq("id", id).single()

  if (!produit) {
    return { error: "Produit non trouvé", data: null }
  }

  // Mettre à jour la quantité (le trigger créera le mouvement automatiquement)
  const { data, error } = await supabase
    .from("produits")
    .update({ quantite: nouvelleQuantite })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return { error: error.message, data: null }
  }

  revalidatePath("/inventory")
  revalidatePath("/")
  return { error: null, data }
}

// Récupérer les catégories
export async function getCategories() {
  const supabase = await createClient()

  const { data, error } = await supabase.from("categories").select("*").order("nom")

  if (error) {
    return { error: error.message, data: null }
  }

  return { error: null, data: data as Categorie[] }
}

// Créer une catégorie
export async function createCategorie(formData: { nom: string; description?: string; couleur?: string }) {
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()

  if (!user.user) {
    return { error: "Non authentifié", data: null }
  }

  const { data: profil } = await supabase.from("profils").select("entreprise_id").eq("id", user.user.id).single()

  if (!profil?.entreprise_id) {
    return { error: "Aucune entreprise associée", data: null }
  }

  const { data, error } = await supabase
    .from("categories")
    .insert({
      ...formData,
      entreprise_id: profil.entreprise_id,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message, data: null }
  }

  revalidatePath("/inventory")
  return { error: null, data }
}

// Exporter les produits en CSV
export async function exportProduitsCSV() {
  const supabase = await createClient()

  const { data, error } = await supabase.from("produits").select("*").order("nom")

  if (error || !data) {
    return { error: error?.message || "Erreur export", csv: null }
  }

  const headers = [
    "SKU",
    "Nom",
    "Description",
    "Prix Achat",
    "Prix Vente",
    "Quantité",
    "Unité",
    "Statut",
    "Emplacement",
  ]
  const rows = data.map((p) => [
    p.sku,
    p.nom,
    p.description || "",
    p.prix_achat,
    p.prix_vente,
    p.quantite,
    p.unite,
    p.statut,
    p.emplacement || "",
  ])

  const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n")

  return { error: null, csv }
}

export async function getProducts() {
  const result = await getProduits()
  if (result.error || !result.data) {
    return []
  }

  return result.data.map((p) => ({
    id: p.id,
    nom: p.nom,
    sku: p.sku,
    categorie: p.categorie?.nom || "Non catégorisé",
    prix: p.prix_vente,
    stock: p.quantite,
    stock_minimum: p.quantite_min,
    statut: p.statut,
  }))
}
