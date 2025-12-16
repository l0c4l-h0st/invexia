"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export interface Ticket {
  id: string
  numero: string
  entreprise_id: string | null
  user_id: string | null
  email: string
  nom: string
  sujet: string
  message: string
  categorie: "general" | "technique" | "facturation" | "fonctionnalite" | "bug" | "autre"
  priorite: "basse" | "normale" | "haute" | "urgente"
  statut: "ouvert" | "en_cours" | "en_attente" | "resolu" | "ferme"
  assigne_a: string | null
  created_at: string
  updated_at: string
  ferme_at: string | null
  profil?: {
    prenom: string
    nom: string
  }
  assigne?: {
    prenom: string
    nom: string
  }
  reponses_count?: number
}

export interface ReponseTicket {
  id: string
  ticket_id: string
  user_id: string | null
  message: string
  est_interne: boolean
  created_at: string
  profil?: {
    prenom: string
    nom: string
    role: string
  }
}

export async function getTickets(filters?: {
  statut?: string
  priorite?: string
  categorie?: string
}) {
  const supabase = await createClient()

  let query = supabase
    .from("tickets_support")
    .select(`
      *,
      profil:profils!tickets_support_user_id_fkey(prenom, nom),
      assigne:profils!tickets_support_assigne_a_fkey(prenom, nom)
    `)
    .order("created_at", { ascending: false })

  if (filters?.statut && filters.statut !== "tous") {
    query = query.eq("statut", filters.statut)
  }
  if (filters?.priorite && filters.priorite !== "toutes") {
    query = query.eq("priorite", filters.priorite)
  }
  if (filters?.categorie && filters.categorie !== "toutes") {
    query = query.eq("categorie", filters.categorie)
  }

  const { data, error } = await query

  if (error) {
    console.error("Erreur récupération tickets:", error)
    return []
  }

  return data as Ticket[]
}

export async function getTicketById(id: string) {
  const supabase = await createClient()

  const { data: ticket, error } = await supabase
    .from("tickets_support")
    .select(`
      *,
      profil:profils!tickets_support_user_id_fkey(prenom, nom),
      assigne:profils!tickets_support_assigne_a_fkey(prenom, nom)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Erreur récupération ticket:", error)
    return null
  }

  // Récupérer les réponses
  const { data: reponses } = await supabase
    .from("reponses_ticket")
    .select(`
      *,
      profil:profils(prenom, nom, role)
    `)
    .eq("ticket_id", id)
    .order("created_at", { ascending: true })

  return { ...ticket, reponses: reponses || [] } as Ticket & { reponses: ReponseTicket[] }
}

export async function createTicket(data: {
  email: string
  nom: string
  sujet: string
  message: string
  categorie?: string
  priorite?: string
}) {
  const supabase = await createClient()

  // Vérifier si l'utilisateur est connecté
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let entrepriseId = null
  if (user) {
    const { data: profil } = await supabase.from("profils").select("entreprise_id").eq("id", user.id).single()
    entrepriseId = profil?.entreprise_id
  }

  const { data: ticket, error } = await supabase
    .from("tickets_support")
    .insert({
      email: data.email,
      nom: data.nom,
      sujet: data.sujet,
      message: data.message,
      categorie: data.categorie || "general",
      priorite: data.priorite || "normale",
      user_id: user?.id || null,
      entreprise_id: entrepriseId,
    })
    .select()
    .single()

  if (error) {
    console.error("Erreur création ticket:", error)
    return { success: false, error: error.message }
  }

  return { success: true, ticket }
}

export async function updateTicketStatus(id: string, statut: string, assigneA?: string) {
  const supabase = await createClient()

  const updateData: Record<string, string> = { statut }
  if (assigneA !== undefined) {
    updateData.assigne_a = assigneA
  }

  const { error } = await supabase.from("tickets_support").update(updateData).eq("id", id)

  if (error) {
    console.error("Erreur mise à jour ticket:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/admin/support")
  return { success: true }
}

export async function addReponse(ticketId: string, message: string, estInterne = false) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: "Non autorisé" }
  }

  const { error } = await supabase.from("reponses_ticket").insert({
    ticket_id: ticketId,
    user_id: user.id,
    message,
    est_interne: estInterne,
  })

  if (error) {
    console.error("Erreur ajout réponse:", error)
    return { success: false, error: error.message }
  }

  // Mettre à jour le statut du ticket si nécessaire
  await supabase.from("tickets_support").update({ statut: "en_cours" }).eq("id", ticketId).eq("statut", "ouvert")

  revalidatePath(`/admin/support/${ticketId}`)
  return { success: true }
}

export async function getTicketStats() {
  const supabase = await createClient()

  const { data: tickets } = await supabase.from("tickets_support").select("statut, priorite, created_at")

  if (!tickets)
    return {
      total: 0,
      ouverts: 0,
      enCours: 0,
      resolus: 0,
      urgents: 0,
    }

  return {
    total: tickets.length,
    ouverts: tickets.filter((t) => t.statut === "ouvert").length,
    enCours: tickets.filter((t) => t.statut === "en_cours").length,
    resolus: tickets.filter((t) => t.statut === "resolu" || t.statut === "ferme").length,
    urgents: tickets.filter((t) => t.priorite === "urgente" && t.statut !== "ferme").length,
  }
}
