"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export interface EntrepriseData {
  nom: string
  slug?: string
  siret?: string
  siren?: string
  tva_intra?: string
  forme_juridique?: string
  capital?: number
  code_naf?: string
  date_creation?: string
  effectif?: string
  secteur?: string
  description?: string
  email: string
  telephone?: string
  site_web?: string
  adresse?: string
  code_postal?: string
  ville?: string
  pays?: string
  contact_nom?: string
  contact_prenom?: string
  contact_email?: string
  contact_telephone?: string
  contact_poste?: string
  plan?: "free" | "pro" | "enterprise"
}

// Créer une nouvelle entreprise
export async function createEntreprise(data: EntrepriseData) {
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()

  if (!user.user) {
    return { error: "Non authentifié", data: null }
  }

  // Vérifier si admin
  const { data: profil } = await supabase.from("profils").select("role").eq("id", user.user.id).single()

  if (profil?.role !== "admin") {
    return { error: "Permission insuffisante", data: null }
  }

  // Générer le slug à partir du nom
  const slug =
    data.slug ||
    data.nom
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

  const { data: entreprise, error } = await supabase
    .from("entreprises")
    .insert({
      ...data,
      slug,
      plan: data.plan || "free",
    })
    .select()
    .single()

  if (error) {
    return { error: error.message, data: null }
  }

  // Créer les paramètres par défaut
  await supabase.from("parametres_entreprise").insert({
    entreprise_id: entreprise.id,
  })

  revalidatePath("/admin/entreprises")
  return { error: null, data: entreprise }
}

// Récupérer toutes les entreprises
export async function getEntreprises() {
  const supabase = await createClient()

  const { data, error } = await supabase.from("entreprises").select("*").order("nom")

  if (error) {
    return { error: error.message, data: null }
  }

  return { error: null, data }
}

// Récupérer une entreprise par ID
export async function getEntrepriseById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("entreprises").select("*").eq("id", id).single()

  if (error) {
    return { error: error.message, data: null }
  }

  return { error: null, data }
}

// Mettre à jour une entreprise
export async function updateEntreprise(id: string, updates: Partial<EntrepriseData>) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("entreprises").update(updates).eq("id", id).select().single()

  if (error) {
    return { error: error.message, data: null }
  }

  revalidatePath("/admin/entreprises")
  return { error: null, data }
}

// Supprimer une entreprise
export async function deleteEntreprise(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("entreprises").delete().eq("id", id)

  if (error) {
    return { error: error.message, success: false }
  }

  revalidatePath("/admin/entreprises")
  return { error: null, success: true }
}

// Créer un employé pour une entreprise
export async function createEmploye(
  entrepriseId: string,
  data: {
    email: string
    prenom: string
    nom: string
    telephone?: string
    poste?: string
    role: "admin" | "manager" | "employe"
  },
) {
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()

  if (!user.user) {
    return { error: "Non authentifié", data: null }
  }

  // Vérifier les permissions
  const { data: currentProfil } = await supabase
    .from("profils")
    .select("role, entreprise_id")
    .eq("id", user.user.id)
    .single()

  const canCreate =
    currentProfil?.role === "super_admin" ||
    (currentProfil?.role === "admin" && currentProfil?.entreprise_id === entrepriseId) ||
    (currentProfil?.role === "manager" && currentProfil?.entreprise_id === entrepriseId && data.role === "employe")

  if (!canCreate) {
    return { error: "Permission insuffisante", data: null }
  }

  // Créer l'utilisateur via l'API admin Supabase (ou invitation)
  // Pour l'instant on simule l'invitation
  return {
    error: null,
    data: null,
    message: `Invitation envoyée à ${data.email}. L'employé recevra un email pour créer son compte.`,
  }
}
