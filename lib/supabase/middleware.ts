import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  const supabaseResponse = NextResponse.next({ request })
  const pathname = request.nextUrl.pathname

  // Routes publiques - pas besoin d'auth
  const publicRoutes = [
    "/auth/login",
    "/auth/inscription",
    "/auth/inscription-succes",
    "/auth/erreur",
    "/auth/callback",
    "/auth/reset-password",
    "/auth/update-password",
    "/api/",
    "/conditions",
    "/confidentialite",
    "/design-system",
  ]

  const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(route))
  const isStaticAsset = pathname.startsWith("/_next/") || pathname.includes(".") || pathname === "/favicon.ico"

  // Pour les routes publiques et assets statiques, pas de vérification auth
  if (isPublicRoute || isStaticAsset) {
    return supabaseResponse
  }

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse
  }

  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => 
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    })

    const { data: { user } } = await supabase.auth.getUser()

    // Rediriger vers login si non connecté
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = "/auth/login"
      url.searchParams.set("redirect", pathname)
      return NextResponse.redirect(url)
    }

    // Vérifier accès admin
    if (pathname.startsWith("/admin")) {
      const { data: profil } = await supabase
        .from("profils")
        .select("role")
        .eq("id", user.id)
        .maybeSingle()

      if (!profil || profil.role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url))
      }
    }

    return supabaseResponse
  } catch {
    // En cas d'erreur (ex: navigation interrompue), laisser passer
    return supabaseResponse
  }
}
