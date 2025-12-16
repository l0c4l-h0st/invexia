"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { createBrowserClient } from "@supabase/ssr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Boxes, Loader2, ArrowLeft, CheckCircle } from "lucide-react"
import type { SupabaseClient } from "@supabase/supabase-js"

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)

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
        setError("Impossible de se connecter au serveur.")
      } finally {
        setIsInitializing(false)
      }
    }
    initSupabase()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase) {
      setError("Service non disponible. Veuillez rafraîchir la page.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      })

      if (error) {
        setError(error.message)
        return
      }

      setSuccess(true)
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md relative bg-slate-900/60 backdrop-blur-xl border-white/10 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Boxes className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-white">Mot de passe oublié</CardTitle>
            <CardDescription className="text-slate-400">
              Entrez votre email pour recevoir un lien de réinitialisation
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          {success ? (
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Email envoyé !</h3>
                <p className="text-slate-400 text-sm">
                  Si un compte existe avec cet email, vous recevrez un lien de réinitialisation.
                </p>
              </div>
              <Link href="/auth/login">
                <Button variant="outline" className="w-full border-white/10 text-white hover:bg-white/5 bg-transparent">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour à la connexion
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="bg-red-500/10 border-red-500/30 text-red-400">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">
                  Adresse email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="vous@entreprise.fr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={!supabase}
                  className="bg-slate-800/50 border-white/10 text-white placeholder:text-slate-500"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading || !supabase}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium h-11"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  "Envoyer le lien"
                )}
              </Button>

              <div className="text-center">
                <Link
                  href="/auth/login"
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Retour à la connexion
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
