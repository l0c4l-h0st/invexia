import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Variables Supabase manquantes dans le middleware")
    return supabaseResponse
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
      },
    },
  })

  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data?.user
  } catch (error) {
    console.error("Erreur auth middleware:", error)
  }

  const pathname = request.nextUrl.pathname

  const publicRoutes = [
    "/auth/login",
    "/auth/inscription",
    "/auth/inscription-succes",
    "/auth/erreur",
    "/auth/callback",
    "/auth/reset-password",
    "/auth/update-password",
    "/api/config",
    "/conditions",
    "/confidentialite",
  ]

  const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"))
  const isApiRoute = pathname.startsWith("/api/")
  const isStaticAsset = pathname.startsWith("/_next/") || pathname.includes(".")

  if (!user && !isPublicRoute && !isApiRoute && !isStaticAsset) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    url.searchParams.set("redirect", pathname)
    return NextResponse.redirect(url)
  }

  const adminRoutes = ["/admin"]
  const isAdminRoute = adminRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"))

  if (isAdminRoute && user) {
    const { data: profil } = await supabase.from("profils").select("role").eq("id", user.id).maybeSingle()

    if (!profil || profil.role !== "admin") {
      const url = request.nextUrl.clone()
      url.pathname = "/"
      return NextResponse.redirect(url)
    }
  }

  if (pathname.startsWith("/auth/") && !pathname.includes("/callback") && user) {
    const url = request.nextUrl.clone()
    const redirect = url.searchParams.get("redirect") || "/"
    url.pathname = redirect
    url.searchParams.delete("redirect")
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
