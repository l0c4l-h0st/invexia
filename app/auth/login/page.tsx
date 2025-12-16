"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { createBrowserClient } from "@supabase/ssr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Boxes, Eye, EyeOff, Loader2 } from "lucide-react"
import type { SupabaseClient } from "@supabase/supabase-js"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect") || "/"

  useEffect(() => {
    const initSupabase = async () => {
      try {
        const response = await fetch("/api/config")
        if (!response.ok) throw new Error("Config unavailable")
        const config = await response.json()

        if (config.supabaseUrl && config.supabaseAnonKey) {
          const client = createBrowserClient(config.supabaseUrl, config.supabaseAnonKey)
          setSupabase(client)

          // Vérifier si déjà connecté
          const {
            data: { session },
          } = await client.auth.getSession()
          if (session?.user) {
            router.push(redirectTo)
            return
          }
        }
      } catch (err) {
        console.error("Erreur init Supabase:", err)
        setError("Impossible de se connecter au serveur. Veuillez réessayer.")
      } finally {
        setIsInitializing(false)
      }
    }
    initSupabase()
  }, [router, redirectTo])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase) {
      setError("Service non disponible. Veuillez rafraîchir la page.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        if (error.message.includes("Invalid login")) {
          setError("Email ou mot de passe incorrect")
        } else if (error.message.includes("Email not confirmed")) {
          setError("Veuillez confirmer votre email avant de vous connecter")
        } else {
          setError(error.message)
        }
        return
      }

      router.push(redirectTo)
      router.refresh()
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
      {/* Background effects */}
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
            <CardTitle className="text-2xl font-bold text-white">Connexion à Invexia</CardTitle>
            <CardDescription className="text-slate-400">
              Entrez vos identifiants pour accéder à votre espace
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
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
                className="bg-slate-800/50 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-blue-500/20"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={!supabase}
                  className="bg-slate-800/50 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-blue-500/20 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-white/20 bg-slate-800/50 text-blue-500 focus:ring-blue-500/20"
                />
                Se souvenir de moi
              </label>
              <Link href="/auth/reset-password" className="text-blue-400 hover:text-blue-300 transition-colors">
                Mot de passe oublié ?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !supabase}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium h-11"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                "Se connecter"
              )}
            </Button>

            <div className="text-center text-sm text-slate-400">
              Pas encore de compte ?{" "}
              <Link
                href="/auth/inscription"
                className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
              >
                Créer un compte
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
