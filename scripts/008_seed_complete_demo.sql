-- =====================================================
-- INVEXIA - Données de démonstration complètes
-- Entreprises, employés, produits, conversations, tickets
-- =====================================================

-- Nettoyer les données existantes (optionnel)
-- DELETE FROM public.messages;
-- DELETE FROM public.conversations;
-- DELETE FROM public.tickets_support;
-- DELETE FROM public.audit_logs;
-- DELETE FROM public.produits;
-- DELETE FROM public.categories;
-- DELETE FROM public.entreprises WHERE slug != 'demo';

-- =====================================================
-- ENTREPRISES
-- =====================================================

INSERT INTO public.entreprises (
  id, nom, slug, email, telephone, adresse, code_postal, ville, pays,
  siret, siren, tva_intra, forme_juridique, capital, code_naf, 
  date_creation, effectif, secteur, description, site_web,
  contact_nom, contact_prenom, contact_email, contact_telephone, contact_poste,
  plan, actif
) VALUES 
-- Entreprise 1: TechVision Solutions
(
  'e1000000-0000-0000-0000-000000000001',
  'TechVision Solutions',
  'techvision-solutions',
  'contact@techvision.fr',
  '+33 1 42 68 95 00',
  '15 Rue de la Innovation',
  '75008',
  'Paris',
  'France',
  '12345678901234',
  '123456789',
  'FR12345678901',
  'SAS',
  150000.00,
  '6201Z',
  '2018-03-15',
  '51-100',
  'Technologie',
  'TechVision Solutions est une entreprise spécialisée dans le développement de solutions logicielles innovantes pour les entreprises.',
  'https://techvision.fr',
  'Dupont',
  'Marie',
  'marie.dupont@techvision.fr',
  '+33 6 12 34 56 78',
  'Directrice Générale',
  'enterprise',
  true
),
-- Entreprise 2: GreenLeaf Bio
(
  'e2000000-0000-0000-0000-000000000002',
  'GreenLeaf Bio',
  'greenleaf-bio',
  'info@greenleaf-bio.fr',
  '+33 4 91 22 33 44',
  '42 Avenue des Plantes',
  '13001',
  'Marseille',
  'France',
  '98765432109876',
  '987654321',
  'FR98765432109',
  'SARL',
  75000.00,
  '4729Z',
  '2020-06-01',
  '11-50',
  'Agriculture',
  'GreenLeaf Bio propose des produits biologiques et naturels pour le jardinage et l''agriculture durable.',
  'https://greenleaf-bio.fr',
  'Martin',
  'Pierre',
  'p.martin@greenleaf-bio.fr',
  '+33 6 98 76 54 32',
  'Gérant',
  'pro',
  true
),
-- Entreprise 3: AutoParts Express
(
  'e3000000-0000-0000-0000-000000000003',
  'AutoParts Express',
  'autoparts-express',
  'commandes@autoparts-express.fr',
  '+33 3 88 55 66 77',
  '8 Zone Industrielle Nord',
  '67000',
  'Strasbourg',
  'France',
  '55566677788899',
  '555666777',
  'FR55566677788',
  'SA',
  500000.00,
  '4531Z',
  '2015-09-20',
  '101-250',
  'Commerce',
  'Leader de la distribution de pièces automobiles dans le Grand Est, AutoParts Express fournit les professionnels et particuliers.',
  'https://autoparts-express.fr',
  'Weber',
  'Hans',
  'h.weber@autoparts-express.fr',
  '+33 6 55 44 33 22',
  'PDG',
  'enterprise',
  true
),
-- Entreprise 4: Mobilier Design
(
  'e4000000-0000-0000-0000-000000000004',
  'Mobilier Design',
  'mobilier-design',
  'bonjour@mobilier-design.fr',
  '+33 5 61 99 88 77',
  '25 Rue du Meuble',
  '31000',
  'Toulouse',
  'France',
  '11122233344455',
  '111222333',
  'FR11122233344',
  'EURL',
  25000.00,
  '4759A',
  '2022-01-10',
  '1-5',
  'Commerce',
  'Mobilier Design crée et vend des meubles contemporains fabriqués artisanalement en France.',
  'https://mobilier-design.fr',
  'Blanc',
  'Sophie',
  's.blanc@mobilier-design.fr',
  '+33 6 11 22 33 44',
  'Fondatrice',
  'free',
  true
);

-- =====================================================
-- PARAMÈTRES ENTREPRISE
-- =====================================================

INSERT INTO public.parametres_entreprise (entreprise_id, devise, format_date, langue, notifications_email, seuil_stock_bas)
VALUES 
  ('e1000000-0000-0000-0000-000000000001', 'EUR', 'DD/MM/YYYY', 'fr', true, 15),
  ('e2000000-0000-0000-0000-000000000002', 'EUR', 'DD/MM/YYYY', 'fr', true, 10),
  ('e3000000-0000-0000-0000-000000000003', 'EUR', 'DD/MM/YYYY', 'fr', true, 25),
  ('e4000000-0000-0000-0000-000000000004', 'EUR', 'DD/MM/YYYY', 'fr', false, 5)
ON CONFLICT (entreprise_id) DO NOTHING;

-- =====================================================
-- CATÉGORIES
-- =====================================================

-- TechVision Solutions - Catégories tech
INSERT INTO public.categories (id, entreprise_id, nom, description, couleur, icone) VALUES
  ('c1000001-0000-0000-0000-000000000001', 'e1000000-0000-0000-0000-000000000001', 'Ordinateurs', 'PC, laptops et workstations', '#3b82f6', 'Monitor'),
  ('c1000001-0000-0000-0000-000000000002', 'e1000000-0000-0000-0000-000000000001', 'Périphériques', 'Claviers, souris, écrans', '#8b5cf6', 'Keyboard'),
  ('c1000001-0000-0000-0000-000000000003', 'e1000000-0000-0000-0000-000000000001', 'Réseau', 'Switches, routeurs, câbles', '#06b6d4', 'Wifi'),
  ('c1000001-0000-0000-0000-000000000004', 'e1000000-0000-0000-0000-000000000001', 'Stockage', 'SSD, HDD, NAS', '#f59e0b', 'HardDrive');

-- GreenLeaf Bio - Catégories bio
INSERT INTO public.categories (id, entreprise_id, nom, description, couleur, icone) VALUES
  ('c2000001-0000-0000-0000-000000000001', 'e2000000-0000-0000-0000-000000000002', 'Semences', 'Graines bio certifiées', '#22c55e', 'Leaf'),
  ('c2000001-0000-0000-0000-000000000002', 'e2000000-0000-0000-0000-000000000002', 'Engrais', 'Fertilisants naturels', '#84cc16', 'Droplet'),
  ('c2000001-0000-0000-0000-000000000003', 'e2000000-0000-0000-0000-000000000002', 'Outillage', 'Outils de jardinage', '#a3e635', 'Shovel');

-- AutoParts Express - Catégories auto
INSERT INTO public.categories (id, entreprise_id, nom, description, couleur, icone) VALUES
  ('c3000001-0000-0000-0000-000000000001', 'e3000000-0000-0000-0000-000000000003', 'Moteur', 'Pièces moteur et transmission', '#ef4444', 'Cog'),
  ('c3000001-0000-0000-0000-000000000002', 'e3000000-0000-0000-0000-000000000003', 'Freinage', 'Disques, plaquettes, étriers', '#f97316', 'CircleDot'),
  ('c3000001-0000-0000-0000-000000000003', 'e3000000-0000-0000-0000-000000000003', 'Carrosserie', 'Éléments de carrosserie', '#eab308', 'Car'),
  ('c3000001-0000-0000-0000-000000000004', 'e3000000-0000-0000-0000-000000000003', 'Électrique', 'Batteries, alternateurs, démarreurs', '#14b8a6', 'Zap');

-- Mobilier Design - Catégories meubles
INSERT INTO public.categories (id, entreprise_id, nom, description, couleur, icone) VALUES
  ('c4000001-0000-0000-0000-000000000001', 'e4000000-0000-0000-0000-000000000004', 'Chaises', 'Chaises et fauteuils design', '#8b5cf6', 'Armchair'),
  ('c4000001-0000-0000-0000-000000000002', 'e4000000-0000-0000-0000-000000000004', 'Tables', 'Tables et bureaux', '#ec4899', 'Table');

-- =====================================================
-- PRODUITS
-- =====================================================

-- TechVision Solutions - Produits tech
INSERT INTO public.produits (id, entreprise_id, categorie_id, nom, description, sku, code_barre, prix_achat, prix_vente, quantite, quantite_min, unite, emplacement, statut) VALUES
  ('p1000001-0000-0000-0000-000000000001', 'e1000000-0000-0000-0000-000000000001', 'c1000001-0000-0000-0000-000000000001', 'MacBook Pro 16"', 'Apple MacBook Pro 16 pouces M3 Pro', 'TV-MBP16-001', '5901234567890', 2499.00, 2999.00, 25, 5, 'pièce', 'Entrepôt A - Rayon 1', 'actif'),
  ('p1000001-0000-0000-0000-000000000002', 'e1000000-0000-0000-0000-000000000001', 'c1000001-0000-0000-0000-000000000001', 'Dell XPS 15', 'Dell XPS 15 Intel i9 32Go RAM', 'TV-DXPS15-001', '5901234567891', 1899.00, 2299.00, 18, 5, 'pièce', 'Entrepôt A - Rayon 1', 'actif'),
  ('p1000001-0000-0000-0000-000000000003', 'e1000000-0000-0000-0000-000000000001', 'c1000001-0000-0000-0000-000000000002', 'Clavier Logitech MX Keys', 'Clavier sans fil premium', 'TV-LMXK-001', '5901234567892', 89.00, 119.00, 150, 20, 'pièce', 'Entrepôt A - Rayon 2', 'actif'),
  ('p1000001-0000-0000-0000-000000000004', 'e1000000-0000-0000-0000-000000000001', 'c1000001-0000-0000-0000-000000000002', 'Souris Logitech MX Master 3', 'Souris ergonomique sans fil', 'TV-LMM3-001', '5901234567893', 79.00, 99.00, 200, 30, 'pièce', 'Entrepôt A - Rayon 2', 'actif'),
  ('p1000001-0000-0000-0000-000000000005', 'e1000000-0000-0000-0000-000000000001', 'c1000001-0000-0000-0000-000000000003', 'Switch Cisco 24 ports', 'Switch manageable Gigabit', 'TV-CSW24-001', '5901234567894', 450.00, 599.00, 12, 3, 'pièce', 'Entrepôt B - Rayon 1', 'actif'),
  ('p1000001-0000-0000-0000-000000000006', 'e1000000-0000-0000-0000-000000000001', 'c1000001-0000-0000-0000-000000000004', 'SSD Samsung 2To', 'SSD NVMe haute performance', 'TV-SSD2T-001', '5901234567895', 159.00, 199.00, 85, 15, 'pièce', 'Entrepôt A - Rayon 3', 'actif');

-- GreenLeaf Bio - Produits bio
INSERT INTO public.produits (id, entreprise_id, categorie_id, nom, description, sku, code_barre, prix_achat, prix_vente, quantite, quantite_min, unite, emplacement, statut) VALUES
  ('p2000001-0000-0000-0000-000000000001', 'e2000000-0000-0000-0000-000000000002', 'c2000001-0000-0000-0000-000000000001', 'Graines Tomates Bio', 'Semences de tomates anciennes certifiées AB', 'GL-TOM-001', '3760012345001', 2.50, 4.90, 500, 100, 'sachet', 'Serre 1 - Étagère A', 'actif'),
  ('p2000001-0000-0000-0000-000000000002', 'e2000000-0000-0000-0000-000000000002', 'c2000001-0000-0000-0000-000000000001', 'Graines Carottes Bio', 'Semences de carottes Nantaises bio', 'GL-CAR-001', '3760012345002', 2.00, 3.90, 450, 100, 'sachet', 'Serre 1 - Étagère A', 'actif'),
  ('p2000001-0000-0000-0000-000000000003', 'e2000000-0000-0000-0000-000000000002', 'c2000001-0000-0000-0000-000000000002', 'Engrais Universel Bio 5kg', 'Fertilisant organique complet', 'GL-ENG5-001', '3760012345003', 12.00, 19.90, 120, 20, 'sac', 'Hangar - Zone B', 'actif'),
  ('p2000001-0000-0000-0000-000000000004', 'e2000000-0000-0000-0000-000000000002', 'c2000001-0000-0000-0000-000000000003', 'Sécateur Professionnel', 'Sécateur à lame bypass inox', 'GL-SEC-001', '3760012345004', 18.00, 29.90, 45, 10, 'pièce', 'Hangar - Zone C', 'actif');

-- AutoParts Express - Produits auto
INSERT INTO public.produits (id, entreprise_id, categorie_id, nom, description, sku, code_barre, prix_achat, prix_vente, quantite, quantite_min, unite, emplacement, statut) VALUES
  ('p3000001-0000-0000-0000-000000000001', 'e3000000-0000-0000-0000-000000000003', 'c3000001-0000-0000-0000-000000000001', 'Filtre à huile Bosch', 'Filtre compatible multi-marques', 'AP-FH-B001', '4006633123456', 8.50, 14.90, 850, 100, 'pièce', 'Allée 1 - Case 12', 'actif'),
  ('p3000001-0000-0000-0000-000000000002', 'e3000000-0000-0000-0000-000000000003', 'c3000001-0000-0000-0000-000000000001', 'Courroie Distribution Gates', 'Kit courroie + pompe à eau', 'AP-CD-G001', '4006633123457', 85.00, 149.00, 120, 20, 'kit', 'Allée 2 - Case 5', 'actif'),
  ('p3000001-0000-0000-0000-000000000003', 'e3000000-0000-0000-0000-000000000003', 'c3000001-0000-0000-0000-000000000002', 'Plaquettes Frein Brembo', 'Jeu plaquettes avant haute performance', 'AP-PF-BR01', '4006633123458', 45.00, 79.90, 280, 50, 'jeu', 'Allée 3 - Case 8', 'actif'),
  ('p3000001-0000-0000-0000-000000000004', 'e3000000-0000-0000-0000-000000000003', 'c3000001-0000-0000-0000-000000000002', 'Disques Frein ATE', 'Paire disques ventilés 300mm', 'AP-DF-AT01', '4006633123459', 65.00, 119.00, 95, 15, 'paire', 'Allée 3 - Case 9', 'actif'),
  ('p3000001-0000-0000-0000-000000000005', 'e3000000-0000-0000-0000-000000000003', 'c3000001-0000-0000-0000-000000000004', 'Batterie Varta 70Ah', 'Batterie démarrage 12V 70Ah 760A', 'AP-BAT-V70', '4006633123460', 89.00, 139.00, 65, 10, 'pièce', 'Allée 4 - Case 1', 'actif'),
  ('p3000001-0000-0000-0000-000000000006', 'e3000000-0000-0000-0000-000000000003', 'c3000001-0000-0000-0000-000000000003', 'Rétroviseur Gauche Clio 4', 'Rétroviseur électrique chauffant', 'AP-RG-CL4', '4006633123461', 75.00, 129.00, 8, 3, 'pièce', 'Allée 5 - Case 15', 'rupture');

-- Mobilier Design - Produits meubles
INSERT INTO public.produits (id, entreprise_id, categorie_id, nom, description, sku, code_barre, prix_achat, prix_vente, quantite, quantite_min, unite, emplacement, statut) VALUES
  ('p4000001-0000-0000-0000-000000000001', 'e4000000-0000-0000-0000-000000000004', 'c4000001-0000-0000-0000-000000000001', 'Chaise Oslo', 'Chaise scandinave bois massif et tissu', 'MD-CH-OSL', '3760098765001', 120.00, 249.00, 12, 3, 'pièce', 'Showroom - Zone A', 'actif'),
  ('p4000001-0000-0000-0000-000000000002', 'e4000000-0000-0000-0000-000000000004', 'c4000001-0000-0000-0000-000000000001', 'Fauteuil Bergen', 'Fauteuil lounge cuir et noyer', 'MD-FA-BER', '3760098765002', 350.00, 699.00, 4, 2, 'pièce', 'Showroom - Zone A', 'actif'),
  ('p4000001-0000-0000-0000-000000000003', 'e4000000-0000-0000-0000-000000000004', 'c4000001-0000-0000-0000-000000000002', 'Table Malmö', 'Table à manger extensible chêne 180-240cm', 'MD-TA-MAL', '3760098765003', 450.00, 899.00, 2, 1, 'pièce', 'Entrepôt - Zone B', 'actif'),
  ('p4000001-0000-0000-0000-000000000004', 'e4000000-0000-0000-0000-000000000004', 'c4000001-0000-0000-0000-000000000002', 'Bureau Stockholm', 'Bureau design avec rangements intégrés', 'MD-BU-STO', '3760098765004', 280.00, 549.00, 6, 2, 'pièce', 'Showroom - Zone B', 'actif');

-- =====================================================
-- TICKETS SUPPORT
-- =====================================================

INSERT INTO public.tickets_support (id, numero, user_id, nom, email, entreprise, sujet, message, categorie, priorite, statut, created_at) VALUES
  ('t1000000-0000-0000-0000-000000000001', 'TKT-2024-0001', NULL, 'Marie Dupont', 'marie.dupont@techvision.fr', 'TechVision Solutions', 'Problème import CSV', 'Bonjour, je n''arrive pas à importer mon fichier CSV de produits. Le système affiche une erreur "format invalide" alors que le fichier semble correct.', 'technique', 'haute', 'en_cours', NOW() - INTERVAL '3 days'),
  ('t1000000-0000-0000-0000-000000000002', 'TKT-2024-0002', NULL, 'Pierre Martin', 'p.martin@greenleaf-bio.fr', 'GreenLeaf Bio', 'Question facturation', 'Je souhaiterais passer au plan Pro. Pouvez-vous me détailler les fonctionnalités supplémentaires et le processus de migration ?', 'facturation', 'normale', 'ouvert', NOW() - INTERVAL '1 day'),
  ('t1000000-0000-0000-0000-000000000003', 'TKT-2024-0003', NULL, 'Hans Weber', 'h.weber@autoparts-express.fr', 'AutoParts Express', 'Demande fonctionnalité', 'Serait-il possible d''ajouter une fonctionnalité de scan code-barres depuis l''application mobile ?', 'fonctionnalite', 'basse', 'ouvert', NOW() - INTERVAL '5 days'),
  ('t1000000-0000-0000-0000-000000000004', 'TKT-2024-0004', NULL, 'Sophie Blanc', 's.blanc@mobilier-design.fr', 'Mobilier Design', 'Bug affichage stock', 'Le compteur de stock affiche -2 pour un de mes produits alors que c''est impossible. Merci de vérifier.', 'bug', 'urgente', 'resolu', NOW() - INTERVAL '7 days');

-- =====================================================
-- CONVERSATIONS CHAT
-- =====================================================

INSERT INTO public.conversations (id, entreprise_id, titre, statut, derniere_activite, created_at) VALUES
  ('cv100000-0000-0000-0000-000000000001', 'e1000000-0000-0000-0000-000000000001', 'Question sur les exports', 'ouvert', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '1 day'),
  ('cv100000-0000-0000-0000-000000000002', 'e2000000-0000-0000-0000-000000000002', 'Mise à niveau du plan', 'ouvert', NOW() - INTERVAL '4 hours', NOW() - INTERVAL '2 days'),
  ('cv100000-0000-0000-0000-000000000003', 'e3000000-0000-0000-0000-000000000003', 'Intégration API', 'ferme', NOW() - INTERVAL '5 days', NOW() - INTERVAL '10 days');

-- =====================================================
-- MESSAGES CHAT
-- =====================================================

INSERT INTO public.messages (id, conversation_id, sender_id, sender_nom, sender_role, contenu, lu, created_at) VALUES
  -- Conversation 1
  ('m1000001-0000-0000-0000-000000000001', 'cv100000-0000-0000-0000-000000000001', NULL, 'Marie Dupont', 'manager', 'Bonjour, est-il possible d''exporter les données d''inventaire au format Excel en plus du CSV ?', true, NOW() - INTERVAL '1 day'),
  ('m1000001-0000-0000-0000-000000000002', 'cv100000-0000-0000-0000-000000000001', NULL, 'Support Invexia', 'admin', 'Bonjour Marie ! Oui, cette fonctionnalité est disponible. Allez dans Paramètres > Export et sélectionnez le format XLSX.', true, NOW() - INTERVAL '20 hours'),
  ('m1000001-0000-0000-0000-000000000003', 'cv100000-0000-0000-0000-000000000001', NULL, 'Marie Dupont', 'manager', 'Parfait, merci beaucoup ! Et pour les rapports automatiques, c''est également possible ?', false, NOW() - INTERVAL '2 hours'),
  
  -- Conversation 2
  ('m1000002-0000-0000-0000-000000000001', 'cv100000-0000-0000-0000-000000000002', NULL, 'Pierre Martin', 'admin', 'Bonjour, nous aimerions passer au plan Enterprise. Quelles sont les étapes ?', true, NOW() - INTERVAL '2 days'),
  ('m1000002-0000-0000-0000-000000000002', 'cv100000-0000-0000-0000-000000000002', NULL, 'Support Invexia', 'super_admin', 'Bonjour Pierre ! Ravi de votre intérêt. Le plan Enterprise inclut : support prioritaire, API avancée, utilisateurs illimités, et audit complet. Je vous envoie une proposition détaillée par email.', true, NOW() - INTERVAL '1 day'),
  ('m1000002-0000-0000-0000-000000000003', 'cv100000-0000-0000-0000-000000000002', NULL, 'Pierre Martin', 'admin', 'Excellent, j''attends votre email. Merci !', false, NOW() - INTERVAL '4 hours'),
  
  -- Conversation 3
  ('m1000003-0000-0000-0000-000000000001', 'cv100000-0000-0000-0000-000000000003', NULL, 'Hans Weber', 'manager', 'Nous souhaitons intégrer Invexia avec notre ERP. Avez-vous une documentation API ?', true, NOW() - INTERVAL '10 days'),
  ('m1000003-0000-0000-0000-000000000002', 'cv100000-0000-0000-0000-000000000003', NULL, 'Support Invexia', 'admin', 'Bonjour Hans ! Notre API REST est documentée ici : docs.invexia.fr/api. Vous y trouverez tous les endpoints disponibles avec exemples.', true, NOW() - INTERVAL '9 days'),
  ('m1000003-0000-0000-0000-000000000003', 'cv100000-0000-0000-0000-000000000003', NULL, 'Hans Weber', 'manager', 'Super, l''intégration fonctionne parfaitement. Merci pour votre aide !', true, NOW() - INTERVAL '5 days');

-- =====================================================
-- AUDIT LOGS
-- =====================================================

INSERT INTO public.audit_logs (id, entreprise_id, user_id, action, entite, entite_id, details, ip_address, severite, created_at) VALUES
  ('a1000001-0000-0000-0000-000000000001', 'e1000000-0000-0000-0000-000000000001', NULL, 'CREATE', 'produit', 'p1000001-0000-0000-0000-000000000001', '{"nom": "MacBook Pro 16\"", "quantite": 25}', '192.168.1.100', 'info', NOW() - INTERVAL '30 days'),
  ('a1000001-0000-0000-0000-000000000002', 'e1000000-0000-0000-0000-000000000001', NULL, 'UPDATE', 'produit', 'p1000001-0000-0000-0000-000000000002', '{"champ": "prix_vente", "ancien": 2199.00, "nouveau": 2299.00}', '192.168.1.100', 'info', NOW() - INTERVAL '15 days'),
  ('a1000001-0000-0000-0000-000000000003', 'e2000000-0000-0000-0000-000000000002', NULL, 'LOGIN', 'user', NULL, '{"email": "p.martin@greenleaf-bio.fr"}', '82.65.45.123', 'info', NOW() - INTERVAL '2 days'),
  ('a1000001-0000-0000-0000-000000000004', 'e3000000-0000-0000-0000-000000000003', NULL, 'STOCK_LOW', 'produit', 'p3000001-0000-0000-0000-000000000006', '{"nom": "Rétroviseur Gauche Clio 4", "quantite": 8, "seuil": 10}', NULL, 'warning', NOW() - INTERVAL '1 day'),
  ('a1000001-0000-0000-0000-000000000005', 'e4000000-0000-0000-0000-000000000004', NULL, 'DELETE', 'categorie', NULL, '{"nom": "Ancienne catégorie test"}', '90.12.34.56', 'warning', NOW() - INTERVAL '5 days'),
  ('a1000001-0000-0000-0000-000000000006', 'e1000000-0000-0000-0000-000000000001', NULL, 'EXPORT', 'inventaire', NULL, '{"format": "CSV", "lignes": 156}', '192.168.1.100', 'info', NOW() - INTERVAL '1 day');
