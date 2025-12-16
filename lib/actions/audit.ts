"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export interface AuditLog {
  id: string
  timestamp: string
  user_id: string
  user_name: string
  action: string
  resource: string
  details: string
  severity: "normal" | "warning" | "high"
  ip_address: string
  user_agent: string
}

export async function getAuditLogs(filter = "all"): Promise<AuditLog[]> {
  const supabase = await createClient()

  let query = supabase
    .from("audit_logs")
    .select(`
      *,
      profil:profils(prenom, nom)
    `)
    .order("created_at", { ascending: false })
    .limit(100)

  if (filter !== "all") {
    query = query.eq("action", filter)
  }

  const { data, error } = await query

  if (error) {
    console.error("Erreur chargement audit logs:", error)
    return []
  }

  return (
    data?.map((log) => ({
      id: log.id,
      timestamp: log.created_at,
      user_id: log.user_id,
      user_name: log.profil ? `${log.profil.prenom} ${log.profil.nom}` : "Système",
      action: log.action,
      resource: log.ressource,
      details: log.details,
      severity: log.severite || "normal",
      ip_address: log.ip_address || "N/A",
      user_agent: log.user_agent || "N/A",
    })) || []
  )
}

export async function createAuditLog(data: {
  action: string
  ressource: string
  details: string
  severite?: "normal" | "warning" | "high"
}) {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()

  const { error } = await supabase.from("audit_logs").insert({
    user_id: userData.user?.id,
    action: data.action,
    ressource: data.ressource,
    details: data.details,
    severite: data.severite || "normal",
    entreprise_id: null, // À récupérer du profil si nécessaire
  })

  if (error) {
    console.error("Erreur création audit log:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/audit-logs")
  return { success: true }
}

export async function deleteAuditLog(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("audit_logs").delete().eq("id", id)

  if (error) {
    console.error("Erreur suppression audit log:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/audit-logs")
  return { success: true }
}

export async function getAuditStats() {
  const supabase = await createClient()

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const { data: totalLogs, count: totalCount } = await supabase
    .from("audit_logs")
    .select("*", { count: "exact", head: true })

  const { data: todayLogs, count: todayCount } = await supabase
    .from("audit_logs")
    .select("*", { count: "exact", head: true })
    .gte("created_at", today.toISOString())

  const { data: highSeverity, count: highCount } = await supabase
    .from("audit_logs")
    .select("*", { count: "exact", head: true })
    .eq("severite", "high")

  const { data: activeUsers } = await supabase
    .from("audit_logs")
    .select("user_id")
    .gte("created_at", today.toISOString())

  const uniqueUsers = new Set(activeUsers?.map((l) => l.user_id)).size

  return {
    total: totalCount || 0,
    today: todayCount || 0,
    critical: highCount || 0,
    activeUsers: uniqueUsers,
  }
}
