import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/lib/auth-context"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Invexia - Gestion d'Inventaire Premium",
  description:
    "Plateforme SaaS d'inventaire d'entreprise avec contrôle d'accès, analytics en temps réel et audit complet",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.INV_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.INV_PUBLIC_SUPABASE_ANON_KEY

  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        {supabaseUrl && supabaseAnonKey && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if (typeof window !== 'undefined') {
                  window.__SUPABASE_CONFIG__ = {
                    url: '${supabaseUrl}',
                    anonKey: '${supabaseAnonKey}'
                  };
                }
              `,
            }}
          />
        )}
      </head>
      <body className={`font-sans antialiased`}>
        <AuthProvider>
          {children}
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  )
}
