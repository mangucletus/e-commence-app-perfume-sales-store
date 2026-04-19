-- Existing 8 products
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

-- Extended collection – MEN
INSERT INTO products (name, brand, description, price, image_url, stock_quantity, category, size)
SELECT '1 Million', 'Paco Rabanne', 'The scent of absolute seduction. Gold, spicy cinnamon, blood mandarin, and white woods ignite a bold masculine statement.', 105.00, 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=400', 65, 'MEN', '100ml'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = '1 Million');

INSERT INTO products (name, brand, description, price, image_url, stock_quantity, category, size)
SELECT 'Invictus', 'Paco Rabanne', 'A victorious, fresh aquatic fragrance with notes of grapefruit, marine accord, and guaiac wood. Power and victory in a bottle.', 98.00, 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400', 70, 'MEN', '100ml'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Invictus');

INSERT INTO products (name, brand, description, price, image_url, stock_quantity, category, size)
SELECT 'The One for Men', 'Dolce & Gabbana', 'A timeless, contemporary oriental aromatic with notes of grapefruit, coriander, ginger, amber, and tobacco.', 115.00, 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400', 45, 'MEN', '100ml'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'The One for Men');

INSERT INTO products (name, brand, description, price, image_url, stock_quantity, category, size)
SELECT 'Boss Bottled', 'Hugo Boss', 'A sophisticated blend of apple, plum, cinnamon, and sandalwood. The signature scent of the confident modern man.', 89.00, 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=400', 50, 'MEN', '100ml'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Boss Bottled');

INSERT INTO products (name, brand, description, price, image_url, stock_quantity, category, size)
SELECT 'Oud Wood', 'Tom Ford', 'Exotic oud wood blended with Chinese pepper, cardamom, sandalwood, vetiver, and amber. Intensely woody and sensual.', 265.00, 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400', 20, 'MEN', '50ml'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Oud Wood');

INSERT INTO products (name, brand, description, price, image_url, stock_quantity, category, size)
SELECT 'Gentleman Givenchy', 'Givenchy', 'A powerful yet refined iris-wood fragrance. Iris, patchouli, leather, and vetiver define the modern gentleman.', 118.00, 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400', 38, 'MEN', '100ml'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Gentleman Givenchy');

INSERT INTO products (name, brand, description, price, image_url, stock_quantity, category, size)
SELECT 'Spicebomb', 'Viktor & Rolf', 'An explosive blend of cayenne pepper, saffron, tobacco, leather, and vetiver. Dangerously addictive masculine power.', 99.00, 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=400', 42, 'MEN', '90ml'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Spicebomb');

INSERT INTO products (name, brand, description, price, image_url, stock_quantity, category, size)
SELECT 'Green Irish Tweed', 'Creed', 'The grandfather of aquatic fragrances. Fresh violet leaves, lemon verbena, and sandalwood in a timeless classic.', 340.00, 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400', 15, 'MEN', '100ml'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Green Irish Tweed');

INSERT INTO products (name, brand, description, price, image_url, stock_quantity, category, size)
SELECT 'Fahrenheit', 'Dior', 'An iconic scent with petroleum-like petrol notes combined with violet, woody notes, and leather for a bold masculinity.', 112.00, 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400', 33, 'MEN', '100ml'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Fahrenheit');

INSERT INTO products (name, brand, description, price, image_url, stock_quantity, category, size)
SELECT 'Polo Ralph Lauren', 'Ralph Lauren', 'A classic American fragrance evoking the spirit of the great outdoors. Pine needles, basil, and leather in perfect harmony.', 82.00, 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=400', 60, 'MEN', '120ml'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Polo Ralph Lauren');

INSERT INTO products (name, brand, description, price, image_url, stock_quantity, category, size)
SELECT 'Pour Homme Valentino', 'Valentino', 'A sophisticated composition of bergamot, iris, cedar and musk. Elegant Italian masculinity distilled into a single fragrance.', 135.00, 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400', 28, 'MEN', '100ml'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Pour Homme Valentino');

-- Extended collection – WOMEN
INSERT INTO products (name, brand, description, price, image_url, stock_quantity, category, size)
SELECT 'La Vie Est Belle', 'Lancôme', 'The fragrance of a new kind of happiness. A gorgeous iris gourmand with iris absolute, patchouli, and praline.', 128.00, 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400', 55, 'WOMEN', '100ml'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'La Vie Est Belle');

INSERT INTO products (name, brand, description, price, image_url, stock_quantity, category, size)
SELECT 'Flowerbomb', 'Viktor & Rolf', 'A floral explosion in a grenade-shaped bottle. Sambac jasmine, cattleya orchid, freesia, rose, and patchouli.', 148.00, 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400', 40, 'WOMEN', '100ml'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Flowerbomb');

INSERT INTO products (name, brand, description, price, image_url, stock_quantity, category, size)
SELECT 'J''adore', 'Dior', 'Pure femininity. A floral opulent blend of ylang-ylang, Damascus rose, jasmine, and lily of the valley.', 142.00, 'https://images.unsplash.com/photo-1600612253971-1e7a0f8c79f4?w=400', 48, 'WOMEN', '100ml'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'J''adore');

INSERT INTO products (name, brand, description, price, image_url, stock_quantity, category, size)
SELECT 'Si', 'Giorgio Armani', 'Inspired by the modern, free-spirited woman. A chypre floral with blackcurrant nectar, rose, freesia, and woody musks.', 132.00, 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400', 42, 'WOMEN', '100ml'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Si');

INSERT INTO products (name, brand, description, price, image_url, stock_quantity, category, size)
SELECT 'Daisy', 'Marc Jacobs', 'Fresh, feminine, and irresistibly charming. Wild strawberry, violet leaves, jasmine, gardenia, and vanilla wood.', 95.00, 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400', 58, 'WOMEN', '100ml'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Daisy');

INSERT INTO products (name, brand, description, price, image_url, stock_quantity, category, size)
SELECT 'Chance Eau Tendre', 'Chanel', 'A fresh, delicate floral fragrance. Grapefruit, quince, jasmine, iris, and white musks create a softly feminine allure.', 135.00, 'https://images.unsplash.com/photo-1600612253971-1e7a0f8c79f4?w=400', 35, 'WOMEN', '100ml'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Chance Eau Tendre');

INSERT INTO products (name, brand, description, price, image_url, stock_quantity, category, size)
SELECT 'Alien', 'Thierry Mugler', 'A solar woody floral of otherworldly beauty. Kashmeran wood, white jasmine absolute, and solar woodiness in a cosmic amber.', 115.00, 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400', 30, 'WOMEN', '90ml'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Alien');

INSERT INTO products (name, brand, description, price, image_url, stock_quantity, category, size)
SELECT 'Gucci Bloom', 'Gucci', 'A rich floral fragrance inspired by a lush white garden. Tuberose, jasmine, and rangoon creeper in full bloom.', 122.00, 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400', 44, 'WOMEN', '100ml'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Gucci Bloom');

INSERT INTO products (name, brand, description, price, image_url, stock_quantity, category, size)
SELECT 'Crystal Noir', 'Versace', 'A sensual oriental floral. Ginger, pepper, coconut flower, peony, gardenia, sandalwood, and amber in seductive harmony.', 108.00, 'https://images.unsplash.com/photo-1600612253971-1e7a0f8c79f4?w=400', 36, 'WOMEN', '90ml'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Crystal Noir');

INSERT INTO products (name, brand, description, price, image_url, stock_quantity, category, size)
SELECT 'Burberry Her', 'Burberry', 'A fruity floral capturing the energy of London. Elderflower, jasmine, violet, blueberry, and musk evoke the city''s spirit.', 92.00, 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400', 52, 'WOMEN', '100ml'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Burberry Her');

INSERT INTO products (name, brand, description, price, image_url, stock_quantity, category, size)
SELECT 'Mon Guerlain', 'Guerlain', 'A romantic lavender fragrance for women. French lavender, vanilla tahitensis, sandalwood, and white musk with Angelica roots.', 118.00, 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400', 38, 'WOMEN', '100ml'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Mon Guerlain');

INSERT INTO products (name, brand, description, price, image_url, stock_quantity, category, size)
SELECT 'Olympea', 'Paco Rabanne', 'The goddess of a new generation. Water jasmine, salty vanilla, and cashmere wood in a luminous, sensual composition.', 102.00, 'https://images.unsplash.com/photo-1600612253971-1e7a0f8c79f4?w=400', 46, 'WOMEN', '100ml'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Olympea');

-- Extended collection – UNISEX
INSERT INTO products (name, brand, description, price, image_url, stock_quantity, category, size)
SELECT 'Aventus', 'Creed', 'Celebrating strength, vision, and success. Blackcurrant, birch, patchouli, oakmoss, and ambergris in a legendary composition.', 395.00, 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400', 18, 'UNISEX', '100ml'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Aventus');

INSERT INTO products (name, brand, description, price, image_url, stock_quantity, category, size)
SELECT 'Santal 33', 'Le Labo', 'A cult West Coast formula conjuring prairies and open skies. Cardamom, iris, violet, leather, sandalwood, and cedar.', 220.00, 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400', 22, 'UNISEX', '50ml'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Santal 33');

INSERT INTO products (name, brand, description, price, image_url, stock_quantity, category, size)
SELECT 'Replica Jazz Club', 'Maison Margiela', 'The smoky, warm feeling of a jazz bar at night. Rum, tonka bean, musk, clary sage, and pink pepper.', 175.00, 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400', 28, 'UNISEX', '100ml'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Replica Jazz Club');

INSERT INTO products (name, brand, description, price, image_url, stock_quantity, category, size)
SELECT 'Bibliothèque', 'Byredo', 'The scent of an ancient library. Peach skin, plum, violet, leather, vanilla, and woody notes transport you to another era.', 245.00, 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400', 16, 'UNISEX', '100ml'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Bibliothèque');

INSERT INTO products (name, brand, description, price, image_url, stock_quantity, category, size)
SELECT 'Colonia', 'Acqua di Parma', 'The Italian original since 1916. Citrus, lavender, rosemary, Bulgarian rose, and vetiver in a timeless classic.', 185.00, 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400', 30, 'UNISEX', '100ml'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Colonia');

INSERT INTO products (name, brand, description, price, image_url, stock_quantity, category, size)
SELECT 'Silver Mountain Water', 'Creed', 'Inspired by fresh mountain streams meeting the glaciers of the Alps. Green tea, bergamot, sandalwood, and musk.', 320.00, 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400', 20, 'UNISEX', '100ml'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Silver Mountain Water');

INSERT INTO products (name, brand, description, price, image_url, stock_quantity, category, size)
SELECT 'Bergamote 22', 'Le Labo', 'A sparkling, zesty explosion of bergamot, neroli, grapefruit, white musk, and ambrette seed. A modern classic.', 198.00, 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400', 24, 'UNISEX', '50ml'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Bergamote 22');

INSERT INTO products (name, brand, description, price, image_url, stock_quantity, category, size)
SELECT 'Neroli 36', 'Le Labo', 'Pure solar beauty. Neroli, petitgrain, musk, and ambergris conjure a Mediterranean garden on a warm summer morning.', 205.00, 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400', 19, 'UNISEX', '50ml'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Neroli 36');

INSERT INTO products (name, brand, description, price, image_url, stock_quantity, category, size)
SELECT 'Bal d''Afrique', 'Byredo', 'A vibrant African-inspired composition. Bergamot, African marigold, violet, cyclamen, musk, vetiver, and cedarwood.', 235.00, 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400', 17, 'UNISEX', '100ml'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Bal d''Afrique');

INSERT INTO products (name, brand, description, price, image_url, stock_quantity, category, size)
SELECT 'Superstitious', 'Byredo', 'A mysterious, contemplative blend of pink pepper, lily, musks, and frankincense. Wear it as your invisible shield.', 248.00, 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400', 14, 'UNISEX', '100ml'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Superstitious');
