"use server"

import { createClient } from "@/lib/supabase/server"
import { createClient as createAdminClient } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"
import type { Role } from "@/lib/rbac"

export interface TeamMember {
  id: string
  entreprise_id: string | null
  prenom: string
  nom: string
  avatar_url: string | null
  telephone: string | null
  poste: string | null
  role: Role
  statut: "actif" | "inactif" | "suspendu"
  derniere_connexion: string | null
  created_at: string
  email?: string
  entreprise_nom?: string
}

function serializeTeamMember(data: any): TeamMember {
  if (data.new || data.old) {
    console.log("[v0] OBJET AVEC new/old:", JSON.stringify(data, null, 2))
  }

  return {
    id: String(data.id || ""),
    entreprise_id: data.entreprise_id ? String(data.entreprise_id) : null,
    prenom: String(data.prenom || ""),
    nom: String(data.nom || ""),
    avatar_url: data.avatar_url ? String(data.avatar_url) : null,
    telephone: data.telephone ? String(data.telephone) : null,
    poste: data.poste ? String(data.poste) : null,
    role: data.role || "employe",
    statut: data.statut || "actif",
    derniere_connexion: data.derniere_connexion ? String(data.derniere_connexion) : null,
    created_at:
      typeof data.created_at === "string"
        ? data.created_at
        : data.created_at instanceof Date
          ? data.created_at.toISOString()
          : String(data.created_at || new Date().toISOString()),
    email: data.email ? String(data.email) : undefined,
  }
}

function serializeError(error: any): string {
  if (typeof error === "string") {
    return error
  }
  if (error?.message) {
    return String(error.message)
  }
  if (error?.code) {
    return `Erreur ${error.code}: ${error.hint || "Une erreur est survenue"}`
  }
  return "Une erreur est survenue"
}

// Récupérer les membres de l'équipe
export async function getTeamMembers() {
  console.log("[v0] getTeamMembers appelé")
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()

  console.log("[v0] User:", user?.user?.id)

  if (!user.user) {
    return { error: "Non authentifié", data: null }
  }

  // Récupérer l'entreprise de l'utilisateur
  const { data: profil, error: profilError } = await supabase
    .from("profils")
    .select("entreprise_id, role")
    .eq("id", user.user.id)
    .maybeSingle()

  console.log("[v0] Profil:", { profil, profilError })

  if (profilError) {
    return { error: serializeError(profilError), data: null }
  }

  if (!profil?.entreprise_id && profil?.role !== "admin") {
    return { error: "Aucune entreprise associée", data: null }
  }

  // Construire la requête selon le rôle avec jointure entreprise
  let query = supabase.from("profils").select("*, entreprises(nom)").order("created_at", { ascending: false })

  if (profil?.role === "admin") {
    console.log("[v0] Mode admin - tous les utilisateurs")
    // Admin Invexia voit tous les utilisateurs
  } else {
    console.log("[v0] Mode manager/employe - entreprise", profil.entreprise_id)
    query = query.eq("entreprise_id", profil.entreprise_id)
  }

  const { data, error } = await query

  console.log("[v0] Résultat query profils:", { count: data?.length, error })

  if (error) {
    return { error: serializeError(error), data: null }
  }

  let serializedData = (data || []).map((item: any) => {
    const member = serializeTeamMember(item)
    return {
      ...member,
      entreprise_nom: item.entreprises?.nom || null,
    }
  })

  if (profil?.role === "admin" || profil?.role === "manager") {
    // Créer le client admin pour récupérer les emails
    const supabaseUrl = process.env.SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (supabaseUrl && serviceRoleKey) {
      const adminClient = createAdminClient(supabaseUrl, serviceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })

      const { data: authUsers } = await adminClient.auth.admin.listUsers()

      if (authUsers?.users) {
        serializedData = serializedData.map((member) => {
          const authUser = authUsers.users.find((u) => u.id === member.id)
          return {
            ...member,
            email: authUser?.email || undefined,
          }
        })
      }
    }
  }

  return { data: serializedData, error: null }
}

// Récupérer un membre par ID
export async function getTeamMemberById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("profils").select("*").eq("id", id).single()

  if (error) {
    return { error: error.message, data: null }
  }

  return { error: null, data: data as TeamMember }
}

// Mettre à jour un membre de l'équipe
export async function updateTeamMember(
  id: string,
  updates: Partial<{
    prenom: string
    nom: string
    telephone: string
    poste: string
    role: Role
    statut: "actif" | "inactif" | "suspendu"
  }>,
) {
  const supabase = await createClient()
  const { data: currentUser } = await supabase.auth.getUser()

  if (!currentUser.user) {
    return { error: "Non authentifié", data: null }
  }

  // Vérifier les permissions
  const { data: currentProfil } = await supabase.from("profils").select("role").eq("id", currentUser.user.id).single()

  if (updates.role && currentProfil?.role !== "admin") {
    return { error: "Seul un admin Invexia peut changer les rôles", data: null }
  }

  const { data, error } = await supabase.from("profils").update(updates).eq("id", id).select().single()

  if (error) {
    return { error: error.message, data: null }
  }

  revalidatePath("/team")
  return { error: null, data }
}

// Supprimer un membre (désactiver)
export async function deleteTeamMember(id: string) {
  const supabase = await createClient()
  const { data: currentUser } = await supabase.auth.getUser()

  if (!currentUser.user) {
    return { error: "Non authentifié", success: false }
  }

  // Ne pas permettre de se supprimer soi-même
  if (currentUser.user.id === id) {
    return { error: "Vous ne pouvez pas supprimer votre propre compte", success: false }
  }

  // Désactiver plutôt que supprimer
  const { error } = await supabase.from("profils").update({ statut: "suspendu" }).eq("id", id)

  if (error) {
    return { error: error.message, success: false }
  }

  revalidatePath("/team")
  return { error: null, success: true }
}

// Changer le statut d'un membre
export async function changeTeamMemberStatus(id: string, statut: "actif" | "inactif" | "suspendu") {
  const supabase = await createClient()

  const { data, error } = await supabase.from("profils").update({ statut }).eq("id", id).select().single()

  if (error) {
    return { error: error.message, data: null }
  }

  revalidatePath("/team")
  return { error: null, data }
}

// Inviter un nouveau membre (créer une invitation)
export async function inviteTeamMember(email: string, role: Role, prenom: string, nom: string) {
  const supabase = await createClient()
  const { data: currentUser } = await supabase.auth.getUser()

  if (!currentUser.user) {
    return { error: "Non authentifié", success: false }
  }

  // Récupérer l'entreprise
  const { data: profil } = await supabase
    .from("profils")
    .select("entreprise_id, role")
    .eq("id", currentUser.user.id)
    .single()

  if (!profil?.entreprise_id) {
    return { error: "Aucune entreprise associée", success: false }
  }

  if (!["admin", "manager"].includes(profil.role)) {
    return { error: "Permission insuffisante - seul admin ou manager peut inviter", success: false }
  }

  return { error: null, success: true, message: `Invitation envoyée à ${email}` }
}

export async function createEmployee(data: {
  email: string
  password: string
  prenom: string
  nom: string
  telephone?: string
  poste?: string
}) {
  const supabase = await createClient()
  const { data: currentUser } = await supabase.auth.getUser()

  if (!currentUser.user) {
    return { error: "Non authentifié", success: false }
  }

  // Récupérer le profil du créateur
  const { data: creatorProfil } = await supabase
    .from("profils")
    .select("entreprise_id, role")
    .eq("id", currentUser.user.id)
    .single()

  if (!creatorProfil?.entreprise_id) {
    return { error: "Aucune entreprise associée", success: false }
  }

  if (!["admin", "manager"].includes(creatorProfil.role)) {
    return { error: "Permission insuffisante", success: false }
  }

  // Créer le client admin avec service_role
  const supabaseUrl = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    return { error: "Configuration serveur manquante", success: false }
  }

  const adminClient = createAdminClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  const { data: existingUsers } = await adminClient.auth.admin.listUsers()
  const userExists = existingUsers?.users.find((u) => u.email === data.email)

  if (userExists) {
    return { error: "Cet email existe déjà", success: false }
  }

  // Créer l'utilisateur avec le client admin
  const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
    email: data.email,
    password: data.password,
    email_confirm: true,
    user_metadata: {
      prenom: data.prenom,
      nom: data.nom,
      role: "employe",
      entreprise_id: creatorProfil.entreprise_id,
    },
  })

  if (createError) {
    return { error: createError.message, success: false }
  }

  if (!newUser.user) {
    return { error: "Erreur création utilisateur", success: false }
  }

  const { data: existingProfil } = await adminClient
    .from("profils")
    .select("id")
    .eq("id", newUser.user.id)
    .maybeSingle()

  if (existingProfil) {
    // Profil existe déjà, le mettre à jour au lieu de l'insérer
    const { error: updateError } = await adminClient
      .from("profils")
      .update({
        entreprise_id: creatorProfil.entreprise_id,
        prenom: data.prenom,
        nom: data.nom,
        telephone: data.telephone || null,
        poste: data.poste || null,
        role: "employe",
        statut: "actif",
      })
      .eq("id", newUser.user.id)

    if (updateError) {
      return { error: updateError.message, success: false }
    }
  } else {
    // Créer le profil employé
    const { error: profilError } = await adminClient.from("profils").insert({
      id: newUser.user.id,
      entreprise_id: creatorProfil.entreprise_id,
      prenom: data.prenom,
      nom: data.nom,
      telephone: data.telephone || null,
      poste: data.poste || null,
      role: "employe",
      statut: "actif",
    })

    if (profilError) {
      // Rollback : supprimer l'utilisateur créé
      await adminClient.auth.admin.deleteUser(newUser.user.id)
      return { error: profilError.message, success: false }
    }
  }

  revalidatePath("/team")
  return {
    error: null,
    success: true,
    credentials: {
      email: data.email,
      password: data.password,
    },
  }
}

export async function changeUserEntreprise(userId: string, newEntrepriseId: string) {
  const supabase = await createClient()
  const { data: currentUser } = await supabase.auth.getUser()

  if (!currentUser.user) {
    return { error: "Non authentifié", success: false }
  }

  // Seul un admin peut changer l'entreprise d'un utilisateur
  const { data: currentProfil } = await supabase
    .from("profils")
    .select("role")
    .eq("id", currentUser.user.id)
    .maybeSingle()

  if (currentProfil?.role !== "admin") {
    return { error: "Permission insuffisante - seul un admin peut changer l'entreprise", success: false }
  }

  // Mettre à jour l'entreprise
  const { error } = await supabase.from("profils").update({ entreprise_id: newEntrepriseId }).eq("id", userId)

  if (error) {
    return { error: error.message, success: false }
  }

  revalidatePath("/team")
  return { error: null, success: true }
}
