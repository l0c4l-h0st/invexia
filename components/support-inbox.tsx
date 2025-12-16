"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth, ProtectedComponent } from "@/lib/auth-context"
import { getTickets, updateTicketStatus, type Ticket } from "@/lib/actions/support"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Inbox, Search, User, Calendar, ArrowUpRight, Loader2, RefreshCw } from "lucide-react"

const prioriteColors = {
  basse: "bg-slate-500/20 text-slate-400",
  normale: "bg-blue-500/20 text-blue-400",
  haute: "bg-orange-500/20 text-orange-400",
  urgente: "bg-red-500/20 text-red-400",
}

const statutColors = {
  ouvert: "bg-yellow-500/20 text-yellow-400",
  en_cours: "bg-blue-500/20 text-blue-400",
  en_attente: "bg-purple-500/20 text-purple-400",
  resolu: "bg-green-500/20 text-green-400",
  ferme: "bg-slate-500/20 text-slate-400",
}

const statutLabels = {
  ouvert: "Ouvert",
  en_cours: "En cours",
  en_attente: "En attente",
  resolu: "Résolu",
  ferme: "Fermé",
}

const categorieLabels = {
  general: "Général",
  technique: "Technique",
  facturation: "Facturation",
  fonctionnalite: "Fonctionnalité",
  bug: "Bug",
  autre: "Autre",
}

export function SupportInbox() {
  const router = useRouter()
  const { profil } = useAuth()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    statut: "tous",
    priorite: "toutes",
    categorie: "toutes",
  })

  const loadTickets = async () => {
    setLoading(true)
    const data = await getTickets(filters)
    setTickets(data)
    setLoading(false)
  }

  useEffect(() => {
    loadTickets()
  }, [filters])

  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.sujet.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.numero.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleStatusChange = async (ticketId: string, newStatus: string) => {
    await updateTicketStatus(ticketId, newStatus)
    loadTickets()
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <ProtectedComponent permission="settings:edit">
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <Inbox className="w-7 h-7 text-primary" />
              Boîte Support
            </h1>
            <p className="text-muted-foreground">Gérez les demandes de support et tickets clients</p>
          </div>
          <Button onClick={loadTickets} variant="outline" className="border-border/40 bg-transparent">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Actualiser
          </Button>
        </div>

        {/* Filters */}
        <Card className="bg-card/50 backdrop-blur-xl border-border/40">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par sujet, email ou numéro..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background/50 border-border/40"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Select value={filters.statut} onValueChange={(v) => setFilters({ ...filters, statut: v })}>
                  <SelectTrigger className="w-[140px] bg-background/50 border-border/40">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tous">Tous les statuts</SelectItem>
                    <SelectItem value="ouvert">Ouvert</SelectItem>
                    <SelectItem value="en_cours">En cours</SelectItem>
                    <SelectItem value="en_attente">En attente</SelectItem>
                    <SelectItem value="resolu">Résolu</SelectItem>
                    <SelectItem value="ferme">Fermé</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filters.priorite} onValueChange={(v) => setFilters({ ...filters, priorite: v })}>
                  <SelectTrigger className="w-[140px] bg-background/50 border-border/40">
                    <SelectValue placeholder="Priorité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="toutes">Toutes</SelectItem>
                    <SelectItem value="basse">Basse</SelectItem>
                    <SelectItem value="normale">Normale</SelectItem>
                    <SelectItem value="haute">Haute</SelectItem>
                    <SelectItem value="urgente">Urgente</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filters.categorie} onValueChange={(v) => setFilters({ ...filters, categorie: v })}>
                  <SelectTrigger className="w-[150px] bg-background/50 border-border/40">
                    <SelectValue placeholder="Catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="toutes">Toutes</SelectItem>
                    <SelectItem value="general">Général</SelectItem>
                    <SelectItem value="technique">Technique</SelectItem>
                    <SelectItem value="facturation">Facturation</SelectItem>
                    <SelectItem value="fonctionnalite">Fonctionnalité</SelectItem>
                    <SelectItem value="bug">Bug</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tickets List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredTickets.length === 0 ? (
          <Card className="bg-card/50 backdrop-blur-xl border-border/40">
            <CardContent className="py-12 text-center">
              <Inbox className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucun ticket trouvé</h3>
              <p className="text-muted-foreground">
                {searchQuery ? "Aucun résultat pour votre recherche" : "La boîte de support est vide"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredTickets.map((ticket) => (
              <Card
                key={ticket.id}
                className="bg-card/50 backdrop-blur-xl border-border/40 hover:border-primary/30 transition-colors cursor-pointer"
                onClick={() => router.push(`/admin/support/${ticket.id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Main Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-muted-foreground">{ticket.numero}</span>
                        <Badge className={prioriteColors[ticket.priorite]}>{ticket.priorite}</Badge>
                        <Badge className={statutColors[ticket.statut]}>{statutLabels[ticket.statut]}</Badge>
                      </div>
                      <h3 className="font-medium text-foreground truncate">{ticket.sujet}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {ticket.nom}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(ticket.created_at)}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {categorieLabels[ticket.categorie]}
                        </Badge>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Select
                        value={ticket.statut}
                        onValueChange={(v) => {
                          handleStatusChange(ticket.id, v)
                        }}
                      >
                        <SelectTrigger
                          className="w-[130px] bg-background/50 border-border/40"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ouvert">Ouvert</SelectItem>
                          <SelectItem value="en_cours">En cours</SelectItem>
                          <SelectItem value="en_attente">En attente</SelectItem>
                          <SelectItem value="resolu">Résolu</SelectItem>
                          <SelectItem value="ferme">Fermé</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button size="icon" variant="ghost">
                        <ArrowUpRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ProtectedComponent>
  )
}
