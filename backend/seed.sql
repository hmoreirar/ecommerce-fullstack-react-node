-- Datos de demostracion para desarrollo local.
-- Ejecutar despues de migrations.sql. No crea usuarios ni contrasenas.

INSERT INTO products (name, price, image, stock, category, tags, active)
VALUES
  ('Auriculares Studio', 79990.00, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80', 18, 'audio', ARRAY['inalambrico', 'premium'], TRUE),
  ('Teclado mecanico Compact', 64990.00, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80', 12, 'accesorios', ARRAY['mecanico', 'escritorio'], TRUE),
  ('Lampara de escritorio', 38990.00, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80', 24, 'hogar', ARRAY['luz', 'escritorio'], TRUE),
  ('Mochila urbana', 45990.00, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80', 15, 'accesorios', ARRAY['viaje', 'resistente'], TRUE),
  ('Botella termica', 22990.00, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80', 30, 'hogar', ARRAY['reutilizable', 'outdoor'], TRUE)
ON CONFLICT DO NOTHING;
