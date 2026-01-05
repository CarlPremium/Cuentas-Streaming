-- Seed Product Categories
-- Run this file to add default categories to your database

INSERT INTO product_categories (name, slug, description, icon, color, sort_order) VALUES
  ('Streaming', 'streaming', 'Servicios de streaming de video', 'Tv', '#8B5CF6', 1),
  ('Música', 'musica', 'Plataformas de música y audio', 'Music', '#06B6D4', 2),
  ('Gaming', 'gaming', 'Servicios de videojuegos', 'Gamepad2', '#10B981', 3),
  ('Productividad', 'productividad', 'Herramientas de productividad', 'Briefcase', '#F59E0B', 4),
  ('Educación', 'educacion', 'Plataformas educativas', 'GraduationCap', '#EC4899', 5),
  ('Software', 'software', 'Software y aplicaciones', 'Code', '#6366F1', 6),
  ('Cloud Storage', 'cloud-storage', 'Almacenamiento en la nube', 'Cloud', '#3B82F6', 7),
  ('VPN', 'vpn', 'Servicios de VPN y seguridad', 'Shield', '#EF4444', 8)
ON CONFLICT (slug) DO NOTHING;
