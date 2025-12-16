"use client"

import { useState, useEffect } from "react"
import {
  UserPlus,
  Shield,
  Trash2,
  Edit2,
  MoreVertical,
  Search,
  Loader2,
  RefreshCw,
  User,
  Phone,
  Calendar,
  Check,
  X,
  Copy,
  Eye,
  EyeOff,
  Mail,
  Building2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth, ProtectedComponent } from "@/lib/auth-context"
import { roleLabels, roleBadgeColors, type Role } from "@/lib/rbac"
import {
  getTeamMembers,
  updateTeamMember,
  deleteTeamMember,
  createEmployee,
  changeUserEntreprise,
  type TeamMember,
} from "@/lib/actions/team"
import { getEntreprises } from "@/lib/actions/entreprise" // Added for Enterprise functionality

export function TeamManagement() {
  const { hasPermission, profil: currentProfil, canManageRole } = useAuth()
  const [team, setTeam] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showCredentialsModal, setShowCredentialsModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [deletingMemberId, setDeletingMemberId] = useState<string | null>(null)
  const [createdCredentials, setCreatedCredentials] = useState<{ email: string; password: string } | null>(null)

  const [entreprises, setEntreprises] = useState<any[]>([])
  const [showChangeEntrepriseModal, setShowChangeEntrepriseModal] = useState(false)
  const [selectedEntrepriseId, setSelectedEntrepriseId] = useState<string>("")

  // Form state
  const [createForm, setCreateForm] = useState({
    email: "",
    password: "",
    prenom: "",
    nom: "",
    telephone: "",
    poste: "",
  })
  const [editForm, setEditForm] = useState({ prenom: "", nom: "", telephone: "", poste: "", role: "employe" as Role })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const isAdmin = currentProfil?.role === "admin"
  const isManager = currentProfil?.role === "manager"
  const canCreate = hasPermission("users:create") && (isAdmin || isManager)
  const canEdit = hasPermission("users:edit")
  const canDelete = hasPermission("users:delete")
  const canManageRoles = hasPermission("users:manage_roles") // Seul admin

  // Charger l'équipe
  const loadTeam = async () => {
    console.log("[v0] Début loadTeam")
    setIsLoading(true)
    setError(null)

    const { data, error: teamError } = await getTeamMembers()

    console.log("[v0] Résultat getTeamMembers:", { data, error: teamError })

    if (teamError) {
      console.error("[v0] Erreur team:", teamError)
      setError(typeof teamError === "string" ? teamError : JSON.stringify(teamError))
    } else {
      console.log("[v0] Team chargée, nombre de membres:", data?.length)
      setTeam(data || [])
    }
    setIsLoading(false)
  }

  useEffect(() => {
    loadTeam()
  }, [])

  useEffect(() => {
    if (currentProfil?.role === "admin") {
      loadEntreprises()
    }
  }, [currentProfil])

  const loadEntreprises = async () => {
    const { data } = await getEntreprises()
    if (data) {
      setEntreprises(data)
    }
  }

  // Filtrer les membres
  const filteredTeam = team.filter(
    (m) =>
      searchQuery === "" ||
      `${m.prenom} ${m.nom}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.poste?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Ouvrir modal édition
  const openEditModal = (member: TeamMember) => {
    setEditingMember(member)
    setEditForm({
      prenom: member.prenom,
      nom: member.nom,
      telephone: member.telephone || "",
      poste: member.poste || "",
      role: member.role,
    })
    setShowEditModal(true)
  }

  const handleCreateEmployee = async () => {
    setIsSubmitting(true)
    setError(null)

    if (!createForm.email || !createForm.password || !createForm.prenom || !createForm.nom) {
      setError("Veuillez remplir tous les champs obligatoires")
      setIsSubmitting(false)
      return
    }

    if (createForm.password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères")
      setIsSubmitting(false)
      return
    }

    try {
      const result = await createEmployee(createForm)

      if (result.error) {
        setError(typeof result.error === "string" ? result.error : String(result.error))
      } else if (result.credentials) {
        setCreatedCredentials(result.credentials)
        setShowCreateModal(false)
        setShowCredentialsModal(true)
        setCreateForm({ email: "", password: "", prenom: "", nom: "", telephone: "", poste: "" })

        // Attendre un peu avant de recharger pour éviter les conflits React
        await new Promise((resolve) => setTimeout(resolve, 500))
        loadTeam()
      }
    } catch (err: any) {
      setError(err.message || "Erreur lors de la création")
    }

    setIsSubmitting(false)
  }

  // Soumettre modification
  const handleEdit = async () => {
    if (!editingMember) return
    setIsSubmitting(true)
    setError(null)
    const result = await updateTeamMember(editingMember.id, editForm)
    if (result.error) {
      setError(typeof result.error === "string" ? result.error : String(result.error))
    } else {
      setSuccess("Membre mis à jour")
      setShowEditModal(false)
      loadTeam()
    }
    setIsSubmitting(false)
  }

  // Supprimer membre
  const handleDelete = async () => {
    if (!deletingMemberId) return
    setIsSubmitting(true)
    const result = await deleteTeamMember(deletingMemberId)
    if (result.error) {
      setError(typeof result.error === "string" ? result.error : String(result.error))
    } else {
      setSuccess("Membre suspendu")
      loadTeam()
    }
    setDeletingMemberId(null)
    setIsSubmitting(false)
  }

  // Changer statut
  const handleStatusChange = async (id: string, newStatus: "actif" | "inactif") => {
    const result = await updateTeamMember(id, { statut: newStatus })
    if (result.error) {
      setError(typeof result.error === "string" ? result.error : String(result.error))
    } else {
      setSuccess(`Membre ${newStatus === "actif" ? "activé" : "désactivé"}`)
      loadTeam()
    }
  }

  // Copier dans le presse-papier
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setSuccess("Copié dans le presse-papier")
  }

  // Générer un mot de passe aléatoire
  const generatePassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%"
    let password = ""
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setCreateForm({ ...createForm, password })
  }

  const statusColors: Record<string, string> = {
    actif: "bg-green-500/20 text-green-400 border-green-500/30",
    inactif: "bg-slate-500/20 text-slate-400 border-slate-500/30",
    suspendu: "bg-red-500/20 text-red-400 border-red-500/30",
  }

  const statusLabels: Record<string, string> = {
    actif: "Actif",
    inactif: "Inactif",
    suspendu: "Suspendu",
  }

  const openDetails = (member: TeamMember) => {
    setSelectedMember(member)
    setShowDetailsModal(true)
  }

  const handleChangeEntreprise = async () => {
    if (!selectedMember || !selectedEntrepriseId) return

    setIsLoading(true)
    const result = await changeUserEntreprise(selectedMember.id, selectedEntrepriseId)

    if (result.error) {
      setError(typeof result.error === "string" ? result.error : String(result.error))
    } else {
      setShowChangeEntrepriseModal(false)
      setSelectedEntrepriseId("")
      loadTeam()
    }
    setIsLoading(false)
  }

  return (
    <ProtectedComponent permission="users:view">
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1">{isAdmin ? "Tous les Utilisateurs" : "Mon Équipe"}</h1>
            <p className="text-muted-foreground text-sm">
              {filteredTeam.length} membre{filteredTeam.length > 1 ? "s" : ""}
              {isManager && " dans votre entreprise"}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={loadTeam}
              disabled={isLoading}
              className="border-border/40 bg-transparent"
            >
              <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
              <span className="hidden sm:inline ml-2">Actualiser</span>
            </Button>

            {canCreate && (
              <Button
                onClick={() => setShowCreateModal(true)}
                size="sm"
                className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
              >
                <UserPlus size={16} />
                <span className="ml-2">Créer un employé</span>
              </Button>
            )}
          </div>
        </div>

        {/* Alerts */}
        {success && (
          <Alert className="bg-green-500/10 border-green-500/30 text-green-400">
            <Check className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert variant="destructive" className="bg-red-500/10 border-red-500/30">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Search */}
        <div className="glass rounded-xl border border-border/40 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom ou poste..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/50 border-border/40"
            />
          </div>
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          /* Team Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredTeam.map((member) => (
              <div
                key={member.id}
                onClick={() => openDetails(member)}
                className="glass rounded-xl border border-border/40 p-5 hover:border-primary/30 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={member.avatar_url || "/placeholder.svg"} />
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {member.prenom[0]}
                        {member.nom[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">
                        {member.prenom} {member.nom}
                      </h3>
                      <p className="text-sm text-muted-foreground">{member.poste || "Poste non défini"}</p>
                    </div>
                  </div>

                  {(canEdit || canDelete) && member.id !== currentProfil?.id && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {canEdit && (
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              openEditModal(member)
                            }}
                          >
                            <Edit2 size={14} className="mr-2" />
                            Modifier
                          </DropdownMenuItem>
                        )}
                        {canEdit && canManageRole(member.role) && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                handleStatusChange(member.id, member.statut === "actif" ? "inactif" : "actif")
                              }}
                            >
                              {member.statut === "actif" ? (
                                <>
                                  <X size={14} className="mr-2" />
                                  Désactiver
                                </>
                              ) : (
                                <>
                                  <Check size={14} className="mr-2" />
                                  Activer
                                </>
                              )}
                            </DropdownMenuItem>
                          </>
                        )}
                        {canDelete && canManageRole(member.role) && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-400 focus:text-red-400"
                              onClick={(e) => {
                                e.stopPropagation()
                                setDeletingMemberId(member.id)
                              }}
                            >
                              <Trash2 size={14} className="mr-2" />
                              Suspendre
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>

                {/* Badges */}
                <div className="flex items-center gap-2 flex-wrap mb-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border ${roleBadgeColors[member.role]}`}
                  >
                    <Shield size={12} className="inline mr-1" />
                    {roleLabels[member.role]}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[member.statut]}`}
                  >
                    {statusLabels[member.statut]}
                  </span>
                </div>

                {/* Info */}
                <div className="space-y-2 text-sm">
                  {member.telephone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone size={14} />
                      <span>{member.telephone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar size={14} />
                    <span>Depuis {new Date(member.created_at).toLocaleDateString("fr-FR")}</span>
                  </div>
                  {member.derniere_connexion && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User size={14} />
                      <span>
                        Dernière connexion:{" "}
                        {new Date(member.derniere_connexion).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {filteredTeam.length === 0 && (
              <div className="col-span-full glass rounded-xl border border-border/40 p-12 text-center">
                <User className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucun membre trouvé</h3>
                <p className="text-muted-foreground text-sm">
                  {canCreate ? "Créez des employés pour commencer à collaborer." : "Aucun membre dans votre équipe."}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Modal Détails Utilisateur */}
        <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
          <DialogContent className="bg-card border-border/40 max-w-3xl max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Détails de l'utilisateur</DialogTitle>
            </DialogHeader>

            {selectedMember && (
              <div className="space-y-6">
                {/* Header avec avatar */}
                <div className="flex items-center gap-4 pb-4 border-b border-border/40">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={selectedMember.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback className="bg-primary/20 text-primary text-2xl">
                      {selectedMember.prenom[0]}
                      {selectedMember.nom[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold">
                      {selectedMember.prenom} {selectedMember.nom}
                    </h2>
                    <p className="text-muted-foreground">{selectedMember.poste || "Poste non défini"}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium border ${roleBadgeColors[selectedMember.role]}`}
                      >
                        <Shield size={12} className="inline mr-1" />
                        {roleLabels[selectedMember.role]}
                      </span>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[selectedMember.statut]}`}
                      >
                        {statusLabels[selectedMember.statut]}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Informations personnelles */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <User size={18} className="text-primary" />
                    Informations personnelles
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="glass rounded-lg p-4 border border-border/40">
                      <div className="text-xs text-muted-foreground mb-1">Prénom</div>
                      <div className="font-medium">{selectedMember.prenom}</div>
                    </div>
                    <div className="glass rounded-lg p-4 border border-border/40">
                      <div className="text-xs text-muted-foreground mb-1">Nom</div>
                      <div className="font-medium">{selectedMember.nom}</div>
                    </div>
                    {selectedMember.email && (
                      <div className="glass rounded-lg p-4 border border-border/40 col-span-2">
                        <div className="text-xs text-muted-foreground mb-1">Email</div>
                        <div className="font-medium flex items-center gap-2">
                          <Mail size={16} className="text-muted-foreground" />
                          {selectedMember.email}
                        </div>
                      </div>
                    )}
                    {selectedMember.telephone && (
                      <div className="glass rounded-lg p-4 border border-border/40 col-span-2">
                        <div className="text-xs text-muted-foreground mb-1">Téléphone</div>
                        <div className="font-medium flex items-center gap-2">
                          <Phone size={16} className="text-muted-foreground" />
                          {selectedMember.telephone}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Building2 size={18} className="text-primary" />
                    Entreprise
                  </h3>
                  <div className="glass rounded-lg p-4 border border-border/40">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Entreprise associée</div>
                        <div className="font-medium">{selectedMember.entreprise_nom || "Aucune entreprise"}</div>
                      </div>
                      {currentProfil?.role === "admin" && selectedMember.id !== currentProfil?.id && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedEntrepriseId(selectedMember.entreprise_id || "")
                            setShowChangeEntrepriseModal(true)
                          }}
                        >
                          <Building2 size={14} className="mr-2" />
                          Changer
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Informations de compte */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Shield size={18} className="text-primary" />
                    Informations de compte
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="glass rounded-lg p-4 border border-border/40">
                      <div className="text-xs text-muted-foreground mb-1">Rôle</div>
                      <div className="font-medium">{roleLabels[selectedMember.role]}</div>
                    </div>
                    <div className="glass rounded-lg p-4 border border-border/40">
                      <div className="text-xs text-muted-foreground mb-1">Statut</div>
                      <div className="font-medium">{statusLabels[selectedMember.statut]}</div>
                    </div>
                    <div className="glass rounded-lg p-4 border border-border/40">
                      <div className="text-xs text-muted-foreground mb-1">Date de création</div>
                      <div className="font-medium flex items-center gap-2">
                        <Calendar size={16} className="text-muted-foreground" />
                        {new Date(selectedMember.created_at).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                    {selectedMember.derniere_connexion && (
                      <div className="glass rounded-lg p-4 border border-border/40">
                        <div className="text-xs text-muted-foreground mb-1">Dernière connexion</div>
                        <div className="font-medium flex items-center gap-2">
                          <User size={16} className="text-muted-foreground" />
                          {new Date(selectedMember.derniere_connexion).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    )}
                    <div className="glass rounded-lg p-4 border border-border/40 col-span-2">
                      <div className="text-xs text-muted-foreground mb-1">Identifiant utilisateur</div>
                      <div className="font-mono text-xs break-all">{selectedMember.id}</div>
                    </div>
                  </div>
                </div>

                {/* Actions rapides */}
                {(canEdit || canDelete) && selectedMember.id !== currentProfil?.id && (
                  <div className="pt-4 border-t border-border/40 flex gap-2 justify-end flex-wrap">
                    {canEdit && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowDetailsModal(false)
                          openEditModal(selectedMember)
                        }}
                      >
                        <Edit2 size={16} className="mr-2" />
                        Modifier
                      </Button>
                    )}
                    {canEdit && canManageRole(selectedMember.role) && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowDetailsModal(false)
                          handleStatusChange(selectedMember.id, selectedMember.statut === "actif" ? "inactif" : "actif")
                        }}
                      >
                        {selectedMember.statut === "actif" ? (
                          <>
                            <X size={16} className="mr-2" />
                            Désactiver
                          </>
                        ) : (
                          <>
                            <Check size={16} className="mr-2" />
                            Activer
                          </>
                        )}
                      </Button>
                    )}
                    {canDelete && canManageRole(selectedMember.role) && (
                      <Button
                        variant="destructive"
                        onClick={() => {
                          setShowDetailsModal(false)
                          setDeletingMemberId(selectedMember.id)
                        }}
                      >
                        <Trash2 size={16} className="mr-2" />
                        Suspendre
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogContent className="bg-card border-border/40 max-w-md">
            <DialogHeader>
              <DialogTitle>Créer un employé</DialogTitle>
              <DialogDescription>
                Créez un compte pour un nouvel employé. Les identifiants seront affichés après création.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>
                    Prénom <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    value={createForm.prenom}
                    onChange={(e) => setCreateForm({ ...createForm, prenom: e.target.value })}
                    placeholder="Jean"
                    className="bg-background/50 border-border/40"
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    Nom <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    value={createForm.nom}
                    onChange={(e) => setCreateForm({ ...createForm, nom: e.target.value })}
                    placeholder="Dupont"
                    className="bg-background/50 border-border/40"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>
                  Email <span className="text-red-400">*</span>
                </Label>
                <Input
                  type="email"
                  value={createForm.email}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                  placeholder="jean.dupont@entreprise.fr"
                  className="bg-background/50 border-border/40"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>
                    Mot de passe <span className="text-red-400">*</span>
                  </Label>
                  <Button type="button" variant="ghost" size="sm" onClick={generatePassword} className="h-6 text-xs">
                    Générer
                  </Button>
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={createForm.password}
                    onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                    placeholder="Minimum 8 caractères"
                    className="bg-background/50 border-border/40 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Téléphone</Label>
                <Input
                  value={createForm.telephone}
                  onChange={(e) => setCreateForm({ ...createForm, telephone: e.target.value })}
                  placeholder="+33 6 12 34 56 78"
                  className="bg-background/50 border-border/40"
                />
              </div>

              <div className="space-y-2">
                <Label>Poste</Label>
                <Input
                  value={createForm.poste}
                  onChange={(e) => setCreateForm({ ...createForm, poste: e.target.value })}
                  placeholder="Responsable Stock"
                  className="bg-background/50 border-border/40"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowCreateModal(false)}
                className="border-border/40 bg-transparent"
              >
                Annuler
              </Button>
              <Button onClick={handleCreateEmployee} disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <UserPlus className="w-4 h-4 mr-2" />
                )}
                Créer l'employé
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showCredentialsModal} onOpenChange={setShowCredentialsModal}>
          <DialogContent className="bg-card border-border/40 max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-green-400">
                <Check className="w-5 h-5" />
                Employé créé avec succès
              </DialogTitle>
              <DialogDescription>
                Voici les identifiants de connexion. Envoyez-les à l'employé de manière sécurisée.
              </DialogDescription>
            </DialogHeader>

            {createdCredentials && (
              <div className="space-y-4 py-4">
                <Alert className="bg-yellow-500/10 border-yellow-500/30">
                  <AlertDescription className="text-yellow-400 text-sm">
                    Ces identifiants ne seront plus affichés. Copiez-les maintenant.
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-background/50 border border-border/40">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Email</p>
                        <p className="font-mono text-sm">{createdCredentials.email}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(createdCredentials.email)}
                        className="h-8 w-8 p-0"
                      >
                        <Copy size={14} />
                      </Button>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-background/50 border border-border/40">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Mot de passe</p>
                        <p className="font-mono text-sm">{createdCredentials.password}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(createdCredentials.password)}
                        className="h-8 w-8 p-0"
                      >
                        <Copy size={14} />
                      </Button>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() =>
                    copyToClipboard(`Email: ${createdCredentials.email}\nMot de passe: ${createdCredentials.password}`)
                  }
                >
                  <Copy size={14} className="mr-2" />
                  Copier tout
                </Button>
              </div>
            )}

            <DialogFooter>
              <Button onClick={() => setShowCredentialsModal(false)}>Fermer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Modal */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="bg-card border-border/40">
            <DialogHeader>
              <DialogTitle>Modifier le membre</DialogTitle>
              <DialogDescription>Mettez à jour les informations de ce membre.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Prénom</Label>
                  <Input
                    value={editForm.prenom}
                    onChange={(e) => setEditForm({ ...editForm, prenom: e.target.value })}
                    className="bg-background/50 border-border/40"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nom</Label>
                  <Input
                    value={editForm.nom}
                    onChange={(e) => setEditForm({ ...editForm, nom: e.target.value })}
                    className="bg-background/50 border-border/40"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Téléphone</Label>
                <Input
                  value={editForm.telephone}
                  onChange={(e) => setEditForm({ ...editForm, telephone: e.target.value })}
                  placeholder="+33 6 12 34 56 78"
                  className="bg-background/50 border-border/40"
                />
              </div>
              <div className="space-y-2">
                <Label>Poste</Label>
                <Input
                  value={editForm.poste}
                  onChange={(e) => setEditForm({ ...editForm, poste: e.target.value })}
                  placeholder="Responsable Stock"
                  className="bg-background/50 border-border/40"
                />
              </div>
              {canManageRoles && editingMember && canManageRole(editingMember.role) && (
                <div className="space-y-2">
                  <Label>Rôle</Label>
                  <Select
                    value={editForm.role}
                    onValueChange={(value: Role) => setEditForm({ ...editForm, role: value })}
                  >
                    <SelectTrigger className="bg-background/50 border-border/40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employe">Employé</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="admin">Admin Invexia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowEditModal(false)}
                className="border-border/40 bg-transparent"
              >
                Annuler
              </Button>
              <Button onClick={handleEdit} disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Enregistrer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showChangeEntrepriseModal} onOpenChange={setShowChangeEntrepriseModal}>
          <DialogContent className="bg-card border-border/40">
            <DialogHeader>
              <DialogTitle>Changer l'entreprise</DialogTitle>
              <DialogDescription>
                Attribuer {selectedMember?.prenom} {selectedMember?.nom} à une autre entreprise
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Entreprise actuelle</label>
                <div className="glass rounded-lg p-3 mt-1 border border-border/40">
                  {selectedMember?.entreprise_nom || "Aucune entreprise"}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Nouvelle entreprise *</label>
                <Select value={selectedEntrepriseId} onValueChange={setSelectedEntrepriseId}>
                  <SelectTrigger className="mt-1 bg-background/50 border-border/40">
                    <SelectValue placeholder="Sélectionner une entreprise" />
                  </SelectTrigger>
                  <SelectContent>
                    {entreprises.map((ent) => (
                      <SelectItem key={ent.id} value={ent.id}>
                        {ent.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowChangeEntrepriseModal(false)} disabled={isLoading}>
                  Annuler
                </Button>
                <Button onClick={handleChangeEntreprise} disabled={isLoading || !selectedEntrepriseId}>
                  {isLoading ? "Changement..." : "Confirmer"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={!!deletingMemberId} onOpenChange={() => setDeletingMemberId(null)}>
          <AlertDialogContent className="bg-card border-border/40">
            <AlertDialogHeader>
              <AlertDialogTitle>Suspendre ce membre ?</AlertDialogTitle>
              <AlertDialogDescription>
                Le compte sera désactivé et l'utilisateur ne pourra plus se connecter. Cette action peut être annulée.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-border/40 bg-transparent">Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Suspendre
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </ProtectedComponent>
  )
}
