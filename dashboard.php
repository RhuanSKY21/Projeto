<?php
require_once __DIR__ . '/includes/bootstrap.php';
$pagina = 'dashboard'; $titulo = 'Dashboard';

if (!eh_admin()) {
    http_response_code(403);
    require __DIR__ . '/includes/header.php';
    ?>
  <section class="page-header"><div class="container"><h1>Acesso restrito</h1><p>Esta área é só para administradores.</p></div></section>
  <main class="container"><p>Faça <a href="login.php">login</a> com uma conta de administrador.</p></main>
<?php
    require __DIR__ . '/includes/footer.php';
    exit;
}

require __DIR__ . '/includes/header.php';
$pdo = db();
$pedidosHoje = (int) $pdo->query('SELECT COUNT(*) FROM pedidos WHERE DATE(criado_em) = CURDATE()')->fetchColumn();

$maisVendidos = $pdo->query(
    'SELECT l.titulo, SUM(i.quantidade) AS total
       FROM itens_pedido i JOIN livros l ON l.id = i.livro_id
      GROUP BY l.id, l.titulo
      ORDER BY total DESC LIMIT 4'
)->fetchAll();

$chegando = (int) $pdo->query('SELECT COALESCE(SUM(quantidade),0) FROM reposicoes WHERE recebido = 0')->fetchColumn();
$reposicao = $pdo->query(
    'SELECT l.titulo, SUM(r.quantidade) AS total
       FROM reposicoes r JOIN livros l ON l.id = r.livro_id
      WHERE r.recebido = 0
      GROUP BY l.id, l.titulo
      ORDER BY total DESC LIMIT 4'
)->fetchAll();
?>
  <section class="page-header"><div class="container"><h1>Indicadores e reposição</h1><p>Painel de reposição e dos livros mais vendidos.</p></div></section>
  <main class="container">
    <div class="grid-indicadores">
      <article class="card-indicador">
        <span class="label">Pedidos hoje</span>
        <span class="valor"><?= $pedidosHoje ?></span>
        <h4>Mais vendidos</h4>
        <ul>
          <?php foreach ($maisVendidos as $m): ?>
            <li><span><?= e($m['titulo']) ?></span><b><?= (int) $m['total'] ?> vendidos</b></li>
          <?php endforeach; ?>
          <?php if (!$maisVendidos): ?><li><span>Nenhuma venda ainda.</span></li><?php endif; ?>
        </ul>
      </article>
      <article class="card-indicador">
        <span class="label">Produtos novos chegando</span>
        <span class="valor"><?= $chegando ?></span>
        <h4>Reposição</h4>
        <ul>
          <?php foreach ($reposicao as $r): ?>
            <li><span><?= e($r['titulo']) ?></span><b><?= (int) $r['total'] ?> novos</b></li>
          <?php endforeach; ?>
          <?php if (!$reposicao): ?><li><span>Nada a caminho.</span></li><?php endif; ?>
        </ul>
      </article>
    </div>
  </main>
<?php require __DIR__ . '/includes/footer.php'; ?>
