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

-- Catalogo ampliado de demostracion.

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Parlante Bluetooth Mini', 45990.00, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/67/JBL_Flip_3_bluetooth_speaker_%28DSCF2653%29.jpg/960px-JBL_Flip_3_bluetooth_speaker_%28DSCF2653%29.jpg', 14, 'audio', ARRAY['inalambrico','portatil'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Parlante Bluetooth Mini');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Microfono USB Studio', 54990.00, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e2/Rode_NT-USB.jpg/960px-Rode_NT-USB.jpg', 9, 'audio', ARRAY['grabacion','streaming'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Microfono USB Studio');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Teclado Mecanico RGB', 72990.00, 'https://upload.wikimedia.org/wikipedia/commons/d/df/Mechanical_keyboard_example.jpg', 10, 'accesorios', ARRAY['mecanico','gamer'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Teclado Mecanico RGB');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Mochila para Laptop 15', 52990.00, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/78/Laptop_backpacks_from_Mr._DIY_at_Ayala_Center_Cebu_%282025-02-24%29.jpg/960px-Laptop_backpacks_from_Mr._DIY_at_Ayala_Center_Cebu_%282025-02-24%29.jpg', 13, 'accesorios', ARRAY['viaje','resistente'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Mochila para Laptop 15');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Mousepad XL Escritorio', 15990.00, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2a/HP_mouse_and_mousepad_20060803.jpg/960px-HP_mouse_and_mousepad_20060803.jpg', 30, 'accesorios', ARRAY['escritorio','antideslizante'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Mousepad XL Escritorio');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Lampara LED Escritorio', 28990.00, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9f/Anglepoise_lamp%2C_model_1208.jpg/960px-Anglepoise_lamp%2C_model_1208.jpg', 18, 'hogar', ARRAY['luz','ajustable'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Lampara LED Escritorio');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Cafetera Prensa Francesa', 32990.00, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/44/Stainless_steel_french_press.png/960px-Stainless_steel_french_press.png', 12, 'hogar', ARRAY['cafe','vidrio'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Cafetera Prensa Francesa');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Ventilador de Escritorio Silencioso', 25990.00, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8d/Generic_9%22_desk_fan_from_the_1990%22.jpg/960px-Generic_9%22_desk_fan_from_the_1990%22.jpg', 15, 'hogar', ARRAY['clima','silencioso'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Ventilador de Escritorio Silencioso');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Hub USB-C 7 en 1', 34990.00, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/04/2023_Hub_USB_2.0.jpg/960px-2023_Hub_USB_2.0.jpg', 17, 'tech', ARRAY['usb-c','portatil'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Hub USB-C 7 en 1');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Botella Deportiva 750ml', 18990.00, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/45/Metal_Water_Bottles.jpeg/960px-Metal_Water_Bottles.jpeg', 26, 'deporte', ARRAY['hidratacion','gimnasio'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Botella Deportiva 750ml');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Silla Ergonomica de Oficina', 189990.00, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d4/Buerostuhl_%28fcm%29.jpg/960px-Buerostuhl_%28fcm%29.jpg', 6, 'hogar', ARRAY['ergonomica', 'escritorio'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Silla Ergonomica de Oficina');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Webcam Full HD', 38990.00, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/54/Logitech_Brio_301_webcam_HS1.jpg/960px-Logitech_Brio_301_webcam_HS1.jpg', 16, 'accesorios', ARRAY['video','streaming'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Webcam Full HD');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Disco Duro Externo 1TB', 79990.00, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/76/WD_External_Hard_Drives_IMG_7899.jpg/960px-WD_External_Hard_Drives_IMG_7899.jpg', 10, 'tech', ARRAY['almacenamiento','portatil'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Disco Duro Externo 1TB');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Reloj Inteligente Deportivo', 89990.00, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b2/Apple_Watch_Sport.jpg/960px-Apple_Watch_Sport.jpg', 12, 'tech', ARRAY['smartwatch','deporte'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Reloj Inteligente Deportivo');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Tablet 10 pulgadas', 199990.00, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/70/Apple_iPad_Pro_11.jpg/960px-Apple_iPad_Pro_11.jpg', 5, 'tech', ARRAY['tablet','pantalla'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Tablet 10 pulgadas');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Audifonos Gamer Pro', 68990.00, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/40/Headphones_1.jpg/960px-Headphones_1.jpg', 11, 'audio', ARRAY['gamer','sonido'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Audifonos Gamer Pro');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Mouse Inalambrico Ergonomico', 24990.00, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/77/A_wireless_computer_mouse.jpg/960px-A_wireless_computer_mouse.jpg', 25, 'accesorios', ARRAY['inalambrico','ergonomico'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Mouse Inalambrico Ergonomico');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Mancuernas Ajustables 10kg', 42990.00, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3a/Gym_Dumbbells_For_Working_Out_%28193383405%29.jpeg/960px-Gym_Dumbbells_For_Working_Out_%28193383405%29.jpeg', 9, 'deporte', ARRAY['gimnasio', 'ajustable'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Mancuernas Ajustables 10kg');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Termo Termico 1L', 21990.00, 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Esbit_thermosflasche.jpg', 22, 'hogar', ARRAY['reutilizable','outdoor'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Termo Termico 1L');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Altavoces de Escritorio 2.0', 29990.00, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9a/Cassa_computer_2.jpg/960px-Cassa_computer_2.jpg', 14, 'tech', ARRAY['audio','escritorio'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Altavoces de Escritorio 2.0');
