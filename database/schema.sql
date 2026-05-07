-- ======================================================
-- MAZEBOSHOP - Banco de Dados
-- Descrição: Estrutura completa do e-commerce
-- ======================================================

-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS mazeboshop;
USE mazeboshop;

-- ======================================================
-- 1. TABELA DE UTILIZADORES
-- ======================================================
CREATE TABLE utilizadores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    tipo ENUM('cliente', 'admin') DEFAULT 'cliente',
    telefone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_tipo (tipo)
);

-- ======================================================
-- 2. TABELA DE PRODUTOS
-- ======================================================
CREATE TABLE produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL,
    preco_original DECIMAL(10,2),
    estoque INT DEFAULT 0,
    imagem VARCHAR(500),
    categoria VARCHAR(50),
    em_promocao BOOLEAN DEFAULT FALSE,
    rating DECIMAL(2,1) DEFAULT 0,
    avaliacoes INT DEFAULT 0,
    destaque BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_categoria (categoria),
    INDEX idx_preco (preco),
    INDEX idx_em_promocao (em_promocao),
    INDEX idx_destaque (destaque)
);

-- ======================================================
-- 3. TABELA DE PEDIDOS
-- ======================================================
CREATE TABLE pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    utilizador_id INT NOT NULL,
    codigo VARCHAR(20) UNIQUE,
    data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pendente', 'pago', 'processando', 'enviado', 'entregue', 'cancelado') DEFAULT 'pendente',
    total DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2),
    desconto DECIMAL(10,2) DEFAULT 0,
    forma_pagamento VARCHAR(50),
    endereco TEXT,
    cidade VARCHAR(100),
    cep VARCHAR(20),
    telefone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (utilizador_id) REFERENCES utilizadores(id) ON DELETE CASCADE,
    INDEX idx_utilizador (utilizador_id),
    INDEX idx_status (status),
    INDEX idx_data (data),
    INDEX idx_codigo (codigo)
);

-- ======================================================
-- 4. TABELA DE ITENS DO PEDIDO
-- ======================================================
CREATE TABLE itens_pedido (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    produto_id INT NOT NULL,
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) GENERATED ALWAYS AS (quantidade * preco_unitario) STORED,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE,
    INDEX idx_pedido (pedido_id),
    INDEX idx_produto (produto_id)
);

-- ======================================================
-- 5. TABELA DE CARRINHO (SESSÃO)
-- ======================================================
CREATE TABLE carrinho (
    id INT AUTO_INCREMENT PRIMARY KEY,
    utilizador_id INT NOT NULL,
    produto_id INT NOT NULL,
    quantidade INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (utilizador_id) REFERENCES utilizadores(id) ON DELETE CASCADE,
    FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE,
    INDEX idx_utilizador (utilizador_id)
);

-- ======================================================
-- 6. TABELA DE RECUPERAÇÃO DE SENHA
-- ======================================================
CREATE TABLE recuperacao_senha (
    id INT AUTO_INCREMENT PRIMARY KEY,
    utilizador_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    expira_em TIMESTAMP NOT NULL,
    usado BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (utilizador_id) REFERENCES utilizadores(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_usado (usado)
);

-- ======================================================
-- 7. TABELA DE LOGS (OPCIONAL - PARA AUDITORIA)
-- ======================================================
CREATE TABLE logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    utilizador_id INT NULL,
    acao VARCHAR(100) NOT NULL,
    descricao TEXT,
    ip VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_utilizador (utilizador_id),
    INDEX idx_acao (acao),
    INDEX idx_created_at (created_at)
);