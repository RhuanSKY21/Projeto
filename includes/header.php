<?php
/** Variáveis esperadas: $pagina (chave do menu) e $titulo (título da aba). */
require_once __DIR__ . '/bootstrap.php';

$usuario = usuario_logado();
$menu = [
    'inicio'    => ['index.php',     'Início'],
    'produtos'  => ['produto.php',   'Produtos'],
    'sobre'     => ['sobre.php',     'Sobre'],
    'contato'   => ['contato.php',   'Contato'],
];
function link_menu(string $chave, string $arquivo, string $rotulo, string $atual): string
{
    $aria = $chave === $atual ? ' aria-current="page"' : '';
    return '<li><a href="' . $arquivo . '"' . $aria . '>' . $rotulo . '</a></li>';
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="csrf-token" content="<?= e(csrf_token()) ?>">
  <meta name="usuario-logado" content="<?= $usuario ? '1' : '0' ?>">
  <title><?= e($titulo) ?> | Livraria Garantia</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;600&family=Young+Serif&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/css.css">
</head>
<body>
  <header class="navbar">
    <a class="logo" href="index.php"><span class="marca" aria-hidden="true"></span>Livraria Garantia</a>
    <nav aria-label="Principal"><ul class="nav-links">
      <?php foreach ($menu as $chave => [$arquivo, $rotulo]) echo link_menu($chave, $arquivo, $rotulo, $pagina); ?>
      <?php if ($usuario): ?>
        <?php if (eh_admin()) echo link_menu('dashboard', 'dashboard.php', 'Dashboard', $pagina); ?>
        <li><a href="api/logout.php" title="Sair da conta">Sair (<?= e(explode(' ', $usuario['nome'])[0]) ?>)</a></li>
      <?php else: ?>
        <?= link_menu('login', 'login.php', 'Login', $pagina) ?>
      <?php endif; ?>
      <li><button type="button" id="abrir-carrinho" class="btn btn-carrinho-nav" aria-label="Abrir carrinho">🛒 Carrinho <span id="carrinho-contador" class="carrinho-badge">0</span></button></li>
    </ul></nav>
  </header>
