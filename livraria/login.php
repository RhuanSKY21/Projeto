<?php
$pagina = 'login'; $titulo = 'Login';
require __DIR__ . '/includes/header.php';
?>
  <section class="page-header"><div class="container"><h1>Login</h1><p>Acesse sua conta ou cadastre-se.</p></div></section>
  <main class="container">
    <div class="login-grid">
      <div class="painel-cliente">
        <h2>Área do cliente</h2>
        <p class="subtitle">Faça seu login para acompanhar seus pedidos ou crie uma conta para começar.</p>
      </div>
      <div class="formulario-container">
        <div class="abas-conta" role="tablist" aria-label="Acesso ou cadastro de usuário">
          <button type="button" class="btn" role="tab" id="tab-login" aria-controls="painel-login" aria-selected="true">Entrar</button>
          <button type="button" class="btn" role="tab" id="tab-cadastro" aria-controls="painel-cadastro" aria-selected="false">Cadastrar</button>
        </div>

        <div id="painel-login" class="painel-aba" role="tabpanel" aria-labelledby="tab-login">
          <form action="api/login.php" method="post">
            <div class="form-group">
              <label for="email-login">E-mail</label>
              <input type="email" id="email-login" name="email" placeholder="Digite seu e-mail" autocomplete="email" required>
            </div>
            <div class="form-group">
              <label for="senha-login">Senha</label>
              <input type="password" id="senha-login" name="senha" placeholder="Digite sua senha" autocomplete="current-password" required>
            </div>
            <button type="submit" class="btn">Entrar</button>
          </form>
        </div>

        <div id="painel-cadastro" class="painel-aba" role="tabpanel" aria-labelledby="tab-cadastro" hidden>
          <form action="api/cadastro.php" method="post" id="form-cadastro">
            <div class="form-group">
              <label for="nome-cadastro">Nome completo</label>
              <input type="text" id="nome-cadastro" name="nome" placeholder="Digite seu nome" autocomplete="name" maxlength="120" required>
            </div>
            <div class="form-group">
              <label for="email-cadastro">E-mail</label>
              <input type="email" id="email-cadastro" name="email" placeholder="Digite seu e-mail" autocomplete="email" maxlength="160" required>
            </div>
            <div class="form-group">
              <label for="senha-cadastro">Senha</label>
              <input type="password" id="senha-cadastro" name="senha" placeholder="Crie uma senha" autocomplete="new-password" minlength="6" required>
            </div>
            <div class="form-group">
              <label for="confirmar-senha">Confirmar senha</label>
              <input type="password" id="confirmar-senha" name="confirmar_senha" placeholder="Repita sua senha" autocomplete="new-password" minlength="6" required>
            </div>
            <button type="submit" class="btn">Criar conta</button>
          </form>
        </div>
      </div>
    </div>
  </main>
<?php require __DIR__ . '/includes/footer.php'; ?>
