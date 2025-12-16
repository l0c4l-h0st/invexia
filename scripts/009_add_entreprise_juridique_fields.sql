-- Ajouter les champs juridiques à la table entreprises
ALTER TABLE public.entreprises
ADD COLUMN IF NOT EXISTS siret TEXT,
ADD COLUMN IF NOT EXISTS siren TEXT,
ADD COLUMN IF NOT EXISTS numero_tva TEXT,
ADD COLUMN IF NOT EXISTS forme_juridique TEXT,
ADD COLUMN IF NOT EXISTS capital DECIMAL(15, 2),
ADD COLUMN IF NOT EXISTS date_creation DATE,
ADD COLUMN IF NOT EXISTS code_naf TEXT,
ADD COLUMN IF NOT EXISTS adresse_siege TEXT,
ADD COLUMN IF NOT EXISTS ville TEXT,
ADD COLUMN IF NOT EXISTS code_postal TEXT,
ADD COLUMN IF NOT EXISTS pays TEXT DEFAULT 'France',
ADD COLUMN IF NOT EXISTS responsable_nom TEXT,
ADD COLUMN IF NOT EXISTS responsable_fonction TEXT,
ADD COLUMN IF NOT EXISTS onboarding_complete BOOLEAN DEFAULT false;

-- Index pour recherche
CREATE INDEX IF NOT EXISTS idx_entreprises_siret ON public.entreprises(siret);
CREATE INDEX IF NOT EXISTS idx_entreprises_siren ON public.entreprises(siren);
