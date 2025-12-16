-- =====================================================
-- INVEXIA - Ajout champs entreprise + Table messages chat
-- =====================================================

-- Ajouter colonnes à la table entreprises
ALTER TABLE public.entreprises ADD COLUMN IF NOT EXISTS siret TEXT;
ALTER TABLE public.entreprises ADD COLUMN IF NOT EXISTS siren TEXT;
ALTER TABLE public.entreprises ADD COLUMN IF NOT EXISTS tva_intra TEXT;
ALTER TABLE public.entreprises ADD COLUMN IF NOT EXISTS forme_juridique TEXT;
ALTER TABLE public.entreprises ADD COLUMN IF NOT EXISTS capital DECIMAL(15, 2);
ALTER TABLE public.entreprises ADD COLUMN IF NOT EXISTS code_naf TEXT;
ALTER TABLE public.entreprises ADD COLUMN IF NOT EXISTS date_creation DATE;
ALTER TABLE public.entreprises ADD COLUMN IF NOT EXISTS effectif TEXT;
ALTER TABLE public.entreprises ADD COLUMN IF NOT EXISTS secteur TEXT;
ALTER TABLE public.entreprises ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.entreprises ADD COLUMN IF NOT EXISTS contact_nom TEXT;
ALTER TABLE public.entreprises ADD COLUMN IF NOT EXISTS contact_prenom TEXT;
ALTER TABLE public.entreprises ADD COLUMN IF NOT EXISTS contact_email TEXT;
ALTER TABLE public.entreprises ADD COLUMN IF NOT EXISTS contact_telephone TEXT;
ALTER TABLE public.entreprises ADD COLUMN IF NOT EXISTS contact_poste TEXT;
ALTER TABLE public.entreprises ADD COLUMN IF NOT EXISTS code_postal TEXT;
ALTER TABLE public.entreprises ADD COLUMN IF NOT EXISTS ville TEXT;
ALTER TABLE public.entreprises ADD COLUMN IF NOT EXISTS pays TEXT DEFAULT 'France';

-- Table des conversations de chat
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entreprise_id UUID NOT NULL REFERENCES public.entreprises(id) ON DELETE CASCADE,
  titre TEXT NOT NULL,
  statut TEXT DEFAULT 'ouvert' CHECK (statut IN ('ouvert', 'ferme', 'archive')),
  derniere_activite TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table des messages de chat
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  sender_nom TEXT NOT NULL,
  sender_role TEXT NOT NULL,
  contenu TEXT NOT NULL,
  lu BOOLEAN DEFAULT false,
  lu_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_conversations_entreprise ON public.conversations(entreprise_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.messages(sender_id);

-- RLS pour conversations
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins peuvent tout voir" ON public.conversations
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profils 
      WHERE id = auth.uid() 
      AND role IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "Utilisateurs voient leur entreprise" ON public.conversations
  FOR SELECT TO authenticated
  USING (
    entreprise_id IN (
      SELECT entreprise_id FROM public.profils WHERE id = auth.uid()
    )
  );

CREATE POLICY "Managers peuvent créer" ON public.conversations
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profils 
      WHERE id = auth.uid() 
      AND role IN ('super_admin', 'admin', 'manager')
      AND entreprise_id = conversations.entreprise_id
    )
  );

-- RLS pour messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Voir messages de ses conversations" ON public.messages
  FOR SELECT TO authenticated
  USING (
    conversation_id IN (
      SELECT c.id FROM public.conversations c
      JOIN public.profils p ON p.entreprise_id = c.entreprise_id OR p.role IN ('super_admin', 'admin')
      WHERE p.id = auth.uid()
    )
  );

CREATE POLICY "Envoyer dans ses conversations" ON public.messages
  FOR INSERT TO authenticated
  WITH CHECK (
    conversation_id IN (
      SELECT c.id FROM public.conversations c
      JOIN public.profils p ON p.entreprise_id = c.entreprise_id OR p.role IN ('super_admin', 'admin')
      WHERE p.id = auth.uid()
    )
  );
