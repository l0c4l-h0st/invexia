"use client"

import { useState, useEffect } from "react"
import { Plus, Download, RefreshCw, Loader2, Search, Filter, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { InventoryGrid } from "./inventory-grid"
import { InventoryModal } from "./inventory-modal"
import { useAuth, ProtectedComponent } from "@/lib/auth-context"
import { getProduits, exportProduitsCSV, type Produit } from "@/lib/actions/inventory"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function InventoryPage() {
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Produit | null>(null)
  const [filterBy, setFilterBy] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [produits, setProduits] = useState<Produit[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const { hasPermission } = useAuth()

  const canCreate = hasPermission("inventory:create")
  const canExport = hasPermission("inventory:export")
  const canImport = hasPermission("inventory:import")

  const filterOptions = [
    { value: "all", label: "Tous les Produits" },
    { value: "actif", label: "En Stock" },
    { value: "commande", label: "Stock Faible" },
    { value: "rupture", label: "Rupture de Stock" },
    { value: "inactif", label: "Inactifs" },
  ]

  // Charger les produits
  const loadProduits = async () => {
    setIsLoading(true)
    setError(null)
    const result = await getProduits()
    if (result.error) {
      setError(result.error)
    } else {
      setProduits(result.data || [])
    }
    setIsLoading(false)
  }

  useEffect(() => {
    loadProduits()
  }, [])

  // Filtrer les produits
  const filteredProduits = produits.filter((p) => {
    const matchesFilter = filterBy === "all" || p.statut === filterBy
    const matchesSearch =
      searchQuery === "" ||
      p.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code_barre?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  // Exporter CSV
  const handleExport = async () => {
    setIsExporting(true)
    const result = await exportProduitsCSV()
    if (result.csv) {
      const blob = new Blob([result.csv], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `inventaire_${new Date().toISOString().split("T")[0]}.csv`
      link.click()
      URL.revokeObjectURL(url)
    }
    setIsExporting(false)
  }

  // Ouvrir modal édition
  const handleEdit = (produit: Produit) => {
    setEditingProduct(produit)
    setShowModal(true)
  }

  // Fermer modal
  const handleCloseModal = () => {
    setShowModal(false)
    setEditingProduct(null)
  }

  // Après création/modification
  const handleSuccess = () => {
    handleCloseModal()
    loadProduits()
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1">Inventaire</h1>
          <p className="text-muted-foreground text-sm">
            {filteredProduits.length} produit{filteredProduits.length > 1 ? "s" : ""} trouvé
            {filteredProduits.length > 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={loadProduits}
            disabled={isLoading}
            className="border-border/40 bg-transparent"
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            <span className="hidden sm:inline ml-2">Actualiser</span>
          </Button>

          <ProtectedComponent permission="inventory:import">
            <Button variant="outline" size="sm" className="border-border/40 bg-transparent">
              <Upload size={16} />
              <span className="hidden sm:inline ml-2">Importer</span>
            </Button>
          </ProtectedComponent>

          <ProtectedComponent permission="inventory:export">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={isExporting}
              className="border-border/40 bg-transparent"
            >
              {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
              <span className="hidden sm:inline ml-2">Exporter</span>
            </Button>
          </ProtectedComponent>

          <ProtectedComponent permission="inventory:create">
            <Button
              onClick={() => setShowModal(true)}
              size="sm"
              className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
            >
              <Plus size={16} />
              <span className="ml-2">Ajouter</span>
            </Button>
          </ProtectedComponent>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="glass rounded-xl border border-border/40 p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom, SKU ou code-barres..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/50 border-border/40"
            />
          </div>
          <Button variant="outline" size="sm" className="border-border/40 bg-transparent sm:w-auto w-full">
            <Filter size={16} className="mr-2" />
            Filtres avancés
          </Button>
        </div>

        <div className="flex gap-2 flex-wrap">
          {filterOptions.map((option) => (
            <Button
              key={option.value}
              onClick={() => setFilterBy(option.value)}
              variant={filterBy === option.value ? "default" : "outline"}
              size="sm"
              className={
                filterBy === option.value ? "bg-primary hover:bg-primary/90" : "border-border/40 bg-transparent"
              }
            >
              {option.label}
              {option.value !== "all" && (
                <span className="ml-1.5 text-xs opacity-70">
                  ({produits.filter((p) => p.statut === option.value).length})
                </span>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <Alert variant="destructive" className="bg-red-500/10 border-red-500/30">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <ProtectedComponent permission="inventory:view">
          <InventoryGrid produits={filteredProduits} onEdit={handleEdit} onRefresh={loadProduits} />
        </ProtectedComponent>
      )}

      {/* Modal */}
      {showModal && (
        <InventoryModal onClose={handleCloseModal} onSuccess={handleSuccess} editingProduct={editingProduct} />
      )}
    </div>
  )
}
