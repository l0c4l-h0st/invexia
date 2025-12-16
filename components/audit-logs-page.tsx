"use client"

import { useState, useEffect } from "react"
import { Shield, FileText, Filter, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AuditLogsTable } from "./audit-logs-table"
import { AuditLogModal } from "./audit-log-modal"
import { useAuth, ProtectedComponent } from "@/lib/auth-context"
import { getAuditLogs, getAuditStats, deleteAuditLog, type AuditLog } from "@/lib/actions/audit"

export function AuditLogsPage() {
  const [showFilters, setShowFilters] = useState(false)
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)
  const [actionFilter, setActionFilter] = useState("all")
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [stats, setStats] = useState({ total: 0, today: 0, critical: 0, activeUsers: 0 })
  const [loading, setLoading] = useState(true)
  const { hasPermission } = useAuth()

  const loadData = async () => {
    setLoading(true)
    try {
      const [logsData, statsData] = await Promise.all([getAuditLogs(actionFilter), getAuditStats()])
      setLogs(logsData)
      setStats(statsData)
    } catch (error) {
      console.error("Erreur chargement audit:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [actionFilter])

  const handleDeleteLog = async (id: string) => {
    const result = await deleteAuditLog(id)
    if (result.success) {
      setSelectedLog(null)
      loadData()
    }
  }

  return (
    <ProtectedComponent permission="audit:view">
      <div className="p-4 md:p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Audit</h1>
            <p className="text-muted-foreground text-sm md:text-base">Historique complet et suivi de conformité</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadData}
              disabled={loading}
              className="border-border/40 bg-transparent"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </Button>
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="border-border/40 bg-transparent"
            >
              <Filter size={18} className="mr-2" />
              Filtres
            </Button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="glass rounded-xl border border-border/40 p-5 md:p-6 space-y-4">
            <h3 className="font-bold">Filtrer par Action</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {["all", "created", "updated", "deleted", "accessed", "role_changed", "bulk_import"].map((action) => (
                <Button
                  key={action}
                  onClick={() => setActionFilter(action)}
                  variant={actionFilter === action ? "default" : "outline"}
                  size="sm"
                  className={actionFilter === action ? "bg-primary hover:bg-primary/90" : "border-border/40"}
                >
                  <span className="capitalize text-xs md:text-sm">
                    {action === "role_changed"
                      ? "Rôle Changé"
                      : action === "bulk_import"
                        ? "Import Lot"
                        : action === "all"
                          ? "Tous"
                          : action === "created"
                            ? "Créé"
                            : action === "updated"
                              ? "Modifié"
                              : action === "deleted"
                                ? "Supprimé"
                                : "Accédé"}
                  </span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass rounded-xl p-5 md:p-6 border border-border/40">
            <div className="flex items-center gap-2 mb-2">
              <Shield size={18} className="text-primary" />
              <p className="text-muted-foreground text-xs md:text-sm">Événements Totaux</p>
            </div>
            <p className="text-3xl md:text-4xl font-bold">{stats.total}</p>
          </div>
          <div className="glass rounded-xl p-5 md:p-6 border border-border/40">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={18} className="text-accent" />
              <p className="text-muted-foreground text-xs md:text-sm">Aujourd'hui</p>
            </div>
            <p className="text-3xl md:text-4xl font-bold">{stats.today}</p>
          </div>
          <div className="glass rounded-xl p-5 md:p-6 border border-border/40">
            <p className="text-muted-foreground text-xs md:text-sm mb-2">Événements Critiques</p>
            <p className="text-3xl md:text-4xl font-bold">{stats.critical}</p>
          </div>
          <div className="glass rounded-xl p-5 md:p-6 border border-border/40">
            <p className="text-muted-foreground text-xs md:text-sm mb-2">Utilisateurs Actifs</p>
            <p className="text-3xl md:text-4xl font-bold">{stats.activeUsers}</p>
          </div>
        </div>

        {/* Logs Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw size={32} className="animate-spin text-primary" />
          </div>
        ) : (
          <AuditLogsTable logs={logs} onSelectLog={setSelectedLog} />
        )}

        {/* Modal */}
        {selectedLog && (
          <AuditLogModal
            log={selectedLog}
            onClose={() => setSelectedLog(null)}
            canDelete={hasPermission("audit:delete")}
            onDelete={() => handleDeleteLog(selectedLog.id)}
          />
        )}
      </div>
    </ProtectedComponent>
  )
}
