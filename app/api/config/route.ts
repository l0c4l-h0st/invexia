import { NextResponse } from "next/server"

export async function GET() {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({ error: "Configuration Supabase manquante" }, { status: 500 })
  }

  return NextResponse.json({
    supabaseUrl,
    supabaseAnonKey,
  })
}
