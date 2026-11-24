<?php
$pagina = 'contato'; $titulo = 'Contato';
require __DIR__ . '/includes/header.php';
?>
  <section class="page-header"><div class="container"><h1>Contato</h1><p>Preencha o formulário e responderemos em breve.</p></div></section>
  <main class="container">
    <div class="formulario-container">
      <form action="api/contato.php" method="post" id="form-contato">
        <div class="form-group">
          <label for="nome">Nome</label>
          <input type="text" id="nome" name="nome" placeholder="Digite seu nome" autocomplete="name" maxlength="120" required>
        </div>
        <div class="form-group">
          <label for="email">E-mail</label>
          <input type="email" id="email" name="email" placeholder="Digite seu e-mail" autocomplete="email" maxlength="160" required>
        </div>
        <div class="form-group">
          <label for="assunto">Assunto</label>
          <select id="assunto" name="assunto">
            <option value="duvida">Dúvida</option>
            <option value="sugestao">Sugestão</option>
            <option value="outros">Outros</option>
          </select>
        </div>
        <div class="form-group">
          <label for="mensagem">Mensagem</label>
          <textarea id="mensagem" name="mensagem" rows="5" placeholder="Digite sua mensagem" maxlength="3000" required></textarea>
        </div>
        <button type="submit" class="btn">Enviar mensagem</button>
      </form>
    </div>
  </main>
<?php require __DIR__ . '/includes/footer.php'; ?>
