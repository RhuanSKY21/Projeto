<?php
require_once __DIR__ . '/../includes/bootstrap.php';
$in = api_entrada();

$nome     = trim((string) ($in['nome'] ?? ''));
$email    = trim((string) ($in['email'] ?? ''));
$assunto  = (string) ($in['assunto'] ?? 'duvida');
$mensagem = trim((string) ($in['mensagem'] ?? ''));

if (mb_strlen($nome) < 2 || mb_strlen($nome) > 120) {
    json_resposta(['ok' => false, 'erro' => 'Informe seu nome.'], 422);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 160) {
    json_resposta(['ok' => false, 'erro' => 'E-mail inválido.'], 422);
}
if (!in_array($assunto, ['duvida', 'sugestao', 'outros'], true)) {
    $assunto = 'outros';
}
if (mb_strlen($mensagem) < 3 || mb_strlen($mensagem) > 3000) {
    json_resposta(['ok' => false, 'erro' => 'Escreva uma mensagem (até 3000 caracteres).'], 422);
}

db()->prepare('INSERT INTO contatos (nome, email, assunto, mensagem) VALUES (?, ?, ?, ?)')
    ->execute([$nome, $email, $assunto, $mensagem]);

json_resposta(['ok' => true], 201);
