"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth, ProtectedComponent } from "@/lib/auth-context"
import { getTicketStats } from "@/lib/actions/support"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Inbox,
  Users,
  Building2,
  AlertTriangle,
  CheckCircle,
  Clock,
  MessageSquare,
  ArrowRight,
  Shield,
  Activity,
  Loader2,
} from "lucide-react"

export function AdminDashboard() {
  const { profil } = useAuth()
  const [stats, setStats] = useState({
    total: 0,
    ouverts: 0,
    enCours: 0,
    resolus: 0,
    urgents: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      const data = await getTicketStats()
      setStats(data)
      setLoading(false)
    }
    loadStats()
  }, [])

  const isAdmin = profil?.role === "admin"

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-4">
        <Shield className="w-16 h-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Accès Restreint</h1>
        <p className="text-muted-foreground max-w-md">
          Cette section est réservée aux administrateurs Invexia. Contactez le support si vous pensez que c'est une
          erreur.
        </p>
      </div>
    )
  }

  return (
    <ProtectedComponent permission="entreprise:manage">
      <div className="p-4 md:p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Panel Administration Invexia</h1>
            <p className="text-muted-foreground">Gestion globale de toutes les entreprises</p>
          </div>
          <Badge variant="outline" className="w-fit bg-red-500/10 text-red-400 border-red-500/30">
            Admin Invexia
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card/50 backdrop-blur-xl border-border/40">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 md:p-3 rounded-xl bg-blue-500/20">
                  <Inbox className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">Total Tickets</p>
                  <p className="text-xl md:text-2xl font-bold">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : stats.total}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-xl border-border/40">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 md:p-3 rounded-xl bg-yellow-500/20">
                  <Clock className="w-5 h-5 md:w-6 md:h-6 text-yellow-400" />
                </div>
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">En Attente</p>
                  <p className="text-xl md:text-2xl font-bold">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : stats.ouverts}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-xl border-border/40">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 md:p-3 rounded-xl bg-green-500/20">
                  <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">Résolus</p>
                  <p className="text-xl md:text-2xl font-bold">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : stats.resolus}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-xl border-border/40">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 md:p-3 rounded-xl bg-red-500/20">
                  <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 text-red-400" />
                </div>
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">Urgents</p>
                  <p className="text-xl md:text-2xl font-bold">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : stats.urgents}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Support Inbox */}
          <Card className="bg-card/50 backdrop-blur-xl border-border/40 hover:border-primary/50 transition-colors group">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                  <MessageSquare className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-lg">Boîte Support</CardTitle>
                  <CardDescription>Répondre aux demandes clients</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Consultez et répondez aux tickets de support des entreprises clientes.
              </p>
              <Link href="/admin/support">
                <Button className="w-full group-hover:bg-primary">
                  Ouvrir la Boîte
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Company Management */}
          <Card className="bg-card/50 backdrop-blur-xl border-border/40 hover:border-primary/50 transition-colors group">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20">
                  <Building2 className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <CardTitle className="text-lg">Entreprises</CardTitle>
                  <CardDescription>Gestion des clients</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Gérez toutes les entreprises inscrites, leurs plans et leurs données.
              </p>
              <Link href="/admin/entreprises">
                <Button variant="outline" className="w-full border-border/40 bg-transparent">
                  Voir les Entreprises
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* User Management */}
          <Card className="bg-card/50 backdrop-blur-xl border-border/40 hover:border-primary/50 transition-colors group">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20">
                  <Users className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <CardTitle className="text-lg">Tous les Utilisateurs</CardTitle>
                  <CardDescription>Vue globale</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Voir tous les utilisateurs de toutes les entreprises.
              </p>
              <Link href="/team">
                <Button variant="outline" className="w-full border-border/40 bg-transparent">
                  Gérer les Utilisateurs
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Activity Logs */}
          <Card className="bg-card/50 backdrop-blur-xl border-border/40 hover:border-primary/50 transition-colors group">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                  <Activity className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-lg">Audit & Logs</CardTitle>
                  <CardDescription>Traçabilité système</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Consultez l'historique des actions et les logs système.
              </p>
              <Link href="/audit-logs">
                <Button variant="outline" className="w-full border-border/40 bg-transparent">
                  Voir les Logs
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedComponent>
  )
}
