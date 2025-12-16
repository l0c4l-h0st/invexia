// Configuration Supabase centralisée
// Ces valeurs sont publiques (anon key est conçue pour être exposée)
export const supabaseConfig = {
  url: process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  anonKey: process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
}

// Pour le client browser, on expose via une route API
export async function getSupabaseConfig() {
  if (typeof window === "undefined") {
    return supabaseConfig
  }

  // Côté client, fetch depuis l'API
  const res = await fetch("/api/supabase-config")
  return res.json()
}
