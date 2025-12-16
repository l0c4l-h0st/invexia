-- =====================================================
-- INVEXIA - Schéma de base de données complet
-- RBAC: Super Admin -> Admin Entreprise -> Employé
-- =====================================================

-- Table des entreprises
CREATE TABLE IF NOT EXISTS public.entreprises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  adresse TEXT,
  telephone TEXT,
  email TEXT,
  site_web TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
  actif BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table des profils utilisateurs
CREATE TABLE IF NOT EXISTS public.profils (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  entreprise_id UUID REFERENCES public.entreprises(id) ON DELETE SET NULL,
  prenom TEXT NOT NULL,
  nom TEXT NOT NULL,
  avatar_url TEXT,
  telephone TEXT,
  poste TEXT,
  -- RBAC: super_admin (global), admin (entreprise), manager, employe
  role TEXT NOT NULL DEFAULT 'employe' CHECK (role IN ('super_admin', 'admin', 'manager', 'employe')),
  statut TEXT DEFAULT 'actif' CHECK (statut IN ('actif', 'inactif', 'suspendu')),
  derniere_connexion TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table des catégories de produits
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entreprise_id UUID NOT NULL REFERENCES public.entreprises(id) ON DELETE CASCADE,
  nom TEXT NOT NULL,
  description TEXT,
  couleur TEXT DEFAULT '#6366f1',
  icone TEXT DEFAULT 'Package',
  parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table des produits/inventaire
CREATE TABLE IF NOT EXISTS public.produits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entreprise_id UUID NOT NULL REFERENCES public.entreprises(id) ON DELETE CASCADE,
  categorie_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  nom TEXT NOT NULL,
  description TEXT,
  sku TEXT NOT NULL,
  code_barre TEXT,
  prix_achat DECIMAL(12, 2) DEFAULT 0,
  prix_vente DECIMAL(12, 2) DEFAULT 0,
  quantite INTEGER DEFAULT 0,
  quantite_min INTEGER DEFAULT 0,
  unite TEXT DEFAULT 'pièce',
  emplacement TEXT,
  image_url TEXT,
  statut TEXT DEFAULT 'actif' CHECK (statut IN ('actif', 'inactif', 'rupture', 'commande')),
  created_by UUID REFERENCES public.profils(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(entreprise_id, sku)
);

-- Table des mouvements de stock
CREATE TABLE IF NOT EXISTS public.mouvements_stock (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entreprise_id UUID NOT NULL REFERENCES public.entreprises(id) ON DELETE CASCADE,
  produit_id UUID NOT NULL REFERENCES public.produits(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('entree', 'sortie', 'ajustement', 'transfert')),
  quantite INTEGER NOT NULL,
  quantite_avant INTEGER NOT NULL,
  quantite_apres INTEGER NOT NULL,
  raison TEXT,
  reference TEXT,
  created_by UUID REFERENCES public.profils(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table des fournisseurs
CREATE TABLE IF NOT EXISTS public.fournisseurs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entreprise_id UUID NOT NULL REFERENCES public.entreprises(id) ON DELETE CASCADE,
  nom TEXT NOT NULL,
  contact TEXT,
  email TEXT,
  telephone TEXT,
  adresse TEXT,
  notes TEXT,
  actif BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table des commandes fournisseurs
CREATE TABLE IF NOT EXISTS public.commandes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entreprise_id UUID NOT NULL REFERENCES public.entreprises(id) ON DELETE CASCADE,
  fournisseur_id UUID REFERENCES public.fournisseurs(id) ON DELETE SET NULL,
  numero TEXT NOT NULL,
  statut TEXT DEFAULT 'brouillon' CHECK (statut IN ('brouillon', 'envoyee', 'confirmee', 'livree', 'annulee')),
  total DECIMAL(12, 2) DEFAULT 0,
  notes TEXT,
  date_livraison_prevue DATE,
  created_by UUID REFERENCES public.profils(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table des lignes de commande
CREATE TABLE IF NOT EXISTS public.lignes_commande (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commande_id UUID NOT NULL REFERENCES public.commandes(id) ON DELETE CASCADE,
  produit_id UUID NOT NULL REFERENCES public.produits(id) ON DELETE CASCADE,
  quantite INTEGER NOT NULL,
  prix_unitaire DECIMAL(12, 2) NOT NULL,
  total DECIMAL(12, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table des logs d'audit
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entreprise_id UUID REFERENCES public.entreprises(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profils(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entite TEXT NOT NULL,
  entite_id UUID,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  severite TEXT DEFAULT 'info' CHECK (severite IN ('info', 'warning', 'error', 'critical')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table des notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profils(id) ON DELETE CASCADE,
  titre TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'warning', 'error', 'success')),
  lue BOOLEAN DEFAULT false,
  lien TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table des paramètres entreprise
CREATE TABLE IF NOT EXISTS public.parametres_entreprise (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entreprise_id UUID UNIQUE NOT NULL REFERENCES public.entreprises(id) ON DELETE CASCADE,
  devise TEXT DEFAULT 'EUR',
  format_date TEXT DEFAULT 'DD/MM/YYYY',
  langue TEXT DEFAULT 'fr',
  notifications_email BOOLEAN DEFAULT true,
  notifications_stock_bas BOOLEAN DEFAULT true,
  seuil_stock_bas INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_profils_entreprise ON public.profils(entreprise_id);
CREATE INDEX IF NOT EXISTS idx_produits_entreprise ON public.produits(entreprise_id);
CREATE INDEX IF NOT EXISTS idx_produits_categorie ON public.produits(categorie_id);
CREATE INDEX IF NOT EXISTS idx_produits_sku ON public.produits(sku);
CREATE INDEX IF NOT EXISTS idx_mouvements_produit ON public.mouvements_stock(produit_id);
CREATE INDEX IF NOT EXISTS idx_audit_entreprise ON public.audit_logs(entreprise_id);
CREATE INDEX IF NOT EXISTS idx_audit_user ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
