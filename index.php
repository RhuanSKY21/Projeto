<?php
$pagina = 'inicio'; $titulo = 'Início';
require __DIR__ . '/includes/header.php';
?>
  <section class="hero"><div class="hero-content">
    <h1>Esse é o seu espaço para renovar seus livros</h1>
    <p>Vamos ajudar você a ler mais.</p>
    <a class="btn" href="produto.php">Ver catálogo</a>
  </div></section>
  <main class="container">
    <h2>Venha seguir nossas dicas e conceitos</h2>
    <p class="subtitle">E entenda todas as referências.</p>
    <div class="grid-cards">
      <article class="card card-tamanho">
        <h3>Aqui você verá muita magia. Ou nem tanta. Se brincar, talvez nem uma.</h3>
        <span class="badge">Talvez só a da sua carteira esvaziando.</span>
        <figure>
          <img src="https://i.redd.it/jflovkek047e1.jpeg" alt="Meme literário sobre leitores que dizem NI" loading="lazy">
          <figcaption>E grite com os leitores que dizem NI!</figcaption>
        </figure>
      </article>
    </div>
  </main>
<?php require __DIR__ . '/includes/footer.php'; ?>
