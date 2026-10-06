-- Datos de demostracion para desarrollo local.
-- Ejecutar despues de migrations.sql. No crea usuarios ni contrasenas.
-- Seguro de ejecutar varias veces: cada fila se omite si el producto ya existe.

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Auriculares Studio', 79990.00, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80', 18, 'audio', ARRAY['inalambrico', 'premium'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Auriculares Studio');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Teclado mecanico Compact', 64990.00, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80', 12, 'accesorios', ARRAY['mecanico', 'escritorio'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Teclado mecanico Compact');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Lampara de escritorio', 38990.00, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80', 24, 'hogar', ARRAY['luz', 'escritorio'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Lampara de escritorio');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Mochila urbana', 45990.00, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80', 15, 'accesorios', ARRAY['viaje', 'resistente'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Mochila urbana');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Botella termica', 22990.00, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80', 30, 'hogar', ARRAY['reutilizable', 'outdoor'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Botella termica');
