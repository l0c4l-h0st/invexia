"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { completeOnboarding, type OnboardingData } from "@/lib/actions/onboarding"
import { Building2, FileText, MapPin, User } from "lucide-react"

interface OnboardingFormProps {
  entreprise: any
}

export function OnboardingForm({ entreprise }: OnboardingFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [step, setStep] = useState(1)

  const [formData, setFormData] = useState<OnboardingData>({
    nom: entreprise?.nom || "",
    email: entreprise?.email || "",
    telephone: "",
    site_web: "",
    siret: "",
    siren: "",
    numero_tva: "",
    forme_juridique: "",
    capital: 0,
    date_creation: "",
    code_naf: "",
    adresse_siege: "",
    ville: "",
    code_postal: "",
    pays: "France",
    responsable_nom: "",
    responsable_fonction: "",
  })

  const handleChange = (field: keyof OnboardingData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const result = await completeOnboarding(formData)

    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      router.push("/")
      router.refresh()
    }
  }

  return (
    <div className="glass-strong w-full max-w-4xl p-8 rounded-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Bienvenue sur Invexia</h1>
        <p className="text-slate-400">Complétez les informations de votre entreprise pour commencer (Étape {step}/4)</p>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`h-2 flex-1 rounded-full ${i <= step ? "bg-blue-500" : "bg-slate-700"}`} />
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Étape 1: Informations générales */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-semibold text-white">Informations générales</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nom" className="text-slate-300">
                  Nom de l'entreprise *
                </Label>
                <Input
                  id="nom"
                  value={formData.nom}
                  onChange={(e) => handleChange("nom", e.target.value)}
                  required
                  className="glass"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-slate-300">
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                  className="glass"
                />
              </div>

              <div>
                <Label htmlFor="telephone" className="text-slate-300">
                  Téléphone *
                </Label>
                <Input
                  id="telephone"
                  value={formData.telephone}
                  onChange={(e) => handleChange("telephone", e.target.value)}
                  required
                  className="glass"
                />
              </div>

              <div>
                <Label htmlFor="site_web" className="text-slate-300">
                  Site web
                </Label>
                <Input
                  id="site_web"
                  value={formData.site_web}
                  onChange={(e) => handleChange("site_web", e.target.value)}
                  className="glass"
                />
              </div>
            </div>
          </div>
        )}

        {/* Étape 2: Informations juridiques */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-semibold text-white">Informations juridiques</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="siret" className="text-slate-300">
                  SIRET *
                </Label>
                <Input
                  id="siret"
                  value={formData.siret}
                  onChange={(e) => handleChange("siret", e.target.value)}
                  required
                  maxLength={14}
                  className="glass"
                />
              </div>

              <div>
                <Label htmlFor="siren" className="text-slate-300">
                  SIREN *
                </Label>
                <Input
                  id="siren"
                  value={formData.siren}
                  onChange={(e) => handleChange("siren", e.target.value)}
                  required
                  maxLength={9}
                  className="glass"
                />
              </div>

              <div>
                <Label htmlFor="numero_tva" className="text-slate-300">
                  Numéro de TVA
                </Label>
                <Input
                  id="numero_tva"
                  value={formData.numero_tva}
                  onChange={(e) => handleChange("numero_tva", e.target.value)}
                  className="glass"
                />
              </div>

              <div>
                <Label htmlFor="forme_juridique" className="text-slate-300">
                  Forme juridique *
                </Label>
                <Input
                  id="forme_juridique"
                  value={formData.forme_juridique}
                  onChange={(e) => handleChange("forme_juridique", e.target.value)}
                  required
                  placeholder="SARL, SAS, etc."
                  className="glass"
                />
              </div>

              <div>
                <Label htmlFor="capital" className="text-slate-300">
                  Capital social (€) *
                </Label>
                <Input
                  id="capital"
                  type="number"
                  value={formData.capital}
                  onChange={(e) => handleChange("capital", Number.parseFloat(e.target.value))}
                  required
                  min="0"
                  step="0.01"
                  className="glass"
                />
              </div>

              <div>
                <Label htmlFor="date_creation" className="text-slate-300">
                  Date de création *
                </Label>
                <Input
                  id="date_creation"
                  type="date"
                  value={formData.date_creation}
                  onChange={(e) => handleChange("date_creation", e.target.value)}
                  required
                  className="glass"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="code_naf" className="text-slate-300">
                  Code NAF/APE
                </Label>
                <Input
                  id="code_naf"
                  value={formData.code_naf}
                  onChange={(e) => handleChange("code_naf", e.target.value)}
                  className="glass"
                />
              </div>
            </div>
          </div>
        )}

        {/* Étape 3: Adresse */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-semibold text-white">Siège social</h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="adresse_siege" className="text-slate-300">
                  Adresse complète *
                </Label>
                <Input
                  id="adresse_siege"
                  value={formData.adresse_siege}
                  onChange={(e) => handleChange("adresse_siege", e.target.value)}
                  required
                  className="glass"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="code_postal" className="text-slate-300">
                    Code postal *
                  </Label>
                  <Input
                    id="code_postal"
                    value={formData.code_postal}
                    onChange={(e) => handleChange("code_postal", e.target.value)}
                    required
                    className="glass"
                  />
                </div>

                <div>
                  <Label htmlFor="ville" className="text-slate-300">
                    Ville *
                  </Label>
                  <Input
                    id="ville"
                    value={formData.ville}
                    onChange={(e) => handleChange("ville", e.target.value)}
                    required
                    className="glass"
                  />
                </div>

                <div>
                  <Label htmlFor="pays" className="text-slate-300">
                    Pays *
                  </Label>
                  <Input
                    id="pays"
                    value={formData.pays}
                    onChange={(e) => handleChange("pays", e.target.value)}
                    required
                    className="glass"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Étape 4: Responsable */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-semibold text-white">Responsable légal</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="responsable_nom" className="text-slate-300">
                  Nom complet *
                </Label>
                <Input
                  id="responsable_nom"
                  value={formData.responsable_nom}
                  onChange={(e) => handleChange("responsable_nom", e.target.value)}
                  required
                  className="glass"
                />
              </div>

              <div>
                <Label htmlFor="responsable_fonction" className="text-slate-300">
                  Fonction *
                </Label>
                <Input
                  id="responsable_fonction"
                  value={formData.responsable_fonction}
                  onChange={(e) => handleChange("responsable_fonction", e.target.value)}
                  required
                  placeholder="Gérant, PDG, etc."
                  className="glass"
                />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="glass-strong border border-red-500/50 p-4 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex gap-4">
          {step > 1 && (
            <Button type="button" variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
              Précédent
            </Button>
          )}
          {step < 4 ? (
            <Button type="button" onClick={() => setStep(step + 1)} className="flex-1">
              Suivant
            </Button>
          ) : (
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Enregistrement..." : "Terminer"}
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
