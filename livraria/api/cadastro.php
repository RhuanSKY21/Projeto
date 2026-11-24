<?php
require_once __DIR__ . '/../includes/bootstrap.php';
$in = api_entrada();

$nome  = trim((string) ($in['nome'] ?? ''));
$email = strtolower(trim((string) ($in['email'] ?? '')));
$senha = (string) ($in['senha'] ?? '');
$conf  = (string) ($in['confirmar_senha'] ?? '');

if (mb_strlen($nome) < 2 || mb_strlen($nome) > 120) {
    json_resposta(['ok' => false, 'erro' => 'Informe seu nome completo.'], 422);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 160) {
    json_resposta(['ok' => false, 'erro' => 'E-mail inválido.'], 422);
}
if (strlen($senha) < 6) {
    json_resposta(['ok' => false, 'erro' => 'A senha deve ter pelo menos 6 caracteres.'], 422);
}
if ($senha !== $conf) {
    json_resposta(['ok' => false, 'erro' => 'As senhas não coincidem.'], 422);
}

$pdo = db();
$existe = $pdo->prepare('SELECT 1 FROM usuarios WHERE email = ?');
$existe->execute([$email]);
if ($existe->fetch()) {
    json_resposta(['ok' => false, 'erro' => 'Este e-mail já está cadastrado.'], 409);
}

$pdo->prepare('INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)')
    ->execute([$nome, $email, password_hash($senha, PASSWORD_DEFAULT)]);

json_resposta(['ok' => true, 'nome' => $nome], 201);
