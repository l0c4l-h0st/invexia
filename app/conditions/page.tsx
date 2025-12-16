import { Shield } from "lucide-react"

export const metadata = {
  title: "Conditions d'utilisation - Invexia",
  description: "Conditions générales d'utilisation de la plateforme Invexia",
}

export default function ConditionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="glass-card p-8 md:p-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <Shield className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-balance">Conditions d'utilisation</h1>
              <p className="text-slate-400 text-sm mt-1">Dernière mise à jour : 11 décembre 2024</p>
            </div>
          </div>

          <div className="space-y-8 text-slate-300">
            <section>
              <h2 className="text-xl font-semibold text-slate-100 mb-4">1. Acceptation des conditions</h2>
              <p className="leading-relaxed">
                En accédant et en utilisant Invexia, vous acceptez d'être lié par ces conditions d'utilisation. Si vous
                n'acceptez pas ces conditions, veuillez ne pas utiliser notre plateforme.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-100 mb-4">2. Description du service</h2>
              <p className="leading-relaxed mb-3">
                Invexia est une plateforme SaaS de gestion d'inventaire destinée aux entreprises. Nous fournissons des
                outils pour :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Gérer votre inventaire et vos produits</li>
                <li>Suivre les stocks en temps réel</li>
                <li>Analyser vos données avec des tableaux de bord</li>
                <li>Gérer votre équipe et les permissions</li>
                <li>Accéder aux logs d'audit pour la conformité</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-100 mb-4">3. Compte utilisateur</h2>
              <p className="leading-relaxed mb-3">
                Pour utiliser Invexia, vous devez créer un compte. Vous êtes responsable de :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Maintenir la confidentialité de vos identifiants</li>
                <li>Toutes les activités effectuées sous votre compte</li>
                <li>Notifier immédiatement tout accès non autorisé</li>
                <li>Fournir des informations exactes et à jour</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-100 mb-4">4. Utilisation acceptable</h2>
              <p className="leading-relaxed mb-3">Vous acceptez de ne pas :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Utiliser la plateforme pour des activités illégales</li>
                <li>Tenter d'accéder à des zones non autorisées</li>
                <li>Perturber ou surcharger nos serveurs</li>
                <li>Copier, modifier ou distribuer notre contenu sans autorisation</li>
                <li>Utiliser des robots ou scripts automatisés non autorisés</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-100 mb-4">5. Propriété intellectuelle</h2>
              <p className="leading-relaxed">
                Tous les droits de propriété intellectuelle de la plateforme Invexia appartiennent à notre société. Vos
                données restent votre propriété, mais vous nous accordez une licence pour les traiter dans le cadre de
                la fourniture du service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-100 mb-4">6. Limitation de responsabilité</h2>
              <p className="leading-relaxed">
                Invexia est fourni "tel quel" sans garantie d'aucune sorte. Nous ne sommes pas responsables des dommages
                directs, indirects ou consécutifs résultant de l'utilisation de notre plateforme.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-100 mb-4">7. Modification des conditions</h2>
              <p className="leading-relaxed">
                Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications seront
                effectives dès leur publication sur cette page. Votre utilisation continue de la plateforme constitue
                votre acceptation des conditions modifiées.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-100 mb-4">8. Contact</h2>
              <p className="leading-relaxed">
                Pour toute question concernant ces conditions, veuillez nous contacter via notre page de support ou à
                l'adresse : legal@invexia.com
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-800">
            <p className="text-sm text-slate-400 text-center">© 2025 Invexia. Tous droits réservés.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
