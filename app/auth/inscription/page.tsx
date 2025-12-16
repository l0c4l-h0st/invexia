"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createBrowserClient } from "@supabase/ssr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Boxes, Eye, EyeOff, Loader2, Check } from "lucide-react"
import type { SupabaseClient } from "@supabase/supabase-js"

export default function InscriptionPage() {
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    email: "",
    password: "",
    confirmPassword: "",
    entrepriseNom: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const initSupabase = async () => {
      try {
        const response = await fetch("/api/config")
        if (!response.ok) throw new Error("Config unavailable")
        const config = await response.json()

        if (config.supabaseUrl && config.supabaseAnonKey) {
          const client = createBrowserClient(config.supabaseUrl, config.supabaseAnonKey)
          setSupabase(client)
        }
      } catch (err) {
        console.error("Erreur init Supabase:", err)
        setError("Impossible de se connecter au serveur. Veuillez réessayer.")
      } finally {
        setIsInitializing(false)
      }
    }
    initSupabase()
  }, [])

  const passwordRequirements = [
    { label: "Au moins 8 caractères", valid: formData.password.length >= 8 },
    { label: "Une lettre majuscule", valid: /[A-Z]/.test(formData.password) },
    { label: "Une lettre minuscule", valid: /[a-z]/.test(formData.password) },
    { label: "Un chiffre", valid: /[0-9]/.test(formData.password) },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase) {
      setError("Service non disponible. Veuillez rafraîchir la page.")
      return
    }

    setIsLoading(true)
    setError(null)

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      setIsLoading(false)
      return
    }

    if (!passwordRequirements.every((r) => r.valid)) {
      setError("Le mot de passe ne respecte pas tous les critères")
      setIsLoading(false)
      return
    }

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/auth/callback`,
          data: {
            prenom: formData.prenom,
            nom: formData.nom,
            entreprise_nom: formData.entrepriseNom,
            // Toujours admin lors de l'inscription publique
            is_new_company: true,
          },
        },
      })

      if (signUpError) {
        if (signUpError.message.includes("already registered")) {
          setError("Cet email est déjà utilisé")
        } else {
          setError(signUpError.message)
        }
        return
      }

      router.push("/auth/inscription-succes")
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 py-8">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-lg relative bg-slate-900/60 backdrop-blur-xl border-white/10 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Boxes className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-white">Créer votre entreprise</CardTitle>
            <CardDescription className="text-slate-400">
              Commencez à gérer votre inventaire en quelques minutes
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="bg-red-500/10 border-red-500/30 text-red-400">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="entrepriseNom" className="text-slate-300">
                Nom de votre entreprise
              </Label>
              <Input
                id="entrepriseNom"
                placeholder="Ma Super Entreprise"
                value={formData.entrepriseNom}
                onChange={(e) => setFormData({ ...formData, entrepriseNom: e.target.value })}
                required
                disabled={!supabase}
                className="bg-slate-800/50 border-white/10 text-white placeholder:text-slate-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prenom" className="text-slate-300">
                  Prénom
                </Label>
                <Input
                  id="prenom"
                  placeholder="Jean"
                  value={formData.prenom}
                  onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                  required
                  disabled={!supabase}
                  className="bg-slate-800/50 border-white/10 text-white placeholder:text-slate-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nom" className="text-slate-300">
                  Nom
                </Label>
                <Input
                  id="nom"
                  placeholder="Dupont"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  required
                  disabled={!supabase}
                  className="bg-slate-800/50 border-white/10 text-white placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">
                Adresse email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="vous@entreprise.fr"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={!supabase}
                className="bg-slate-800/50 border-white/10 text-white placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">
                Mot de passe
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  disabled={!supabase}
                  className="bg-slate-800/50 border-white/10 text-white placeholder:text-slate-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {formData.password && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {passwordRequirements.map((req, i) => (
                    <div
                      key={i}
                      className={`text-xs flex items-center gap-1 ${req.valid ? "text-green-400" : "text-slate-500"}`}
                    >
                      <Check className={`w-3 h-3 ${req.valid ? "opacity-100" : "opacity-30"}`} />
                      {req.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-slate-300">
                Confirmer le mot de passe
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                disabled={!supabase}
                className="bg-slate-800/50 border-white/10 text-white placeholder:text-slate-500"
              />
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-xs text-red-400">Les mots de passe ne correspondent pas</p>
              )}
            </div>

            <label className="flex items-start gap-2 text-sm text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                required
                className="rounded border-white/20 bg-slate-800/50 text-blue-500 focus:ring-blue-500/20 mt-1"
              />
              <span>
                J'accepte les{" "}
                <Link href="/conditions" className="text-blue-400 hover:text-blue-300">
                  conditions d'utilisation
                </Link>{" "}
                et la{" "}
                <Link href="/confidentialite" className="text-blue-400 hover:text-blue-300">
                  politique de confidentialité
                </Link>
              </span>
            </label>

            <Button
              type="submit"
              disabled={isLoading || !supabase}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium h-11"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Création en cours...
                </>
              ) : (
                "Créer mon compte"
              )}
            </Button>

            <div className="text-center text-sm text-slate-400">
              Déjà un compte ?{" "}
              <Link href="/auth/login" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                Se connecter
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
