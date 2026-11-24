-- Livraria Garantia — banco de dados (MySQL 5.7+ / MariaDB 10.3+)
-- Uso: mysql -u root -p < database.sql

CREATE DATABASE IF NOT EXISTS livraria_garantia
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE livraria_garantia;

CREATE TABLE IF NOT EXISTS usuarios (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome        VARCHAR(120) NOT NULL,
  email       VARCHAR(160) NOT NULL UNIQUE,
  senha_hash  VARCHAR(255) NOT NULL,
  tipo        ENUM('cliente','admin') NOT NULL DEFAULT 'cliente',
  criado_em   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS livros (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  titulo     VARCHAR(160) NOT NULL,
  descricao  TEXT NULL,
  preco      DECIMAL(10,2) NOT NULL,
  imagem     VARCHAR(200) NULL,          -- ex.: img/hobbit.jpg
  estoque    INT UNSIGNED NOT NULL DEFAULT 0,
  ativo      TINYINT(1) NOT NULL DEFAULT 1,
  criado_em  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS pedidos (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  usuario_id  INT UNSIGNED NOT NULL,
  total       DECIMAL(10,2) NOT NULL,
  criado_em   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX (criado_em),
  CONSTRAINT fk_pedido_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS itens_pedido (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  pedido_id     INT UNSIGNED NOT NULL,
  livro_id      INT UNSIGNED NOT NULL,
  quantidade    INT UNSIGNED NOT NULL,
  preco_unit    DECIMAL(10,2) NOT NULL,  -- preço no momento da compra
  CONSTRAINT fk_item_pedido FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
  CONSTRAINT fk_item_livro  FOREIGN KEY (livro_id)  REFERENCES livros(id)
) ENGINE=InnoDB;

-- Livros que estão chegando (alimenta o card "Reposição" do dashboard)
CREATE TABLE IF NOT EXISTS reposicoes (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  livro_id    INT UNSIGNED NOT NULL,
  quantidade  INT UNSIGNED NOT NULL,
  recebido    TINYINT(1) NOT NULL DEFAULT 0,
  criado_em   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_repo_livro FOREIGN KEY (livro_id) REFERENCES livros(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS contatos (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome       VARCHAR(120) NOT NULL,
  email      VARCHAR(160) NOT NULL,
  assunto    ENUM('duvida','sugestao','outros') NOT NULL DEFAULT 'duvida',
  mensagem   TEXT NOT NULL,
  criado_em  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------- Dados iniciais ----------
-- Preços e descrições dos 6 últimos livros são PLACEHOLDERS: ajuste como quiser.
INSERT INTO livros (titulo, descricao, preco, imagem, estoque) VALUES
('O Hobbit',
 'Edição com mapas, capa dura, fitilho, as ilustrações originais de J.R.R. Tolkien e um pôster de Valfenda exclusivo!',
 42.89, 'img/hobbit.jpg', 50),
('Crepúsculo',
 'Crepúsculo poderia ser uma história comum, não fosse um elemento irresistível: o objeto da paixão da protagonista é um vampiro. Assim, soma-se à paixão um perigo sobrenatural temperado com muito suspense, e o resultado é uma leitura de tirar o fôlego. Um romance repleto das angústias e incertezas da juventude: o arrebatamento, a atração, a ansiedade que antecede cada palavra, cada gesto, e todos os medos.',
 53.10, 'img/crepusculo.jpg', 40),
('Duna', 'Uma estonteante mistura de aventura e misticismo, ecologia e política, este romance ganhador dos prêmios Hugo e Nebula deu início a uma das mais épicas histórias de toda a ficção científica. Duna é um triunfo da imaginação, que influenciará a literatura para sempre.Esta edição inédita, com introdução de Neil Gaiman, apresenta ao leitor o universo fantástico criado por Herbert e que será adaptado ao cinema por Denis Villeneuve, diretor de A chegada e de Blade Runner 2049.', 39.90, 'img/duna.jpg', 30),
('Laranja Mecânica', 'Uma das mais brilhantes sátiras distópicas já escritas, Laranja Mecânica ganhou fama ao ser adaptado em uma obra magistral do cinema pelas mãos de Stanley Kubrick. O livro, entretanto, também é um clássico moderno da ficção inglesa e um marco na cultura pop, que ao lado de 1984, de George Orwell, Admirável Mundo Novo, de Aldous Huxley, e Fahrenheit 451, de Ray Bradbury, representa um dos ícones literários da alienação pós-industrial', 44.90, 'img/laranja.jpg', 15),
('A Arte da Guerra', 'Escrita há mais de 2.500 anos, A Arte da Guerra é uma obra-prima da estratégia militar cujos ensinamentos influenciaram guerreiros da Antiguidade e seguem fundamentais para líderes e estrategistas dos dias atuais. Um best-seller atemporal, amplamente apreciado por quem busca sabedoria em áreas como política, negócios e até nas decisões do dia a dia. Esta edição especial oferece acesso exclusivo ao audiobook, proporcionando uma experiência de leitura ainda mais prática e envolvente. Uma obra essencial em qualquer biblioteca.', 29.90, 'img/arte.jpg', 10),
('1984', 'Winston, herói de 1984 , último romance de George Orwell, vive aprisionado na engrenagem totalitária de uma sociedade completamente dominada pelo Estado, onde tudo é feito coletivamente, mas cada qual vive sozinho. Ninguém escapa à vigilância do Grande Irmão, a mais famosa personificação literária de um poder cínico e cruel ao infinito, além de vazio de sentido histórico. De fato, a ideologia do Partido dominante em Oceânia não visa nada de coisa alguma para ninguém, no presente ou no futuro. O Brien, hierarca do Partido, é quem explica a Winston que só nos interessa o poder em si. Nem riqueza, nem luxo, nem vida longa, nem felicidade: só o poder pelo poder, poder puro.', 34.90, 'img/1984.jpg', 10),
('Watchmen', 'Watchmen é considerado por muitos a maior realização na história da narrativa sequencial. Esta edição de luxo em capa dura e formato ampliado apresenta a arte original remasterizada digitalmente e com novas cores, feitas com a supervisão de John Higgins e Dave Gibbons. Ela também inclui páginas de material complementar e amostras do roteiro de Alan Moore, com a proposta original da série, além de inúmeros esboços iniciais de personagens, rascunhos de capas e materiais promocionais de Dave Gibbons.', 89.90, 'img/watchmen.jpg', 5),
('Dom Casmurro', 'Em Dom Casmurro, o narrador Bento Santiago retoma a infância que passou na Rua de Matacavalos e conta a história do amor e das desventuras que viveu com Capitu, uma das personagens mais enigmáticas e intrigantes da literatura brasileira. Nas páginas deste romance, encontra-se a versão de um homem perturbado pelo ciúme, que revela aos poucos sua psicologia complexa e enreda o leitor em sua narrativa ambígua acerca do acontecimento ou não do adultério da mulher com olhos de ressaca, uma das maiores polêmicas da literatura brasileira.', 24.90, 'img/dom.jpg', 8);

-- Reposição igual ao que o dashboard mostrava (30, 20, 10 e 7)
INSERT INTO reposicoes (livro_id, quantidade)
SELECT id, 30 FROM livros WHERE titulo = 'A Arte da Guerra'
UNION ALL SELECT id, 20 FROM livros WHERE titulo = '1984'
UNION ALL SELECT id, 10 FROM livros WHERE titulo = 'Watchmen'
UNION ALL SELECT id,  7 FROM livros WHERE titulo = 'Dom Casmurro';

-- O administrador é criado com:  php criar_admin.php
