<?php
declare(strict_types=1);

// ---------- Configuração (ajuste aqui ou use variáveis de ambiente) ----------
const DB_HOST = '127.0.0.1';
const DB_NAME = 'livraria_garantia';
const DB_USER = 'root';
const DB_PASS = '';

// ---------- Sessão ----------
if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params([
        'lifetime' => 0,
        'path'     => '/',
        'httponly' => true,
        'samesite' => 'Lax',
        'secure'   => !empty($_SERVER['HTTPS']),
    ]);
    session_start();
}

// ---------- Banco de dados (PDO) ----------
function db(): PDO
{
    static $pdo = null;
    if ($pdo === null) {
        $host = getenv('DB_HOST') ?: DB_HOST;
        $nome = getenv('DB_NAME') ?: DB_NAME;
        $user = getenv('DB_USER') ?: DB_USER;
        $pass = getenv('DB_PASS') !== false ? getenv('DB_PASS') : DB_PASS;
        $pdo = new PDO(
            "mysql:host=$host;dbname=$nome;charset=utf8mb4",
            $user,
            $pass,
            [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ]
        );
    }
    return $pdo;
}

// ---------- Helpers ----------
function e(?string $texto): string
{
    return htmlspecialchars((string) $texto, ENT_QUOTES, 'UTF-8');
}

function moeda(float|string $valor): string
{
    return 'R$ ' . number_format((float) $valor, 2, ',', '.');
}

function usuario_logado(): ?array
{
    return $_SESSION['usuario'] ?? null;
}

function eh_admin(): bool
{
    return (usuario_logado()['tipo'] ?? '') === 'admin';
}

// ---------- CSRF ----------
function csrf_token(): string
{
    if (empty($_SESSION['csrf'])) {
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf'];
}

// ---------- Helpers de API (JSON) ----------
function json_resposta(array $dados, int $status = 200): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($dados, JSON_UNESCAPED_UNICODE);
    exit;
}

/** Garante POST + token CSRF e devolve o corpo (JSON ou formulário). */
function api_entrada(): array
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
        json_resposta(['ok' => false, 'erro' => 'Método não permitido.'], 405);
    }
    $token = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    if (!hash_equals(csrf_token(), $token)) {
        json_resposta(['ok' => false, 'erro' => 'Sessão expirada. Recarregue a página.'], 403);
    }
    $tipo = $_SERVER['CONTENT_TYPE'] ?? '';
    if (stripos($tipo, 'application/json') !== false) {
        $dados = json_decode(file_get_contents('php://input'), true);
        return is_array($dados) ? $dados : [];
    }
    return $_POST;
}

function api_exigir_login(): array
{
    $u = usuario_logado();
    if (!$u) {
        json_resposta(['ok' => false, 'erro' => 'Faça login para continuar.', 'login' => true], 401);
    }
    return $u;
}
