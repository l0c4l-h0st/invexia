"use client"

import { useState, useEffect } from "react"
import { useAuth, ProtectedComponent } from "@/lib/auth-context"
import { createEntreprise, type EntrepriseData } from "@/lib/actions/entreprise"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Building2,
  Users,
  Package,
  Search,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Crown,
  UserCog,
  User,
  Loader2,
  Shield,
  TrendingUp,
  Plus,
  FileText,
  Globe,
  Calendar,
  Briefcase,
  CreditCard,
  Hash,
} from "lucide-react"
import type { Role } from "@/lib/rbac"

interface Entreprise {
  id: string
  nom: string
  slug: string
  email: string
  telephone: string | null
  adresse: string | null
  code_postal: string | null
  ville: string | null
  pays: string | null
  siret: string | null
  siren: string | null
  tva_intra: string | null
  forme_juridique: string | null
  capital: number | null
  code_naf: string | null
  date_creation: string | null
  effectif: string | null
  secteur: string | null
  description: string | null
  site_web: string | null
  contact_nom: string | null
  contact_prenom: string | null
  contact_email: string | null
  contact_telephone: string | null
  contact_poste: string | null
  plan: string
  created_at: string
  employes: Employe[]
  produits_count: number
}

interface Employe {
  id: string
  prenom: string
  nom: string
  email: string
  role: Role
  poste: string | null
  avatar_url: string | null
  created_at: string
}

const formesJuridiques = ["SAS", "SARL", "SA", "EURL", "SNC", "SASU", "Auto-entrepreneur", "EI", "EIRL", "SCI", "Autre"]

const secteurs = [
  "Technologie",
  "Commerce",
  "Industrie",
  "Services",
  "Santé",
  "Finance",
  "Immobilier",
  "Transport",
  "Agriculture",
  "Éducation",
  "Autre",
]

const effectifs = ["1-5", "6-10", "11-50", "51-100", "101-250", "251-500", "500+"]

export function EntreprisesAdmin() {
  const { profil, supabase } = useAuth()
  const [entreprises, setEntreprises] = useState<Entreprise[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedEntreprise, setSelectedEntreprise] = useState<Entreprise | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [creating, setCreating] = useState(false)
  const [formData, setFormData] = useState<EntrepriseData>({
    nom: "",
    email: "",
    plan: "free",
  })

  const isAdmin = profil?.role === "admin"

  useEffect(() => {
    loadEntreprises()
  }, [])

  async function loadEntreprises() {
    if (!supabase) {
      setLoading(false)
      return
    }

    setLoading(true)

    const { data: entreprisesData, error } = await supabase.from("entreprises").select("*").order("nom")

    if (error) {
      setLoading(false)
      return
    }

    const entreprisesWithDetails = await Promise.all(
      (entreprisesData || []).map(async (ent) => {
        const { data: profils } = await supabase
          .from("profils")
          .select("id, prenom, nom, role, poste, avatar_url, created_at")
          .eq("entreprise_id", ent.id)
          .order("role")

        const { count } = await supabase
          .from("produits")
          .select("*", { count: "exact", head: true })
          .eq("entreprise_id", ent.id)

        return {
          ...ent,
          employes: profils || [],
          produits_count: count || 0,
        }
      }),
    )

    setEntreprises(entreprisesWithDetails)
    setLoading(false)
  }

  async function handleCreateEntreprise() {
    if (!formData.nom || !formData.email) return

    setCreating(true)
    const result = await createEntreprise(formData)

    if (result.error) {
      console.error(result.error)
    } else {
      setShowCreateDialog(false)
      setFormData({ nom: "", email: "", plan: "free" })
      loadEntreprises()
    }
    setCreating(false)
  }

  const filteredEntreprises = entreprises.filter(
    (ent) =>
      ent.nom.toLowerCase().includes(search.toLowerCase()) ||
      ent.email?.toLowerCase().includes(search.toLowerCase()) ||
      ent.siret?.includes(search),
  )

  const getPlanBadge = (plan: string) => {
    const planStyles: Record<string, string> = {
      free: "bg-slate-500/20 text-slate-400 border-slate-500/30",
      pro: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      enterprise: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    }
    const planLabels: Record<string, string> = {
      free: "Gratuit",
      pro: "Pro",
      enterprise: "Enterprise",
    }
    return (
      <Badge variant="outline" className={planStyles[plan] || planStyles.free}>
        {planLabels[plan] || plan}
      </Badge>
    )
  }

  const getRoleIcon = (role: Role) => {
    switch (role) {
      case "super_admin":
      case "admin":
        return <Crown className="w-4 h-4" />
      case "manager":
        return <UserCog className="w-4 h-4" />
      default:
        return <User className="w-4 h-4" />
    }
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-4">
        <Shield className="w-16 h-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Accès Restreint</h1>
        <p className="text-muted-foreground max-w-md">Cette section est réservée aux administrateurs Invexia.</p>
      </div>
    )
  }

  return (
    <ProtectedComponent permission="entreprise:manage">
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Gestion des Entreprises</h1>
            <p className="text-muted-foreground">
              {entreprises.length} entreprise{entreprises.length > 1 ? "s" : ""} enregistrée
              {entreprises.length > 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex gap-2">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher (nom, email, SIRET)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-card/50 border-border/40"
              />
            </div>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="gap-2 shrink-0">
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Créer une entreprise</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden bg-card/95 backdrop-blur-xl border-border/40">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary" />
                    Créer une nouvelle entreprise
                  </DialogTitle>
                  <DialogDescription>
                    Remplissez les informations de l'entreprise. Les champs marqués * sont obligatoires.
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[calc(90vh-10rem)] pr-4">
                  <Tabs defaultValue="general" className="mt-4">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="general">Général</TabsTrigger>
                      <TabsTrigger value="legal">Juridique</TabsTrigger>
                      <TabsTrigger value="contact">Contact</TabsTrigger>
                    </TabsList>

                    <TabsContent value="general" className="space-y-4 mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium">Nom de l'entreprise *</label>
                          <Input
                            placeholder="Ex: Tech Solutions SAS"
                            value={formData.nom}
                            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                            className="mt-1 bg-background/50 border-border/40"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Email *</label>
                          <Input
                            type="email"
                            placeholder="contact@entreprise.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="mt-1 bg-background/50 border-border/40"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Téléphone</label>
                          <Input
                            placeholder="+33 1 23 45 67 89"
                            value={formData.telephone || ""}
                            onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                            className="mt-1 bg-background/50 border-border/40"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Site web</label>
                          <Input
                            placeholder="https://www.entreprise.com"
                            value={formData.site_web || ""}
                            onChange={(e) => setFormData({ ...formData, site_web: e.target.value })}
                            className="mt-1 bg-background/50 border-border/40"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Plan</label>
                          <Select
                            value={formData.plan}
                            onValueChange={(v) => setFormData({ ...formData, plan: v as any })}
                          >
                            <SelectTrigger className="mt-1 bg-background/50 border-border/40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="free">Gratuit</SelectItem>
                              <SelectItem value="pro">Pro</SelectItem>
                              <SelectItem value="enterprise">Enterprise</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Secteur d'activité</label>
                          <Select
                            value={formData.secteur || ""}
                            onValueChange={(v) => setFormData({ ...formData, secteur: v })}
                          >
                            <SelectTrigger className="mt-1 bg-background/50 border-border/40">
                              <SelectValue placeholder="Sélectionner" />
                            </SelectTrigger>
                            <SelectContent>
                              {secteurs.map((s) => (
                                <SelectItem key={s} value={s}>
                                  {s}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Effectif</label>
                          <Select
                            value={formData.effectif || ""}
                            onValueChange={(v) => setFormData({ ...formData, effectif: v })}
                          >
                            <SelectTrigger className="mt-1 bg-background/50 border-border/40">
                              <SelectValue placeholder="Sélectionner" />
                            </SelectTrigger>
                            <SelectContent>
                              {effectifs.map((e) => (
                                <SelectItem key={e} value={e}>
                                  {e} employés
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium">Description</label>
                          <Textarea
                            placeholder="Décrivez l'activité de l'entreprise..."
                            value={formData.description || ""}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="mt-1 min-h-[80px] bg-background/50 border-border/40"
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="legal" className="space-y-4 mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium flex items-center gap-1">
                            <Hash className="w-3 h-3" /> SIRET
                          </label>
                          <Input
                            placeholder="123 456 789 00012"
                            value={formData.siret || ""}
                            onChange={(e) => setFormData({ ...formData, siret: e.target.value })}
                            className="mt-1 bg-background/50 border-border/40"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">SIREN</label>
                          <Input
                            placeholder="123 456 789"
                            value={formData.siren || ""}
                            onChange={(e) => setFormData({ ...formData, siren: e.target.value })}
                            className="mt-1 bg-background/50 border-border/40"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">N° TVA Intracommunautaire</label>
                          <Input
                            placeholder="FR12345678901"
                            value={formData.tva_intra || ""}
                            onChange={(e) => setFormData({ ...formData, tva_intra: e.target.value })}
                            className="mt-1 bg-background/50 border-border/40"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Code NAF/APE</label>
                          <Input
                            placeholder="6201Z"
                            value={formData.code_naf || ""}
                            onChange={(e) => setFormData({ ...formData, code_naf: e.target.value })}
                            className="mt-1 bg-background/50 border-border/40"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium flex items-center gap-1">
                            <Briefcase className="w-3 h-3" /> Forme juridique
                          </label>
                          <Select
                            value={formData.forme_juridique || ""}
                            onValueChange={(v) => setFormData({ ...formData, forme_juridique: v })}
                          >
                            <SelectTrigger className="mt-1 bg-background/50 border-border/40">
                              <SelectValue placeholder="Sélectionner" />
                            </SelectTrigger>
                            <SelectContent>
                              {formesJuridiques.map((f) => (
                                <SelectItem key={f} value={f}>
                                  {f}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium flex items-center gap-1">
                            <CreditCard className="w-3 h-3" /> Capital social (€)
                          </label>
                          <Input
                            type="number"
                            placeholder="10000"
                            value={formData.capital || ""}
                            onChange={(e) =>
                              setFormData({ ...formData, capital: Number.parseFloat(e.target.value) || undefined })
                            }
                            className="mt-1 bg-background/50 border-border/40"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> Date de création
                          </label>
                          <Input
                            type="date"
                            value={formData.date_creation || ""}
                            onChange={(e) => setFormData({ ...formData, date_creation: e.target.value })}
                            className="mt-1 bg-background/50 border-border/40"
                          />
                        </div>
                      </div>

                      <div className="pt-4 border-t border-border/40">
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <MapPin className="w-4 h-4" /> Adresse
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="md:col-span-2">
                            <label className="text-sm font-medium">Adresse</label>
                            <Input
                              placeholder="123 rue de l'Exemple"
                              value={formData.adresse || ""}
                              onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                              className="mt-1 bg-background/50 border-border/40"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Code postal</label>
                            <Input
                              placeholder="75001"
                              value={formData.code_postal || ""}
                              onChange={(e) => setFormData({ ...formData, code_postal: e.target.value })}
                              className="mt-1 bg-background/50 border-border/40"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Ville</label>
                            <Input
                              placeholder="Paris"
                              value={formData.ville || ""}
                              onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                              className="mt-1 bg-background/50 border-border/40"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Pays</label>
                            <Input
                              placeholder="France"
                              value={formData.pays || "France"}
                              onChange={(e) => setFormData({ ...formData, pays: e.target.value })}
                              className="mt-1 bg-background/50 border-border/40"
                            />
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="contact" className="space-y-4 mt-4">
                      <p className="text-sm text-muted-foreground">
                        Informations du contact principal de l'entreprise (optionnel)
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Prénom</label>
                          <Input
                            placeholder="Jean"
                            value={formData.contact_prenom || ""}
                            onChange={(e) => setFormData({ ...formData, contact_prenom: e.target.value })}
                            className="mt-1 bg-background/50 border-border/40"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Nom</label>
                          <Input
                            placeholder="Dupont"
                            value={formData.contact_nom || ""}
                            onChange={(e) => setFormData({ ...formData, contact_nom: e.target.value })}
                            className="mt-1 bg-background/50 border-border/40"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Email</label>
                          <Input
                            type="email"
                            placeholder="jean.dupont@entreprise.com"
                            value={formData.contact_email || ""}
                            onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                            className="mt-1 bg-background/50 border-border/40"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Téléphone</label>
                          <Input
                            placeholder="+33 6 12 34 56 78"
                            value={formData.contact_telephone || ""}
                            onChange={(e) => setFormData({ ...formData, contact_telephone: e.target.value })}
                            className="mt-1 bg-background/50 border-border/40"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium">Poste / Fonction</label>
                          <Input
                            placeholder="Directeur Général"
                            value={formData.contact_poste || ""}
                            onChange={(e) => setFormData({ ...formData, contact_poste: e.target.value })}
                            className="mt-1 bg-background/50 border-border/40"
                          />
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </ScrollArea>

                <div className="flex justify-end gap-2 pt-4 border-t border-border/40">
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleCreateEntreprise} disabled={creating || !formData.nom || !formData.email}>
                    {creating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                    Créer l'entreprise
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card/50 backdrop-blur-xl border-border/40">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-500/20">
                  <Building2 className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Entreprises</p>
                  <p className="text-xl font-bold">{entreprises.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-xl border-border/40">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-green-500/20">
                  <Users className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Utilisateurs</p>
                  <p className="text-xl font-bold">{entreprises.reduce((acc, ent) => acc + ent.employes.length, 0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-xl border-border/40">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-500/20">
                  <Package className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Produits</p>
                  <p className="text-xl font-bold">{entreprises.reduce((acc, ent) => acc + ent.produits_count, 0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-xl border-border/40">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-orange-500/20">
                  <TrendingUp className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Plan Pro+</p>
                  <p className="text-xl font-bold">
                    {entreprises.filter((e) => e.plan === "pro" || e.plan === "enterprise").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des entreprises */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredEntreprises.map((entreprise) => (
              <Card
                key={entreprise.id}
                className="bg-card/50 backdrop-blur-xl border-border/40 hover:border-primary/30 transition-colors cursor-pointer"
                onClick={() => setSelectedEntreprise(entreprise)}
              >
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
                        <Building2 className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-lg">{entreprise.nom}</h3>
                          {getPlanBadge(entreprise.plan)}
                          {entreprise.forme_juridique && (
                            <Badge variant="outline" className="text-xs">
                              {entreprise.forme_juridique}
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                          {entreprise.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {entreprise.email}
                            </span>
                          )}
                          {entreprise.siret && (
                            <span className="flex items-center gap-1">
                              <FileText className="w-3 h-3" />
                              SIRET: {entreprise.siret}
                            </span>
                          )}
                        </div>
                        {(entreprise.ville || entreprise.secteur) && (
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            {entreprise.ville && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {entreprise.ville}
                              </span>
                            )}
                            {entreprise.secteur && (
                              <span className="flex items-center gap-1">
                                <Briefcase className="w-3 h-3" />
                                {entreprise.secteur}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold">{entreprise.employes.length}</p>
                        <p className="text-xs text-muted-foreground">Employés</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold">{entreprise.produits_count}</p>
                        <p className="text-xs text-muted-foreground">Produits</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredEntreprises.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Aucune entreprise trouvée</p>
              </div>
            )}
          </div>
        )}

        {/* Modal détail entreprise */}
        <Dialog open={!!selectedEntreprise} onOpenChange={() => setSelectedEntreprise(null)}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-card/95 backdrop-blur-xl border-border/40">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-primary" />
                {selectedEntreprise?.nom}
              </DialogTitle>
              <DialogDescription>Détails complets de l'entreprise</DialogDescription>
            </DialogHeader>

            {selectedEntreprise && (
              <Tabs defaultValue="info" className="mt-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="info">Informations</TabsTrigger>
                  <TabsTrigger value="legal">Juridique</TabsTrigger>
                  <TabsTrigger value="employes">Employés ({selectedEntreprise.employes.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-muted/30">
                      <p className="text-xs text-muted-foreground mb-1">Plan</p>
                      {getPlanBadge(selectedEntreprise.plan)}
                    </div>
                    <div className="p-4 rounded-lg bg-muted/30">
                      <p className="text-xs text-muted-foreground mb-1">Inscrit le</p>
                      <p className="font-medium">
                        {new Date(selectedEntreprise.created_at).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                    {selectedEntreprise.secteur && (
                      <div className="p-4 rounded-lg bg-muted/30">
                        <p className="text-xs text-muted-foreground mb-1">Secteur</p>
                        <p className="font-medium">{selectedEntreprise.secteur}</p>
                      </div>
                    )}
                    {selectedEntreprise.effectif && (
                      <div className="p-4 rounded-lg bg-muted/30">
                        <p className="text-xs text-muted-foreground mb-1">Effectif</p>
                        <p className="font-medium">{selectedEntreprise.effectif} employés</p>
                      </div>
                    )}
                  </div>

                  {selectedEntreprise.description && (
                    <div className="p-4 rounded-lg bg-muted/30">
                      <p className="text-xs text-muted-foreground mb-1">Description</p>
                      <p className="text-sm">{selectedEntreprise.description}</p>
                    </div>
                  )}

                  <div className="p-4 rounded-lg bg-muted/30 space-y-2">
                    <p className="text-xs text-muted-foreground font-medium uppercase">Contact</p>
                    {selectedEntreprise.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        {selectedEntreprise.email}
                      </div>
                    )}
                    {selectedEntreprise.telephone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        {selectedEntreprise.telephone}
                      </div>
                    )}
                    {selectedEntreprise.site_web && (
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                        <a
                          href={selectedEntreprise.site_web}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {selectedEntreprise.site_web}
                        </a>
                      </div>
                    )}
                    {(selectedEntreprise.adresse || selectedEntreprise.ville) && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        {[
                          selectedEntreprise.adresse,
                          selectedEntreprise.code_postal,
                          selectedEntreprise.ville,
                          selectedEntreprise.pays,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </div>
                    )}
                  </div>

                  {(selectedEntreprise.contact_nom || selectedEntreprise.contact_prenom) && (
                    <div className="p-4 rounded-lg bg-muted/30 space-y-2">
                      <p className="text-xs text-muted-foreground font-medium uppercase">Contact principal</p>
                      <p className="font-medium">
                        {selectedEntreprise.contact_prenom} {selectedEntreprise.contact_nom}
                      </p>
                      {selectedEntreprise.contact_poste && (
                        <p className="text-sm text-muted-foreground">{selectedEntreprise.contact_poste}</p>
                      )}
                      {selectedEntreprise.contact_email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          {selectedEntreprise.contact_email}
                        </div>
                      )}
                      {selectedEntreprise.contact_telephone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          {selectedEntreprise.contact_telephone}
                        </div>
                      )}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="legal" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    {selectedEntreprise.siret && (
                      <div className="p-4 rounded-lg bg-muted/30">
                        <p className="text-xs text-muted-foreground mb-1">SIRET</p>
                        <p className="font-mono font-medium">{selectedEntreprise.siret}</p>
                      </div>
                    )}
                    {selectedEntreprise.siren && (
                      <div className="p-4 rounded-lg bg-muted/30">
                        <p className="text-xs text-muted-foreground mb-1">SIREN</p>
                        <p className="font-mono font-medium">{selectedEntreprise.siren}</p>
                      </div>
                    )}
                    {selectedEntreprise.tva_intra && (
                      <div className="p-4 rounded-lg bg-muted/30">
                        <p className="text-xs text-muted-foreground mb-1">TVA Intracommunautaire</p>
                        <p className="font-mono font-medium">{selectedEntreprise.tva_intra}</p>
                      </div>
                    )}
                    {selectedEntreprise.code_naf && (
                      <div className="p-4 rounded-lg bg-muted/30">
                        <p className="text-xs text-muted-foreground mb-1">Code NAF</p>
                        <p className="font-mono font-medium">{selectedEntreprise.code_naf}</p>
                      </div>
                    )}
                    {selectedEntreprise.forme_juridique && (
                      <div className="p-4 rounded-lg bg-muted/30">
                        <p className="text-xs text-muted-foreground mb-1">Forme juridique</p>
                        <p className="font-medium">{selectedEntreprise.forme_juridique}</p>
                      </div>
                    )}
                    {selectedEntreprise.capital && (
                      <div className="p-4 rounded-lg bg-muted/30">
                        <p className="text-xs text-muted-foreground mb-1">Capital social</p>
                        <p className="font-medium">{selectedEntreprise.capital.toLocaleString("fr-FR")} €</p>
                      </div>
                    )}
                    {selectedEntreprise.date_creation && (
                      <div className="p-4 rounded-lg bg-muted/30">
                        <p className="text-xs text-muted-foreground mb-1">Date de création</p>
                        <p className="font-medium">
                          {new Date(selectedEntreprise.date_creation).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    )}
                  </div>

                  {!selectedEntreprise.siret && !selectedEntreprise.siren && !selectedEntreprise.tva_intra && (
                    <p className="text-center text-muted-foreground py-8">Aucune information juridique renseignée</p>
                  )}
                </TabsContent>

                <TabsContent value="employes" className="mt-4">
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {selectedEntreprise.employes.map((employe) => (
                      <div
                        key={employe.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/30"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                            {employe.avatar_url ? (
                              <img
                                src={employe.avatar_url || "/placeholder.svg"}
                                alt={`${employe.prenom} ${employe.nom}`}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-sm font-medium">
                                {employe.prenom[0]}
                                {employe.nom[0]}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">
                              {employe.prenom} {employe.nom}
                            </p>
                            {employe.poste && <p className="text-xs text-muted-foreground">{employe.poste}</p>}
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={`bg-slate-500/20 text-slate-400 border-slate-500/30 flex items-center gap-1`}
                        >
                          {getRoleIcon(employe.role)}
                          {employe.role}
                        </Badge>
                      </div>
                    ))}

                    {selectedEntreprise.employes.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">Aucun employé enregistré</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedComponent>
  )
}
