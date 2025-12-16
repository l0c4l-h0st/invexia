"use client"

import { Bell, Shield, Database, Palette, Users, Loader2, Check } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth, ProtectedComponent } from "@/lib/auth-context"
import { getProducts } from "@/lib/actions/inventory"
import { getAuditLogs } from "@/lib/actions/audit"

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general")
  const { hasPermission } = useAuth()

  const tabs = [
    { id: "general", label: "Général", icon: Palette, permission: "settings:view" as const },
    { id: "security", label: "Sécurité", icon: Shield, permission: "settings:view" as const },
    { id: "notifications", label: "Notifications", icon: Bell, permission: "settings:view" as const },
    { id: "users", label: "Utilisateurs", icon: Users, permission: "settings:view" as const },
    { id: "data", label: "Données & Export", icon: Database, permission: "settings:view" as const },
  ]

  const visibleTabs = tabs.filter((tab) => hasPermission(tab.permission))

  return (
    <ProtectedComponent permission="settings:view">
      <div className="p-4 md:p-6 space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Paramètres</h1>
          <p className="text-muted-foreground text-sm md:text-base">Gérez votre compte et vos préférences</p>
        </div>

        <div className="flex gap-2 border-b border-border/40 overflow-x-auto">
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 md:px-4 py-3 border-b-2 transition-colors whitespace-nowrap text-sm md:text-base ${
                activeTab === tab.id
                  ? "border-primary text-primary font-medium"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon size={18} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        <div>
          {activeTab === "general" && <GeneralSettings />}
          {activeTab === "security" && <SecuritySettings />}
          {activeTab === "notifications" && <NotificationSettings />}
          {activeTab === "users" && <UsersSettings />}
          {activeTab === "data" && <DataSettings />}
        </div>
      </div>
    </ProtectedComponent>
  )
}

function GeneralSettings() {
  const { entreprise, refreshProfil, supabase } = useAuth()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    nom: entreprise?.nom || "Mon Entreprise",
    email: "",
    timezone: "CET",
  })

  const handleSave = async () => {
    if (!supabase || !entreprise) return

    setLoading(true)
    try {
      await supabase.from("entreprises").update({ nom: formData.nom }).eq("id", entreprise.id)
      await refreshProfil()
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error("Erreur sauvegarde:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="glass rounded-xl border border-border/40 p-5 md:p-6">
        <h3 className="text-lg font-bold mb-6">Organisation</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Nom Organisation</label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              className="w-full px-4 py-2.5 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email Contact</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="admin@company.com"
              className="w-full px-4 py-2.5 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Fuseau Horaire</label>
            <select
              value={formData.timezone}
              onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
              className="w-full px-4 py-2.5 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            >
              <option value="UTC">UTC</option>
              <option value="CET">Europe/Paris (CET)</option>
              <option value="PST">America/Los_Angeles (PST)</option>
            </select>
          </div>
        </div>
      </div>

      <Button onClick={handleSave} disabled={loading} className="bg-primary hover:bg-primary/90">
        {loading ? (
          <Loader2 size={16} className="animate-spin mr-2" />
        ) : success ? (
          <Check size={16} className="mr-2" />
        ) : null}
        {success ? "Enregistré" : "Enregistrer les Modifications"}
      </Button>
    </div>
  )
}

function SecuritySettings() {
  const { supabase } = useAuth()
  const [loading, setLoading] = useState<string | null>(null)

  const handleChangePassword = async () => {
    if (!supabase) return

    setLoading("password")
    try {
      const { data: userData } = await supabase.auth.getUser()
      if (userData.user?.email) {
        await supabase.auth.resetPasswordForEmail(userData.user.email)
        alert("Email de réinitialisation envoyé")
      }
    } catch (error) {
      console.error("Erreur:", error)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="glass rounded-xl border border-border/40 p-5 md:p-6">
        <h3 className="text-lg font-bold mb-6">Mot de Passe et Sécurité</h3>
        <div className="space-y-3">
          <Button
            onClick={handleChangePassword}
            disabled={loading === "password"}
            variant="outline"
            className="w-full border-border/40 bg-transparent justify-start"
          >
            {loading === "password" && <Loader2 size={16} className="animate-spin mr-2" />}
            Changer le Mot de Passe
          </Button>
          <Button variant="outline" className="w-full border-border/40 bg-transparent justify-start">
            Activer Authentification Deux Facteurs
          </Button>
          <Button variant="outline" className="w-full border-border/40 bg-transparent justify-start">
            Afficher les Sessions Actives
          </Button>
        </div>
      </div>

      <div className="glass rounded-xl border border-border/40 p-5 md:p-6">
        <h3 className="text-lg font-bold mb-4">Clés API</h3>
        <p className="text-muted-foreground text-sm mb-4">Gérez vos clés API pour les intégrations</p>
        <Button variant="outline" className="border-border/40 bg-transparent">
          Générer Nouvelle Clé
        </Button>
      </div>
    </div>
  )
}

function NotificationSettings() {
  const [notifications, setNotifications] = useState({
    lowStock: true,
    newOrders: true,
    userActivity: false,
    weeklyReport: true,
  })
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSaving(false)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="glass rounded-xl border border-border/40 p-5 md:p-6">
        <h3 className="text-lg font-bold mb-6">Notifications Email</h3>
        <div className="space-y-3">
          {[
            { key: "lowStock", label: "Alertes Stock Faible", desc: "Notification quand stock sous seuil" },
            { key: "newOrders", label: "Nouvelles Commandes", desc: "Notification pour nouvelles commandes" },
            { key: "userActivity", label: "Activité Équipe", desc: "Alertes activités équipe importantes" },
            { key: "weeklyReport", label: "Rapport Hebdo", desc: "Rapports inventaire et ventes hebdo" },
          ].map((notif) => (
            <label
              key={notif.key}
              className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg hover:bg-muted/70 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={notifications[notif.key as keyof typeof notifications]}
                onChange={(e) =>
                  setNotifications((prev) => ({
                    ...prev,
                    [notif.key]: e.target.checked,
                  }))
                }
                className="w-4 h-4 rounded border-border cursor-pointer"
              />
              <div>
                <p className="font-medium text-sm md:text-base">{notif.label}</p>
                <p className="text-xs md:text-sm text-muted-foreground">{notif.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90">
        {saving && <Loader2 size={16} className="animate-spin mr-2" />}
        Enregistrer les Préférences
      </Button>
    </div>
  )
}

function UsersSettings() {
  const router = useRouter()

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="glass rounded-xl border border-border/40 p-5 md:p-6">
        <div className="flex items-center justify-between mb-6 flex-col md:flex-row gap-4">
          <h3 className="text-lg font-bold">Gérer Utilisateurs</h3>
          <Button
            onClick={() => router.push("/team")}
            className="bg-primary hover:bg-primary/90 text-sm w-full md:w-auto"
          >
            Aller à la Gestion d'Équipe
          </Button>
        </div>
        <p className="text-muted-foreground text-sm">
          Gérez les utilisateurs, invitations et rôles dans la section Équipe du menu.
        </p>
      </div>
    </div>
  )
}

function DataSettings() {
  const [exporting, setExporting] = useState<string | null>(null)
  const { hasPermission } = useAuth()

  const handleExportInventory = async () => {
    setExporting("inventory")
    try {
      const products = await getProducts()
      const csv = [
        ["ID", "Nom", "SKU", "Catégorie", "Prix", "Stock", "Seuil Minimum", "Statut"].join(","),
        ...products.map((p) => [p.id, p.nom, p.sku, p.categorie, p.prix, p.stock, p.stock_minimum, p.statut].join(",")),
      ].join("\n")

      const blob = new Blob([csv], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `inventaire-${new Date().toISOString().split("T")[0]}.csv`
      a.click()
    } catch (error) {
      console.error("Erreur export:", error)
    } finally {
      setExporting(null)
    }
  }

  const handleExportAudit = async () => {
    setExporting("audit")
    try {
      const logs = await getAuditLogs()
      const csv = [
        ["ID", "Date", "Utilisateur", "Action", "Ressource", "Détails", "Sévérité"].join(","),
        ...logs.map((l) => [l.id, l.timestamp, l.user_name, l.action, l.resource, l.details, l.severity].join(",")),
      ].join("\n")

      const blob = new Blob([csv], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `audit-logs-${new Date().toISOString().split("T")[0]}.csv`
      a.click()
    } catch (error) {
      console.error("Erreur export:", error)
    } finally {
      setExporting(null)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="glass rounded-xl border border-border/40 p-5 md:p-6">
        <h3 className="text-lg font-bold mb-6">Données et Export</h3>
        <div className="space-y-3">
          <Button
            onClick={handleExportInventory}
            disabled={exporting === "inventory"}
            variant="outline"
            className="w-full border-border/40 bg-transparent justify-start"
          >
            {exporting === "inventory" && <Loader2 size={16} className="animate-spin mr-2" />}
            Exporter Données Inventaire (CSV)
          </Button>
          {hasPermission("audit:export") && (
            <Button
              onClick={handleExportAudit}
              disabled={exporting === "audit"}
              variant="outline"
              className="w-full border-border/40 bg-transparent justify-start"
            >
              {exporting === "audit" && <Loader2 size={16} className="animate-spin mr-2" />}
              Exporter Logs Audit (CSV)
            </Button>
          )}
          <Button variant="outline" className="w-full border-border/40 bg-transparent justify-start">
            Télécharger Sauvegarde Complète
          </Button>
        </div>
      </div>

      <div className="glass rounded-xl border border-destructive/30 p-5 md:p-6">
        <h3 className="text-lg font-bold mb-2 text-destructive">Zone Dangereuse</h3>
        <p className="text-muted-foreground text-sm mb-4">Actions irréversibles - À utiliser avec précaution</p>
        <Button className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
          Supprimer Organisation
        </Button>
      </div>
    </div>
  )
}
