import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, ArrowRight } from "lucide-react"

export default function InscriptionSuccesPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md relative bg-slate-900/60 backdrop-blur-xl border-white/10 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
            <Mail className="w-10 h-10 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-white">Inscription réussie !</CardTitle>
            <CardDescription className="text-slate-400">Un email de confirmation vous a été envoyé</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-slate-800/50 rounded-lg p-4 border border-white/10">
            <h3 className="text-white font-medium mb-2">Prochaines étapes :</h3>
            <ol className="space-y-2 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <span className="bg-blue-500/20 text-blue-400 rounded-full w-5 h-5 flex items-center justify-center text-xs shrink-0 mt-0.5">
                  1
                </span>
                Vérifiez votre boîte de réception (et spam)
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-blue-500/20 text-blue-400 rounded-full w-5 h-5 flex items-center justify-center text-xs shrink-0 mt-0.5">
                  2
                </span>
                Cliquez sur le lien de confirmation
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-blue-500/20 text-blue-400 rounded-full w-5 h-5 flex items-center justify-center text-xs shrink-0 mt-0.5">
                  3
                </span>
                Connectez-vous à votre espace Invexia
              </li>
            </ol>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              asChild
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <Link href="/auth/login">
                Aller à la connexion
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full border-white/10 text-slate-300 hover:bg-white/5 bg-transparent"
            >
              <Link href="/">Retour à l'accueil</Link>
            </Button>
          </div>

          <p className="text-center text-xs text-slate-500">
            Vous n'avez pas reçu l'email ?{" "}
            <button className="text-blue-400 hover:text-blue-300">Renvoyer le lien</button>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
