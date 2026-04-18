INSERT INTO products (name, brand, description, price, image_url, stock_quantity, category, size)
SELECT 'Bleu de Chanel', 'Chanel', 'A bold, fresh woody aromatic fragrance for men. Notes of citrus, labdanum, and sandalwood create a timeless masculine scent.', 145.00, 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=400', 50, 'MEN', '100ml'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Bleu de Chanel');

INSERT INTO products (name, brand, description, price, image_url, stock_quantity, category, size)
SELECT 'Coco Mademoiselle', 'Chanel', 'A vibrant, bold oriental fragrance for women. Opening with orange and bergamot, and deepened by patchouli and vetiver.', 138.00, 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400', 45, 'WOMEN', '100ml'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Coco Mademoiselle');

INSERT INTO products (name, brand, description, price, image_url, stock_quantity, category, size)
SELECT 'Sauvage', 'Dior', 'A radically fresh composition with notes of Calabrian bergamot and Ambroxan. Bold, noble, and wild.', 130.00, 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400', 60, 'MEN', '100ml'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Sauvage');

INSERT INTO products (name, brand, description, price, image_url, stock_quantity, category, size)
SELECT 'Miss Dior', 'Dior', 'A floral, musky fragrance with notes of grasse rose, peony, and white musks. Fresh, free-spirited and feminine.', 125.00, 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400', 40, 'WOMEN', '100ml'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Miss Dior');

INSERT INTO products (name, brand, description, price, image_url, stock_quantity, category, size)
SELECT 'CK One', 'Calvin Klein', 'A fresh, clean shared fragrance for a man and a woman. With notes of green tea, bergamot, jasmine, and white musk.', 75.00, 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400', 80, 'UNISEX', '200ml'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'CK One');

INSERT INTO products (name, brand, description, price, image_url, stock_quantity, category, size)
SELECT 'Black Opium', 'Yves Saint Laurent', 'A rock ''n'' roll twist on the oriental fragrance family. Addictive coffee, white flowers, and vanilla.', 120.00, 'https://images.unsplash.com/photo-1600612253971-1e7a0f8c79f4?w=400', 35, 'WOMEN', '90ml'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Black Opium');

INSERT INTO products (name, brand, description, price, image_url, stock_quantity, category, size)
SELECT 'Acqua di Gio', 'Giorgio Armani', 'An icon of Mediterranean freshness. Notes of sea water, jasmine, and cedar create a clean aquatic scent.', 110.00, 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400', 55, 'MEN', '100ml'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Acqua di Gio');

INSERT INTO products (name, brand, description, price, image_url, stock_quantity, category, size)
SELECT 'Molecule 01', 'Escentric Molecules', 'A single-molecule fragrance of pure Iso E Super that reacts uniquely with each person''s skin chemistry.', 95.00, 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400', 25, 'UNISEX', '100ml'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Molecule 01');
