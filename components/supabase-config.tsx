"use client"

import { useEffect } from "react"

export function SupabaseConfig({ url, anonKey }: { url: string; anonKey: string }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).__SUPABASE_CONFIG__ = { url, anonKey }
    }
  }, [url, anonKey])

  return null
}
