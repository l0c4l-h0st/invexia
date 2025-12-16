"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export interface Conversation {
  id: string
  entreprise_id: string
  titre: string
  statut: "ouvert" | "ferme" | "archive"
  derniere_activite: string
  created_by: string | null
  created_at: string
  entreprise?: {
    nom: string
  }
  messages_count?: number
  unread_count?: number
  last_message?: Message
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string | null
  sender_nom: string
  sender_role: string
  contenu: string
  lu: boolean
  lu_at: string | null
  created_at: string
}

// Créer une nouvelle conversation
export async function createConversation(titre: string, premierMessage: string) {
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()

  if (!user.user) {
    return { error: "Non authentifié", data: null }
  }

  // Récupérer le profil
  const { data: profil } = await supabase
    .from("profils")
    .select("entreprise_id, prenom, nom, role")
    .eq("id", user.user.id)
    .single()

  if (!profil?.entreprise_id) {
    return { error: "Aucune entreprise associée", data: null }
  }

  // Créer la conversation
  const { data: conversation, error: convError } = await supabase
    .from("conversations")
    .insert({
      entreprise_id: profil.entreprise_id,
      titre,
      created_by: user.user.id,
    })
    .select()
    .single()

  if (convError) {
    return { error: convError.message, data: null }
  }

  // Ajouter le premier message
  const { error: msgError } = await supabase.from("messages").insert({
    conversation_id: conversation.id,
    sender_id: user.user.id,
    sender_nom: `${profil.prenom} ${profil.nom}`,
    sender_role: profil.role,
    contenu: premierMessage,
  })

  if (msgError) {
    return { error: msgError.message, data: null }
  }

  revalidatePath("/messages")
  return { error: null, data: conversation }
}

// Récupérer les conversations
export async function getConversations() {
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()

  if (!user.user) {
    return { error: "Non authentifié", data: null }
  }

  const { data: profil } = await supabase.from("profils").select("entreprise_id, role").eq("id", user.user.id).single()

  let query = supabase
    .from("conversations")
    .select(`
      *,
      entreprise:entreprises(nom)
    `)
    .order("derniere_activite", { ascending: false })

  // Si pas admin, filtrer par entreprise
  if (profil?.role !== "super_admin" && profil?.role !== "admin") {
    query = query.eq("entreprise_id", profil?.entreprise_id)
  }

  const { data, error } = await query

  if (error) {
    return { error: error.message, data: null }
  }

  // Récupérer le dernier message et compteurs pour chaque conversation
  const conversationsWithDetails = await Promise.all(
    (data || []).map(async (conv) => {
      const { data: messages, count } = await supabase
        .from("messages")
        .select("*", { count: "exact" })
        .eq("conversation_id", conv.id)
        .order("created_at", { ascending: false })
        .limit(1)

      const { count: unreadCount } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("conversation_id", conv.id)
        .eq("lu", false)
        .neq("sender_id", user.user!.id)

      return {
        ...conv,
        messages_count: count || 0,
        unread_count: unreadCount || 0,
        last_message: messages?.[0] || null,
      }
    }),
  )

  return { error: null, data: conversationsWithDetails as Conversation[] }
}

// Récupérer les messages d'une conversation
export async function getMessages(conversationId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })

  if (error) {
    return { error: error.message, data: null }
  }

  return { error: null, data: data as Message[] }
}

// Envoyer un message
export async function sendMessage(conversationId: string, contenu: string) {
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()

  if (!user.user) {
    return { error: "Non authentifié", data: null }
  }

  const { data: profil } = await supabase.from("profils").select("prenom, nom, role").eq("id", user.user.id).single()

  const { data: message, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      sender_id: user.user.id,
      sender_nom: `${profil?.prenom} ${profil?.nom}`,
      sender_role: profil?.role || "employe",
      contenu,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message, data: null }
  }

  // Mettre à jour la dernière activité
  await supabase.from("conversations").update({ derniere_activite: new Date().toISOString() }).eq("id", conversationId)

  revalidatePath(`/messages/${conversationId}`)
  return { error: null, data: message }
}

// Marquer les messages comme lus
export async function markMessagesAsRead(conversationId: string) {
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()

  if (!user.user) return

  await supabase
    .from("messages")
    .update({ lu: true, lu_at: new Date().toISOString() })
    .eq("conversation_id", conversationId)
    .neq("sender_id", user.user.id)
    .eq("lu", false)
}
