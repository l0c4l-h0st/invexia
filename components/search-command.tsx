"use client"

import { useState, useEffect } from "react"
import { Search, X, Package, Users, Grid3x3, FileText, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"

export function SearchCommand() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState<any[]>([])
  const { hasPermission } = useAuth()

  const allItems = [
    // Inventaire
    { type: "inventory", name: "Casque Sans-fil", sku: "WHP-002", icon: Package },
    { type: "inventory", name: "Portefeuille Cuir", sku: "PLW-001", icon: Package },
    { type: "inventory", name: "Clavier Mécanique", sku: "MKB-006", icon: Package },
    { type: "inventory", name: "Support Moniteur", sku: "MOS-005", icon: Package },
    { type: "inventory", name: "Pack Câble USB-C", sku: "UCP-004", icon: Package },

    // Équipe
    { type: "team", name: "Alex Johnson", role: "Admin", icon: Users },
    { type: "team", name: "Sarah Chen", role: "Manager", icon: Users },
    { type: "team", name: "Mike Rodriguez", role: "Observateur", icon: Users },

    // Pages
    { type: "page", name: "Tableau de Bord", url: "/", icon: Grid3x3 },
    { type: "page", name: "Inventaire", url: "/inventory", icon: Package },
    { type: "page", name: "Analytics", url: "/analytics", icon: BarChart3 },
    { type: "page", name: "Équipe", url: "/team", icon: Users },
    { type: "page", name: "Audit", url: "/audit-logs", icon: FileText },
  ]

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setIsOpen(!isOpen)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  useEffect(() => {
    if (!searchQuery) {
      setResults([])
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = allItems.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        (item.sku && item.sku.toLowerCase().includes(query)) ||
        (item.role && item.role.toLowerCase().includes(query)),
    )

    setResults(filtered.slice(0, 10))
  }, [searchQuery])

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-2 bg-muted/50 hover:bg-muted/70 rounded-lg transition-all text-sm text-muted-foreground w-full"
      >
        <Search size={16} />
        <span>Rechercher...</span>
        <span className="ml-auto text-xs">Ctrl K</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 pt-20 md:pt-32 px-4">
          <div className="w-full max-w-2xl glass rounded-xl border border-border/40 overflow-hidden shadow-2xl">
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 md:px-6 py-4 border-b border-border/40">
              <Search size={20} className="text-primary flex-shrink-0" />
              <input
                type="text"
                placeholder="Rechercher produits, équipe, pages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="flex-1 bg-transparent outline-none text-base placeholder-muted-foreground"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0 hover:bg-muted/50"
              >
                <X size={18} />
              </Button>
            </div>

            {/* Results */}
            {searchQuery && (
              <div className="max-h-96 overflow-y-auto divide-y divide-border/40">
                {results.length > 0 ? (
                  results.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setIsOpen(false)}
                      className="w-full px-4 md:px-6 py-3 hover:bg-muted/40 transition-colors text-left flex items-center gap-3 group"
                    >
                      <item.icon size={18} className="text-muted-foreground group-hover:text-primary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.sku || item.role || item.type}</p>
                      </div>
                      <span className="text-xs text-muted-foreground capitalize flex-shrink-0">{item.type}</span>
                    </button>
                  ))
                ) : (
                  <div className="px-6 py-12 text-center text-muted-foreground">
                    Aucun résultat pour "{searchQuery}"
                  </div>
                )}
              </div>
            )}

            {!searchQuery && (
              <div className="px-4 md:px-6 py-4 text-sm text-muted-foreground">
                <p className="mb-3 font-medium">Actions Rapides</p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-muted rounded">Ctrl K</span>
                    <span>pour ouvrir la recherche</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-muted rounded">Esc</span>
                    <span>pour fermer</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
