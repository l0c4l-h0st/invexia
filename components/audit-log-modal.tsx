"use client"

import { X, Copy, Check, Trash2, Loader2 } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { AuditLog } from "@/lib/actions/audit"

interface AuditLogModalProps {
  log: AuditLog
  onClose: () => void
  canDelete?: boolean
  onDelete?: () => void
}

export function AuditLogModal({ log, onClose, canDelete = false, onDelete }: AuditLogModalProps) {
  const [copied, setCopied] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleCopy = () => {
    const text = `
ID: ${log.id}
Horodatage: ${log.timestamp}
Utilisateur: ${log.user_name}
Action: ${log.action}
Ressource: ${log.resource}
Détails: ${log.details}
Adresse IP: ${log.ip_address}
User Agent: ${log.user_agent}
Sévérité: ${log.severity}
    `.trim()
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDelete = async () => {
    if (!onDelete) return
    setDeleting(true)
    try {
      await onDelete()
    } finally {
      setDeleting(false)
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
        second: "2-digit",
      })
    } catch {
      return dateString
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="glass rounded-xl border border-border/40 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 md:p-6 border-b border-border/40 sticky top-0 bg-background/95 backdrop-blur">
          <h2 className="text-lg md:text-2xl font-bold">Détails du Contrôle d'Accès</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 hover:bg-muted">
            <X size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-5 md:p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            <div>
              <p className="text-muted-foreground text-xs md:text-sm mb-2">ID Événement</p>
              <p className="font-mono text-sm md:text-base bg-muted/50 p-2 md:p-3 rounded-lg truncate">{log.id}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs md:text-sm mb-2">Horodatage</p>
              <p className="font-medium text-sm md:text-base">{formatDate(log.timestamp)}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs md:text-sm mb-2">Utilisateur</p>
              <p className="font-medium text-sm md:text-base">{log.user_name}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs md:text-sm mb-2">Action</p>
              <span className="inline-flex items-center px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium bg-primary/10 text-primary">
                {getActionLabel(log.action)}
              </span>
            </div>
          </div>

          <div>
            <p className="text-muted-foreground text-xs md:text-sm mb-2">Ressource</p>
            <p className="font-medium bg-muted/50 rounded-lg p-3 md:p-4 text-sm md:text-base break-words">
              {log.resource}
            </p>
          </div>

          <div>
            <p className="text-muted-foreground text-xs md:text-sm mb-2">Détails</p>
            <p className="bg-muted/50 rounded-lg p-3 md:p-4 text-xs md:text-sm break-words">{log.details}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            <div>
              <p className="text-muted-foreground text-xs md:text-sm mb-2">Adresse IP</p>
              <p className="font-mono text-xs md:text-sm bg-muted/50 p-2 md:p-3 rounded-lg">{log.ip_address}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs md:text-sm mb-2">Sévérité</p>
              <span
                className={`inline-flex items-center px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium ${
                  log.severity === "high"
                    ? "bg-red-100/80 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                    : log.severity === "warning"
                      ? "bg-orange-100/80 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300"
                      : "bg-green-100/80 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                }`}
              >
                {log.severity === "high" ? "Critique" : log.severity === "warning" ? "Avertissement" : "Normal"}
              </span>
            </div>
          </div>

          <div>
            <p className="text-muted-foreground text-xs md:text-sm mb-2">User Agent</p>
            <p className="font-mono text-xs bg-muted/50 rounded-lg p-3 md:p-4 break-all">{log.user_agent}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 md:p-6 border-t border-border/40 flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleCopy}
            variant="outline"
            className="flex-1 flex items-center justify-center gap-2 border-border/40 bg-transparent"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? "Copié" : "Copier"}</span>
          </Button>
          {canDelete && onDelete && (
            <Button
              onClick={handleDelete}
              disabled={deleting}
              variant="outline"
              className="border-destructive/40 hover:bg-destructive/10 text-destructive bg-transparent"
            >
              {deleting ? <Loader2 size={16} className="animate-spin mr-2" /> : <Trash2 size={16} className="mr-2" />}
              <span>Supprimer</span>
            </Button>
          )}
          <Button onClick={onClose} className="flex-1 bg-primary hover:bg-primary/90">
            Fermer
          </Button>
        </div>
      </div>
    </div>
  )
}
