-- =====================================================
-- INVEXIA - Triggers et Fonctions automatiques
-- =====================================================

-- Trigger pour créer profil automatiquement après inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profils (id, prenom, nom, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'prenom', 'Utilisateur'),
    COALESCE(NEW.raw_user_meta_data ->> 'nom', 'Nouveau'),
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'employe')
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Appliquer le trigger updated_at sur toutes les tables concernées
DROP TRIGGER IF EXISTS update_entreprises_updated_at ON public.entreprises;
CREATE TRIGGER update_entreprises_updated_at
  BEFORE UPDATE ON public.entreprises
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_profils_updated_at ON public.profils;
CREATE TRIGGER update_profils_updated_at
  BEFORE UPDATE ON public.profils
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_produits_updated_at ON public.produits;
CREATE TRIGGER update_produits_updated_at
  BEFORE UPDATE ON public.produits
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_categories_updated_at ON public.categories;
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Trigger pour créer un mouvement de stock automatiquement lors de modification quantité
CREATE OR REPLACE FUNCTION public.log_stock_movement()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF OLD.quantite != NEW.quantite THEN
    INSERT INTO public.mouvements_stock (
      entreprise_id,
      produit_id,
      type,
      quantite,
      quantite_avant,
      quantite_apres,
      raison,
      created_by
    )
    VALUES (
      NEW.entreprise_id,
      NEW.id,
      CASE 
        WHEN NEW.quantite > OLD.quantite THEN 'entree'
        ELSE 'sortie'
      END,
      ABS(NEW.quantite - OLD.quantite),
      OLD.quantite,
      NEW.quantite,
      'Modification manuelle',
      auth.uid()
    );
  END IF;
  
  -- Mettre à jour le statut si rupture de stock
  IF NEW.quantite <= 0 THEN
    NEW.statut = 'rupture';
  ELSIF NEW.quantite <= NEW.quantite_min THEN
    NEW.statut = 'commande';
  ELSE
    NEW.statut = 'actif';
  END IF;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS log_produit_stock_change ON public.produits;
CREATE TRIGGER log_produit_stock_change
  BEFORE UPDATE ON public.produits
  FOR EACH ROW
  EXECUTE FUNCTION public.log_stock_movement();

-- Trigger pour log d'audit automatique
CREATE OR REPLACE FUNCTION public.create_audit_log()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  ent_id UUID;
BEGIN
  -- Récupérer entreprise_id selon la table
  IF TG_TABLE_NAME = 'entreprises' THEN
    ent_id = COALESCE(NEW.id, OLD.id);
  ELSIF TG_TABLE_NAME = 'profils' THEN
    ent_id = COALESCE(NEW.entreprise_id, OLD.entreprise_id);
  ELSE
    ent_id = COALESCE(NEW.entreprise_id, OLD.entreprise_id);
  END IF;

  INSERT INTO public.audit_logs (
    entreprise_id,
    user_id,
    action,
    entite,
    entite_id,
    details
  )
  VALUES (
    ent_id,
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE TG_OP
      WHEN 'INSERT' THEN to_jsonb(NEW)
      WHEN 'UPDATE' THEN jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW))
      WHEN 'DELETE' THEN to_jsonb(OLD)
    END
  );
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$;

-- Appliquer audit log sur les tables importantes
DROP TRIGGER IF EXISTS audit_produits ON public.produits;
CREATE TRIGGER audit_produits
  AFTER INSERT OR UPDATE OR DELETE ON public.produits
  FOR EACH ROW
  EXECUTE FUNCTION public.create_audit_log();

DROP TRIGGER IF EXISTS audit_profils ON public.profils;
CREATE TRIGGER audit_profils
  AFTER UPDATE OR DELETE ON public.profils
  FOR EACH ROW
  EXECUTE FUNCTION public.create_audit_log();

-- Notification automatique pour stock bas
CREATE OR REPLACE FUNCTION public.notify_low_stock()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_id UUID;
BEGIN
  IF NEW.quantite <= NEW.quantite_min AND OLD.quantite > OLD.quantite_min THEN
    -- Notifier les admins de l'entreprise
    FOR admin_id IN 
      SELECT id FROM public.profils 
      WHERE entreprise_id = NEW.entreprise_id 
      AND role IN ('admin', 'manager')
    LOOP
      INSERT INTO public.notifications (user_id, titre, message, type, lien)
      VALUES (
        admin_id,
        'Stock bas: ' || NEW.nom,
        'Le produit "' || NEW.nom || '" a atteint le seuil minimum (' || NEW.quantite || ' restants)',
        'warning',
        '/inventory?id=' || NEW.id
      );
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS notify_low_stock_trigger ON public.produits;
CREATE TRIGGER notify_low_stock_trigger
  AFTER UPDATE ON public.produits
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_low_stock();
