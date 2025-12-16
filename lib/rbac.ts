// =====================================================
// INVEXIA - Système RBAC
// Hiérarchie: Admin -> Manager -> Employé
// =====================================================

export type Permission =
  // Inventaire
  | "inventory:view"
  | "inventory:create"
  | "inventory:edit"
  | "inventory:delete"
  | "inventory:export"
  | "inventory:import"
  // Catégories
  | "categories:view"
  | "categories:create"
  | "categories:edit"
  | "categories:delete"
  // Utilisateurs
  | "users:view"
  | "users:create"
  | "users:edit"
  | "users:delete"
  | "users:manage_roles"
  | "users:invite"
  // Entreprise
  | "entreprise:view"
  | "entreprise:edit"
  | "entreprise:manage"
  // Fournisseurs
  | "fournisseurs:view"
  | "fournisseurs:create"
  | "fournisseurs:edit"
  | "fournisseurs:delete"
  // Commandes
  | "commandes:view"
  | "commandes:create"
  | "commandes:edit"
  | "commandes:delete"
  | "commandes:approve"
  // Analytics
  | "analytics:view"
  | "analytics:export"
  | "analytics:advanced"
  // Audit
  | "audit:view"
  | "audit:export"
  | "audit:delete"
  // Paramètres
  | "settings:view"
  | "settings:edit"
  | "settings:billing"
  | "settings:integrations"
  // Notifications
  | "notifications:view"
  | "notifications:manage"

// Rôles hiérarchiques
export type Role = "admin" | "manager" | "employe"

// Permissions par rôle
export const rolePermissions: Record<Role, Permission[]> = {
  // Admin: Accès total à toutes les entreprises (Invexia)
  admin: [
    "inventory:view",
    "inventory:create",
    "inventory:edit",
    "inventory:delete",
    "inventory:export",
    "inventory:import",
    "categories:view",
    "categories:create",
    "categories:edit",
    "categories:delete",
    "users:view",
    "users:create",
    "users:edit",
    "users:delete",
    "users:manage_roles",
    "users:invite",
    "entreprise:view",
    "entreprise:edit",
    "entreprise:manage",
    "fournisseurs:view",
    "fournisseurs:create",
    "fournisseurs:edit",
    "fournisseurs:delete",
    "commandes:view",
    "commandes:create",
    "commandes:edit",
    "commandes:delete",
    "commandes:approve",
    "analytics:view",
    "analytics:export",
    "analytics:advanced",
    "audit:view",
    "audit:export",
    "audit:delete",
    "settings:view",
    "settings:edit",
    "settings:billing",
    "settings:integrations",
    "notifications:view",
    "notifications:manage",
  ],

  // Manager: Propriétaire d'entreprise, gère son entreprise et employés
  manager: [
    "inventory:view",
    "inventory:create",
    "inventory:edit",
    "inventory:delete",
    "inventory:export",
    "categories:view",
    "categories:create",
    "categories:edit",
    "categories:delete",
    "users:view",
    "users:create",
    "users:edit",
    "users:delete",
    "users:invite",
    "entreprise:view",
    "entreprise:edit",
    "fournisseurs:view",
    "fournisseurs:create",
    "fournisseurs:edit",
    "fournisseurs:delete",
    "commandes:view",
    "commandes:create",
    "commandes:edit",
    "commandes:approve",
    "analytics:view",
    "analytics:export",
    "audit:view",
    "audit:export",
    "settings:view",
    "settings:edit",
    "notifications:view",
    "notifications:manage",
  ],

  // Employé: Utilisateur standard, accès aux opérations quotidiennes
  employe: [
    "inventory:view",
    "inventory:create",
    "inventory:edit",
    "categories:view",
    "users:view",
    "entreprise:view",
    "fournisseurs:view",
    "commandes:view",
    "commandes:create",
    "commandes:edit",
    "analytics:view",
    "notifications:view",
  ],
}

// Vérification des permissions
export function hasPermission(role: Role, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) ?? false
}

export function hasAllPermissions(role: Role, permissions: Permission[]): boolean {
  return permissions.every((perm) => hasPermission(role, perm))
}

export function hasAnyPermission(role: Role, permissions: Permission[]): boolean {
  return permissions.some((perm) => hasPermission(role, perm))
}

// Vérifier si un rôle peut gérer un autre rôle
export function canManageRole(userRole: Role, targetRole: Role): boolean {
  const hierarchy: Record<Role, number> = {
    admin: 3,
    manager: 2,
    employe: 1,
  }
  return hierarchy[userRole] > hierarchy[targetRole]
}

// Labels français
export const roleLabels: Record<Role, string> = {
  admin: "Administrateur Invexia",
  manager: "Manager (Propriétaire)",
  employe: "Employé",
}

export const roleDescriptions: Record<Role, string> = {
  admin: "Accès complet à toutes les entreprises de la plateforme Invexia",
  manager: "Propriétaire d'entreprise - Gestion complète de l'entreprise et des employés",
  employe: "Employé - Accès aux opérations quotidiennes de l'entreprise",
}

export const roleBadgeColors: Record<Role, string> = {
  admin: "bg-red-500/20 text-red-400 border-red-500/30",
  manager: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  employe: "bg-blue-500/20 text-blue-400 border-blue-500/30",
}
