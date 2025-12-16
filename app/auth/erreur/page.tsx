import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react"

export default async function ErreurPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; details?: string }>
}) {
  const params = await searchParams
  const errorMessages: Record<string, string> = {
    callback_error: "Une erreur s'est produite lors de la confirmation de votre compte.",
    invalid_token: "Le lien de confirmation est invalide ou a expiré.",
    oauth_error: "Erreur lors de l'authentification OAuth.",
    exchange_error: "Impossible d'échanger le code d'autorisation.",
    no_session: "La session n'a pas pu être créée.",
    missing_code: "Code d'autorisation manquant.",
    server_error: "Erreur serveur lors de la création de votre compte.",
    default: "Une erreur inattendue s'est produite.",
  }

  const errorMessage = errorMessages[params.error || ""] || errorMessages.default
  const errorDetails = params.details ? decodeURIComponent(params.details) : null

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md relative bg-slate-900/60 backdrop-blur-xl border-white/10 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg">
            <AlertTriangle className="w-10 h-10 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-white">Oups !</CardTitle>
            <CardDescription className="text-slate-400">{errorMessage}</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {params.error && (
            <div className="bg-slate-800/50 rounded-lg p-3 border border-white/10 space-y-2">
              <p className="text-xs text-slate-500 font-mono">Code erreur: {params.error}</p>
              {errorDetails && <p className="text-xs text-slate-400 break-words">{errorDetails}</p>}
            </div>
          )}

          {(params.error === "exchange_error" || params.error === "invalid_token") && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-sm text-blue-400">
              Le lien de confirmation a peut-être expiré. Essayez de vous réinscrire ou de demander un nouveau lien.
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Button
              asChild
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <Link href="/auth/inscription">
                <RefreshCw className="w-4 h-4 mr-2" />
                Créer un nouveau compte
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full border-white/10 text-slate-300 hover:bg-white/5 bg-transparent"
            >
              <Link href="/auth/login">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Se connecter
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
