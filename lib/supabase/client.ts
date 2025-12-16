import { createBrowserClient, type SupabaseClient } from "@supabase/ssr"

export interface SupabaseConfig {
  url: string
  anonKey: string
}

let supabaseClient: SupabaseClient | null = null
let isInitialized = false
let currentConfig: SupabaseConfig | null = null

export function createClient(config?: SupabaseConfig): SupabaseClient | null {
  if (typeof window === "undefined") {
    return null
  }

  if (isInitialized && supabaseClient) {
    return supabaseClient
  }

  // Récupérer la config depuis window si pas fournie
  const windowConfig = (window as any).__SUPABASE_CONFIG__ as SupabaseConfig | undefined
  const finalConfig = config || currentConfig || windowConfig

  if (!finalConfig?.url || !finalConfig?.anonKey) {
    return null
  }

  if (!supabaseClient) {
    currentConfig = finalConfig
    supabaseClient = createBrowserClient(finalConfig.url, finalConfig.anonKey)
    isInitialized = true
  }

  return supabaseClient
}

export function setConfig(config: SupabaseConfig): void {
  currentConfig = config
}

export function getClient(): SupabaseClient | null {
  return supabaseClient
}

export function isClientReady(): boolean {
  return isInitialized && supabaseClient !== null
}
