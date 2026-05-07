-- ======================================================
-- MAZEBOSHOP - Dados Iniciais
-- ======================================================

USE mazeboshop;

-- ======================================================
-- 1. INSERIR ADMINISTRADOR
-- ======================================================
INSERT INTO utilizadores (nome, email, senha, tipo) VALUES 
('Administrador', 'admin@mazeboshop.ao', 'admin123', 'admin');

-- ======================================================
-- 2. INSERIR PRODUTOS DE EXEMPLO
-- ======================================================
INSERT INTO produtos (nome, descricao, preco, preco_original, estoque, imagem, categoria, em_promocao, rating, avaliacoes, destaque) VALUES
('iPhone 15 Pro', 'Smartphone Apple com câmera de 48MP, chip A17 Pro e tela Super Retina XDR', 1250000, 1450000, 10, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400', 'smartphones', TRUE, 4.8, 234, TRUE),

('Samsung Galaxy S24 Ultra', 'Smartphone Samsung com tela Dynamic AMOLED 2X, 200MP camera e S Pen integrada', 1450000, 1550000, 8, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400', 'smartphones', FALSE, 4.7, 189, TRUE),

('MacBook Pro M3', 'Notebook Apple com chip M3, 14 polegadas, 512GB SSD, 16GB RAM', 2450000, NULL, 5, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', 'notebooks', FALSE, 4.9, 456, TRUE),

('Dell XPS 15', 'Notebook Dell com tela InfinityEdge, Intel Core i9, 32GB RAM, 1TB SSD', 1850000, 2100000, 7, 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400', 'notebooks', TRUE, 4.6, 167, FALSE),

('AirPods Pro 2', 'Fone Bluetooth Apple com cancelamento de ruído ativo e áudio espacial', 185000, NULL, 20, 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400', 'audio', FALSE, 4.8, 892, TRUE),

('Sony WH-1000XM5', 'Headphone Sony com cancelamento de ruído líder do mercado, 30h de bateria', 295000, 350000, 12, 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400', 'audio', TRUE, 4.9, 543, FALSE),

('Apple Watch Ultra 2', 'Smartwatch Apple com GPS + Cellular, 49mm, tela Retina sempre ativa', 650000, NULL, 6, 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400', 'wearables', FALSE, 4.7, 234, TRUE),

('Galaxy Watch 6 Classic', 'Smartwatch Samsung com mostrador giratório, monitoramento de saúde avançado', 320000, 380000, 15, 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400', 'wearables', TRUE, 4.5, 178, FALSE),

('iPad Pro M2', 'Tablet Apple com chip M2, tela Liquid Retina XDR, 11 polegadas', 890000, NULL, 8, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400', 'tablets', FALSE, 4.8, 345, TRUE),

('Google Pixel 8 Pro', 'Smartphone Google com câmera de 50MP e IA integrada', 1100000, 1250000, 4, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400', 'smartphones', TRUE, 4.6, 98, FALSE);

-- ======================================================
-- 3. INSERIR CLIENTE DE TESTE
-- ======================================================
INSERT INTO utilizadores (nome, email, senha, tipo, telefone) VALUES 
('Cliente Teste', 'cliente@teste.com', '123456', 'cliente', '923456789');

-- ======================================================
-- 4. INSERIR ALGUNS PEDIDOS DE TESTE
-- ======================================================
INSERT INTO pedidos (utilizador_id, codigo, status, total, subtotal, forma_pagamento, endereco, cidade, cep, telefone) VALUES
(2, 'PED-20240001', 'entregue', 1250000, 1250000, 'pix', 'Rua das Flores, 123', 'Luanda', '0000-000', '923456789'),
(2, 'PED-20240002', 'enviado', 480000, 480000, 'cartao', 'Av. 4 de Fevereiro, 456', 'Luanda', '0000-000', '923456789');

-- ======================================================
-- 5. INSERIR ITENS DOS PEDIDOS
-- ======================================================
INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario) VALUES
(1, 1, 1, 1250000),
(2, 5, 2, 185000),
(2, 7, 1, 110000);