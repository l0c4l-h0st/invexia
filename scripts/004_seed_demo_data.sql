-- =====================================================
-- INVEXIA - Données de démonstration
-- =====================================================

-- Créer une entreprise de démonstration
INSERT INTO public.entreprises (id, nom, slug, email, telephone, plan, adresse)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'Démo Invexia',
  'demo-invexia',
  'contact@demo-invexia.fr',
  '+33 1 23 45 67 89',
  'pro',
  '123 Avenue des Champs-Élysées, 75008 Paris'
) ON CONFLICT DO NOTHING;

-- Créer les paramètres de l'entreprise
INSERT INTO public.parametres_entreprise (entreprise_id, devise, langue)
VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'EUR', 'fr')
ON CONFLICT DO NOTHING;

-- Créer des catégories
INSERT INTO public.categories (id, entreprise_id, nom, description, couleur) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Électronique', 'Appareils et accessoires électroniques', '#3b82f6'),
  ('c1000000-0000-0000-0000-000000000002', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Mobilier', 'Meubles de bureau et équipements', '#10b981'),
  ('c1000000-0000-0000-0000-000000000003', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Fournitures', 'Fournitures de bureau', '#f59e0b'),
  ('c1000000-0000-0000-0000-000000000004', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Logiciels', 'Licences et abonnements logiciels', '#8b5cf6')
ON CONFLICT DO NOTHING;

-- Créer des fournisseurs
INSERT INTO public.fournisseurs (id, entreprise_id, nom, contact, email, telephone) VALUES
  ('f1000000-0000-0000-0000-000000000001', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Tech Supplies SAS', 'Jean Martin', 'contact@techsupplies.fr', '+33 1 98 76 54 32'),
  ('f1000000-0000-0000-0000-000000000002', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Office Pro', 'Marie Dupont', 'ventes@officepro.fr', '+33 1 11 22 33 44'),
  ('f1000000-0000-0000-0000-000000000003', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Mobilier Express', 'Pierre Bernard', 'commandes@mobilierexpress.fr', '+33 1 55 66 77 88')
ON CONFLICT DO NOTHING;

-- Créer des produits de démonstration
INSERT INTO public.produits (entreprise_id, categorie_id, nom, description, sku, code_barre, prix_achat, prix_vente, quantite, quantite_min, unite, emplacement, statut) VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1000000-0000-0000-0000-000000000001', 'MacBook Pro 14"', 'Ordinateur portable Apple M3 Pro', 'ELEC-001', '5901234123457', 2199.00, 2499.00, 15, 5, 'pièce', 'Entrepôt A - Rayon 1', 'actif'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1000000-0000-0000-0000-000000000001', 'iPhone 15 Pro', 'Smartphone Apple 256GB', 'ELEC-002', '5901234123458', 999.00, 1199.00, 25, 10, 'pièce', 'Entrepôt A - Rayon 1', 'actif'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1000000-0000-0000-0000-000000000001', 'Écran Dell 27"', 'Moniteur 4K USB-C', 'ELEC-003', '5901234123459', 399.00, 549.00, 8, 5, 'pièce', 'Entrepôt A - Rayon 2', 'actif'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1000000-0000-0000-0000-000000000001', 'Clavier Magic Keyboard', 'Clavier sans fil Apple', 'ELEC-004', '5901234123460', 89.00, 119.00, 3, 10, 'pièce', 'Entrepôt A - Rayon 2', 'commande'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1000000-0000-0000-0000-000000000002', 'Bureau Ergonomique', 'Bureau assis-debout électrique', 'MOB-001', '5901234123461', 499.00, 699.00, 12, 3, 'pièce', 'Entrepôt B - Zone 1', 'actif'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1000000-0000-0000-0000-000000000002', 'Chaise Herman Miller', 'Chaise de bureau ergonomique', 'MOB-002', '5901234123462', 899.00, 1299.00, 6, 2, 'pièce', 'Entrepôt B - Zone 1', 'actif'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1000000-0000-0000-0000-000000000003', 'Ramette Papier A4', 'Papier blanc 80g - 500 feuilles', 'FOUR-001', '5901234123463', 3.50, 5.99, 150, 50, 'paquet', 'Entrepôt C - Étagère 3', 'actif'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1000000-0000-0000-0000-000000000003', 'Stylos BIC', 'Lot de 50 stylos bleus', 'FOUR-002', '5901234123464', 8.00, 14.99, 45, 20, 'lot', 'Entrepôt C - Étagère 1', 'actif'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1000000-0000-0000-0000-000000000004', 'Licence Microsoft 365', 'Abonnement annuel Business', 'LOG-001', NULL, 99.00, 149.00, 50, 10, 'licence', 'Digital', 'actif'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1000000-0000-0000-0000-000000000004', 'Licence Adobe CC', 'Creative Cloud annuel', 'LOG-002', NULL, 450.00, 599.00, 0, 5, 'licence', 'Digital', 'rupture')
ON CONFLICT DO NOTHING;
