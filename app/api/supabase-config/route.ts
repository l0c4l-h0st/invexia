import { NextResponse } from "next/server"

// Route API pour exposer la config Supabase au client
// L'anon key est conçue pour être publique
export async function GET() {
  return NextResponse.json({
    url: process.env.SUPABASE_URL || "",
    anonKey: process.env.SUPABASE_ANON_KEY || "",
  })
}
