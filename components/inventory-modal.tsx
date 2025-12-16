"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X, Loader2, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createProduit, updateProduit, getCategories, type Produit, type Categorie } from "@/lib/actions/inventory"

interface InventoryModalProps {
  onClose: () => void
  onSuccess: () => void
  editingProduct?: Produit | null
}

export function InventoryModal({ onClose, onSuccess, editingProduct }: InventoryModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<Categorie[]>([])

  const [formData, setFormData] = useState({
    nom: editingProduct?.nom || "",
    sku: editingProduct?.sku || "",
    categorie_id: editingProduct?.categorie_id || "",
    prix_achat: editingProduct?.prix_achat?.toString() || "",
    prix_vente: editingProduct?.prix_vente?.toString() || "",
    quantite: editingProduct?.quantite?.toString() || "0",
    quantite_min: editingProduct?.quantite_min?.toString() || "5",
    unite: editingProduct?.unite || "pièce",
    code_barre: editingProduct?.code_barre || "",
    emplacement: editingProduct?.emplacement || "",
    description: editingProduct?.description || "",
  })

  // Charger les catégories
  useEffect(() => {
    const loadCategories = async () => {
      const result = await getCategories()
      if (result.data) {
        setCategories(result.data)
      }
    }
    loadCategories()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const data = {
        nom: formData.nom,
        sku: formData.sku,
        description: formData.description || undefined,
        code_barre: formData.code_barre || undefined,
        categorie_id: formData.categorie_id || undefined,
        prix_achat: Number.parseFloat(formData.prix_achat) || 0,
        prix_vente: Number.parseFloat(formData.prix_vente) || 0,
        quantite: Number.parseInt(formData.quantite) || 0,
        quantite_min: Number.parseInt(formData.quantite_min) || 0,
        unite: formData.unite,
        emplacement: formData.emplacement || undefined,
      }

      let result
      if (editingProduct) {
        result = await updateProduit(editingProduct.id, data)
      } else {
        result = await createProduit(data)
      }

      if (result.error) {
        setError(result.error)
      } else {
        onSuccess()
      }
    } catch {
      setError("Une erreur est survenue")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="glass rounded-xl border border-border/40 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border/40 sticky top-0 bg-card/95 backdrop-blur z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold">{editingProduct ? "Modifier le produit" : "Nouveau produit"}</h2>
              <p className="text-xs text-muted-foreground">
                {editingProduct ? "Mettez à jour les informations" : "Ajoutez un produit à votre inventaire"}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X size={18} />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {error && (
            <Alert variant="destructive" className="bg-red-500/10 border-red-500/30">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Nom & SKU */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom du produit *</Label>
              <Input
                id="nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
                placeholder="ex: MacBook Pro 14 pouces"
                className="bg-background/50 border-border/40"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">SKU *</Label>
              <Input
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                required
                placeholder="ex: ELEC-001"
                className="bg-background/50 border-border/40 font-mono"
              />
            </div>
          </div>

          {/* Catégorie & Code-barres */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Catégorie</Label>
              <Select
                value={formData.categorie_id}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, categorie_id: value }))}
              >
                <SelectTrigger className="bg-background/50 border-border/40">
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.couleur }} />
                        {cat.nom}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="code_barre">Code-barres</Label>
              <Input
                id="code_barre"
                name="code_barre"
                value={formData.code_barre}
                onChange={handleChange}
                placeholder="ex: 5901234123457"
                className="bg-background/50 border-border/40 font-mono"
              />
            </div>
          </div>

          {/* Prix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prix_achat">Prix d'achat (€) *</Label>
              <Input
                id="prix_achat"
                name="prix_achat"
                type="number"
                step="0.01"
                min="0"
                value={formData.prix_achat}
                onChange={handleChange}
                required
                placeholder="0.00"
                className="bg-background/50 border-border/40"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prix_vente">Prix de vente (€) *</Label>
              <Input
                id="prix_vente"
                name="prix_vente"
                type="number"
                step="0.01"
                min="0"
                value={formData.prix_vente}
                onChange={handleChange}
                required
                placeholder="0.00"
                className="bg-background/50 border-border/40"
              />
            </div>
          </div>

          {/* Quantité */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantite">Quantité en stock</Label>
              <Input
                id="quantite"
                name="quantite"
                type="number"
                min="0"
                value={formData.quantite}
                onChange={handleChange}
                className="bg-background/50 border-border/40"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantite_min">Seuil minimum</Label>
              <Input
                id="quantite_min"
                name="quantite_min"
                type="number"
                min="0"
                value={formData.quantite_min}
                onChange={handleChange}
                className="bg-background/50 border-border/40"
              />
            </div>
            <div className="space-y-2">
              <Label>Unité</Label>
              <Select
                value={formData.unite}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, unite: value }))}
              >
                <SelectTrigger className="bg-background/50 border-border/40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pièce">Pièce</SelectItem>
                  <SelectItem value="kg">Kilogramme</SelectItem>
                  <SelectItem value="litre">Litre</SelectItem>
                  <SelectItem value="mètre">Mètre</SelectItem>
                  <SelectItem value="lot">Lot</SelectItem>
                  <SelectItem value="paquet">Paquet</SelectItem>
                  <SelectItem value="carton">Carton</SelectItem>
                  <SelectItem value="licence">Licence</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Emplacement */}
          <div className="space-y-2">
            <Label htmlFor="emplacement">Emplacement</Label>
            <Input
              id="emplacement"
              name="emplacement"
              value={formData.emplacement}
              onChange={handleChange}
              placeholder="ex: Entrepôt A - Rayon 3 - Étagère 2"
              className="bg-background/50 border-border/40"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description détaillée du produit..."
              rows={3}
              className="bg-background/50 border-border/40 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-border/40">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-border/40 bg-transparent"
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {editingProduct ? "Modification..." : "Création..."}
                </>
              ) : editingProduct ? (
                "Enregistrer"
              ) : (
                "Créer le produit"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
