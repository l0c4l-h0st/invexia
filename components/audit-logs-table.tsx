"use client"

import { Shield, AlertCircle, CheckCircle2, Clock, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { AuditLog } from "@/lib/actions/audit"

interface LogsTableProps {
  logs: AuditLog[]
  onSelectLog: (log: AuditLog) => void
}

export function AuditLogsTable({ logs, onSelectLog }: LogsTableProps) {
  const getActionIcon = (action: string) => {
    switch (action) {
      case "created":
        return <CheckCircle2 size={16} className="text-green-600 dark:text-green-400" />
      case "deleted":
        return <AlertCircle size={16} className="text-red-600 dark:text-red-400" />
      case "updated":
        return <Clock size={16} className="text-blue-600 dark:text-blue-400" />
      default:
        return <Shield size={16} className="text-gray-600 dark:text-gray-400" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100/80 text-red-700 dark:bg-red-900/40 dark:text-red-300"
      case "warning":
        return "bg-orange-100/80 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300"
      default:
        return "bg-green-100/80 text-green-700 dark:bg-green-900/40 dark:text-green-300"
    }
  }

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      created: "Créé",
      updated: "Modifié",
      deleted: "Supprimé",
      accessed: "Accédé",
      role_changed: "Rôle Changé",
      bulk_import: "Import Lot",
    }
    return labels[action] || action
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return dateString
    }
  }

  return (
    <div className="glass rounded-xl border border-border/40 overflow-hidden flex flex-col">
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-sm md:text-base">
          <thead>
            <tr className="border-b border-border/40 bg-muted/30">
              <th className="px-4 md:px-6 py-4 text-left font-semibold text-muted-foreground text-xs md:text-sm">
                Horodatage
              </th>
              <th className="hidden md:table-cell px-4 md:px-6 py-4 text-left font-semibold text-muted-foreground text-xs md:text-sm">
                Utilisateur
              </th>
              <th className="px-4 md:px-6 py-4 text-left font-semibold text-muted-foreground text-xs md:text-sm">
                Action
              </th>
              <th className="hidden lg:table-cell px-4 md:px-6 py-4 text-left font-semibold text-muted-foreground text-xs md:text-sm">
                Ressource
              </th>
              <th className="px-4 md:px-6 py-4 text-left font-semibold text-muted-foreground text-xs md:text-sm">
                Sévérité
              </th>
              <th className="px-4 md:px-6 py-4 text-left font-semibold text-muted-foreground text-xs md:text-sm">
                Voir
              </th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 md:px-6 py-12 text-center text-muted-foreground">
                  Aucun événement enregistré
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-border/40 hover:bg-muted/40 transition-colors duration-300 group"
                >
                  <td className="px-4 md:px-6 py-4 text-xs md:text-sm font-medium font-mono">
                    {formatDate(log.timestamp)}
                  </td>
                  <td className="hidden md:table-cell px-4 md:px-6 py-4 text-xs md:text-sm">{log.user_name}</td>
                  <td className="px-4 md:px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getActionIcon(log.action)}
                      <span className="text-xs md:text-sm font-medium">{getActionLabel(log.action)}</span>
                    </div>
                  </td>
                  <td className="hidden lg:table-cell px-4 md:px-6 py-4 text-xs md:text-sm text-muted-foreground max-w-xs truncate">
                    {log.resource}
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2 md:px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(log.severity)}`}
                    >
                      {log.severity === "high" ? "Critique" : log.severity === "warning" ? "Avertissement" : "Normal"}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <Button
                      onClick={() => onSelectLog(log)}
                      variant="ghost"
                      size="sm"
                      className="text-primary hover:bg-primary/10 h-8 w-8 p-0"
                    >
                      <Eye size={16} />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
