"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Shield, Bell, Key, Loader2, Save, Upload, Check } from "lucide-react"
import { roleLabels, roleBadgeColors } from "@/lib/rbac"

export default function ProfilePage() {
  const { profil, entreprise, refreshProfil, supabase } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    telephone: "",
    poste: "",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    if (profil) {
      setFormData({
        prenom: profil.prenom || "",
        nom: profil.nom || "",
        telephone: profil.telephone || "",
        poste: profil.poste || "",
      })
    }
  }, [profil])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase || !profil) return

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const { error } = await supabase
        .from("profils")
        .update({
          prenom: formData.prenom,
          nom: formData.nom,
          telephone: formData.telephone,
          poste: formData.poste,
        })
        .eq("id", profil.id)

      if (error) throw error

      await refreshProfil()
      setSuccess("Profil mis à jour avec succès")
    } catch (err) {
      setError("Erreur lors de la mise à jour du profil")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase) return

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      })

      if (error) throw error

      setSuccess("Mot de passe mis à jour avec succès")
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    } catch {
      setError("Erreur lors de la mise à jour du mot de passe")
    } finally {
      setIsLoading(false)
    }
  }

  if (!profil) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Mon Profil</h1>
            <p className="text-muted-foreground">Gérez vos informations personnelles et paramètres de sécurité</p>
          </div>
        </div>

        {success && (
          <Alert className="bg-green-500/10 border-green-500/30 text-green-400">
            <Check className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert variant="destructive" className="bg-red-500/10 border-red-500/30 text-red-400">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="bg-card/50 backdrop-blur-xl border-border/40">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profil.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback className="bg-primary/20 text-primary text-2xl">
                    {profil.prenom?.[0] || "U"}
                    {profil.nom?.[0] || ""}
                  </AvatarFallback>
                </Avatar>
                <Button size="icon" variant="secondary" className="absolute -bottom-2 -right-2 rounded-full w-8 h-8">
                  <Upload className="w-4 h-4" />
                </Button>
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-xl font-semibold text-foreground">
                  {profil.prenom} {profil.nom}
                </h2>
                <p className="text-muted-foreground">{profil.poste || "Poste non défini"}</p>
                <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
                  <Badge className={roleBadgeColors[profil.role]}>{roleLabels[profil.role]}</Badge>
                  {entreprise && (
                    <Badge variant="outline" className="border-border/40">
                      {entreprise.nom}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="bg-card/50 border border-border/40">
            <TabsTrigger value="general" className="data-[state=active]:bg-primary/20">
              <User className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Général</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-primary/20">
              <Shield className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Sécurité</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-primary/20">
              <Bell className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card className="bg-card/50 backdrop-blur-xl border-border/40">
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
                <CardDescription>Mettez à jour vos informations de profil</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="prenom">Prénom</Label>
                      <Input
                        id="prenom"
                        value={formData.prenom}
                        onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                        className="bg-background/50 border-border/40"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nom">Nom</Label>
                      <Input
                        id="nom"
                        value={formData.nom}
                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                        className="bg-background/50 border-border/40"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="telephone">Téléphone</Label>
                      <Input
                        id="telephone"
                        type="tel"
                        value={formData.telephone}
                        onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                        className="bg-background/50 border-border/40"
                        placeholder="+33 6 12 34 56 78"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="poste">Poste</Label>
                      <Input
                        id="poste"
                        value={formData.poste}
                        onChange={(e) => setFormData({ ...formData, poste: e.target.value })}
                        className="bg-background/50 border-border/40"
                        placeholder="Ex: Responsable Stock"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Enregistrer
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="bg-card/50 backdrop-blur-xl border-border/40">
              <CardHeader>
                <CardTitle>Changer le mot de passe</CardTitle>
                <CardDescription>Mettez à jour votre mot de passe pour sécuriser votre compte</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="bg-background/50 border-border/40"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="bg-background/50 border-border/40"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmer</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="bg-background/50 border-border/40"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Key className="w-4 h-4 mr-2" />}
                      Mettre à jour
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="bg-card/50 backdrop-blur-xl border-border/40">
              <CardHeader>
                <CardTitle>Préférences de notifications</CardTitle>
                <CardDescription>Gérez comment vous recevez les notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Alertes stock bas", desc: "Recevoir une alerte quand le stock atteint le seuil minimum" },
                  { label: "Nouvelles commandes", desc: "Notification lors de la création d'une commande" },
                  { label: "Rapports hebdomadaires", desc: "Résumé de l'activité chaque semaine" },
                  { label: "Mises à jour système", desc: "Informations sur les nouvelles fonctionnalités" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-3 border-b border-border/40 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-foreground">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
