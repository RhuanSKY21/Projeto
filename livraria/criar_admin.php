<?php
// Uso (no terminal):  php criar_admin.php "Seu Nome" seu@email.com
// A senha é pedida no terminal. Apague ou proteja este arquivo em produção.
if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}
require __DIR__ . '/includes/bootstrap.php';

$nome  = $argv[1] ?? '';
$email = strtolower($argv[2] ?? '');
if ($nome === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    fwrite(STDERR, "Uso: php criar_admin.php \"Nome\" email@exemplo.com\n");
    exit(1);
}

fwrite(STDOUT, 'Senha (mín. 6 caracteres; ficará visível): ');
$senha = trim((string) fgets(STDIN));
if (strlen($senha) < 6) {
    fwrite(STDERR, "Senha muito curta.\n");
    exit(1);
}

$st = db()->prepare(
    "INSERT INTO usuarios (nome, email, senha_hash, tipo) VALUES (?, ?, ?, 'admin')
     ON DUPLICATE KEY UPDATE nome = VALUES(nome), senha_hash = VALUES(senha_hash), tipo = 'admin'"
);
$st->execute([$nome, $email, password_hash($senha, PASSWORD_DEFAULT)]);
fwrite(STDOUT, "Administrador $email criado/atualizado.\n");
