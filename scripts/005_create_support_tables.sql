-- Script pour créer les tables de support et tickets
-- À exécuter après les scripts 001-004

-- Table des tickets de support
CREATE TABLE IF NOT EXISTS tickets_support (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero VARCHAR(20) UNIQUE NOT NULL,
  entreprise_id UUID REFERENCES entreprises(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email VARCHAR(255) NOT NULL,
  nom VARCHAR(255) NOT NULL,
  sujet VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  categorie VARCHAR(50) DEFAULT 'general',
  priorite VARCHAR(20) DEFAULT 'normale',
  statut VARCHAR(20) DEFAULT 'ouvert',
  assigne_a UUID REFERENCES profils(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  ferme_at TIMESTAMPTZ,
  
  CONSTRAINT check_categorie CHECK (categorie IN ('general', 'technique', 'facturation', 'fonctionnalite', 'bug', 'autre')),
  CONSTRAINT check_priorite CHECK (priorite IN ('basse', 'normale', 'haute', 'urgente')),
  CONSTRAINT check_statut CHECK (statut IN ('ouvert', 'en_cours', 'en_attente', 'resolu', 'ferme'))
);

-- Table des réponses aux tickets
CREATE TABLE IF NOT EXISTS reponses_ticket (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES tickets_support(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  est_interne BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des pièces jointes
CREATE TABLE IF NOT EXISTS pieces_jointes_ticket (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES tickets_support(id) ON DELETE CASCADE,
  reponse_id UUID REFERENCES reponses_ticket(id) ON DELETE CASCADE,
  nom_fichier VARCHAR(255) NOT NULL,
  url VARCHAR(1000) NOT NULL,
  type_mime VARCHAR(100),
  taille INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_tickets_entreprise ON tickets_support(entreprise_id);
CREATE INDEX IF NOT EXISTS idx_tickets_statut ON tickets_support(statut);
CREATE INDEX IF NOT EXISTS idx_tickets_priorite ON tickets_support(priorite);
CREATE INDEX IF NOT EXISTS idx_tickets_created ON tickets_support(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reponses_ticket ON reponses_ticket(ticket_id);

-- Fonction pour générer un numéro de ticket unique
CREATE OR REPLACE FUNCTION generate_ticket_numero()
RETURNS TRIGGER AS $$
BEGIN
  NEW.numero := 'TKT-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour le numéro de ticket
DROP TRIGGER IF EXISTS trigger_ticket_numero ON tickets_support;
CREATE TRIGGER trigger_ticket_numero
  BEFORE INSERT ON tickets_support
  FOR EACH ROW
  EXECUTE FUNCTION generate_ticket_numero();

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_ticket_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  IF NEW.statut IN ('resolu', 'ferme') AND OLD.statut NOT IN ('resolu', 'ferme') THEN
    NEW.ferme_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_ticket_updated ON tickets_support;
CREATE TRIGGER trigger_ticket_updated
  BEFORE UPDATE ON tickets_support
  FOR EACH ROW
  EXECUTE FUNCTION update_ticket_timestamp();

-- RLS pour tickets_support
ALTER TABLE tickets_support ENABLE ROW LEVEL SECURITY;

-- Super admin peut tout voir
CREATE POLICY "Super admin peut tout sur tickets" ON tickets_support
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profils WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- Admin peut voir les tickets de son entreprise
CREATE POLICY "Admin voit tickets entreprise" ON tickets_support
  FOR SELECT USING (
    entreprise_id IN (
      SELECT entreprise_id FROM profils WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Utilisateurs peuvent voir leurs propres tickets
CREATE POLICY "Users voient leurs tickets" ON tickets_support
  FOR SELECT USING (user_id = auth.uid());

-- Tout le monde peut créer un ticket
CREATE POLICY "Tous peuvent créer ticket" ON tickets_support
  FOR INSERT WITH CHECK (true);

-- RLS pour reponses_ticket
ALTER TABLE reponses_ticket ENABLE ROW LEVEL SECURITY;

-- Super admin peut tout
CREATE POLICY "Super admin sur reponses" ON reponses_ticket
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profils WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- Utilisateurs peuvent voir les réponses non internes de leurs tickets
CREATE POLICY "Users voient reponses publiques" ON reponses_ticket
  FOR SELECT USING (
    est_interne = FALSE AND
    ticket_id IN (SELECT id FROM tickets_support WHERE user_id = auth.uid())
  );

-- Admin peut voir toutes les réponses de son entreprise
CREATE POLICY "Admin voit toutes reponses" ON reponses_ticket
  FOR SELECT USING (
    ticket_id IN (
      SELECT t.id FROM tickets_support t
      JOIN profils p ON p.id = auth.uid()
      WHERE t.entreprise_id = p.entreprise_id AND p.role IN ('admin', 'manager')
    )
  );

-- Admin et super admin peuvent créer des réponses
CREATE POLICY "Admin cree reponses" ON reponses_ticket
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profils WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'manager')
    )
  );

-- RLS pour pieces_jointes
ALTER TABLE pieces_jointes_ticket ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acces pieces jointes via ticket" ON pieces_jointes_ticket
  FOR SELECT USING (
    ticket_id IN (SELECT id FROM tickets_support WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profils WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'manager'))
  );
