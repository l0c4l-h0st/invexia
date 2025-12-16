import { Lock } from "lucide-react"

export const metadata = {
  title: "Politique de confidentialité - Invexia",
  description: "Politique de confidentialité et protection des données de la plateforme Invexia",
}

export default function ConfidentialitePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="glass-card p-8 md:p-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <Lock className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-balance">Politique de confidentialité</h1>
              <p className="text-slate-400 text-sm mt-1">Dernière mise à jour : 11 décembre 2024</p>
            </div>
          </div>

          <div className="space-y-8 text-slate-300">
            <section>
              <h2 className="text-xl font-semibold text-slate-100 mb-4">1. Introduction</h2>
              <p className="leading-relaxed">
                Chez Invexia, nous prenons la protection de vos données personnelles très au sérieux. Cette politique
                explique comment nous collectons, utilisons, stockons et protégeons vos informations conformément au
                RGPD et aux réglementations applicables.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-100 mb-4">2. Données collectées</h2>
              <p className="leading-relaxed mb-3">Nous collectons les types de données suivants :</p>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-slate-200 mb-2">Données d'identification :</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-slate-400">
                    <li>Nom, prénom</li>
                    <li>Adresse email</li>
                    <li>Numéro de téléphone (optionnel)</li>
                    <li>Informations de l'entreprise (nom, SIRET, adresse)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-200 mb-2">Données d'utilisation :</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-slate-400">
                    <li>Logs de connexion</li>
                    <li>Adresse IP</li>
                    <li>Actions effectuées sur la plateforme</li>
                    <li>Données de navigation</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-200 mb-2">Données métier :</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-slate-400">
                    <li>Données d'inventaire et produits</li>
                    <li>Informations de stock</li>
                    <li>Données analytiques</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-100 mb-4">3. Utilisation des données</h2>
              <p className="leading-relaxed mb-3">Nous utilisons vos données pour :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Fournir et améliorer nos services</li>
                <li>Gérer votre compte et authentification</li>
                <li>Assurer la sécurité de la plateforme</li>
                <li>Communiquer avec vous concernant le service</li>
                <li>Respecter nos obligations légales</li>
                <li>Générer des statistiques anonymisées</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-100 mb-4">4. Partage des données</h2>
              <p className="leading-relaxed mb-3">
                Nous ne vendons jamais vos données. Nous pouvons les partager uniquement avec :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Les membres de votre entreprise selon les permissions définies</li>
                <li>Nos prestataires techniques (hébergement, support) sous NDA strict</li>
                <li>Les autorités légales si requis par la loi</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-100 mb-4">5. Sécurité des données</h2>
              <p className="leading-relaxed mb-3">Nous mettons en œuvre des mesures de sécurité robustes :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Chiffrement SSL/TLS pour toutes les communications</li>
                <li>Authentification sécurisée avec hachage des mots de passe</li>
                <li>Row Level Security (RLS) sur la base de données</li>
                <li>Logs d'audit complets pour la traçabilité</li>
                <li>Sauvegardes régulières et chiffrées</li>
                <li>Hébergement dans des data centers certifiés ISO 27001</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-100 mb-4">6. Vos droits (RGPD)</h2>
              <p className="leading-relaxed mb-3">Conformément au RGPD, vous disposez des droits suivants :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong className="text-slate-200">Droit d'accès :</strong> Consulter vos données personnelles
                </li>
                <li>
                  <strong className="text-slate-200">Droit de rectification :</strong> Corriger vos données inexactes
                </li>
                <li>
                  <strong className="text-slate-200">Droit à l'effacement :</strong> Supprimer vos données (droit à
                  l'oubli)
                </li>
                <li>
                  <strong className="text-slate-200">Droit à la portabilité :</strong> Récupérer vos données dans un
                  format structuré
                </li>
                <li>
                  <strong className="text-slate-200">Droit d'opposition :</strong> Vous opposer au traitement de vos
                  données
                </li>
                <li>
                  <strong className="text-slate-200">Droit de limitation :</strong> Limiter le traitement dans certains
                  cas
                </li>
              </ul>
              <p className="leading-relaxed mt-4">Pour exercer ces droits, contactez-nous à : privacy@invexia.com</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-100 mb-4">7. Conservation des données</h2>
              <p className="leading-relaxed">
                Nous conservons vos données personnelles aussi longtemps que nécessaire pour fournir nos services et
                respecter nos obligations légales. En cas de suppression de compte, vos données sont effacées sous 30
                jours, sauf obligation légale de conservation (ex: comptabilité).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-100 mb-4">8. Cookies</h2>
              <p className="leading-relaxed">
                Nous utilisons des cookies essentiels pour le fonctionnement de la plateforme (authentification,
                sessions). Aucun cookie de tracking publicitaire n'est utilisé. Vous pouvez gérer les cookies via les
                paramètres de votre navigateur.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-100 mb-4">9. Transferts internationaux</h2>
              <p className="leading-relaxed">
                Vos données sont hébergées dans l'Union Européenne (Supabase EU). En cas de transfert hors UE, nous
                garantissons un niveau de protection équivalent au RGPD via des clauses contractuelles types.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-100 mb-4">10. Contact et réclamations</h2>
              <p className="leading-relaxed mb-2">
                Pour toute question sur cette politique ou pour exercer vos droits :
              </p>
              <ul className="list-none space-y-1 ml-4">
                <li>Email : privacy@invexia.com</li>
                <li>Courrier : Invexia - DPO, [Adresse]</li>
              </ul>
              <p className="leading-relaxed mt-4">
                Vous avez également le droit de déposer une réclamation auprès de la CNIL (Commission Nationale de
                l'Informatique et des Libertés).
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
