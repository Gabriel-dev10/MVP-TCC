-- MaricáMais — Schema MySQL 8
-- Plataforma digital de marketplace para o comércio local de Maricá/RJ

CREATE DATABASE IF NOT EXISTS maricamais_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE maricamais_db;

-- Tabela: users (consumidores, vendedores e admins)
CREATE TABLE IF NOT EXISTS users (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome        VARCHAR(150) NOT NULL,
  email       VARCHAR(150) NOT NULL UNIQUE,
  senha       VARCHAR(255) NOT NULL COMMENT 'Hash bcrypt',
  tipo        ENUM('consumidor','vendedor','admin') NOT NULL DEFAULT 'consumidor',
  telefone    VARCHAR(20),
  endereco    TEXT,
  latitude    DECIMAL(10,8),
  longitude   DECIMAL(11,8),
  aceitaMumbuca BOOLEAN NOT NULL DEFAULT FALSE,
  foto        VARCHAR(500),
  ativo       BOOLEAN NOT NULL DEFAULT TRUE,
  createdAt   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_tipo (tipo),
  INDEX idx_ativo (ativo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela: categorias
CREATE TABLE IF NOT EXISTS categorias (
  id        INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome      VARCHAR(100) NOT NULL UNIQUE,
  descricao TEXT,
  icone     VARCHAR(50),
  INDEX idx_nome (nome)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela: anuncios
CREATE TABLE IF NOT EXISTS anuncios (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  titulo        VARCHAR(200) NOT NULL,
  descricao     TEXT NOT NULL,
  preco         DECIMAL(10,2) NOT NULL,
  precoMumbuca  DECIMAL(10,2),
  categoriaId   INT UNSIGNED NOT NULL,
  vendedorId    INT UNSIGNED NOT NULL,
  fotos         JSON DEFAULT (JSON_ARRAY()),
  latitude      DECIMAL(10,8),
  longitude     DECIMAL(11,8),
  bairro        VARCHAR(100),
  tipo          ENUM('venda','oferta','leilao') NOT NULL DEFAULT 'venda',
  aceitaMumbuca BOOLEAN NOT NULL DEFAULT FALSE,
  status        ENUM('ativo','pausado','encerrado') NOT NULL DEFAULT 'ativo',
  estoque       INT UNSIGNED NOT NULL DEFAULT 1,
  createdAt     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (categoriaId) REFERENCES categorias(id) ON DELETE RESTRICT,
  FOREIGN KEY (vendedorId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_status (status),
  INDEX idx_categoria (categoriaId),
  INDEX idx_vendedor (vendedorId),
  INDEX idx_tipo (tipo),
  INDEX idx_aceitaMumbuca (aceitaMumbuca),
  FULLTEXT idx_busca (titulo, descricao)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela: pedidos
CREATE TABLE IF NOT EXISTS pedidos (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  compradorId     INT UNSIGNED NOT NULL,
  anuncioId       INT UNSIGNED NOT NULL,
  quantidade      INT UNSIGNED NOT NULL DEFAULT 1,
  valorTotal      DECIMAL(10,2) NOT NULL,
  formaPagamento  ENUM('dinheiro','mumbuca','pix') NOT NULL DEFAULT 'dinheiro',
  status          ENUM('pendente','confirmado','enviado','entregue','cancelado') NOT NULL DEFAULT 'pendente',
  enderecoEntrega TEXT,
  createdAt       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (compradorId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (anuncioId) REFERENCES anuncios(id) ON DELETE CASCADE,
  INDEX idx_comprador (compradorId),
  INDEX idx_anuncio (anuncioId),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela: avaliacoes
CREATE TABLE IF NOT EXISTS avaliacoes (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  avaliadorId INT UNSIGNED NOT NULL,
  avaliadoId  INT UNSIGNED NOT NULL,
  anuncioId   INT UNSIGNED,
  pedidoId    INT UNSIGNED,
  nota        TINYINT UNSIGNED NOT NULL CHECK (nota BETWEEN 1 AND 5),
  comentario  TEXT,
  createdAt   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (avaliadorId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (avaliadoId)  REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (anuncioId)   REFERENCES anuncios(id) ON DELETE SET NULL,
  FOREIGN KEY (pedidoId)    REFERENCES pedidos(id) ON DELETE SET NULL,
  INDEX idx_avaliado (avaliadoId),
  INDEX idx_anuncio (anuncioId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela: denuncias
CREATE TABLE IF NOT EXISTS denuncias (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  denuncianteId INT UNSIGNED NOT NULL,
  anuncioId     INT UNSIGNED NOT NULL,
  motivo        VARCHAR(100) NOT NULL,
  descricao     TEXT,
  status        ENUM('pendente','analisada','resolvida') NOT NULL DEFAULT 'pendente',
  createdAt     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (denuncianteId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (anuncioId)     REFERENCES anuncios(id) ON DELETE CASCADE,
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela: ofertas (negociação de preço)
CREATE TABLE IF NOT EXISTS ofertas (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  compradorId   INT UNSIGNED NOT NULL,
  anuncioId     INT UNSIGNED NOT NULL,
  valorOfertado DECIMAL(10,2) NOT NULL,
  contraoferta  DECIMAL(10,2),
  status        ENUM('pendente','aceita','recusada','contraoferta') NOT NULL DEFAULT 'pendente',
  createdAt     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (compradorId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (anuncioId)   REFERENCES anuncios(id) ON DELETE CASCADE,
  INDEX idx_anuncio (anuncioId),
  INDEX idx_comprador (compradorId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela: leiloes
CREATE TABLE IF NOT EXISTS leiloes (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  anuncioId   INT UNSIGNED NOT NULL UNIQUE,
  lanceMinimo DECIMAL(10,2) NOT NULL,
  lanceAtual  DECIMAL(10,2) NOT NULL DEFAULT 0,
  vencedorId  INT UNSIGNED,
  dataInicio  DATETIME NOT NULL,
  dataFim     DATETIME NOT NULL,
  status      ENUM('ativo','encerrado') NOT NULL DEFAULT 'ativo',
  createdAt   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (anuncioId)  REFERENCES anuncios(id) ON DELETE CASCADE,
  FOREIGN KEY (vencedorId) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_status (status),
  INDEX idx_dataFim (dataFim)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela: lances
CREATE TABLE IF NOT EXISTS lances (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  leilaoId    INT UNSIGNED NOT NULL,
  licitanteId INT UNSIGNED NOT NULL,
  valor       DECIMAL(10,2) NOT NULL,
  createdAt   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (leilaoId)    REFERENCES leiloes(id) ON DELETE CASCADE,
  FOREIGN KEY (licitanteId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_leilao (leilaoId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
