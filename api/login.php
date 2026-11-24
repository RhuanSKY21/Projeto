<?php
require_once __DIR__ . '/../includes/bootstrap.php';
$in = api_entrada();

$email = strtolower(trim((string) ($in['email'] ?? '')));
$senha = (string) ($in['senha'] ?? '');

$st = db()->prepare('SELECT id, nome, email, senha_hash, tipo FROM usuarios WHERE email = ?');
$st->execute([$email]);
$u = $st->fetch();

// Mesma mensagem para e-mail inexistente e senha errada (não revela quais e-mails existem)
if (!$u || !password_verify($senha, $u['senha_hash'])) {
    json_resposta(['ok' => false, 'erro' => 'E-mail ou senha incorretos.'], 401);
}

session_regenerate_id(true);
$_SESSION['usuario'] = [
    'id'    => (int) $u['id'],
    'nome'  => $u['nome'],
    'email' => $u['email'],
    'tipo'  => $u['tipo'],
];

json_resposta(['ok' => true, 'nome' => $u['nome'], 'admin' => $u['tipo'] === 'admin']);
