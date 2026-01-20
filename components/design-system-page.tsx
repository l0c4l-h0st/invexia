"use client"

import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Package, Users, BarChart3, Settings, Check, AlertTriangle, Info, X } from "lucide-react"

export function DesignSystemPage() {
  const colors = {
    primary: [
      {
        name: "Primary",
        var: "--primary",
        light: "oklch(0.35 0.15 280)",
        dark: "oklch(0.65 0.22 260)",
        hex: "#4F46E5",
        usage: "Boutons principaux, liens, focus",
      },
      {
        name: "Primary Foreground",
        var: "--primary-foreground",
        light: "oklch(0.98 0 0)",
        dark: "oklch(0.09 0.01 280)",
        hex: "#FAFAFA",
        usage: "Texte sur fond primary",
      },
    ],
    secondary: [
      {
        name: "Secondary",
        var: "--secondary",
        light: "oklch(0.5 0.1 200)",
        dark: "oklch(0.55 0.18 200)",
        hex: "#0EA5E9",
        usage: "Boutons secondaires, accents",
      },
      {
        name: "Secondary Foreground",
        var: "--secondary-foreground",
        light: "oklch(0.98 0 0)",
        dark: "oklch(0.98 0 0)",
        hex: "#FAFAFA",
        usage: "Texte sur fond secondary",
      },
    ],
    accent: [
      {
        name: "Accent",
        var: "--accent",
        light: "oklch(0.6 0.2 260)",
        dark: "oklch(0.75 0.28 260)",
        hex: "#8B5CF6",
        usage: "Éléments de mise en valeur, badges",
      },
      {
        name: "Accent Foreground",
        var: "--accent-foreground",
        light: "oklch(0.98 0 0)",
        dark: "oklch(0.09 0.01 280)",
        hex: "#FAFAFA",
        usage: "Texte sur fond accent",
      },
    ],
    neutral: [
      {
        name: "Background",
        var: "--background",
        light: "oklch(0.98 0.001 280)",
        dark: "oklch(0.09 0.012 280)",
        hex: "#FAFAFA / #0D0D14",
        usage: "Fond principal de l'app",
      },
      {
        name: "Foreground",
        var: "--foreground",
        light: "oklch(0.15 0.01 280)",
        dark: "oklch(0.95 0.01 280)",
        hex: "#1A1A2E / #F0F0F5",
        usage: "Texte principal",
      },
      {
        name: "Muted",
        var: "--muted",
        light: "oklch(0.92 0.005 280)",
        dark: "oklch(0.22 0.01 280)",
        hex: "#E8E8ED / #2A2A3A",
        usage: "Fonds secondaires, disabled",
      },
      {
        name: "Muted Foreground",
        var: "--muted-foreground",
        light: "oklch(0.45 0.02 280)",
        dark: "oklch(0.7 0.02 280)",
        hex: "#6B6B80 / #A0A0B5",
        usage: "Texte secondaire, placeholders",
      },
      {
        name: "Border",
        var: "--border",
        light: "oklch(0.922 0.002 280)",
        dark: "oklch(0.2 0.012 280)",
        hex: "#E5E5EA / #282838",
        usage: "Bordures, séparateurs",
      },
    ],
    semantic: [
      {
        name: "Destructive",
        var: "--destructive",
        light: "oklch(0.577 0.245 27.325)",
        dark: "oklch(0.396 0.141 25.723)",
        hex: "#EF4444",
        usage: "Erreurs, actions dangereuses",
      },
      {
        name: "Success",
        var: "--chart-2",
        light: "oklch(0.6 0.118 184.704)",
        dark: "oklch(0.696 0.17 162.48)",
        hex: "#10B981",
        usage: "Succès, validations",
      },
      {
        name: "Warning",
        var: "--chart-1",
        light: "oklch(0.646 0.222 41.116)",
        dark: "oklch(0.488 0.243 264.376)",
        hex: "#F59E0B",
        usage: "Alertes, avertissements",
      },
      {
        name: "Info",
        var: "--secondary",
        light: "oklch(0.5 0.1 200)",
        dark: "oklch(0.55 0.18 200)",
        hex: "#3B82F6",
        usage: "Informations, aide",
      },
    ],
    charts: [
      {
        name: "Chart 1",
        var: "--chart-1",
        light: "oklch(0.646 0.222 41.116)",
        hex: "#F97316",
        usage: "Graphiques - Orange",
      },
      {
        name: "Chart 2",
        var: "--chart-2",
        light: "oklch(0.6 0.118 184.704)",
        hex: "#14B8A6",
        usage: "Graphiques - Teal",
      },
      {
        name: "Chart 3",
        var: "--chart-3",
        light: "oklch(0.398 0.07 227.392)",
        hex: "#6366F1",
        usage: "Graphiques - Indigo",
      },
      {
        name: "Chart 4",
        var: "--chart-4",
        light: "oklch(0.828 0.189 84.429)",
        hex: "#FBBF24",
        usage: "Graphiques - Jaune",
      },
      {
        name: "Chart 5",
        var: "--chart-5",
        light: "oklch(0.769 0.188 70.08)",
        hex: "#FB923C",
        usage: "Graphiques - Orange clair",
      },
    ],
  }

  const typography = [
    { name: "Display", class: "text-4xl font-bold", size: "36px", weight: "700", usage: "Titres de page principaux" },
    { name: "Heading 1", class: "text-3xl font-semibold", size: "30px", weight: "600", usage: "Titres de section" },
    { name: "Heading 2", class: "text-2xl font-semibold", size: "24px", weight: "600", usage: "Sous-titres" },
    { name: "Heading 3", class: "text-xl font-medium", size: "20px", weight: "500", usage: "Titres de carte" },
    { name: "Body Large", class: "text-lg", size: "18px", weight: "400", usage: "Texte important" },
    { name: "Body", class: "text-base", size: "16px", weight: "400", usage: "Texte courant" },
    { name: "Body Small", class: "text-sm", size: "14px", weight: "400", usage: "Labels, descriptions" },
    { name: "Caption", class: "text-xs", size: "12px", weight: "400", usage: "Notes, métadonnées" },
  ]

  const spacing = [
    { name: "xs", value: "4px", class: "p-1", usage: "Espacement minimal" },
    { name: "sm", value: "8px", class: "p-2", usage: "Espacement serré" },
    { name: "md", value: "16px", class: "p-4", usage: "Espacement standard" },
    { name: "lg", value: "24px", class: "p-6", usage: "Espacement large" },
    { name: "xl", value: "32px", class: "p-8", usage: "Espacement très large" },
    { name: "2xl", value: "48px", class: "p-12", usage: "Espacement maximal" },
  ]

  const radius = [
    { name: "sm", value: "calc(0.875rem - 4px)", class: "rounded-sm", usage: "Boutons, inputs" },
    { name: "md", value: "calc(0.875rem - 2px)", class: "rounded-md", usage: "Cartes petites" },
    { name: "lg", value: "0.875rem", class: "rounded-lg", usage: "Cartes, modales" },
    { name: "xl", value: "calc(0.875rem + 4px)", class: "rounded-xl", usage: "Conteneurs larges" },
    { name: "full", value: "9999px", class: "rounded-full", usage: "Avatars, badges" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Logo size="lg" />
          <h1 className="text-xl font-semibold">Direction Artistique</h1>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 space-y-16">
        {/* Introduction */}
        <section>
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold mb-4">Identité Visuelle Invexia</h2>
            <p className="text-lg text-muted-foreground">
              Cette page présente l'ensemble des éléments graphiques qui composent l'identité visuelle d'Invexia. Notre
              design system est basé sur l'esthétique <strong>Liquid Glass</strong> avec des effets de transparence, de
              flou et de reflets subtils pour créer une interface moderne et premium.
            </p>
          </div>
        </section>

        {/* Logo */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Logo</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Mode Clair</CardTitle>
                <CardDescription>Utilisation sur fond clair</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center p-12 bg-white rounded-lg border">
                <Logo size="xl" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Mode Sombre</CardTitle>
                <CardDescription>Utilisation sur fond sombre</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center p-12 bg-slate-900 rounded-lg">
                <Logo size="xl" />
              </CardContent>
            </Card>
          </div>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 flex flex-col items-center gap-2">
              <Logo size="sm" />
              <span className="text-xs text-muted-foreground">Small (24px)</span>
            </Card>
            <Card className="p-4 flex flex-col items-center gap-2">
              <Logo size="md" />
              <span className="text-xs text-muted-foreground">Medium (32px)</span>
            </Card>
            <Card className="p-4 flex flex-col items-center gap-2">
              <Logo size="lg" />
              <span className="text-xs text-muted-foreground">Large (40px)</span>
            </Card>
            <Card className="p-4 flex flex-col items-center gap-2">
              <Logo size="xl" />
              <span className="text-xs text-muted-foreground">XLarge (56px)</span>
            </Card>
          </div>
        </section>

        {/* Couleurs */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Palette de Couleurs</h2>

          {/* Primary Colors */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Couleurs Primaires</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {colors.primary.map((color) => (
                <Card key={color.name} className="overflow-hidden">
                  <div className="h-20 bg-primary" />
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{color.name}</h4>
                        <p className="text-xs text-muted-foreground">{color.var}</p>
                      </div>
                      <code className="text-xs bg-muted px-2 py-1 rounded">{color.hex}</code>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{color.usage}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Secondary Colors */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Couleurs Secondaires</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {colors.secondary.map((color) => (
                <Card key={color.name} className="overflow-hidden">
                  <div className="h-20 bg-secondary" />
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{color.name}</h4>
                        <p className="text-xs text-muted-foreground">{color.var}</p>
                      </div>
                      <code className="text-xs bg-muted px-2 py-1 rounded">{color.hex}</code>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{color.usage}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Accent Colors */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Couleurs d'Accent</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {colors.accent.map((color) => (
                <Card key={color.name} className="overflow-hidden">
                  <div className="h-20 bg-accent" />
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{color.name}</h4>
                        <p className="text-xs text-muted-foreground">{color.var}</p>
                      </div>
                      <code className="text-xs bg-muted px-2 py-1 rounded">{color.hex}</code>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{color.usage}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Neutral Colors */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Couleurs Neutres</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {colors.neutral.map((color) => (
                <Card key={color.name} className="overflow-hidden">
                  <div className="h-16" style={{ backgroundColor: `var(${color.var})` }} />
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-sm">{color.name}</h4>
                        <p className="text-xs text-muted-foreground">{color.var}</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">{color.usage}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Semantic Colors */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Couleurs Sémantiques</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="overflow-hidden">
                <div className="h-16 bg-destructive" />
                <CardContent className="p-4">
                  <h4 className="font-medium text-sm">Destructive</h4>
                  <p className="text-xs text-muted-foreground">Erreurs, danger</p>
                </CardContent>
              </Card>
              <Card className="overflow-hidden">
                <div className="h-16 bg-green-500" />
                <CardContent className="p-4">
                  <h4 className="font-medium text-sm">Success</h4>
                  <p className="text-xs text-muted-foreground">Succès, validé</p>
                </CardContent>
              </Card>
              <Card className="overflow-hidden">
                <div className="h-16 bg-yellow-500" />
                <CardContent className="p-4">
                  <h4 className="font-medium text-sm">Warning</h4>
                  <p className="text-xs text-muted-foreground">Avertissement</p>
                </CardContent>
              </Card>
              <Card className="overflow-hidden">
                <div className="h-16 bg-blue-500" />
                <CardContent className="p-4">
                  <h4 className="font-medium text-sm">Info</h4>
                  <p className="text-xs text-muted-foreground">Information</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Chart Colors */}
          <div>
            <h3 className="text-lg font-medium mb-4">Couleurs des Graphiques</h3>
            <div className="flex gap-2">
              {colors.charts.map((color, i) => (
                <div key={color.name} className="flex-1">
                  <div className="h-24 rounded-lg" style={{ backgroundColor: `var(${color.var})` }} />
                  <p className="text-xs text-center mt-2 text-muted-foreground">Chart {i + 1}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Typographie */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Typographie</h2>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Polices de Caractères</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-8">
                <div className="w-32">
                  <p className="text-sm text-muted-foreground">Sans-serif</p>
                  <p className="font-semibold">Geist</p>
                </div>
                <p className="text-2xl font-sans">
                  ABCDEFGHIJKLMNOPQRSTUVWXYZ
                  <br />
                  abcdefghijklmnopqrstuvwxyz
                  <br />
                  0123456789
                </p>
              </div>
              <div className="border-t pt-6 flex items-center gap-8">
                <div className="w-32">
                  <p className="text-sm text-muted-foreground">Monospace</p>
                  <p className="font-semibold">Geist Mono</p>
                </div>
                <p className="text-2xl font-mono">
                  ABCDEFGHIJKLMNOPQRSTUVWXYZ
                  <br />
                  abcdefghijklmnopqrstuvwxyz
                  <br />
                  0123456789
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Échelle Typographique</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {typography.map((type) => (
                  <div key={type.name} className="flex items-baseline gap-8 pb-4 border-b last:border-0">
                    <div className="w-32 shrink-0">
                      <p className="font-medium">{type.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {type.size} / {type.weight}
                      </p>
                    </div>
                    <p className={type.class}>Invexia - Gestion d'inventaire premium</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Espacement */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Espacement</h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {spacing.map((space) => (
                  <div key={space.name} className="flex items-center gap-4">
                    <div className="w-16">
                      <p className="font-medium">{space.name}</p>
                      <p className="text-xs text-muted-foreground">{space.value}</p>
                    </div>
                    <div className="bg-primary h-8 rounded" style={{ width: space.value }} />
                    <p className="text-sm text-muted-foreground">{space.usage}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Rayon de bordure */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Rayons de Bordure</h2>
          <div className="flex gap-6 flex-wrap">
            {radius.map((r) => (
              <Card key={r.name} className="p-4 flex flex-col items-center gap-2">
                <div className={`w-20 h-20 bg-primary ${r.class}`} />
                <p className="font-medium">{r.name}</p>
                <p className="text-xs text-muted-foreground">{r.usage}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Effet Glass */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Effet Liquid Glass</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative h-64 rounded-xl overflow-hidden">
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }}
              />
              <div className="absolute inset-4 glass rounded-lg p-6">
                <h3 className="font-semibold text-white mb-2">Glass Effect</h3>
                <p className="text-white/80 text-sm">Transparence 28%, blur 16px, saturation 180%</p>
              </div>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Spécifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Background</p>
                  <code className="text-xs bg-muted px-2 py-1 rounded block mt-1">rgba(255, 255, 255, 0.28)</code>
                </div>
                <div>
                  <p className="text-sm font-medium">Backdrop Filter</p>
                  <code className="text-xs bg-muted px-2 py-1 rounded block mt-1">blur(16px) saturate(180%)</code>
                </div>
                <div>
                  <p className="text-sm font-medium">Border</p>
                  <code className="text-xs bg-muted px-2 py-1 rounded block mt-1">
                    1px solid rgba(255, 255, 255, 0.25)
                  </code>
                </div>
                <div>
                  <p className="text-sm font-medium">Box Shadow</p>
                  <code className="text-xs bg-muted px-2 py-1 rounded block mt-1">
                    0 8px 32px 0 rgba(31, 38, 135, 0.12)
                  </code>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Composants */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Composants UI</h2>

          {/* Boutons */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Boutons</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-4">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="link">Link</Button>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button disabled>Disabled</Button>
                <Button>
                  <Package className="w-4 h-4 mr-2" />
                  Avec Icône
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Badges */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Badges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge className="bg-green-500 hover:bg-green-600">Success</Badge>
                <Badge className="bg-yellow-500 hover:bg-yellow-600">Warning</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Inputs */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Champs de Saisie</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-w-md">
              <div>
                <label className="text-sm font-medium mb-2 block">Input Standard</label>
                <Input placeholder="Entrez une valeur..." />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Input Disabled</label>
                <Input placeholder="Désactivé" disabled />
              </div>
            </CardContent>
          </Card>

          {/* Cards */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Cartes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      Produits
                    </CardTitle>
                    <CardDescription>Gestion du stock</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">1,234</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Utilisateurs
                    </CardTitle>
                    <CardDescription>Équipe active</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">56</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Revenus
                    </CardTitle>
                    <CardDescription>Ce mois</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">€45,678</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Alertes */}
          <Card>
            <CardHeader>
              <CardTitle>Messages d'État</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <Check className="w-5 h-5 text-green-600" />
                <span className="text-green-800 dark:text-green-200">Opération réussie</span>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <span className="text-yellow-800 dark:text-yellow-200">Attention requise</span>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <X className="w-5 h-5 text-red-600" />
                <span className="text-red-800 dark:text-red-200">Une erreur est survenue</span>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <Info className="w-5 h-5 text-blue-600" />
                <span className="text-blue-800 dark:text-blue-200">Information importante</span>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Icônes */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Iconographie</h2>
          <Card>
            <CardHeader>
              <CardTitle>Lucide Icons</CardTitle>
              <CardDescription>Bibliothèque d'icônes utilisée dans Invexia</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                {[Package, Users, BarChart3, Settings, Check, AlertTriangle, Info, X].map((Icon, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Plus de 1000 icônes disponibles sur{" "}
                <a
                  href="https://lucide.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  lucide.dev
                </a>
              </p>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-16">
        <div className="container mx-auto px-6 text-center text-muted-foreground">
          <p>© 2026 Invexia. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  )
}
