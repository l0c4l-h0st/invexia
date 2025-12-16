-- =====================================================
-- INVEXIA - Row Level Security (RLS)
-- RBAC: Super Admin -> Admin Entreprise -> Employé
-- =====================================================

-- Activer RLS sur toutes les tables
ALTER TABLE public.entreprises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profils ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mouvements_stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fournisseurs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commandes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lignes_commande ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parametres_entreprise ENABLE ROW LEVEL SECURITY;

-- Fonction helper pour obtenir l'entreprise de l'utilisateur courant
CREATE OR REPLACE FUNCTION public.get_user_entreprise_id()
RETURNS UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT entreprise_id FROM public.profils WHERE id = auth.uid()
$$;

-- Fonction helper pour obtenir le rôle de l'utilisateur courant
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT role FROM public.profils WHERE id = auth.uid()
$$;

-- Fonction helper pour vérifier si super_admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (SELECT 1 FROM public.profils WHERE id = auth.uid() AND role = 'super_admin')
$$;

-- Fonction helper pour vérifier si admin de l'entreprise
CREATE OR REPLACE FUNCTION public.is_admin_of_entreprise(ent_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profils 
    WHERE id = auth.uid() 
    AND entreprise_id = ent_id 
    AND role IN ('super_admin', 'admin')
  )
$$;

-- ===== POLITIQUES ENTREPRISES =====
CREATE POLICY "Super admin peut tout voir sur entreprises"
  ON public.entreprises FOR ALL
  USING (public.is_super_admin());

CREATE POLICY "Utilisateurs voient leur entreprise"
  ON public.entreprises FOR SELECT
  USING (id = public.get_user_entreprise_id());

-- ===== POLITIQUES PROFILS =====
CREATE POLICY "Super admin peut tout voir sur profils"
  ON public.profils FOR ALL
  USING (public.is_super_admin());

CREATE POLICY "Utilisateurs voient leur propre profil"
  ON public.profils FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Utilisateurs voient profils de leur entreprise"
  ON public.profils FOR SELECT
  USING (entreprise_id = public.get_user_entreprise_id());

CREATE POLICY "Utilisateurs peuvent modifier leur propre profil"
  ON public.profils FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "Admin peut gérer profils de son entreprise"
  ON public.profils FOR ALL
  USING (public.is_admin_of_entreprise(entreprise_id));

CREATE POLICY "Profil peut être créé après inscription"
  ON public.profils FOR INSERT
  WITH CHECK (id = auth.uid());

-- ===== POLITIQUES CATÉGORIES =====
CREATE POLICY "Super admin peut tout sur categories"
  ON public.categories FOR ALL
  USING (public.is_super_admin());

CREATE POLICY "Utilisateurs voient catégories de leur entreprise"
  ON public.categories FOR SELECT
  USING (entreprise_id = public.get_user_entreprise_id());

CREATE POLICY "Admin/Manager peuvent gérer catégories"
  ON public.categories FOR ALL
  USING (
    entreprise_id = public.get_user_entreprise_id() 
    AND public.get_user_role() IN ('admin', 'manager')
  );

-- ===== POLITIQUES PRODUITS =====
CREATE POLICY "Super admin peut tout sur produits"
  ON public.produits FOR ALL
  USING (public.is_super_admin());

CREATE POLICY "Utilisateurs voient produits de leur entreprise"
  ON public.produits FOR SELECT
  USING (entreprise_id = public.get_user_entreprise_id());

CREATE POLICY "Admin/Manager peuvent gérer produits"
  ON public.produits FOR ALL
  USING (
    entreprise_id = public.get_user_entreprise_id() 
    AND public.get_user_role() IN ('admin', 'manager')
  );

CREATE POLICY "Employés peuvent modifier produits"
  ON public.produits FOR UPDATE
  USING (
    entreprise_id = public.get_user_entreprise_id() 
    AND public.get_user_role() = 'employe'
  );

-- ===== POLITIQUES MOUVEMENTS STOCK =====
CREATE POLICY "Super admin peut tout sur mouvements"
  ON public.mouvements_stock FOR ALL
  USING (public.is_super_admin());

CREATE POLICY "Utilisateurs voient mouvements de leur entreprise"
  ON public.mouvements_stock FOR SELECT
  USING (entreprise_id = public.get_user_entreprise_id());

CREATE POLICY "Utilisateurs peuvent créer mouvements"
  ON public.mouvements_stock FOR INSERT
  WITH CHECK (entreprise_id = public.get_user_entreprise_id());

-- ===== POLITIQUES FOURNISSEURS =====
CREATE POLICY "Super admin peut tout sur fournisseurs"
  ON public.fournisseurs FOR ALL
  USING (public.is_super_admin());

CREATE POLICY "Utilisateurs voient fournisseurs de leur entreprise"
  ON public.fournisseurs FOR SELECT
  USING (entreprise_id = public.get_user_entreprise_id());

CREATE POLICY "Admin/Manager peuvent gérer fournisseurs"
  ON public.fournisseurs FOR ALL
  USING (
    entreprise_id = public.get_user_entreprise_id() 
    AND public.get_user_role() IN ('admin', 'manager')
  );

-- ===== POLITIQUES COMMANDES =====
CREATE POLICY "Super admin peut tout sur commandes"
  ON public.commandes FOR ALL
  USING (public.is_super_admin());

CREATE POLICY "Utilisateurs voient commandes de leur entreprise"
  ON public.commandes FOR SELECT
  USING (entreprise_id = public.get_user_entreprise_id());

CREATE POLICY "Admin/Manager peuvent gérer commandes"
  ON public.commandes FOR ALL
  USING (
    entreprise_id = public.get_user_entreprise_id() 
    AND public.get_user_role() IN ('admin', 'manager')
  );

-- ===== POLITIQUES LIGNES COMMANDE =====
CREATE POLICY "Super admin peut tout sur lignes_commande"
  ON public.lignes_commande FOR ALL
  USING (public.is_super_admin());

CREATE POLICY "Utilisateurs voient lignes via commandes"
  ON public.lignes_commande FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.commandes c 
      WHERE c.id = commande_id 
      AND c.entreprise_id = public.get_user_entreprise_id()
    )
  );

-- ===== POLITIQUES AUDIT LOGS =====
CREATE POLICY "Super admin peut tout sur audit_logs"
  ON public.audit_logs FOR ALL
  USING (public.is_super_admin());

CREATE POLICY "Admin peut voir logs de son entreprise"
  ON public.audit_logs FOR SELECT
  USING (
    entreprise_id = public.get_user_entreprise_id() 
    AND public.get_user_role() IN ('admin', 'manager')
  );

CREATE POLICY "Utilisateurs peuvent créer logs"
  ON public.audit_logs FOR INSERT
  WITH CHECK (entreprise_id = public.get_user_entreprise_id() OR entreprise_id IS NULL);

-- ===== POLITIQUES NOTIFICATIONS =====
CREATE POLICY "Utilisateurs voient leurs notifications"
  ON public.notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Utilisateurs peuvent modifier leurs notifications"
  ON public.notifications FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Système peut créer notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (true);

-- ===== POLITIQUES PARAMÈTRES =====
CREATE POLICY "Super admin peut tout sur parametres"
  ON public.parametres_entreprise FOR ALL
  USING (public.is_super_admin());

CREATE POLICY "Utilisateurs voient parametres de leur entreprise"
  ON public.parametres_entreprise FOR SELECT
  USING (entreprise_id = public.get_user_entreprise_id());

CREATE POLICY "Admin peut modifier parametres"
  ON public.parametres_entreprise FOR UPDATE
  USING (public.is_admin_of_entreprise(entreprise_id));
