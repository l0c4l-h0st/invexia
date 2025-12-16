"use client"

import { useState } from "react"
import { Package, Edit2, Trash2, Eye, MoreVertical, AlertTriangle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { useAuth, ProtectedComponent } from "@/lib/auth-context"
import { deleteProduit, type Produit } from "@/lib/actions/inventory"

interface InventoryGridProps {
  produits: Produit[]
  onEdit: (produit: Produit) => void
  onRefresh: () => void
}

export function InventoryGrid({ produits, onEdit, onRefresh }: InventoryGridProps) {
  const { hasPermission } = useAuth()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const canEdit = hasPermission("inventory:edit")
  const canDelete = hasPermission("inventory:delete")

  const getStatusStyles = (statut: string) => {
    switch (statut) {
      case "actif":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "commande":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      case "rupture":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "inactif":
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  const getStatusLabel = (statut: string) => {
    switch (statut) {
      case "actif":
        return "En Stock"
      case "commande":
        return "À Commander"
      case "rupture":
        return "Rupture"
      case "inactif":
        return "Inactif"
      default:
        return statut
    }
  }

  const handleDelete = async () => {
    if (!deletingId) return
    setIsDeleting(true)
    const result = await deleteProduit(deletingId)
    if (result.success) {
      onRefresh()
    }
    setIsDeleting(false)
    setDeletingId(null)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(price)
  }

  if (produits.length === 0) {
    return (
      <div className="glass rounded-xl border border-border/40 p-12 text-center">
        <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Aucun produit trouvé</h3>
        <p className="text-muted-foreground text-sm">Commencez par ajouter votre premier produit à l'inventaire.</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {produits.map((produit) => (
          <div
            key={produit.id}
            className="glass rounded-xl border border-border/40 overflow-hidden hover:border-primary/30 transition-all duration-300 group flex flex-col"
          >
            {/* Header */}
            <div className="p-4 md:p-5 border-b border-border/40 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base mb-1 truncate">{produit.nom}</h3>
                  <p className="text-xs text-muted-foreground font-mono">{produit.sku}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusStyles(produit.statut)}`}
                  >
                    {getStatusLabel(produit.statut)}
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem>
                        <Eye size={14} className="mr-2" />
                        Voir détails
                      </DropdownMenuItem>
                      {canEdit && (
                        <DropdownMenuItem onClick={() => onEdit(produit)}>
                          <Edit2 size={14} className="mr-2" />
                          Modifier
                        </DropdownMenuItem>
                      )}
                      {canDelete && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-400 focus:text-red-400"
                            onClick={() => setDeletingId(produit.id)}
                          >
                            <Trash2 size={14} className="mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Catégorie & Code-barres */}
              <div className="flex items-center gap-2 flex-wrap">
                {produit.categorie && (
                  <span
                    className="px-2 py-0.5 rounded text-xs font-medium"
                    style={{ backgroundColor: `${produit.categorie.couleur}20`, color: produit.categorie.couleur }}
                  >
                    {produit.categorie.nom}
                  </span>
                )}
                {produit.code_barre && (
                  <span className="text-xs text-muted-foreground font-mono bg-muted/50 px-2 py-0.5 rounded">
                    {produit.code_barre}
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-4 md:p-5 space-y-4 flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Stock</p>
                  <div className="flex items-baseline gap-1">
                    <p
                      className={`text-2xl font-bold ${produit.quantite <= produit.quantite_min ? "text-orange-400" : ""}`}
                    >
                      {produit.quantite}
                    </p>
                    <p className="text-xs text-muted-foreground">{produit.unite}</p>
                  </div>
                  {produit.quantite <= produit.quantite_min && (
                    <p className="text-xs text-orange-400 flex items-center gap-1 mt-1">
                      <AlertTriangle size={12} />
                      Min: {produit.quantite_min}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Prix vente</p>
                  <p className="text-2xl font-bold">{formatPrice(produit.prix_vente)}</p>
                  <p className="text-xs text-muted-foreground">Achat: {formatPrice(produit.prix_achat)}</p>
                </div>
              </div>

              {/* Emplacement */}
              {produit.emplacement && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground p-2.5 bg-muted/30 rounded-lg">
                  <Package size={14} className="flex-shrink-0" />
                  <span className="truncate">{produit.emplacement}</span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-border/40 flex gap-2">
              <ProtectedComponent permission="inventory:edit">
                <Button onClick={() => onEdit(produit)} size="sm" className="flex-1 bg-primary hover:bg-primary/90 h-9">
                  <Edit2 size={14} className="mr-2" />
                  Modifier
                </Button>
              </ProtectedComponent>
              <ProtectedComponent permission="inventory:delete">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 border-border/40 hover:bg-red-500/10 hover:border-red-500/30 bg-transparent"
                  onClick={() => setDeletingId(produit.id)}
                >
                  <Trash2 size={14} className="text-red-400" />
                </Button>
              </ProtectedComponent>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent className="bg-card border-border/40">
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce produit ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le produit sera définitivement supprimé de votre inventaire.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border/40 bg-transparent">Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-red-500 hover:bg-red-600">
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
