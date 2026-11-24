USE maricamais_db;

-- =============================================================
-- Categorias
-- =============================================================
INSERT INTO categorias (nome, descricao, icone) VALUES
('Alimentação',                 'Alimentos, bebidas e gastronomia local',          'UtensilsCrossed'),
('Artesanato',                  'Peças artesanais e produtos feitos à mão',         'Palette'),
('Moda e acessórios',           'Roupas, bijuterias e acessórios',                  'Shirt'),
('Beleza e cuidados pessoais',  'Cosméticos, perfumaria e estética',                'Sparkles'),
('Casa e decoração',            'Móveis, decoração e utilidades domésticas',        'Lamp'),
('Agricultura e produtos rurais','Hortifrúti, mudas e produtos rurais',             'Sprout'),
('Serviços locais',             'Reparos, instalações e serviços',                  'Wrench'),
('Outros produtos',             'Eletrônicos, acessórios e demais produtos',        'Package');

-- =============================================================
-- Usuários
-- Senhas são hash bcrypt de 'senha123'
-- Colunas: id, nome, email, senha, tipo, telefone, aceitaMumbuca
-- =============================================================
INSERT INTO users (nome, email, senha, tipo, telefone, aceitaMumbuca) VALUES
('Admin MaricáMais',           'admin@maricamais.com',       '$2b$10$YhbMnfCp/2RQmSBlAWbGFuMXXVRpqe7x3T3TLPX4HJDKeFjMjNFHq', 'admin',      '(21) 99999-0001', FALSE),
('Responsável Doces da Vila',  'doces@maricamais.com',       '$2b$10$YhbMnfCp/2RQmSBlAWbGFuMXXVRpqe7x3T3TLPX4HJDKeFjMjNFHq', 'vendedor',   '(21) 99999-0002', TRUE),
('Responsável Tramas do Litoral','tramas@maricamais.com',    '$2b$10$YhbMnfCp/2RQmSBlAWbGFuMXXVRpqe7x3T3TLPX4HJDKeFjMjNFHq', 'vendedor',   '(21) 99999-0003', TRUE),
('Responsável Sítio Verde',    'sitio@maricamais.com',       '$2b$10$YhbMnfCp/2RQmSBlAWbGFuMXXVRpqe7x3T3TLPX4HJDKeFjMjNFHq', 'vendedor',   '(21) 99999-0004', FALSE),
('Consumidor Demo 1',          'consumidor1@maricamais.com', '$2b$10$YhbMnfCp/2RQmSBlAWbGFuMXXVRpqe7x3T3TLPX4HJDKeFjMjNFHq', 'consumidor', NULL,              FALSE),
('Consumidor Demo 2',          'consumidor2@maricamais.com', '$2b$10$YhbMnfCp/2RQmSBlAWbGFuMXXVRpqe7x3T3TLPX4HJDKeFjMjNFHq', 'consumidor', NULL,              TRUE);

-- IDs gerados:
--   1 = Admin MaricáMais
--   2 = Responsável Doces da Vila   (vendedor)
--   3 = Responsável Tramas do Litoral (vendedor)
--   4 = Responsável Sítio Verde     (vendedor)
--   5 = Consumidor Demo 1
--   6 = Consumidor Demo 2

-- Categorias geradas:
--   1 = Alimentação
--   2 = Artesanato
--   3 = Moda e acessórios
--   4 = Beleza e cuidados pessoais
--   5 = Casa e decoração
--   6 = Agricultura e produtos rurais
--   7 = Serviços locais
--   8 = Outros produtos

-- =============================================================
-- Anúncios (referenciando IDs acima)
-- =============================================================
INSERT INTO anuncios (titulo, descricao, preco, precoMumbuca, categoriaId, vendedorId, bairro, tipo, aceitaMumbuca, estoque) VALUES
(
  'Caixa de Brigadeiros Artesanais',
  'Caixa com 20 brigadeiros artesanais nos sabores chocolate, maracujá e pistache. Feitos com ingredientes naturais, sem conservantes. Encomenda com 24h de antecedência.',
  45.00, 45.00, 1, 2, 'Centro', 'venda', TRUE, 20
),
(
  'Bolsa de Palha Trançada à Mão',
  'Bolsa de palha 100% artesanal, trançada à mão por artesãs de Itaipuaçu. Modelo praia com alça de couro vegano. Disponível nas cores natural, azul e rosa.',
  120.00, 120.00, 2, 3, 'Itaipuaçu', 'venda', TRUE, 8
),
(
  'Cesta Orgânica Semanal',
  'Cesta com 8 tipos de hortaliças orgânicas cultivadas no Sítio Verde, em São José do Imbassaí. Sem agrotóxicos. Entrega às sextas-feiras no Centro e arredores.',
  65.00, NULL, 6, 4, 'São José do Imbassaí', 'venda', FALSE, 15
),
(
  'Vela Aromática de Cera de Abelha',
  'Vela artesanal de cera de abelha com essência de lavanda e bambu. Duração de até 40 horas. Pote de vidro reutilizável de 200g. Produção local — Maricá.',
  38.00, 38.00, 5, 3, 'Ponta Negra', 'venda', TRUE, 30
),
(
  'Muda de Manjericão Roxo',
  'Muda de manjericão roxo cultivada organicamente. Planta jovem com 15–20 cm, pronta para vaso ou horta. Acompanha orientações de cultivo.',
  12.00, NULL, 6, 4, 'São José do Imbassaí', 'venda', FALSE, 50
),
(
  'Kit Brownie Gourmet — 12 unidades',
  'Kit com 12 brownies gourmet nos sabores chocolate belga, nozes e oreo. Embalagem presente inclusa. Ideal para eventos e datas comemorativas. Encomenda com 48h.',
  80.00, 80.00, 1, 2, 'Centro', 'oferta', TRUE, 10
);
