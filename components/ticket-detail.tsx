"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { getTicketById, updateTicketStatus, addReponse, type Ticket, type ReponseTicket } from "@/lib/actions/support"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, User, Mail, Calendar, Send, Loader2, Building2, MessageSquare, Lock } from "lucide-react"

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

export function TicketDetail({ ticketId }: { ticketId: string }) {
  const router = useRouter()
  const { profil } = useAuth()
  const [ticket, setTicket] = useState<(Ticket & { reponses: ReponseTicket[] }) | null>(null)
  const [loading, setLoading] = useState(true)
  const [reponse, setReponse] = useState("")
  const [estInterne, setEstInterne] = useState(false)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    async function load() {
      const data = await getTicketById(ticketId)
      setTicket(data)
      setLoading(false)
    }
    load()
  }, [ticketId])

  const handleSendReponse = async () => {
    if (!reponse.trim()) return
    setSending(true)
    await addReponse(ticketId, reponse, estInterne)
    const updated = await getTicketById(ticketId)
    setTicket(updated)
    setReponse("")
    setSending(false)
  }

  const handleStatusChange = async (newStatus: string) => {
    await updateTicketStatus(ticketId, newStatus)
    const updated = await getTicketById(ticketId)
    setTicket(updated)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-xl font-bold mb-2">Ticket non trouvé</h1>
        <Button onClick={() => router.push("/admin/support")}>Retour à la boîte</Button>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/admin/support")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-mono text-muted-foreground">{ticket.numero}</span>
            <Badge className={prioriteColors[ticket.priorite]}>{ticket.priorite}</Badge>
            <Badge className={statutColors[ticket.statut]}>{ticket.statut}</Badge>
          </div>
          <h1 className="text-xl md:text-2xl font-bold">{ticket.sujet}</h1>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Original Message */}
          <Card className="bg-card/50 backdrop-blur-xl border-border/40">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Message Original
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3 mb-4">
                <Avatar>
                  <AvatarFallback className="bg-primary/20 text-primary">
                    {ticket.nom.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{ticket.nom}</p>
                  <p className="text-sm text-muted-foreground">{ticket.email}</p>
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 whitespace-pre-wrap">{ticket.message}</div>
            </CardContent>
          </Card>

          {/* Responses */}
          {ticket.reponses && ticket.reponses.length > 0 && (
            <Card className="bg-card/50 backdrop-blur-xl border-border/40">
              <CardHeader>
                <CardTitle className="text-lg">Conversation ({ticket.reponses.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {ticket.reponses.map((rep) => (
                  <div
                    key={rep.id}
                    className={`p-4 rounded-lg ${rep.est_interne ? "bg-yellow-500/10 border border-yellow-500/20" : "bg-muted/50"}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs">
                          {rep.profil?.prenom?.[0] || "?"}
                          {rep.profil?.nom?.[0] || ""}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {rep.profil?.prenom} {rep.profil?.nom}
                          {rep.est_interne && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              <Lock className="w-3 h-3 mr-1" />
                              Interne
                            </Badge>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">{formatDate(rep.created_at)}</p>
                      </div>
                    </div>
                    <p className="whitespace-pre-wrap text-sm">{rep.message}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Reply Form */}
          <Card className="bg-card/50 backdrop-blur-xl border-border/40">
            <CardHeader>
              <CardTitle className="text-lg">Répondre</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Écrivez votre réponse..."
                value={reponse}
                onChange={(e) => setReponse(e.target.value)}
                rows={5}
                className="bg-background/50 border-border/40"
              />
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={estInterne}
                    onChange={(e) => setEstInterne(e.target.checked)}
                    className="rounded border-border"
                  />
                  <Lock className="w-4 h-4" />
                  Note interne (non visible par le client)
                </label>
                <Button onClick={handleSendReponse} disabled={sending || !reponse.trim()}>
                  {sending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                  Envoyer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Info Card */}
          <Card className="bg-card/50 backdrop-blur-xl border-border/40">
            <CardHeader>
              <CardTitle className="text-lg">Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Client</p>
                  <p className="font-medium">{ticket.nom}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-sm">{ticket.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Créé le</p>
                  <p className="font-medium text-sm">{formatDate(ticket.created_at)}</p>
                </div>
              </div>
              {ticket.entreprise_id && (
                <div className="flex items-center gap-3">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Entreprise</p>
                    <p className="font-medium">Client enregistré</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Status Card */}
          <Card className="bg-card/50 backdrop-blur-xl border-border/40">
            <CardHeader>
              <CardTitle className="text-lg">Gestion</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Statut</label>
                <Select value={ticket.statut} onValueChange={handleStatusChange}>
                  <SelectTrigger className="bg-background/50 border-border/40">
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
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Catégorie</label>
                <Badge variant="outline" className="text-sm">
                  {ticket.categorie}
                </Badge>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Priorité</label>
                <Badge className={prioriteColors[ticket.priorite]}>{ticket.priorite}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
