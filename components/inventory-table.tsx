"use client"

import { useState, useEffect } from "react"
import { Edit2, Trash2, Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth, ProtectedComponent } from "@/lib/auth-context"
import { getRecentProducts, type RecentProduct } from "@/lib/actions/dashboard"

export function InventoryTable() {
  const { hasPermission, profil } = useAuth()
  const [items, setItems] = useState<RecentProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadProducts() {
      if (!profil) return
      setIsLoading(true)
      const result = await getRecentProducts()
      if (result.data) {
        setItems(result.data)
      }
      setIsLoading(false)
    }
    loadProducts()
  }, [profil])

  const canEdit = hasPermission("inventory:edit")
  const canDelete = hasPermission("inventory:delete")

  if (isLoading) {
    return (
      <div className="glass rounded-xl border border-border/40 p-8 flex items-center justify-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="glass rounded-xl border border-border/40 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-border/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg md:text-xl font-bold">Inventaire Récent</h2>
          <p className="text-sm text-muted-foreground mt-1">Gestion de vos produits</p>
        </div>
        <ProtectedComponent permission="inventory:create">
          <Button className="w-full md:w-auto bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
            <Plus size={18} className="mr-2" />
            <span className="hidden sm:inline">Ajouter</span>
            <span className="sm:hidden">+</span>
          </Button>
        </ProtectedComponent>
      </div>

      {/* Table */}
      <div className="overflow-x-auto flex-1">
        {items.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <p>Aucun produit dans votre inventaire</p>
            <p className="text-sm mt-2">Commencez par ajouter un produit</p>
          </div>
        ) : (
          <table className="w-full text-sm md:text-base">
            <thead>
              <tr className="border-b border-border/40 bg-muted/30">
                <th className="px-4 md:px-6 py-3 text-left font-semibold text-muted-foreground text-xs md:text-sm">
                  Produit
                </th>
                <th className="px-4 md:px-6 py-3 text-left font-semibold text-muted-foreground text-xs md:text-sm">
                  SKU
                </th>
                <th className="px-4 md:px-6 py-3 text-left font-semibold text-muted-foreground text-xs md:text-sm">
                  Stock
                </th>
                <th className="hidden sm:table-cell px-4 md:px-6 py-3 text-left font-semibold text-muted-foreground text-xs md:text-sm">
                  Catégorie
                </th>
                <th className="hidden md:table-cell px-4 md:px-6 py-3 text-left font-semibold text-muted-foreground text-xs md:text-sm">
                  Prix
                </th>
                {(canEdit || canDelete) && (
                  <th className="px-4 md:px-6 py-3 text-left font-semibold text-muted-foreground text-xs md:text-sm">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-border/40 hover:bg-muted/40 transition-colors duration-300 group"
                >
                  <td className="px-4 md:px-6 py-4 font-medium text-sm md:text-base">{item.nom}</td>
                  <td className="px-4 md:px-6 py-4 text-muted-foreground text-xs md:text-sm font-mono">{item.sku}</td>
                  <td className="px-4 md:px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs md:text-sm font-medium transition-all ${
                        item.quantite < 20
                          ? "bg-red-100/80 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                          : "bg-green-100/80 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                      }`}
                    >
                      {item.quantite}
                    </span>
                  </td>
                  <td className="hidden sm:table-cell px-4 md:px-6 py-4 text-muted-foreground text-xs md:text-sm">
                    {item.categorie}
                  </td>
                  <td className="hidden md:table-cell px-4 md:px-6 py-4 font-medium text-sm md:text-base">
                    {item.prix_unitaire.toFixed(2)}€
                  </td>
                  {(canEdit || canDelete) && (
                    <td className="px-4 md:px-6 py-4">
                      <div className="flex items-center gap-2">
                        {canEdit && (
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-primary/10">
                            <Edit2 size={16} className="text-primary" />
                          </Button>
                        )}
                        {canDelete && (
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-destructive/10">
                            <Trash2 size={16} className="text-destructive" />
                          </Button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
