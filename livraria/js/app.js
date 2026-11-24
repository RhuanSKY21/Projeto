
(function () {
  'use strict';

  const STORAGE_KEY = 'livraria_garantia_carrinho';
  const USER_KEY = 'livraria_garantia_usuario';

  
  const style = document.createElement('style');
  style.textContent = `
    /* Botão e aba lateral do carrinho */
    .btn-carrinho-nav {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      cursor: pointer;
    }
    .carrinho-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 1.35rem;
      height: 1.35rem;
      padding: 0 0.35rem;
      border-radius: 999px;
      font-size: 0.8rem;
      font-weight: 600;
      background: #1f1f1f;
      color: #fff;
    }
    .carrinho-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.45);
      z-index: 998;
      backdrop-filter: blur(2px);
    }
    .carrinho-overlay[hidden],
    .aba-carrinho[hidden],
    .painel-aba[hidden] {
      display: none !important;
    }
    .aba-carrinho {
      position: fixed;
      top: 0;
      right: 0;
      width: min(400px, 92vw);
      height: 100vh;
      background: #fff;
      color: #1f1f1f;
      box-shadow: -6px 0 24px rgba(0, 0, 0, 0.18);
      z-index: 999;
      display: flex;
      flex-direction: column;
      padding: 1.5rem;
      box-sizing: border-box;
    }
    .aba-carrinho-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #e5e5e5;
      padding-bottom: 0.9rem;
      margin-bottom: 1rem;
    }
    .aba-carrinho-header h2 {
      margin: 0;
      font-size: 1.35rem;
    }
    .btn-fechar-carrinho {
      background: transparent;
      border: 1px solid #ccc;
      border-radius: 6px;
      padding: 0.35rem 0.65rem;
      cursor: pointer;
      font-size: 1rem;
    }
    .carrinho-lista {
      list-style: none;
      margin: 0;
      padding: 0;
      flex: 1;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }
    .carrinho-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      padding: 0.75rem;
      border: 1px solid #ececec;
      border-radius: 8px;
    }
    .carrinho-item-info strong {
      display: block;
    }
    .carrinho-item-acoes {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }
    .carrinho-item-acoes button {
      width: 1.75rem;
      height: 1.75rem;
      border: 1px solid #ccc;
      background: #f8f8f8;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
    }
    .carrinho-vazio {
      text-align: center;
      opacity: 0.7;
      margin-top: 2rem;
    }
    .aba-carrinho-footer {
      border-top: 1px solid #e5e5e5;
      padding-top: 1rem;
      margin-top: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .carrinho-total {
      display: flex;
      justify-content: space-between;
      font-size: 1.1rem;
      font-weight: 600;
    }
    .carrinho-acoes-footer {
      display: flex;
      gap: 0.5rem;
    }
    .carrinho-acoes-footer .btn {
      flex: 1;
      text-align: center;
    }

    /* Abas de Login / Cadastro */
    .abas-conta {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.25rem;
    }
    .abas-conta button[aria-selected="false"] {
      opacity: 0.7;
    }

    /* Efeito de entrada suave (Scroll Reveal) */
    .js-reveal {
      opacity: 0;
      transform: translateY(22px);
      transition: opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1),
                  transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .js-reveal.is-visible {
      opacity: 1;
      transform: translateY(0);
    }

    /* Microinteração nos cards */
    .card-produto, .card, .card-indicador {
      transition: transform 0.28s ease, box-shadow 0.28s ease;
    }
    .card-produto:hover, .card:hover, .card-indicador:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 26px rgba(0, 0, 0, 0.12);
    }

    /* Ripple nos botões */
    .btn {
      position: relative;
      overflow: hidden;
      transition: transform 0.18s ease, filter 0.18s ease;
    }
    .btn:active {
      transform: scale(0.97);
    }
    .js-ripple {
      position: absolute;
      border-radius: 50%;
      transform: scale(0);
      animation: jsRippleAnim 0.55s linear;
      background: rgba(255, 255, 255, 0.45);
      pointer-events: none;
    }
    @keyframes jsRippleAnim {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }

    /* Notificação Toast */
    .toast-container {
      position: fixed;
      bottom: 1.5rem;
      left: 1.5rem;
      z-index: 1200;
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
      pointer-events: none;
    }
    .toast-msg {
      background: #1f1f1f;
      color: #fff;
      padding: 0.85rem 1.2rem;
      border-radius: 10px;
      font-size: 0.92rem;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.22);
      display: flex;
      align-items: center;
      gap: 0.6rem;
      opacity: 0;
      transform: translateY(14px);
      transition: opacity 0.3s ease, transform 0.3s ease;
    }
    .toast-msg.show {
      opacity: 1;
      transform: translateY(0);
    }

    /* Animação do contador do carrinho */
    @keyframes popBadge {
      0% { transform: scale(1); }
      45% { transform: scale(1.35); }
      100% { transform: scale(1); }
    }
    .badge-pop {
      animation: popBadge 0.35s ease;
    }

    /* Barra de busca na página de produtos */
    .barra-filtro-produtos {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.5rem;
    }
    .barra-filtro-produtos input {
      flex: 1;
      min-width: 220px;
      padding: 0.65rem 0.9rem;
      border: 1px solid #ccc;
      border-radius: 8px;
      font-family: inherit;
      font-size: 0.95rem;
    }
    .contador-resultados {
      font-size: 0.9rem;
      opacity: 0.75;
    }

    /* Botão voltar ao topo */
    .btn-topo {
      position: fixed;
      bottom: 1.5rem;
      right: 1.5rem;
      width: 2.6rem;
      height: 2.6rem;
      border-radius: 50%;
      border: none;
      background: #1f1f1f;
      color: #fff;
      font-size: 1.1rem;
      cursor: pointer;
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
      opacity: 0;
      visibility: hidden;
      transform: translateY(10px);
      transition: opacity 0.25s ease, transform 0.25s ease, visibility 0.25s;
      z-index: 990;
    }
    .btn-topo.visivel {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    /* Medidor de força de senha */
    .forca-senha {
      margin-top: 0.4rem;
      font-size: 0.82rem;
      font-weight: 600;
    }
    .forca-barra {
      height: 5px;
      border-radius: 999px;
      background: #e5e5e5;
      margin-top: 0.25rem;
      overflow: hidden;
    }
    .forca-barra-fill {
      height: 100%;
      width: 0%;
      transition: width 0.3s ease, background-color 0.3s ease;
    }
  `;
  document.head.appendChild(style);

  
  if (!document.getElementById('aba-carrinho')) {
    const wrapperCarrinho = document.createElement('div');
    wrapperCarrinho.innerHTML = `
      <div id="carrinho-overlay" class="carrinho-overlay" hidden></div>
      <aside id="aba-carrinho" class="aba-carrinho" role="dialog" aria-modal="true" aria-labelledby="titulo-carrinho" hidden>
        <div class="aba-carrinho-header">
          <h2 id="titulo-carrinho">Seu Carrinho</h2>
          <button type="button" id="fechar-carrinho" class="btn-fechar-carrinho" aria-label="Fechar carrinho">✕</button>
        </div>
        <ul id="carrinho-lista" class="carrinho-lista"></ul>
        <div class="aba-carrinho-footer">
          <div class="carrinho-total">
            <span>Total:</span>
            <span id="carrinho-total-valor">R$ 0,00</span>
          </div>
          <div class="carrinho-acoes-footer">
            <button type="button" id="limpar-carrinho" class="btn">Limpar</button>
            <button type="button" id="finalizar-compra" class="btn">Finalizar compra</button>
          </div>
        </div>
      </aside>
    `;
    while (wrapperCarrinho.firstElementChild) {
      document.body.appendChild(wrapperCarrinho.firstElementChild);
    }
  }

 
  const toastContainer = document.createElement('div');
  toastContainer.className = 'toast-container';
  toastContainer.setAttribute('aria-live', 'polite');
  document.body.appendChild(toastContainer);

  function mostrarToast(mensagem, icone = '✨') {
    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.innerHTML = `<span>${icone}</span><span>${mensagem}</span>`;
    toastContainer.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 320);
    }, 3200);
  }

  // ---- Comunicação com o backend PHP ----
  async function api(url, dados) {
    const csrf = document.querySelector('meta[name="csrf-token"]')?.content || '';
    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf },
        body: JSON.stringify(dados),
        credentials: 'same-origin'
      });
      const json = await resp.json();
      return { status: resp.status, ...json };
    } catch (err) {
      return { ok: false, erro: 'Não foi possível falar com o servidor.', status: 0 };
    }
  }

  function dadosDoForm(form) {
    return Object.fromEntries(new FormData(form).entries());
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn');
    if (!btn) return;
    const circle = document.createElement('span');
    const diameter = Math.max(btn.clientWidth, btn.clientHeight);
    const radius = diameter / 2;
    const rect = btn.getBoundingClientRect();

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - rect.left - radius}px`;
    circle.style.top = `${e.clientY - rect.top - radius}px`;
    circle.classList.add('js-ripple');

    const oldRipple = btn.querySelector('.js-ripple');
    if (oldRipple) oldRipple.remove();
    btn.appendChild(circle);
  });

  
  const elementosReveal = document.querySelectorAll(
    '.card-produto, .card, .card-indicador, .formulario-container, .sobre-grid'
  );
  elementosReveal.forEach((el) => el.classList.add('js-reveal'));

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    elementosReveal.forEach((el) => observer.observe(el));
  } else {
    elementosReveal.forEach((el) => el.classList.add('is-visible'));
  }

  document.querySelectorAll('.card-indicador .valor').forEach((el) => {
    const alvo = parseInt(el.textContent.trim(), 10);
    if (isNaN(alvo)) return;
    let atual = 0;
    const passo = Math.max(1, Math.ceil(alvo / 30));
    const timer = setInterval(() => {
      atual += passo;
      if (atual >= alvo) {
        el.textContent = alvo;
        clearInterval(timer);
      } else {
        el.textContent = atual;
      }
    }, 25);
  });

  
  const btnTopo = document.createElement('button');
  btnTopo.type = 'button';
  btnTopo.className = 'btn-topo';
  btnTopo.setAttribute('aria-label', 'Voltar ao topo');
  btnTopo.textContent = '↑';
  document.body.appendChild(btnTopo);

  window.addEventListener('scroll', () => {
    btnTopo.classList.toggle('visivel', window.scrollY > 240);
  });

  btnTopo.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  
  const gridProdutos = document.querySelector('.grid-produtos');
  if (gridProdutos) {
    const cards = Array.from(gridProdutos.querySelectorAll('.card-produto'));
    const barra = document.createElement('div');
    barra.className = 'barra-filtro-produtos';
    barra.innerHTML = `
      <input type="search" id="busca-livros" placeholder="🔍 Buscar livro por título ou descrição..." aria-label="Buscar livros">
      <span class="contador-resultados" id="contador-livros">${cards.length} livro(s) encontrado(s)</span>
    `;
    gridProdutos.parentNode.insertBefore(barra, gridProdutos);

    const inputBusca = document.getElementById('busca-livros');
    const contadorLivros = document.getElementById('contador-livros');

    inputBusca.addEventListener('input', () => {
      const termo = inputBusca.value.toLowerCase().trim();
      let visiveis = 0;
      cards.forEach((card) => {
        const match = card.textContent.toLowerCase().includes(termo);
        card.style.display = match ? '' : 'none';
        if (match) visiveis++;
      });
      contadorLivros.textContent = `${visiveis} livro(s) encontrado(s)`;
    });
  }

 
  const tabLogin = document.getElementById('tab-login');
  const tabCadastro = document.getElementById('tab-cadastro');
  const painelLogin = document.getElementById('painel-login');
  const painelCadastro = document.getElementById('painel-cadastro');

  if (tabLogin && tabCadastro && painelLogin && painelCadastro) {
    function alternarAba(ativa) {
      const isCadastro = ativa === 'cadastro';
      tabLogin.setAttribute('aria-selected', String(!isCadastro));
      tabCadastro.setAttribute('aria-selected', String(isCadastro));
      painelLogin.hidden = isCadastro;
      painelCadastro.hidden = !isCadastro;
    }

    tabLogin.addEventListener('click', () => alternarAba('login'));
    tabCadastro.addEventListener('click', () => alternarAba('cadastro'));

    const formLogin = painelLogin.querySelector('form');
    if (formLogin) {
      formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();
        const r = await api('api/login.php', dadosDoForm(formLogin));
        if (!r.ok) {
          mostrarToast(r.erro || 'Falha no login.', '⚠️');
          return;
        }
        mostrarToast(`Bem-vindo de volta, ${r.nome}!`, '👋');
        setTimeout(() => { window.location.href = r.admin ? 'dashboard.php' : 'index.php'; }, 800);
      });
    }

    const formCadastro = document.getElementById('form-cadastro');
    const senhaCadastro = document.getElementById('senha-cadastro');
    const confirmarSenha = document.getElementById('confirmar-senha');

    if (senhaCadastro) {
      const medidor = document.createElement('div');
      medidor.className = 'forca-senha';
      medidor.innerHTML = `
        <span id="texto-forca">Força da senha: —</span>
        <div class="forca-barra"><div class="forca-barra-fill" id="barra-forca"></div></div>
      `;
      senhaCadastro.parentNode.appendChild(medidor);

      const textoForca = document.getElementById('texto-forca');
      const barraForca = document.getElementById('barra-forca');

      senhaCadastro.addEventListener('input', () => {
        const val = senhaCadastro.value;
        let pontos = 0;
        if (val.length >= 6) pontos++;
        if (/[A-Z]/.test(val)) pontos++;
        if (/[0-9]/.test(val)) pontos++;
        if (/[^A-Za-z0-9]/.test(val)) pontos++;

        const niveis = [
          { label: 'Muito fraca', cor: '#d9534f', largura: '25%' },
          { label: 'Fraca', cor: '#f0ad4e', largura: '50%' },
          { label: 'Boa', cor: '#5bc0de', largura: '75%' },
          { label: 'Forte', cor: '#5cb85c', largura: '100%' }
        ];

        if (!val) {
          textoForca.textContent = 'Força da senha: —';
          barraForca.style.width = '0%';
          return;
        }
        const nivel = niveis[Math.max(0, pontos - 1)];
        textoForca.textContent = `Força da senha: ${nivel.label}`;
        barraForca.style.width = nivel.largura;
        barraForca.style.backgroundColor = nivel.cor;
      });
    }

    if (formCadastro) {
      formCadastro.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (senhaCadastro.value !== confirmarSenha.value) {
          confirmarSenha.setCustomValidity('As senhas não coincidem.');
          confirmarSenha.reportValidity();
          return;
        }
        confirmarSenha.setCustomValidity('');
        const r = await api('api/cadastro.php', dadosDoForm(formCadastro));
        if (!r.ok) {
          mostrarToast(r.erro || 'Não foi possível criar a conta.', '⚠️');
          return;
        }
        mostrarToast(`Conta criada com sucesso para ${r.nome}! Faça login.`, '🎉');
        formCadastro.reset();
        alternarAba('login');
      });

      confirmarSenha.addEventListener('input', () => confirmarSenha.setCustomValidity(''));
    }
  }

  
  const formContato = document.querySelector('main .formulario-container form');
  if (formContato && !tabLogin) {
    formContato.addEventListener('submit', async (e) => {
      e.preventDefault();
      const r = await api('api/contato.php', dadosDoForm(formContato));
      if (!r.ok) {
        mostrarToast(r.erro || 'Não foi possível enviar a mensagem.', '⚠️');
        return;
      }
      mostrarToast('Mensagem enviada! Responderemos em breve.', '📩');
      formContato.reset();
    });
  }

 
  const btnAbrir = document.getElementById('abrir-carrinho');
  const btnFechar = document.getElementById('fechar-carrinho');
  const overlay = document.getElementById('carrinho-overlay');
  const abaCarrinho = document.getElementById('aba-carrinho');
  const listaEl = document.getElementById('carrinho-lista');
  const totalEl = document.getElementById('carrinho-total-valor');
  const badgeEl = document.getElementById('carrinho-contador');
  const btnLimpar = document.getElementById('limpar-carrinho');
  const btnFinalizar = document.getElementById('finalizar-compra');

  function lerCarrinho() {
    try {
      const itens = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
      return itens.filter((i) => Number.isInteger(i.id));
    } catch (e) {
      return [];
    }
  }

  function salvarCarrinho(itens) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(itens));
  }

  function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function animarBadge() {
    if (!badgeEl) return;
    badgeEl.classList.remove('badge-pop');
    void badgeEl.offsetWidth;
    badgeEl.classList.add('badge-pop');
  }

  function renderizarCarrinho() {
    const itens = lerCarrinho();
    const totalQtd = itens.reduce((acc, item) => acc + item.qtd, 0);
    const totalValor = itens.reduce((acc, item) => acc + item.preco * item.qtd, 0);

    if (badgeEl) badgeEl.textContent = totalQtd;
    if (totalEl) totalEl.textContent = formatarMoeda(totalValor);

    if (!listaEl) return;
    listaEl.innerHTML = '';

    if (itens.length === 0) {
      const vazio = document.createElement('li');
      vazio.className = 'carrinho-vazio';
      vazio.textContent = 'Seu carrinho está vazio.';
      listaEl.appendChild(vazio);
      return;
    }

    itens.forEach((item, index) => {
      const li = document.createElement('li');
      li.className = 'carrinho-item';
      li.innerHTML = `
        <div class="carrinho-item-info">
          <strong>${item.nome}</strong>
          <span>${formatarMoeda(item.preco)} × ${item.qtd}</span>
        </div>
        <div class="carrinho-item-acoes">
          <button type="button" data-acao="diminuir" data-index="${index}" aria-label="Diminuir quantidade">-</button>
          <span>${item.qtd}</span>
          <button type="button" data-acao="aumentar" data-index="${index}" aria-label="Aumentar quantidade">+</button>
          <button type="button" data-acao="remover" data-index="${index}" aria-label="Remover item">🗑</button>
        </div>
      `;
      listaEl.appendChild(li);
    });
  }

  function abrirCarrinho() {
    if (!abaCarrinho || !overlay) return;
    renderizarCarrinho();
    abaCarrinho.hidden = false;
    overlay.hidden = false;
  }

  function fecharCarrinho() {
    if (!abaCarrinho || !overlay) return;
    abaCarrinho.hidden = true;
    overlay.hidden = true;
  }

  function adicionarAoCarrinho(id, nome, preco) {
    const itens = lerCarrinho();
    const existente = itens.find((i) => i.id === id);
    if (existente) {
      existente.qtd += 1;
    } else {
      itens.push({ id, nome, preco: Number(preco), qtd: 1 });
    }
    salvarCarrinho(itens);
    renderizarCarrinho();
    animarBadge();
    mostrarToast(`"${nome}" adicionado ao carrinho!`, '🛒');
    abrirCarrinho();
  }

  if (btnAbrir) btnAbrir.addEventListener('click', abrirCarrinho);
  if (btnFechar) btnFechar.addEventListener('click', fecharCarrinho);
  if (overlay) overlay.addEventListener('click', fecharCarrinho);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && abaCarrinho && !abaCarrinho.hidden) fecharCarrinho();
  });

  if (listaEl) {
    listaEl.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-acao]');
      if (!btn) return;
      const index = Number(btn.dataset.index);
      const acao = btn.dataset.acao;
      const itens = lerCarrinho();
      if (!itens[index]) return;

      if (acao === 'aumentar') itens[index].qtd += 1;
      if (acao === 'diminuir') {
        itens[index].qtd -= 1;
        if (itens[index].qtd <= 0) itens.splice(index, 1);
      }
      if (acao === 'remover') {
        const removido = itens[index].nome;
        itens.splice(index, 1);
        mostrarToast(`"${removido}" removido do carrinho.`, '🗑️');
      }

      salvarCarrinho(itens);
      renderizarCarrinho();
      animarBadge();
    });
  }

  if (btnLimpar) {
    btnLimpar.addEventListener('click', () => {
      salvarCarrinho([]);
      renderizarCarrinho();
      animarBadge();
      mostrarToast('Carrinho esvaziado.', '🧹');
    });
  }

  if (btnFinalizar) {
    btnFinalizar.addEventListener('click', async () => {
      const itens = lerCarrinho();
      if (itens.length === 0) {
        mostrarToast('Adicione pelo menos um livro antes de finalizar.', '⚠️');
        return;
      }
      btnFinalizar.disabled = true;
      const r = await api('api/pedido.php', { itens: itens.map((i) => ({ id: i.id, qtd: i.qtd })) });
      btnFinalizar.disabled = false;
      if (!r.ok) {
        mostrarToast(r.erro || 'Não foi possível finalizar o pedido.', '⚠️');
        if (r.login) setTimeout(() => { window.location.href = 'login.php'; }, 1200);
        return;
      }
      mostrarToast(`Pedido #${r.pedido} finalizado! Obrigado pela compra.`, '✅');
      salvarCarrinho([]);
      renderizarCarrinho();
      animarBadge();
      fecharCarrinho();
    });
  }

  document.querySelectorAll('.btn-comprar').forEach((botao) => {
    botao.addEventListener('click', () => {
      adicionarAoCarrinho(Number(botao.dataset.id), botao.dataset.livro, botao.dataset.preco);
    });
  });

  renderizarCarrinho();
})();

(function () {
  'use strict';

  const formFiltro = document.getElementById('formFiltro');
  const btnLimpar = document.getElementById('btnLimpar');

  if (btnLimpar && formFiltro) {
    btnLimpar.addEventListener('click', function () {
      window.location.href = 'consulta.php';
    });
  }

  if (formFiltro) {
    formFiltro.addEventListener('submit', function (e) {
      const minVal = parseFloat(String(document.getElementById('preco_min')?.value || '').replace(',', '.'));
      const maxVal = parseFloat(String(document.getElementById('preco_max')?.value || '').replace(',', '.'));
      if (!isNaN(minVal) && !isNaN(maxVal) && minVal > maxVal) {
        e.preventDefault();
        alert('O preço mínimo não pode ser maior que o preço máximo.');
      }
    });
  }
})();

(function () {
  'use strict';

  const form = document.getElementById('formCadastro');
  const caixaErros = document.getElementById('caixaErros');
  const custoInput = document.getElementById('preco_custo');
  const vendaInput = document.getElementById('preco_venda');
  const margemInput = document.getElementById('margem');

  function atualizarMargem() {
    if (!custoInput || !vendaInput || !margemInput) return;
    const custo = parseFloat(String(custoInput.value).replace(',', '.'));
    const venda = parseFloat(String(vendaInput.value).replace(',', '.'));
    if (isNaN(custo) || isNaN(venda) || venda <= 0) {
      margemInput.value = '';
      return;
    }
    const lucro = venda - custo;
    const pct = (lucro / venda) * 100;
    margemInput.value = `R$ ${lucro.toFixed(2).replace('.', ',')} (${pct.toFixed(1)}%)`;
  }

  if (custoInput) custoInput.addEventListener('input', atualizarMargem);
  if (vendaInput) vendaInput.addEventListener('input', atualizarMargem);

  if (form && caixaErros) {
    form.addEventListener('submit', function (e) {
      const erros = [];
      const codigo = document.getElementById('codigo')?.value.trim() || '';
      const titulo = document.getElementById('titulo')?.value.trim() || '';
      const categoria = document.getElementById('categoria')?.value.trim() || '';
      const custo = parseFloat(String(custoInput?.value || '').replace(',', '.'));
      const venda = parseFloat(String(vendaInput?.value || '').replace(',', '.'));

      if (!codigo) erros.push('Informe o código do livro.');
      if (titulo.length < 2) erros.push('Informe o título do livro (mínimo 2 caracteres).');
      if (!categoria) erros.push('Selecione uma categoria.');
      if (isNaN(custo) || custo < 0) erros.push('Preço de custo inválido.');
      if (isNaN(venda) || venda < 0) erros.push('Preço de venda inválido.');

      if (erros.length > 0) {
        e.preventDefault();
        caixaErros.innerHTML = '<strong>Corrija os campos abaixo:</strong><ul>' +
          erros.map(err => `<li>${err}</li>`).join('') + '</ul>';
        caixaErros.classList.remove('escondido');
        caixaErros.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        caixaErros.classList.add('escondido');
      }
    });
  }
})();