"use client"

import type React from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  BarChart3,
  Package,
  Users,
  LogOut,
  X,
  Grid3x3,
  ClipboardList,
  Shield,
  User,
  ShieldCheck,
  Inbox,
  Building2,
  MessageCircle,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import type { Permission } from "@/lib/rbac"

interface SidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface MenuItem {
  icon: React.ReactNode
  label: string
  href: string
  requiredPermission?: Permission
  adminOnly?: boolean
  managerOnly?: boolean
}

export function Sidebar({ open, onOpenChange }: SidebarProps) {
  const { profil, hasPermission, signOut, isAuthenticated, isLoading, isProfilLoading } = useAuth()
  const router = useRouter()

  const isLoadingState = isLoading || isProfilLoading
  const isAdmin = profil?.role === "admin"
  const isManager = profil?.role === "manager"
  const isEmploye = profil?.role === "employe"

  // Menu principal - visible selon les permissions
  const menuItems: MenuItem[] = [
    {
      icon: <Grid3x3 size={20} />,
      label: "Tableau de Bord",
      href: "/",
      requiredPermission: "inventory:view",
    },
    {
      icon: <Package size={20} />,
      label: "Inventaire",
      href: "/inventory",
      requiredPermission: "inventory:view",
    },
    {
      icon: <BarChart3 size={20} />,
      label: "Analytics",
      href: "/analytics",
      requiredPermission: "analytics:view",
    },
    {
      icon: <Users size={20} />,
      label: "Équipe",
      href: "/team",
      requiredPermission: "users:view",
      managerOnly: true,
    },
    {
      icon: <ClipboardList size={20} />,
      label: "Audit",
      href: "/audit-logs",
      requiredPermission: "audit:view",
    },
    {
      icon: <Shield size={20} />,
      label: "Paramètres",
      href: "/settings",
      requiredPermission: "settings:view",
    },
  ]

  const adminItems: MenuItem[] = [
    {
      icon: <Inbox size={20} />,
      label: "Messages",
      href: "/messages",
      adminOnly: true,
    },
    {
      icon: <Building2 size={20} />,
      label: "Entreprises",
      href: "/admin/entreprises",
      adminOnly: true,
    },
    {
      icon: <ShieldCheck size={20} />,
      label: "Panel Admin",
      href: "/admin",
      adminOnly: true,
    },
  ]

  // Pendant le chargement, montrer tous les items de base
  const visibleItems = isLoadingState
    ? menuItems.filter((item) => !item.managerOnly && !item.adminOnly)
    : menuItems.filter((item) => {
        if (item.requiredPermission && !hasPermission(item.requiredPermission)) {
          return false
        }
        if (item.managerOnly && isEmploye) {
          return false
        }
        return true
      })

  const handleSignOut = async () => {
    await signOut()
  }

  const handleGoToProfile = () => {
    router.push("/profile")
    onOpenChange(false)
  }

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      admin: "Admin Invexia",
      manager: "Manager",
      employe: "Employé",
    }
    return labels[role] || role
  }

  const getRoleBadgeClass = (role: string) => {
    const classes: Record<string, string> = {
      admin: "from-red-500/20 to-red-600/20 border-red-500/30",
      manager: "from-purple-500/20 to-purple-600/20 border-purple-500/30",
      employe: "from-blue-500/20 to-blue-600/20 border-blue-500/30",
    }
    return classes[role] || "from-primary/10 to-accent/10 border-primary/20"
  }

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => onOpenChange(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        glass w-64 border-r border-border fixed md:relative h-screen z-50 md:z-auto
        transform transition-all duration-300 md:translate-x-0 flex flex-col
        ${open ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Header */}
        <div className="p-6 border-b border-border/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-primary via-accent to-primary rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-primary-foreground font-bold text-sm">∞</span>
              </div>
              <div>
                <span className="font-bold text-lg block">Invexia</span>
                <span className="text-xs text-muted-foreground">Inventory Platform</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="md:hidden hover:bg-white/10 dark:hover:bg-white/5"
            >
              <X size={20} />
            </Button>
          </div>
        </div>

        {/* User Role Badge */}
        {isLoadingState ? (
          <div className="px-4 py-3 mx-2 mt-2 rounded-lg bg-gradient-to-r from-muted/50 to-muted/30 border border-border/40">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Chargement du profil...</span>
            </div>
          </div>
        ) : profil ? (
          <div className={`px-4 py-3 mx-2 mt-2 rounded-lg bg-gradient-to-r ${getRoleBadgeClass(profil.role)} border`}>
            <div className="text-xs text-muted-foreground">Rôle actif</div>
            <div className="text-sm font-semibold text-foreground">{getRoleLabel(profil.role)}</div>
            {profil.entreprise && (
              <div className="text-xs text-muted-foreground mt-1 truncate">{profil.entreprise.nom}</div>
            )}
          </div>
        ) : null}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 mt-4 overflow-y-auto">
          {visibleItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => onOpenChange(false)}
              className="glass-hover flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300"
            >
              <div className="text-primary">{item.icon}</div>
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          ))}

          {!isLoadingState && isAdmin && (
            <>
              <div className="pt-4 pb-2">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4">
                  Administration Invexia
                </div>
              </div>
              {adminItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => onOpenChange(false)}
                  className="glass-hover flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 bg-red-500/5 border border-red-500/10"
                >
                  <div className="text-red-400">{item.icon}</div>
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              ))}
            </>
          )}

          {!isLoadingState && (isManager || isEmploye) && (
            <>
              <div className="pt-4 pb-2">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4">Support</div>
              </div>
              <Link
                href="/messages"
                onClick={() => onOpenChange(false)}
                className="glass-hover flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300"
              >
                <div className="text-primary">
                  <MessageCircle size={20} />
                </div>
                <span className="font-medium text-sm">Contacter Invexia</span>
              </Link>
            </>
          )}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border/40 space-y-2">
          {isLoadingState ? (
            <div className="flex items-center gap-2 px-4 py-2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Chargement...</span>
            </div>
          ) : profil ? (
            <Button
              variant="ghost"
              onClick={handleGoToProfile}
              className="w-full justify-start px-4 py-2 h-auto hover:bg-muted/50"
            >
              <User size={16} className="mr-2" />
              <div className="text-left">
                <div className="text-xs text-muted-foreground">Connecté</div>
                <div className="text-sm font-medium truncate">
                  {profil.prenom} {profil.nom}
                </div>
              </div>
            </Button>
          ) : null}

          <Button
            variant="ghost"
            onClick={handleSignOut}
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut size={20} className="mr-2" />
            <span className="font-medium text-sm">Déconnexion</span>
          </Button>
        </div>
      </aside>
    </>
  )
}
