-- Datos de demostracion para desarrollo local.
-- Ejecutar despues de migrations.sql. No crea usuarios ni contrasenas.
-- Seguro de ejecutar varias veces: cada fila se omite si el producto ya existe.
-- Imagenes: SceneSKU (https://scenesku.com) — API publica de packs de producto.

-- Catalogo actual: packs SceneSKU. Los productos de demo anteriores se desactivan
-- (no se borran: las ordenes existentes conservan sus referencias).

UPDATE products SET active = FALSE
WHERE name IN ('Auriculares Studio', 'Teclado mecanico Compact', 'Lampara de escritorio', 'Mochila urbana', 'Botella termica', 'Parlante Bluetooth Mini', 'Microfono USB Studio', 'Audifonos Gamer Pro', 'Mouse Inalambrico Ergonomico', 'Teclado Mecanico RGB', 'Mochila para Laptop 15', 'Webcam Full HD', 'Mousepad XL Escritorio', 'Lampara LED Escritorio', 'Cafetera Prensa Francesa', 'Ventilador de Escritorio Silencioso', 'Termo Termico 1L', 'Silla Ergonomica de Oficina', 'Hub USB-C 7 en 1', 'Disco Duro Externo 1TB', 'Reloj Inteligente Deportivo', 'Tablet 10 pulgadas', 'Botella Deportiva 750ml', 'Mancuernas Ajustables 10kg', 'Altavoces de Escritorio 2.0');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Vestido Playero de Verano Sin Mangas', 38000.00, 'https://cdn.scenesku.com/scene-packs/50258134-2fff-4ca4-abea-3f46e9368378/cbe0e097-da10-44de-b076-8be49c7b8752.webp', 12, 'moda', ARRAY['vestido', 'verano'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Vestido Playero de Verano Sin Mangas');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Conjunto de Falda Larga Tiro Alto', 95000.00, 'https://cdn.scenesku.com/scene-packs/27e4c87f-57d1-45e3-8f62-bd206973da5a/f4c01b33-d9dc-4610-829f-44975cc865c6.webp', 8, 'moda', ARRAY['falda', 'conjunto'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Conjunto de Falda Larga Tiro Alto');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Vestido Maxi Casual con Cinturón', 61800.00, 'https://cdn.scenesku.com/scene-packs/d252c6ae-1098-4aeb-b7ee-f0a21beae4b6/7337a42c-cb5a-4694-a618-d6b6aa4a3c01.webp', 15, 'moda', ARRAY['vestido', 'casual'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Vestido Maxi Casual con Cinturón');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Vestido Elegante de Cuello Alto', 71300.00, 'https://cdn.scenesku.com/scene-packs/ae9a5b6d-727d-4dcc-8b99-7c07b701b5be/7de6ab66-478b-45da-888b-79a1049dee01.webp', 10, 'moda', ARRAY['vestido', 'elegante'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Vestido Elegante de Cuello Alto');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Vestido de Manga Larga con Pliegues', 95000.00, 'https://cdn.scenesku.com/scene-packs/8672bb13-c2c0-4fd0-bb6e-e5e53c25182d/b7ea7316-330d-4325-8ad4-9e61c4bc4a6a.webp', 6, 'moda', ARRAY['vestido', 'manga larga'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Vestido de Manga Larga con Pliegues');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Lámina Decorativa Abstracta', 190000.00, 'https://cdn.scenesku.com/scene-packs/d8116a53-42d3-40b3-8c84-9c5a48916457/57c80303-a384-41c4-a744-9c9e1529d02d.webp', 9, 'hogar', ARRAY['arte', 'pared'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Lámina Decorativa Abstracta');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Almohadón Decorativo', 38000.00, 'https://cdn.scenesku.com/scene-packs/3e1d5e2e-fb6c-4cb0-9859-05af3039cd05/6f798404-d9b8-466e-bc1a-851f18cd6c43.webp', 20, 'hogar', ARRAY['almohadón', 'decoración'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Almohadón Decorativo');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Mesa Auxiliar Escultórica', 213800.00, 'https://cdn.scenesku.com/scene-packs/1f3e0b40-87e3-48d8-848c-9249f52c94e9/27e4ca2d-ba57-4fb0-8fb0-5d394b72c890.webp', 7, 'hogar', ARRAY['mesa', 'moderna'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Mesa Auxiliar Escultórica');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Alfombra Tejida', 166300.00, 'https://cdn.scenesku.com/scene-packs/64c091af-af21-4d28-91a5-488d1bc1d341/c121cda9-28b0-458e-97b1-edfaae9157bf.webp', 5, 'hogar', ARRAY['alfombra', 'tejida'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Alfombra Tejida');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Silla Lounge Escandinava', 308800.00, 'https://cdn.scenesku.com/scene-packs/f78e9df7-f1e9-4aa6-a24c-b664aa0a75d2/c981ce1f-9678-42a9-8569-15af09a10674.webp', 4, 'hogar', ARRAY['silla', 'escandinava'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Silla Lounge Escandinava');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Zapatillas Grises Bajas Hombre', 61800.00, 'https://cdn.scenesku.com/scene-packs/a8aa6cb1-670e-455a-9c58-ba4c32fe50a4/949ccd1d-a088-403e-8067-f4d2eea362f4.webp', 14, 'zapatos', ARRAY['zapatillas', 'hombre'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Zapatillas Grises Bajas Hombre');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Zapatillas de Entrenamiento Mujer', 76000.00, 'https://cdn.scenesku.com/scene-packs/a3c827cf-0ae5-4827-af09-7ea18d8d2885/fab8331b-ad60-4e5e-9d55-2fca5e4623a5.webp', 11, 'zapatos', ARRAY['zapatillas', 'entrenamiento'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Zapatillas de Entrenamiento Mujer');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Zapatillas de Correr Fluor Mujer', 95000.00, 'https://cdn.scenesku.com/scene-packs/1b89d2cd-70e5-4a9e-9264-5a2c3ca4199b/99e207af-8d72-4201-b4ca-074e19fb0e4b.webp', 13, 'zapatos', ARRAY['zapatillas', 'correr'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Zapatillas de Correr Fluor Mujer');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Zapatos de Lona Blancos Mujer', 61800.00, 'https://cdn.scenesku.com/scene-packs/6e323896-008c-408c-aa4a-9f45b4e34d64/d4280864-9919-4f04-987e-cff75a43a54f.webp', 16, 'zapatos', ARRAY['zapatos', 'lona'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Zapatos de Lona Blancos Mujer');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Zapatillas Azul y Morado', 80800.00, 'https://cdn.scenesku.com/scene-packs/1efd6c4d-debe-4b15-a3b0-9c97a36e6b99/a1118bf4-5d6b-478e-9ca4-50b936336e05.webp', 9, 'zapatos', ARRAY['zapatillas', 'casual'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Zapatillas Azul y Morado');
