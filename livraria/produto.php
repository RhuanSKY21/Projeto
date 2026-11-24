<?php
$pagina = 'produtos'; $titulo = 'Produtos';
require __DIR__ . '/includes/header.php';

$livros = db()->query('SELECT id, titulo, descricao, preco, imagem, estoque FROM livros WHERE ativo = 1 ORDER BY id')->fetchAll();
?>
  <section class="page-header"><div class="container"><h1>Produtos</h1><p>Catálogo da nossa loja.</p></div></section>
  <main class="container">
    <div class="grid-produtos">
      <?php if (!$livros): ?>
        <p>Nenhum livro disponível no momento.</p>
      <?php endif; ?>
      <?php foreach ($livros as $l): ?>
      <article class="card-produto">
        <div class="capa">
          <?php if ($l['imagem']): ?>
            <img src="<?= e($l['imagem']) ?>" alt="Capa do livro <?= e($l['titulo']) ?>" loading="lazy">
          <?php else: ?>
            <div class="selo" aria-hidden="true" style="margin:0 auto;width:120px;height:120px;font-size:3rem">📕</div>
          <?php endif; ?>
        </div>
        <h3><?= e($l['titulo']) ?></h3>
        <p class="descricao"><?= e($l['descricao']) ?></p>
        <span class="preco"><?= moeda($l['preco']) ?></span>
        <?php if ((int) $l['estoque'] > 0): ?>
          <button type="button" class="btn btn-comprar"
                  data-id="<?= (int) $l['id'] ?>"
                  data-livro="<?= e($l['titulo']) ?>"
                  data-preco="<?= e((string) $l['preco']) ?>">Comprar</button>
        <?php else: ?>
          <button type="button" class="btn" disabled>Esgotado</button>
        <?php endif; ?>
      </article>
      <?php endforeach; ?>
    </div>
  </main>
<?php require __DIR__ . '/includes/footer.php'; ?>
