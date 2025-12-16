"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Menu, Bell, User, Search, LogOut, Settings, ChevronDown, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth-context"
import { SearchCommand } from "./search-command"

interface TopBarProps {
  onMenuClick: () => void
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const { profil, signOut, isAuthenticated, isLoading, isProfilLoading } = useAuth()
  const router = useRouter()
  const [showSearch, setShowSearch] = useState(false)

  const handleSignOut = async () => {
    await signOut()
  }

  const handleGoToProfile = () => {
    router.push("/profile")
  }

  const handleGoToSettings = () => {
    router.push("/settings")
  }

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      admin: "Administrateur Invexia",
      manager: "Manager",
      employe: "Employé",
    }
    return labels[role] || role
  }

  const isLoadingState = isLoading || isProfilLoading

  return (
    <>
      <header className="glass border-b border-border/40 px-4 md:px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        {/* Left */}
        <div className="flex items-center gap-4 flex-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="md:hidden hover:bg-white/10 dark:hover:bg-white/5"
          >
            <Menu size={20} />
          </Button>

          <Button
            variant="ghost"
            onClick={() => setShowSearch(true)}
            className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 max-w-xs hover:bg-muted/70"
          >
            <Search size={18} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Rechercher...</span>
            <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Search mobile */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSearch(true)}
            className="md:hidden hover:bg-white/10 dark:hover:bg-white/5"
          >
            <Search size={20} />
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative hover:bg-white/10 dark:hover:bg-white/5">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full animate-pulse"></span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 glass border-border/40">
              <div className="p-4">
                <h3 className="font-semibold mb-2">Notifications</h3>
                <div className="space-y-2">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium">Stock faible détecté</p>
                    <p className="text-xs text-muted-foreground">3 produits sous le seuil minimum</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium">Nouvelle commande</p>
                    <p className="text-xs text-muted-foreground">Commande #1234 reçue</p>
                  </div>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          {isLoadingState ? (
            <div className="hidden md:flex items-center gap-3 pl-4 border-l border-border/40">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Chargement...</span>
            </div>
          ) : isAuthenticated && profil ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="hidden md:flex items-center gap-3 pl-4 border-l border-border/40 hover:bg-white/10 dark:hover:bg-white/5"
                >
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {profil.prenom} {profil.nom}
                    </div>
                    <div className="text-xs text-muted-foreground">{getRoleLabel(profil.role)}</div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <User size={16} className="text-primary" />
                  </div>
                  <ChevronDown size={16} className="text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 glass border-border/40">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">
                    {profil.prenom} {profil.nom}
                  </p>
                  <p className="text-xs text-muted-foreground">{getRoleLabel(profil.role)}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleGoToProfile} className="cursor-pointer">
                  <User size={16} className="mr-2" />
                  Mon Profil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleGoToSettings} className="cursor-pointer">
                  <Settings size={16} className="mr-2" />
                  Paramètres
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut size={16} className="mr-2" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={handleSignOut} variant="ghost" className="hidden md:flex text-destructive">
              <LogOut size={16} className="mr-2" />
              Déconnexion
            </Button>
          )}

          {/* Mobile user button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden hover:bg-white/10 dark:hover:bg-white/5">
                {isLoadingState ? <Loader2 size={20} className="animate-spin" /> : <User size={20} />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 glass border-border/40">
              {isLoadingState ? (
                <div className="px-4 py-3 flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">Chargement...</span>
                </div>
              ) : isAuthenticated && profil ? (
                <>
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">
                      {profil.prenom} {profil.nom}
                    </p>
                    <p className="text-xs text-muted-foreground">{getRoleLabel(profil.role)}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleGoToProfile} className="cursor-pointer">
                    <User size={16} className="mr-2" />
                    Mon Profil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleGoToSettings} className="cursor-pointer">
                    <Settings size={16} className="mr-2" />
                    Paramètres
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut size={16} className="mr-2" />
                    Déconnexion
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                  <LogOut size={16} className="mr-2" />
                  Déconnexion
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Search Command */}
      <SearchCommand open={showSearch} onOpenChange={setShowSearch} />
    </>
  )
}
