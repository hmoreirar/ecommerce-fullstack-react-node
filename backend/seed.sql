-- Datos de demostracion para desarrollo local.
-- Ejecutar despues de migrations.sql. No crea usuarios ni contrasenas.
-- Seguro de ejecutar varias veces: cada fila se omite si el producto ya existe.
-- Imagenes: SceneSKU (https://scenesku.com) — API publica de packs de producto.
-- Precios: estrategia marketing, siempre terminan en 990.

-- Los productos de demo anteriores se desactivan
-- (no se borran: las ordenes existentes conservan sus referencias).

UPDATE products SET active = FALSE
WHERE name IN ('Auriculares Studio', 'Teclado mecanico Compact', 'Lampara de escritorio', 'Mochila urbana', 'Botella termica', 'Parlante Bluetooth Mini', 'Microfono USB Studio', 'Audifonos Gamer Pro', 'Mouse Inalambrico Ergonomico', 'Teclado Mecanico RGB', 'Mochila para Laptop 15', 'Webcam Full HD', 'Mousepad XL Escritorio', 'Lampara LED Escritorio', 'Cafetera Prensa Francesa', 'Ventilador de Escritorio Silencioso', 'Termo Termico 1L', 'Silla Ergonomica de Oficina', 'Hub USB-C 7 en 1', 'Disco Duro Externo 1TB', 'Reloj Inteligente Deportivo', 'Tablet 10 pulgadas', 'Botella Deportiva 750ml', 'Mancuernas Ajustables 10kg', 'Altavoces de Escritorio 2.0');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Vestido Playero de Verano Sin Mangas', 37990.00, 'https://cdn.scenesku.com/scene-packs/50258134-2fff-4ca4-abea-3f46e9368378/cbe0e097-da10-44de-b076-8be49c7b8752.webp', 12, 'moda', ARRAY['vestido', 'verano'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Vestido Playero de Verano Sin Mangas');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Conjunto de Falda Larga Tiro Alto', 94990.00, 'https://cdn.scenesku.com/scene-packs/27e4c87f-57d1-45e3-8f62-bd206973da5a/f4c01b33-d9dc-4610-829f-44975cc865c6.webp', 8, 'moda', ARRAY['falda', 'conjunto'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Conjunto de Falda Larga Tiro Alto');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Vestido Maxi Casual con Cinturón', 61990.00, 'https://cdn.scenesku.com/scene-packs/d252c6ae-1098-4aeb-b7ee-f0a21beae4b6/7337a42c-cb5a-4694-a618-d6b6aa4a3c01.webp', 15, 'moda', ARRAY['vestido', 'casual'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Vestido Maxi Casual con Cinturón');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Vestido Elegante de Cuello Alto', 70990.00, 'https://cdn.scenesku.com/scene-packs/ae9a5b6d-727d-4dcc-8b99-7c07b701b5be/7de6ab66-478b-45da-888b-79a1049dee01.webp', 10, 'moda', ARRAY['vestido', 'elegante'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Vestido Elegante de Cuello Alto');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Vestido de Manga Larga con Pliegues', 94990.00, 'https://cdn.scenesku.com/scene-packs/8672bb13-c2c0-4fd0-bb6e-e5e53c25182d/b7ea7316-330d-4325-8ad4-9e61c4bc4a6a.webp', 6, 'moda', ARRAY['vestido', 'manga larga'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Vestido de Manga Larga con Pliegues');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Lámina Decorativa Abstracta', 189990.00, 'https://cdn.scenesku.com/scene-packs/d8116a53-42d3-40b3-8c84-9c5a48916457/57c80303-a384-41c4-a744-9c9e1529d02d.webp', 9, 'hogar', ARRAY['arte', 'pared'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Lámina Decorativa Abstracta');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Almohadón Decorativo', 37990.00, 'https://cdn.scenesku.com/scene-packs/3e1d5e2e-fb6c-4cb0-9859-05af3039cd05/6f798404-d9b8-466e-bc1a-851f18cd6c43.webp', 20, 'hogar', ARRAY['almohadón', 'decoración'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Almohadón Decorativo');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Mesa Auxiliar Escultórica', 213990.00, 'https://cdn.scenesku.com/scene-packs/1f3e0b40-87e3-48d8-848c-9249f52c94e9/27e4ca2d-ba57-4fb0-8fb0-5d394b72c890.webp', 7, 'hogar', ARRAY['mesa', 'moderna'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Mesa Auxiliar Escultórica');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Alfombra Tejida', 165990.00, 'https://cdn.scenesku.com/scene-packs/64c091af-af21-4d28-91a5-488d1bc1d341/c121cda9-28b0-458e-97b1-edfaae9157bf.webp', 5, 'hogar', ARRAY['alfombra', 'tejida'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Alfombra Tejida');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Silla Lounge Escandinava', 308990.00, 'https://cdn.scenesku.com/scene-packs/f78e9df7-f1e9-4aa6-a24c-b664aa0a75d2/c981ce1f-9678-42a9-8569-15af09a10674.webp', 4, 'hogar', ARRAY['silla', 'escandinava'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Silla Lounge Escandinava');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Zapatillas Grises Bajas Hombre', 61990.00, 'https://cdn.scenesku.com/scene-packs/a8aa6cb1-670e-455a-9c58-ba4c32fe50a4/949ccd1d-a088-403e-8067-f4d2eea362f4.webp', 14, 'zapatos', ARRAY['zapatillas', 'hombre'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Zapatillas Grises Bajas Hombre');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Zapatillas de Entrenamiento Mujer', 75990.00, 'https://cdn.scenesku.com/scene-packs/a3c827cf-0ae5-4827-af09-7ea18d8d2885/fab8331b-ad60-4e5e-9d55-2fca5e4623a5.webp', 11, 'zapatos', ARRAY['zapatillas', 'entrenamiento'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Zapatillas de Entrenamiento Mujer');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Zapatillas de Correr Fluor Mujer', 94990.00, 'https://cdn.scenesku.com/scene-packs/1b89d2cd-70e5-4a9e-9264-5a2c3ca4199b/99e207af-8d72-4201-b4ca-074e19fb0e4b.webp', 13, 'zapatos', ARRAY['zapatillas', 'correr'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Zapatillas de Correr Fluor Mujer');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Zapatos de Lona Blancos Mujer', 61990.00, 'https://cdn.scenesku.com/scene-packs/6e323896-008c-408c-aa4a-9f45b4e34d64/d4280864-9919-4f04-987e-cff75a43a54f.webp', 16, 'zapatos', ARRAY['zapatos', 'lona'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Zapatos de Lona Blancos Mujer');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Zapatillas Azul y Morado', 80990.00, 'https://cdn.scenesku.com/scene-packs/1efd6c4d-debe-4b15-a3b0-9c97a36e6b99/a1118bf4-5d6b-478e-9ca4-50b936336e05.webp', 9, 'zapatos', ARRAY['zapatillas', 'casual'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Zapatillas Azul y Morado');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Sudadera con Capucha Azul Marino', 47990.00, 'https://cdn.scenesku.com/scene-packs/b22c8669-e121-4f19-bdc1-1574efd580e9/a74e42af-dc43-448e-9edd-b34994f3a2b0.webp', 12, 'hombre', ARRAY['sudadera', 'hombre'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Sudadera con Capucha Azul Marino');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Sudadera Casual Hombre', 51990.00, 'https://cdn.scenesku.com/scene-packs/e9319652-5668-4b84-a912-1ffb3212d610/66b6bc15-118d-4726-9f56-f9b556069e9e.webp', 14, 'hombre', ARRAY['sudadera', 'casual'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Sudadera Casual Hombre');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Polo de Manga Corta Beige', 37990.00, 'https://cdn.scenesku.com/scene-packs/ff8daaf6-b016-45bf-aabd-710d681575f2/f8d17ee8-8047-432f-bb8f-0d56a75b2a3b.webp', 18, 'hombre', ARRAY['polo', 'hombre'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Polo de Manga Corta Beige');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Smart TV 55 Pulgadas', 1328990.00, 'https://cdn.scenesku.com/scene-packs/3d214b2d-bcc7-46ff-a87a-cf288fe550b6/339e7486-0d5b-4806-baca-1112341d3561.webp', 6, 'tech', ARRAY['smart tv', 'hogar'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Smart TV 55 Pulgadas');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Laptop Ultra Delgada', 949990.00, 'https://cdn.scenesku.com/scene-packs/76f1adf3-c9ff-494f-b92b-803d3171d0dd/04256f98-2a43-4640-a85e-fb577a37b350.webp', 8, 'tech', ARRAY['laptop', 'tech'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Laptop Ultra Delgada');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Teclado Mecanico Compacto', 94990.00, 'https://cdn.scenesku.com/scene-packs/cdaaba9f-6d41-449e-830c-7f14369ebdef/6c302470-40f8-4a4d-a162-e1b45969045e.webp', 15, 'tech', ARRAY['teclado', 'gamer'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Teclado Mecanico Compacto');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Audifonos con Cancelacion de Ruido', 236990.00, 'https://cdn.scenesku.com/scene-packs/8114b4d6-55f1-4ae5-99f3-35dcfd068868/7b46feae-2ba8-4f79-85f7-fe8be5e8164b.webp', 10, 'tech', ARRAY['audifonos', 'inalambrico'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Audifonos con Cancelacion de Ruido');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Parlante Bluetooth Portatil', 70990.00, 'https://cdn.scenesku.com/scene-packs/72fc3c13-ea40-413c-b0b7-a3f40eed1ea5/82b9d250-7d8c-433f-b17a-a5929cdc278d.webp', 16, 'tech', ARRAY['parlante', 'outdoor'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Parlante Bluetooth Portatil');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Mochila de Trekking Premium', 94990.00, 'https://cdn.scenesku.com/scene-packs/87fe67e1-7e22-4751-8d4e-ec8338c10aa4/da949c1e-278f-4c27-9b19-81c479908731.webp', 11, 'accesorios', ARRAY['mochila', 'outdoor'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Mochila de Trekking Premium');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Mochila Escolar Infantil', 30990.00, 'https://cdn.scenesku.com/scene-packs/cc699308-f8d3-4294-975b-6c00717ca124/301ec480-edb3-4303-bd6d-a2328575f3ac.webp', 20, 'accesorios', ARRAY['mochila', 'ninos'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Mochila Escolar Infantil');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Bolso Tote de Cuero Camel', 213990.00, 'https://cdn.scenesku.com/scene-packs/8910be12-c32b-4cba-a812-c8382cdac208/e72d6b1b-0e6b-4492-965d-4410ea847409.webp', 7, 'accesorios', ARRAY['bolso', 'cuero'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Bolso Tote de Cuero Camel');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Smartwatch Deportivo', 212990.00, 'https://cdn.scenesku.com/scene-packs/1d88b90f-ac2d-4560-9aab-a5c939ba9e32/93648e15-334d-499c-9da6-91e59325e24d.webp', 9, 'tech', ARRAY['smartwatch', 'deporte'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Smartwatch Deportivo');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Polera Deportiva Mujer', 61990.00, 'https://cdn.scenesku.com/scene-packs/6cc475b1-5efd-4b93-b216-2d7d8cb0d5c8/388660f8-42c4-414e-9afe-3b75a9b4998c.webp', 17, 'deporte', ARRAY['deporte', 'mujer'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Polera Deportiva Mujer');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Zapatillas Infantiles', 37990.00, 'https://cdn.scenesku.com/scene-packs/843a55dc-8f63-44ce-9bc5-919eb634bf9c/421ca8d0-f90e-431b-bb95-eca4ec1d87b1.webp', 13, 'zapatos', ARRAY['zapatillas', 'ninos'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Zapatillas Infantiles');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Zapatillas Rojas Hombre', 80990.00, 'https://cdn.scenesku.com/scene-packs/6fca0853-8bd4-4ab8-a54d-a43546ca42a8/8de2f144-a465-4f1a-829d-b8d307beddb6.webp', 12, 'zapatos', ARRAY['zapatillas', 'hombre'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Zapatillas Rojas Hombre');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Gel Hidratante Facial', 23990.00, 'https://cdn.scenesku.com/scene-packs/5ef80301-f232-4c91-a5b4-59ff3eede37d/cc7e9214-185e-4268-b051-ac0438ade78b.webp', 22, 'belleza', ARRAY['hidratacion', 'skincare'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Gel Hidratante Facial');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Serum de Acido Hialuronico', 37990.00, 'https://cdn.scenesku.com/scene-packs/3a1ac652-6328-4551-9673-5c4f4e75b053/565d0017-0783-4b0d-8f13-ce15c13b47ba.webp', 18, 'belleza', ARRAY['serum', 'skincare'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Serum de Acido Hialuronico');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Limpiador Facial Suave', 11990.00, 'https://cdn.scenesku.com/scene-packs/69aacff6-099d-4be6-915d-ebe65c5a1d84/0e0c2731-1436-470f-b00a-62ded05cb48d.webp', 25, 'belleza', ARRAY['limpiador', 'skincare'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Limpiador Facial Suave');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Set de Contenedores Apilables', 25990.00, 'https://cdn.scenesku.com/scene-packs/1d168fab-a247-404f-bab2-46b49453e203/839e6db7-b7f0-4544-877e-0e24837e809b.webp', 19, 'hogar', ARRAY['cocina', 'orden'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Set de Contenedores Apilables');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Comedor de Madera 6 Piezas', 617990.00, 'https://cdn.scenesku.com/scene-packs/61762834-7837-42a9-8f62-0d6d370085db/3e426ffd-8b35-4b56-bd4f-d9108bce5121.webp', 5, 'hogar', ARRAY['comedor', 'madera'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Comedor de Madera 6 Piezas');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Set de Vajilla de Ceramica', 70990.00, 'https://cdn.scenesku.com/scene-packs/8a971408-85d3-4065-af35-ee24e3ab4551/65d4611b-88e4-4fe0-abff-19f0c49950f8.webp', 10, 'hogar', ARRAY['vajilla', 'ceramica'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Set de Vajilla de Ceramica');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Collar con Colgante Cruz', 94990.00, 'https://cdn.scenesku.com/scene-packs/e95bf540-c2ad-4b1f-a889-078e7d69f9fc/fea88bb6-307f-4af3-94d3-d7222ed0d768.webp', 14, 'accesorios', ARRAY['collar', 'joyeria'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Collar con Colgante Cruz');

INSERT INTO products (name, price, image, stock, category, tags, active)
SELECT 'Collar con Colgante de Diamante', 332990.00, 'https://cdn.scenesku.com/scene-packs/e77c4217-779b-4c9c-9fdd-cd336d6288c4/959334c0-910e-460b-b9bb-2823c2929164.webp', 6, 'accesorios', ARRAY['collar', 'diamante'], TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Collar con Colgante de Diamante');
