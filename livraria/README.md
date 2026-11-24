# Livraria Garantia — PHP + MySQL

## Requisitos
PHP 8.1+ (extensão `pdo_mysql`) e MySQL 5.7+ / MariaDB 10.3+.

## Instalação
1. Crie o banco e as tabelas:
   ```bash
   mysql -u root -p < database.sql
   ```
2. Ajuste usuário/senha do banco em `includes/bootstrap.php` (constantes `DB_*`)
   ou use as variáveis de ambiente `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASS`.
3. Crie o administrador (para acessar o Dashboard):
   ```bash
   php criar_admin.php "Seu Nome" voce@email.com
   ```
4. Coloque as capas em `img/hobbit.jpg` e `img/crepusculo.jpg`.
5. Rode o servidor de desenvolvimento dentro desta pasta:
   ```bash
   php -S localhost:8000
   ```
   e abra http://localhost:8000

## Estrutura
| Arquivo | Função |
|---|---|
| `database.sql` | Tabelas: usuarios, livros, pedidos, itens_pedido, reposicoes, contatos |
| `includes/bootstrap.php` | Conexão PDO, sessão, CSRF e helpers |
| `includes/header.php` / `footer.php` | Layout e menu compartilhados (menu muda se logado) |
| `produto.php` | Catálogo lido do banco |
| `dashboard.php` | Indicadores calculados do banco (só admin) |
| `api/cadastro.php`, `api/login.php`, `api/logout.php` | Contas e sessão |
| `api/contato.php` | Grava mensagens do formulário de contato |
| `api/pedido.php` | Finaliza compra: confere estoque, grava pedido e baixa o estoque |

## Segurança já incluída
- Senhas com `password_hash` / `password_verify`
- Consultas com prepared statements (PDO)
- Token CSRF em todas as chamadas POST da API
- Preço do pedido sempre lido do banco, nunca do navegador
- Saída HTML escapada com `e()`

Em produção, use HTTPS, limite tentativas de login e remova `criar_admin.php`.
