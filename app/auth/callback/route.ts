import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/onboarding"
  const error = searchParams.get("error")
  const error_description = searchParams.get("error_description")

  if (error) {
    return NextResponse.redirect(
      `${origin}/auth/erreur?error=oauth_error&details=${encodeURIComponent(error_description || error)}`,
    )
  }

  if (code) {
    try {
      const supabase = await createClient()

      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

      if (exchangeError) {
        return NextResponse.redirect(
          `${origin}/auth/erreur?error=exchange_error&details=${encodeURIComponent(exchangeError.message)}`,
        )
      }

      if (!data.session) {
        return NextResponse.redirect(`${origin}/auth/erreur?error=no_session`)
      }

      // Vérifier si profil existe déjà
      const { data: existingProfile } = await supabase.from("profils").select("id").eq("id", data.user.id).maybeSingle()

      if (!existingProfile) {
        const metadata = data.user.user_metadata
        const isNewCompany = metadata?.is_new_company === true

        if (!isNewCompany) {
          return NextResponse.redirect(`${origin}/auth/erreur?error=invalid_signup`)
        }

        const nomEntreprise = metadata?.entreprise_nom || `Entreprise de ${metadata?.prenom || "User"}`

        // Créer l'entreprise
        const { data: newEntreprise, error: entrepriseError } = await supabase
          .from("entreprises")
          .insert({
            nom: nomEntreprise,
            slug: nomEntreprise
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-+|-+$/g, ""),
            email: data.user.email,
            plan: "free",
            actif: true,
            onboarding_complete: false,
          })
          .select()
          .single()

        if (entrepriseError) {
          return NextResponse.redirect(`${origin}/auth/erreur?error=create_company`)
        }

        // Créer le profil avec rôle manager
        const { error: profileError } = await supabase.from("profils").insert({
          id: data.user.id,
          prenom: metadata?.prenom || "",
          nom: metadata?.nom || "",
          role: "manager",
          entreprise_id: newEntreprise.id,
          statut: "actif",
        })

        if (profileError) {
          return NextResponse.redirect(`${origin}/auth/erreur?error=create_profile`)
        }

        // Créer les paramètres de l'entreprise
        await supabase.from("parametres_entreprise").insert({
          entreprise_id: newEntreprise.id,
        })
      }

      return NextResponse.redirect(`${origin}${next}`)
    } catch (err) {
      return NextResponse.redirect(
        `${origin}/auth/erreur?error=server_error&details=${encodeURIComponent(String(err))}`,
      )
    }
  }

  return NextResponse.redirect(`${origin}/auth/erreur?error=missing_code`)
}
