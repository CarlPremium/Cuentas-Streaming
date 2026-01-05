-- Sample Store Products
-- Run this after the main migration to populate the store with sample products

-- Insert sample products
INSERT INTO products (
  name, slug, description, price, original_price, 
  image_url, category, duration, features, 
  is_active, is_featured, is_popular, sort_order
) VALUES
-- Streaming Products
(
  'Netflix Premium',
  'netflix-premium',
  'Cuenta premium con acceso a todo el catálogo en 4K Ultra HD. Disfruta de series y películas sin límites.',
  4.99,
  15.99,
  'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&h=600&fit=crop',
  'Streaming',
  '1 Mes',
  '["4K Ultra HD", "4 Pantallas", "Descargas ilimitadas", "Sin anuncios"]'::jsonb,
  true,
  true,
  true,
  1
),
(
  'Disney+ Premium',
  'disney-plus-premium',
  'Todo el universo Disney, Marvel, Star Wars y National Geographic en un solo lugar.',
  3.99,
  12.99,
  'https://images.unsplash.com/photo-1640499900704-b00dd6a1103a?w=800&h=600&fit=crop',
  'Streaming',
  '1 Mes',
  '["4K + Dolby Vision", "4 Pantallas", "Contenido exclusivo", "GroupWatch"]'::jsonb,
  true,
  true,
  false,
  2
),
(
  'HBO Max',
  'hbo-max',
  'Las mejores series originales, películas de Warner Bros y contenido exclusivo de HBO.',
  4.49,
  14.99,
  'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&h=600&fit=crop',
  'Streaming',
  '1 Mes',
  '["4K Ultra HD", "3 Pantallas", "Descargas", "Estrenos de cine"]'::jsonb,
  true,
  false,
  false,
  3
),
(
  'Amazon Prime Video',
  'amazon-prime-video',
  'Miles de películas y series exclusivas de Amazon, incluyendo producciones originales.',
  3.49,
  8.99,
  'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=800&h=600&fit=crop',
  'Streaming',
  '1 Mes',
  '["4K Ultra HD", "X-Ray", "Watch Party", "Canales premium"]'::jsonb,
  true,
  false,
  false,
  4
),
(
  'YouTube Premium',
  'youtube-premium',
  'Videos sin anuncios, reproducción en segundo plano y YouTube Music incluido.',
  2.99,
  11.99,
  'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&h=600&fit=crop',
  'Streaming',
  '1 Mes',
  '["Sin anuncios", "Reproducción offline", "YouTube Music", "Picture-in-Picture"]'::jsonb,
  true,
  false,
  false,
  5
),
(
  'Crunchyroll Premium',
  'crunchyroll-premium',
  'Todo el anime que amas con subtítulos y doblaje, sin anuncios y en la mejor calidad.',
  2.49,
  7.99,
  'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&h=600&fit=crop',
  'Streaming',
  '1 Mes',
  '["Sin anuncios", "Simulcasts", "Manga digital", "Descuentos tienda"]'::jsonb,
  true,
  false,
  false,
  6
),

-- Music Products
(
  'Spotify Premium',
  'spotify-premium',
  'Música sin límites, sin anuncios y con la mejor calidad de audio disponible.',
  2.99,
  9.99,
  'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=800&h=600&fit=crop',
  'Música',
  '1 Mes',
  '["Audio HD", "Sin anuncios", "Descargas offline", "Letras en tiempo real"]'::jsonb,
  true,
  true,
  true,
  7
),
(
  'Apple Music',
  'apple-music',
  'Más de 100 millones de canciones con audio espacial y sin pérdida.',
  3.49,
  10.99,
  'https://images.unsplash.com/photo-1611339555312-e607c8352fd7?w=800&h=600&fit=crop',
  'Música',
  '1 Mes',
  '["Audio sin pérdida", "Dolby Atmos", "Letras en vivo", "Radio en vivo"]'::jsonb,
  true,
  false,
  false,
  8
),

-- Gaming Products
(
  'Xbox Game Pass Ultimate',
  'xbox-game-pass-ultimate',
  'Acceso a cientos de juegos para consola, PC y cloud gaming. Incluye EA Play.',
  7.99,
  14.99,
  'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800&h=600&fit=crop',
  'Gaming',
  '1 Mes',
  '["Cloud Gaming", "EA Play incluido", "+400 juegos", "Multidispositivo"]'::jsonb,
  true,
  true,
  true,
  9
),
(
  'PlayStation Plus Premium',
  'playstation-plus-premium',
  'Juegos mensuales, descuentos exclusivos y acceso a un catálogo de clásicos.',
  6.99,
  17.99,
  'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&h=600&fit=crop',
  'Gaming',
  '1 Mes',
  '["Juegos mensuales", "Descuentos", "Catálogo clásicos", "Multijugador online"]'::jsonb,
  true,
  false,
  false,
  10
),
(
  'Nintendo Switch Online',
  'nintendo-switch-online',
  'Juega online, accede a juegos clásicos de NES y SNES, y guarda tus partidas en la nube.',
  1.99,
  3.99,
  'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800&h=600&fit=crop',
  'Gaming',
  '1 Mes',
  '["Multijugador online", "Juegos clásicos", "Guardado en nube", "Ofertas exclusivas"]'::jsonb,
  true,
  false,
  false,
  11
);

-- Update store settings with proper Telegram handle
UPDATE store_settings
SET
  telegram_handle = '@hyrecrpyto',
  store_name = 'Cuentas Premium Store',
  store_description = 'Las mejores cuentas premium a precios increíbles',
  binance_enabled = true,
  paypal_enabled = true,
  notify_new_orders = true
WHERE id = 1;

-- If no settings exist, insert default
INSERT INTO store_settings (
  telegram_handle,
  store_name,
  store_description,
  binance_enabled,
  paypal_enabled,
  notify_new_orders
)
SELECT
  '@hyrecrpyto',
  'Cuentas Premium Store',
  'Las mejores cuentas premium a precios increíbles',
  true,
  true,
  true
WHERE NOT EXISTS (SELECT 1 FROM store_settings LIMIT 1);
