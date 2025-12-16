"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export interface OnboardingData {
  // Informations entreprise de base
  nom: string
  email: string
  telephone: string
  site_web?: string

  // Informations juridiques
  siret: string
  siren: string
  numero_tva?: string
  forme_juridique: string
  capital: number
  date_creation: string
  code_naf?: string

  // Adresse siège social
  adresse_siege: string
  ville: string
  code_postal: string
  pays: string

  // Responsable légal
  responsable_nom: string
  responsable_fonction: string
}

export async function completeOnboarding(data: OnboardingData) {
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()

  if (!user.user) {
    return { error: "Non authentifié", success: false }
  }

  // Récupérer le profil
  const { data: profil } = await supabase.from("profils").select("entreprise_id, role").eq("id", user.user.id).single()

  if (!profil?.entreprise_id) {
    return { error: "Aucune entreprise associée", success: false }
  }

  // Seul l'admin peut compléter l'onboarding
  if (profil.role !== "admin" && profil.role !== "super_admin") {
    return { error: "Permission insuffisante", success: false }
  }

  // Mettre à jour l'entreprise
  const { error } = await supabase
    .from("entreprises")
    .update({
      nom: data.nom,
      email: data.email,
      telephone: data.telephone,
      site_web: data.site_web || null,
      siret: data.siret,
      siren: data.siren,
      numero_tva: data.numero_tva || null,
      forme_juridique: data.forme_juridique,
      capital: data.capital,
      date_creation: data.date_creation,
      code_naf: data.code_naf || null,
      adresse_siege: data.adresse_siege,
      ville: data.ville,
      code_postal: data.code_postal,
      pays: data.pays,
      responsable_nom: data.responsable_nom,
      responsable_fonction: data.responsable_fonction,
      onboarding_complete: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", profil.entreprise_id)

  if (error) {
    return { error: error.message, success: false }
  }

  revalidatePath("/")
  return { error: null, success: true }
}

export async function checkOnboardingStatus() {
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()

  if (!user.user) {
    return { needsOnboarding: false, entreprise: null }
  }

  const { data: profil } = await supabase
    .from("profils")
    .select("entreprise_id, role, entreprises(onboarding_complete)")
    .eq("id", user.user.id)
    .single()

  if (!profil?.entreprise_id) {
    return { needsOnboarding: false, entreprise: null }
  }

  const entrepriseData = profil.entreprises as any

  // Seul l'admin doit faire l'onboarding
  if (profil.role === "admin" && !entrepriseData?.onboarding_complete) {
    return { needsOnboarding: true, entreprise: entrepriseData }
  }

  return { needsOnboarding: false, entreprise: entrepriseData }
}
