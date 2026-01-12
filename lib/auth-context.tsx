"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react"
import { createBrowserClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"
import type { Role, Permission } from "./rbac"
import { hasPermission, hasAllPermissions, hasAnyPermission, canManageRole } from "./rbac"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { useRouter, usePathname } from "next/navigation"

// Types
export interface Entreprise {
  id: string
  nom: string
  slug: string
  logo_url?: string
  plan: "free" | "pro" | "enterprise"
  onboarding_complete?: boolean
}

export interface Profil {
  id: string
  entreprise_id: string | null
  prenom: string
  nom: string
  avatar_url?: string
  telephone?: string
  poste?: string
  role: Role
  statut: "actif" | "inactif" | "suspendu"
  derniere_connexion?: string
  created_at: string
}

interface AuthContextType {
  user: SupabaseUser | null
  profil: Profil | null
  entreprise: Entreprise | null
  isLoading: boolean
  isProfilLoading: boolean
  isAuthenticated: boolean
  supabase: SupabaseClient | null
  hasPermission: (permission: Permission) => boolean
  hasAllPermissions: (permissions: Permission[]) => boolean
  hasAnyPermission: (permissions: Permission[]) => boolean
  canManageRole: (targetRole: Role) => boolean
  signOut: () => Promise<void>
  refreshProfil: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

let globalSupabaseClient: SupabaseClient | null = null

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [profil, setProfil] = useState<Profil | null>(null)
  const [entreprise, setEntreprise] = useState<Entreprise | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isProfilLoading, setIsProfilLoading] = useState(false)
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)
  const [configError, setConfigError] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const serializeSupabaseObject = (obj: any): any => {
    if (obj === null || obj === undefined) return obj
    if (typeof obj !== "object") return obj
    if (obj instanceof Date) return obj.toISOString()
    if (Array.isArray(obj)) return obj.map(serializeSupabaseObject)

    // Create a clean object with only enumerable properties
    const cleaned: any = {}
    for (const key of Object.keys(obj)) {
      if (!["new", "old", "_id", "__v"].includes(key)) {
        cleaned[key] = serializeSupabaseObject(obj[key])
      }
    }
    return cleaned
  }

  const loadProfil = useCallback(async (userId: string, client: any) => {
    try {
      setIsProfilLoading(true)

      const { data: profilData, error } = await client.from("profils").select("*").eq("id", userId).maybeSingle()

      if (error || !profilData) {
        setIsProfilLoading(false)
        return false
      }

      const cleanProfil = serializeSupabaseObject(profilData)
      setProfil(cleanProfil as Profil)

      if (cleanProfil.entreprise_id) {
        const { data: entrepriseData } = await client
          .from("entreprises")
          .select("*")
          .eq("id", cleanProfil.entreprise_id)
          .maybeSingle()

        if (entrepriseData) {
          const cleanEntreprise = serializeSupabaseObject(entrepriseData)
          setEntreprise(cleanEntreprise as Entreprise)
        }
      }

      client
        .from("profils")
        .update({ derniere_connexion: new Date().toISOString() })
        .eq("id", userId)
        .catch(() => {})

      setIsProfilLoading(false)
      return true
    } catch (err) {
      setIsProfilLoading(false)
      return false
    }
  }, [])

  const refreshProfil = useCallback(async () => {
    if (user && supabase) {
      await loadProfil(user.id, supabase)
    }
  }, [user, supabase, loadProfil])

  const signOut = useCallback(async () => {
    try {
      if (supabase) {
        await supabase.auth.signOut()
      }
    } catch (err) {
      // Ignorer les erreurs silencieusement
    } finally {
      setUser(null)
      setProfil(null)
      setEntreprise(null)
      globalSupabaseClient = null
      window.location.href = "/auth/login"
    }
  }, [supabase])

  useEffect(() => {
    const initSupabase = async () => {
      if (globalSupabaseClient) {
        setSupabase(globalSupabaseClient)
        return
      }

      try {
        const windowConfig = (window as any).__SUPABASE_CONFIG__

        if (!windowConfig?.url || !windowConfig?.anonKey) {
          setConfigError(true)
          setIsLoading(false)
          return
        }

        const client = createBrowserClient(windowConfig.url, windowConfig.anonKey)
        globalSupabaseClient = client
        setSupabase(client)
      } catch (err) {
        setConfigError(true)
        setIsLoading(false)
      }
    }

    initSupabase()
  }, [])

  useEffect(() => {
    if (!supabase) return

    let subscription: { unsubscribe: () => void } | null = null
    let mounted = true

    const initAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user && mounted) {
          setUser(session.user)
          await loadProfil(session.user.id, supabase)
        }

        const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (!mounted) return

          if (event === "SIGNED_IN" && session?.user) {
            setUser(session.user)
            await loadProfil(session.user.id, supabase)
          } else if (event === "SIGNED_OUT") {
            setUser(null)
            setProfil(null)
            setEntreprise(null)
          } else if (event === "TOKEN_REFRESHED" && session?.user) {
            setUser(session.user)
          }
        })

        subscription = data.subscription
      } catch (err) {
        // Erreur silencieuse
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    initAuth()

    return () => {
      mounted = false
      subscription?.unsubscribe()
    }
  }, [supabase, loadProfil])

  useEffect(() => {
    if (isLoading) return

    const publicPaths = [
      "/auth/login",
      "/auth/inscription",
      "/auth/inscription-succes",
      "/auth/erreur",
      "/auth/callback",
      "/auth/reset-password",
      "/auth/update-password",
      "/conditions",
      "/confidentialite",
    ]
    const isPublicPath = publicPaths.some((path) => pathname?.startsWith(path))

    if (!user && !isPublicPath && !configError) {
      window.location.href = `/auth/login?redirect=${encodeURIComponent(pathname || "/")}`
    }
  }, [user, isLoading, pathname, configError])

  const contextValue: AuthContextType = {
    user,
    profil,
    entreprise,
    isLoading,
    isProfilLoading,
    isAuthenticated: !!user,
    supabase,
    hasPermission: (permission) => {
      if (isProfilLoading) return true // Autoriser pendant le chargement
      return profil ? hasPermission(profil.role, permission) : false
    },
    hasAllPermissions: (permissions) => {
      if (isProfilLoading) return true
      return profil ? hasAllPermissions(profil.role, permissions) : false
    },
    hasAnyPermission: (permissions) => {
      if (isProfilLoading) return true
      return profil ? hasAnyPermission(profil.role, permissions) : false
    },
    canManageRole: (targetRole) => (profil ? canManageRole(profil.role, targetRole) : false),
    signOut,
    refreshProfil,
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider")
  }
  return context
}

export function ProtectedComponent({
  permission,
  children,
  fallback = null,
}: {
  permission: Permission | Permission[]
  children: ReactNode
  fallback?: ReactNode
}) {
  const { hasPermission: checkPerm, hasAnyPermission, isProfilLoading, isLoading } = useAuth()

  if (isLoading || isProfilLoading) {
    return <>{children}</>
  }

  const hasAccess = Array.isArray(permission) ? hasAnyPermission(permission) : checkPerm(permission)

  return hasAccess ? <>{children}</> : <>{fallback}</>
}

export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  requiredPermission?: Permission | Permission[],
) {
  return function ProtectedPage(props: P) {
    const { isLoading, isAuthenticated, hasPermission, hasAnyPermission } = useAuth()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        window.location.href = `/auth/login?redirect=${encodeURIComponent(pathname || "/")}`
      }
    }, [isLoading, isAuthenticated, pathname])

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )
    }

    if (!isAuthenticated) {
      return null
    }

    if (requiredPermission) {
      const hasAccess = Array.isArray(requiredPermission)
        ? hasAnyPermission(requiredPermission)
        : hasPermission(requiredPermission)

      if (!hasAccess) {
        return (
          <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold mb-2">Accès refusé</h1>
            <p className="text-muted-foreground">Vous n'avez pas les permissions nécessaires.</p>
          </div>
        )
      }
    }

    return <Component {...props} />
  }
}
