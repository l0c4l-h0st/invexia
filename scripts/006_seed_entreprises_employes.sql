-- =====================================================
-- INVEXIA - Données fictives complètes
-- Plusieurs entreprises avec employés et stock
-- =====================================================

-- =====================================================
-- ENTREPRISE 1: TechVision Solutions
-- =====================================================
INSERT INTO public.entreprises (id, nom, slug, email, telephone, plan, adresse)
VALUES (
  'e1000000-0000-0000-0000-000000000001',
  'TechVision Solutions',
  'techvision-solutions',
  'contact@techvision.fr',
  '+33 1 42 68 53 00',
  'enterprise',
  '15 Rue de la Paix, 75002 Paris'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.parametres_entreprise (entreprise_id, devise, langue)
VALUES ('e1000000-0000-0000-0000-000000000001', 'EUR', 'fr')
ON CONFLICT DO NOTHING;

-- Catégories TechVision
INSERT INTO public.categories (id, entreprise_id, nom, description, couleur) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'e1000000-0000-0000-0000-000000000001', 'Serveurs', 'Infrastructure serveur et cloud', '#ef4444'),
  ('c1000000-0000-0000-0000-000000000002', 'e1000000-0000-0000-0000-000000000001', 'Réseau', 'Équipements réseau', '#3b82f6'),
  ('c1000000-0000-0000-0000-000000000003', 'e1000000-0000-0000-0000-000000000001', 'Sécurité', 'Solutions de cybersécurité', '#10b981')
ON CONFLICT (id) DO NOTHING;

-- Produits TechVision
INSERT INTO public.produits (entreprise_id, categorie_id, nom, description, sku, prix_achat, prix_vente, quantite, quantite_min, unite, emplacement, statut) VALUES
  ('e1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'Dell PowerEdge R750', 'Serveur rack 2U haute performance', 'SRV-001', 8500.00, 12000.00, 8, 2, 'unité', 'Datacenter A1', 'actif'),
  ('e1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'HPE ProLiant DL380', 'Serveur polyvalent Gen10+', 'SRV-002', 6200.00, 8500.00, 12, 3, 'unité', 'Datacenter A2', 'actif'),
  ('e1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000002', 'Cisco Catalyst 9300', 'Switch manageable 48 ports', 'NET-001', 3500.00, 4800.00, 25, 5, 'unité', 'Stock Réseau B1', 'actif'),
  ('e1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000002', 'Ubiquiti UniFi AP', 'Point d''accès WiFi 6', 'NET-002', 180.00, 280.00, 150, 30, 'unité', 'Stock Réseau B2', 'actif'),
  ('e1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000003', 'Fortinet FortiGate 100F', 'Pare-feu nouvelle génération', 'SEC-001', 2800.00, 4200.00, 15, 3, 'unité', 'Stock Sécurité C1', 'actif'),
  ('e1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000003', 'CrowdStrike Falcon', 'Licence EDR 1 an', 'SEC-002', 45.00, 89.00, 500, 100, 'licence', 'Digital', 'actif')
ON CONFLICT DO NOTHING;

-- =====================================================
-- ENTREPRISE 2: GreenLeaf Bio
-- =====================================================
INSERT INTO public.entreprises (id, nom, slug, email, telephone, plan, adresse)
VALUES (
  'e2000000-0000-0000-0000-000000000002',
  'GreenLeaf Bio',
  'greenleaf-bio',
  'hello@greenleafbio.com',
  '+33 4 91 22 33 44',
  'pro',
  '45 Boulevard de la Canebière, 13001 Marseille'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.parametres_entreprise (entreprise_id, devise, langue)
VALUES ('e2000000-0000-0000-0000-000000000002', 'EUR', 'fr')
ON CONFLICT DO NOTHING;

-- Catégories GreenLeaf
INSERT INTO public.categories (id, entreprise_id, nom, description, couleur) VALUES
  ('c2000000-0000-0000-0000-000000000001', 'e2000000-0000-0000-0000-000000000002', 'Cosmétiques', 'Produits cosmétiques bio', '#ec4899'),
  ('c2000000-0000-0000-0000-000000000002', 'e2000000-0000-0000-0000-000000000002', 'Compléments', 'Compléments alimentaires', '#22c55e'),
  ('c2000000-0000-0000-0000-000000000003', 'e2000000-0000-0000-0000-000000000002', 'Huiles', 'Huiles essentielles', '#eab308')
ON CONFLICT (id) DO NOTHING;

-- Produits GreenLeaf
INSERT INTO public.produits (entreprise_id, categorie_id, nom, description, sku, prix_achat, prix_vente, quantite, quantite_min, unite, emplacement, statut) VALUES
  ('e2000000-0000-0000-0000-000000000002', 'c2000000-0000-0000-0000-000000000001', 'Crème Hydratante Bio', 'Crème visage à l''aloe vera', 'COS-001', 8.50, 24.90, 340, 50, 'unité', 'Entrepôt Principal - Zone A', 'actif'),
  ('e2000000-0000-0000-0000-000000000002', 'c2000000-0000-0000-0000-000000000001', 'Shampoing Naturel', 'Shampoing sans sulfate 250ml', 'COS-002', 4.20, 12.90, 520, 100, 'unité', 'Entrepôt Principal - Zone A', 'actif'),
  ('e2000000-0000-0000-0000-000000000002', 'c2000000-0000-0000-0000-000000000002', 'Spiruline Bio', 'Comprimés 500mg x120', 'COMP-001', 12.00, 29.90, 180, 40, 'boîte', 'Entrepôt Principal - Zone B', 'actif'),
  ('e2000000-0000-0000-0000-000000000002', 'c2000000-0000-0000-0000-000000000002', 'Vitamine D3', 'Gouttes 1000 UI', 'COMP-002', 6.50, 18.90, 0, 30, 'flacon', 'Entrepôt Principal - Zone B', 'rupture'),
  ('e2000000-0000-0000-0000-000000000002', 'c2000000-0000-0000-0000-000000000003', 'Huile Lavande', 'Huile essentielle 30ml', 'HUI-001', 5.80, 15.90, 280, 50, 'flacon', 'Entrepôt Principal - Zone C', 'actif'),
  ('e2000000-0000-0000-0000-000000000002', 'c2000000-0000-0000-0000-000000000003', 'Huile Tea Tree', 'Huile essentielle 30ml', 'HUI-002', 4.90, 14.90, 15, 50, 'flacon', 'Entrepôt Principal - Zone C', 'commande')
ON CONFLICT DO NOTHING;

-- =====================================================
-- ENTREPRISE 3: AutoParts Express
-- =====================================================
INSERT INTO public.entreprises (id, nom, slug, email, telephone, plan, adresse)
VALUES (
  'e3000000-0000-0000-0000-000000000003',
  'AutoParts Express',
  'autoparts-express',
  'commandes@autoparts-express.fr',
  '+33 5 56 78 90 12',
  'pro',
  '78 Avenue de la Garonne, 33000 Bordeaux'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.parametres_entreprise (entreprise_id, devise, langue)
VALUES ('e3000000-0000-0000-0000-000000000003', 'EUR', 'fr')
ON CONFLICT DO NOTHING;

-- Catégories AutoParts
INSERT INTO public.categories (id, entreprise_id, nom, description, couleur) VALUES
  ('c3000000-0000-0000-0000-000000000001', 'e3000000-0000-0000-0000-000000000003', 'Freinage', 'Pièces de freinage', '#dc2626'),
  ('c3000000-0000-0000-0000-000000000002', 'e3000000-0000-0000-0000-000000000003', 'Moteur', 'Pièces moteur', '#0ea5e9'),
  ('c3000000-0000-0000-0000-000000000003', 'e3000000-0000-0000-0000-000000000003', 'Carrosserie', 'Pièces carrosserie', '#64748b'),
  ('c3000000-0000-0000-0000-000000000004', 'e3000000-0000-0000-0000-000000000003', 'Électrique', 'Composants électriques', '#f59e0b')
ON CONFLICT (id) DO NOTHING;

-- Produits AutoParts
INSERT INTO public.produits (entreprise_id, categorie_id, nom, description, sku, prix_achat, prix_vente, quantite, quantite_min, unite, emplacement, statut) VALUES
  ('e3000000-0000-0000-0000-000000000003', 'c3000000-0000-0000-0000-000000000001', 'Plaquettes Brembo', 'Plaquettes de frein avant', 'FRE-001', 45.00, 89.90, 120, 20, 'jeu', 'Rayon A1', 'actif'),
  ('e3000000-0000-0000-0000-000000000003', 'c3000000-0000-0000-0000-000000000001', 'Disques ATE', 'Disques de frein ventilés', 'FRE-002', 65.00, 129.90, 85, 15, 'paire', 'Rayon A2', 'actif'),
  ('e3000000-0000-0000-0000-000000000003', 'c3000000-0000-0000-0000-000000000002', 'Courroie Distribution', 'Kit courroie + pompe à eau', 'MOT-001', 120.00, 249.90, 45, 10, 'kit', 'Rayon B1', 'actif'),
  ('e3000000-0000-0000-0000-000000000003', 'c3000000-0000-0000-0000-000000000002', 'Filtre à Huile', 'Filtre Mann universel', 'MOT-002', 8.00, 18.90, 450, 100, 'unité', 'Rayon B2', 'actif'),
  ('e3000000-0000-0000-0000-000000000003', 'c3000000-0000-0000-0000-000000000003', 'Rétroviseur Gauche', 'Rétro électrique chauffant', 'CAR-001', 85.00, 169.90, 28, 5, 'unité', 'Rayon C1', 'actif'),
  ('e3000000-0000-0000-0000-000000000003', 'c3000000-0000-0000-0000-000000000004', 'Batterie Varta 70Ah', 'Batterie démarrage', 'ELE-001', 95.00, 159.90, 35, 10, 'unité', 'Rayon D1', 'actif'),
  ('e3000000-0000-0000-0000-000000000003', 'c3000000-0000-0000-0000-000000000004', 'Alternateur', 'Alternateur 120A reconditionné', 'ELE-002', 180.00, 349.90, 0, 5, 'unité', 'Rayon D2', 'rupture')
ON CONFLICT DO NOTHING;

-- =====================================================
-- ENTREPRISE 4: Mobilier Design
-- =====================================================
INSERT INTO public.entreprises (id, nom, slug, email, telephone, plan, adresse)
VALUES (
  'e4000000-0000-0000-0000-000000000004',
  'Mobilier Design',
  'mobilier-design',
  'showroom@mobilier-design.fr',
  '+33 1 45 67 89 00',
  'free',
  '120 Rue du Faubourg Saint-Antoine, 75012 Paris'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.parametres_entreprise (entreprise_id, devise, langue)
VALUES ('e4000000-0000-0000-0000-000000000004', 'EUR', 'fr')
ON CONFLICT DO NOTHING;

-- Catégories Mobilier Design
INSERT INTO public.categories (id, entreprise_id, nom, description, couleur) VALUES
  ('c4000000-0000-0000-0000-000000000001', 'e4000000-0000-0000-0000-000000000004', 'Salon', 'Mobilier de salon', '#8b5cf6'),
  ('c4000000-0000-0000-0000-000000000002', 'e4000000-0000-0000-0000-000000000004', 'Bureau', 'Mobilier de bureau', '#06b6d4'),
  ('c4000000-0000-0000-0000-000000000003', 'e4000000-0000-0000-0000-000000000004', 'Chambre', 'Mobilier de chambre', '#f472b6')
ON CONFLICT (id) DO NOTHING;

-- Produits Mobilier Design
INSERT INTO public.produits (entreprise_id, categorie_id, nom, description, sku, prix_achat, prix_vente, quantite, quantite_min, unite, emplacement, statut) VALUES
  ('e4000000-0000-0000-0000-000000000004', 'c4000000-0000-0000-0000-000000000001', 'Canapé Scandinave', 'Canapé 3 places tissu gris', 'SAL-001', 450.00, 1290.00, 8, 2, 'unité', 'Showroom RDC', 'actif'),
  ('e4000000-0000-0000-0000-000000000004', 'c4000000-0000-0000-0000-000000000001', 'Table Basse Chêne', 'Table basse style nordique', 'SAL-002', 120.00, 349.00, 15, 5, 'unité', 'Showroom RDC', 'actif'),
  ('e4000000-0000-0000-0000-000000000004', 'c4000000-0000-0000-0000-000000000002', 'Bureau Noyer', 'Bureau en bois massif 160cm', 'BUR-001', 280.00, 699.00, 6, 2, 'unité', 'Showroom 1er étage', 'actif'),
  ('e4000000-0000-0000-0000-000000000004', 'c4000000-0000-0000-0000-000000000002', 'Chaise Ergonomique', 'Chaise de bureau premium', 'BUR-002', 350.00, 899.00, 12, 3, 'unité', 'Showroom 1er étage', 'actif'),
  ('e4000000-0000-0000-0000-000000000004', 'c4000000-0000-0000-0000-000000000003', 'Lit King Size', 'Lit 180x200 avec tête de lit', 'CHB-001', 520.00, 1490.00, 3, 2, 'unité', 'Entrepôt', 'actif'),
  ('e4000000-0000-0000-0000-000000000004', 'c4000000-0000-0000-0000-000000000003', 'Commode 6 Tiroirs', 'Commode design contemporain', 'CHB-002', 180.00, 549.00, 0, 3, 'unité', 'Entrepôt', 'rupture')
ON CONFLICT DO NOTHING;

-- =====================================================
-- TICKETS DE SUPPORT DE DÉMONSTRATION
-- (sans utilisateur_id car ils nécessitent auth.users)
-- =====================================================
INSERT INTO public.tickets_support (id, numero, entreprise_id, user_id, nom, sujet, message, categorie, priorite, statut, email) VALUES
  ('t1000000-0000-0000-0000-000000000001', 'TKT-2024-0001', 'e1000000-0000-0000-0000-000000000001', NULL, 'Jean Martin', 'Problème d''export CSV', 'L''export CSV des produits ne fonctionne pas correctement, certaines colonnes sont manquantes.', 'technique', 'haute', 'ouvert', 'jean.martin@techvision.fr'),
  ('t1000000-0000-0000-0000-000000000002', 'TKT-2024-0002', 'e2000000-0000-0000-0000-000000000002', NULL, 'Emma Leroy', 'Demande d''augmentation de quota', 'Nous atteignons la limite de produits de notre plan Pro, pouvez-vous augmenter notre quota ?', 'facturation', 'normale', 'en_cours', 'emma.leroy@greenleafbio.com'),
  ('t1000000-0000-0000-0000-000000000003', 'TKT-2024-0003', 'e3000000-0000-0000-0000-000000000003', NULL, 'Marc Robert', 'Question sur les rapports', 'Comment puis-je générer un rapport mensuel automatique ?', 'general', 'basse', 'resolu', 'marc.robert@autoparts-express.fr'),
  ('t1000000-0000-0000-0000-000000000004', 'TKT-2024-0004', 'e4000000-0000-0000-0000-000000000004', NULL, 'Claire Roux', 'Bug affichage mobile', 'Le tableau de bord ne s''affiche pas correctement sur tablette.', 'bug', 'normale', 'ouvert', 'claire.roux@mobilier-design.fr')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- LOGS D'AUDIT DE DÉMONSTRATION
-- (utilise user_id et ip_address comme dans le schéma)
-- =====================================================
INSERT INTO public.audit_logs (id, entreprise_id, user_id, action, entite, entite_id, details, ip_address) VALUES
  (gen_random_uuid(), 'e1000000-0000-0000-0000-000000000001', NULL, 'connexion', 'session', NULL, '{"navigateur": "Chrome 120", "os": "Windows 11"}', '192.168.1.100'),
  (gen_random_uuid(), 'e1000000-0000-0000-0000-000000000001', NULL, 'creation', 'produit', gen_random_uuid(), '{"nom": "Dell PowerEdge R750", "sku": "SRV-001"}', '192.168.1.101'),
  (gen_random_uuid(), 'e2000000-0000-0000-0000-000000000002', NULL, 'modification', 'produit', gen_random_uuid(), '{"champ": "quantite", "ancienne_valeur": 50, "nouvelle_valeur": 0}', '10.0.0.50'),
  (gen_random_uuid(), 'e3000000-0000-0000-0000-000000000003', NULL, 'export', 'inventaire', NULL, '{"format": "csv", "nombre_produits": 156}', '172.16.0.25'),
  (gen_random_uuid(), 'e4000000-0000-0000-0000-000000000004', NULL, 'suppression', 'produit', gen_random_uuid(), '{"nom": "Ancien modèle", "raison": "discontinué"}', '192.168.2.15')
ON CONFLICT DO NOTHING;
