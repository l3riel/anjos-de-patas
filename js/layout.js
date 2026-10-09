/* =========================================================
   Layout compartilhado: ícones, header, rodapé e WhatsApp
   Para trocar contatos/redes, edite só o objeto ONG abaixo.
   ========================================================= */

const ONG = {
  nome: "ONG Anjos de Patas",
  razaoSocial: "Anjos de Patas Matipó - APM",
  cnpj: "35.761.357/0001-77",
  cidade: "Matipó - MG",
  endereco: "Rua E, Bairro Exposição, ao lado do ESF",
  // [PREENCHER] número com DDI+DDD, só dígitos (ex.: "5531999999999").
  // Enquanto estiver vazio, os botões de WhatsApp abrem o grupo abaixo.
  whatsappNumero: "",
  whatsappTexto: "[PREENCHER] (31) 9 0000-0000",
  whatsappGrupo: "https://chat.whatsapp.com/EZXPNb8ATfT1UnAckykyNl",
  instagram: "https://www.instagram.com/anjosdepatasmatipo/",
  instagramUsuario: "@anjosdepatasmatipo",
  email: "[PREENCHER]@email.com",
  horario: "Seg. a sex.: 9h às 16h · Sáb.: 9h às 12h",
  // [PREENCHER] URL do Formspree/Getform para receber os formulários por e-mail.
  // Vazio = o formulário monta a mensagem e abre o WhatsApp.
  formEndpoint: "",
  // Supabase (veja supabase/LEIA-ME.md). Vazio = o site lê data/animais.json.
  // A chave anon é pública por design; a segurança vem das políticas RLS.
  // Nunca coloque aqui a chave service_role.
  supabaseUrl: "",
  supabaseAnonKey: "",
};

function linkWhatsApp(mensagem = "Olá! Vim pelo site da Anjos de Patas.") {
  if (!ONG.whatsappNumero) return ONG.whatsappGrupo;
  return `https://wa.me/${ONG.whatsappNumero}?text=${encodeURIComponent(mensagem)}`;
}

/* Ícones SVG (traço no estilo Lucide; WhatsApp e Instagram simplificados) */
const ICONES = {
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  fechar: '<path d="M18 6 6 18M6 6l12 12"/>',
  "seta-dir": '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  "seta-esq": '<path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>',
  "chevron-dir": '<path d="m9 18 6-6-6-6"/>',
  "chevron-esq": '<path d="m15 18-6-6 6-6"/>',
  "chevron-baixo": '<path d="m6 9 6 6 6-6"/>',
  coracao:
    '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
  pata:
    '<g fill="currentColor" stroke="none"><circle cx="5.5" cy="10" r="2.2"/><circle cx="9.2" cy="5.2" r="2.2"/><circle cx="14.8" cy="5.2" r="2.2"/><circle cx="18.5" cy="10" r="2.2"/><path d="M12 11c-2.6 0-6.2 4.3-6.2 7.1A2.6 2.6 0 0 0 8.4 20.7c1.4 0 2.3-.8 3.6-.8s2.2.8 3.6.8a2.6 2.6 0 0 0 2.6-2.6C18.2 15.3 14.6 11 12 11Z"/></g>',
  email:
    '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  telefone:
    '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"/>',
  local:
    '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  relogio: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  alerta:
    '<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
  resgate:
    '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/><path d="M8 8v4M6 10h4"/>',
  estetoscopio:
    '<path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6 6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/>',
  seringa:
    '<path d="m18 2 4 4"/><path d="m17 7 3-3"/><path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5"/><path d="m9 11 4 4"/><path d="m5 19-3 3"/><path d="m14 4 6 6"/>',
  casa:
    '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  pausar: '<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>',
  tocar: '<path d="M7 4v16l13-8z"/>',
  copiar:
    '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  banco:
    '<path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"/>',
  pacote:
    '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.3 7 12 12l8.7-5"/><path d="M12 22V12"/><path d="m7.5 4.3 9 5.2"/>',
  documento:
    '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M16 13H8M16 17H8M10 9H8"/>',
  pessoas:
    '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  alvo: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  olho:
    '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  estrela:
    '<path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>',
  maos:
    '<path d="M11 14h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 16"/><path d="m7 20 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9"/><path d="m2 15 6 6"/><path d="M19.5 8.5c.7-.7 1.5-1.6 1.5-2.7A2.73 2.73 0 0 0 16 4a2.78 2.78 0 0 0-5 1.8c0 1.2.8 2 1.5 2.8L16 12Z"/>',
  filtro: '<path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>',
  instagram:
    '<rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><path d="M17.5 6.5h.01"/>',
  whatsapp:
    '<path fill="currentColor" stroke="none" d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.08-.13-.27-.2-.57-.35m-5.42 7.4h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.17-3.48-8.41Z"/>',
};

function icone(nome, classe = "icone") {
  return `<svg class="${classe}" aria-hidden="true" focusable="false" viewBox="0 0 24 24">${ICONES[nome] || ""}</svg>`;
}

/* Substitui <svg data-icone="nome"></svg> no HTML pelo ícone */
function aplicarIcones(raiz = document) {
  raiz.querySelectorAll("[data-icone]").forEach((el) => {
    el.outerHTML = icone(el.dataset.icone, el.getAttribute("class") || "icone");
  });
}

const MENU = [
  { href: "adote.html", texto: "Adote" },
  { href: "apadrinhe.html", texto: "Apadrinhe" },
  { href: "resgates.html", texto: "Resgates" },
  { href: "quem-somos.html", texto: "Quem somos" },
  { href: "index.html#contato", texto: "Contato" },
];

/* Nome da página atual ("adote", "doe"...), funcione o site com ou sem ".html" na URL */
function paginaAtual(href) {
  const nome = (h) => h.split(/[?#]/)[0].split("/").pop().replace(/\.html$/, "") || "index";
  const atual = nome(location.pathname);
  if (href.includes("#")) return false;
  if (atual === "animal") return nome(href) === "adote";
  return nome(href) === atual;
}

function sociais() {
  return `
    <a class="icone-social" href="${ONG.instagram}" target="_blank" rel="noopener" aria-label="Instagram da ONG (abre em nova aba)">${icone("instagram")}</a>
    <a class="icone-social" href="${linkWhatsApp()}" data-whatsapp target="_blank" rel="noopener" aria-label="WhatsApp da ONG (abre em nova aba)">${icone("whatsapp")}</a>`;
}

function montarHeader() {
  const alvo = document.getElementById("site-header");
  if (!alvo) return;
  const links = MENU.map(
    (l) =>
      `<li><a class="nav__link" href="${l.href}"${paginaAtual(l.href) ? ' aria-current="page"' : ""}>${l.texto}</a></li>`
  ).join("");

  alvo.outerHTML = `
  <header class="topo">
    <div class="container topo__inner">
      <a class="topo__logo" href="index.html" aria-label="Anjos de Patas, página inicial">
        <img src="assets/img/brand/logo.webp" alt="ONG Anjos de Patas" width="176" height="165">
      </a>
      <button class="menu-btn" type="button" aria-expanded="false" aria-controls="menu-principal" aria-label="Abrir menu">
        ${icone("menu", "icone icone-menu")}${icone("fechar", "icone icone-fechar")}
      </button>
      <nav class="nav" id="menu-principal" aria-label="Menu principal">
        <a class="btn nav__doar" href="doe.html"${paginaAtual("doe.html") ? ' aria-current="page"' : ""}>${icone("coracao")}Faça uma doação</a>
        <ul class="nav__lista" role="list">${links}</ul>
        <div class="nav__sociais">${sociais()}</div>
      </nav>
    </div>
  </header>`;

  const corpo = document.body;
  const botao = document.querySelector(".menu-btn");
  const nav = document.getElementById("menu-principal");

  const fechar = (devolverFoco = false) => {
    corpo.classList.remove("menu-aberto");
    corpo.style.overflow = "";
    botao.setAttribute("aria-expanded", "false");
    botao.setAttribute("aria-label", "Abrir menu");
    if (devolverFoco) botao.focus();
  };

  botao.addEventListener("click", () => {
    const abrir = !corpo.classList.contains("menu-aberto");
    if (!abrir) return fechar();
    corpo.classList.add("menu-aberto");
    corpo.style.overflow = "hidden";
    botao.setAttribute("aria-expanded", "true");
    botao.setAttribute("aria-label", "Fechar menu");
    nav.querySelector("a")?.focus();
  });

  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) fechar();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && corpo.classList.contains("menu-aberto")) fechar(true);
  });

  matchMedia("(min-width: 1100px)").addEventListener("change", () => fechar());
}

function montarRodape() {
  const alvo = document.getElementById("site-footer");
  if (!alvo) return;
  const ano = new Date().getFullYear();

  alvo.outerHTML = `
  <footer class="rodape">
    <div class="container rodape__grid">
      <div class="rodape__marca">
        <img src="assets/img/brand/logo.webp" alt="ONG Anjos de Patas" width="176" height="165" loading="lazy">
        <p>Resgatamos, tratamos e encontramos lares cheios de amor para cães e gatos de rua em ${ONG.cidade}.</p>
        <div class="rodape__sociais">${sociais()}</div>
      </div>
      <nav aria-label="Links do rodapé">
        <h2>Navegue</h2>
        <ul class="rodape__links" role="list">
          <li><a href="index.html">Início</a></li>
          <li><a href="quem-somos.html">Quem somos</a></li>
          <li><a href="resgates.html">Resgates</a></li>
          <li><a href="quem-somos.html#transparencia">Transparência</a></li>
          <li><a href="index.html#contato">Contato</a></li>
        </ul>
      </nav>
      <nav aria-label="Como ajudar">
        <h2>Como ajudar</h2>
        <ul class="rodape__links" role="list">
          <li><a href="doe.html">Faça uma doação</a></li>
          <li><a href="adote.html">Adote</a></li>
          <li><a href="apadrinhe.html">Apadrinhe</a></li>
          <li><a href="index.html#contato">Seja voluntário</a></li>
        </ul>
      </nav>
      <div>
        <h2>Fale com a gente</h2>
        <ul class="rodape__contato" role="list">
          <li>${icone("local")}<span>${ONG.endereco}<br>${ONG.cidade}</span></li>
          <li>${icone("whatsapp")}<a href="${linkWhatsApp()}" data-whatsapp target="_blank" rel="noopener" data-conteudo="whatsapp_texto">${ONG.whatsappTexto}</a></li>
          <li>${icone("email")}<a href="mailto:${ONG.email}" data-email data-conteudo="email">${ONG.email}</a></li>
          <li>${icone("relogio")}<span>${ONG.horario}</span></li>
          <li>${icone("alerta")}<span>Denúncia anônima de maus-tratos: ligue <strong>181</strong></span></li>
        </ul>
      </div>
    </div>

    <div class="rodape__base">
      <div class="rodape__pets" aria-hidden="true">
        <img class="pet-gato" src="assets/img/decor/gato-footer.webp" alt="" width="427" height="332" loading="lazy">
        <img class="pet-casa" src="assets/img/decor/casa.webp" alt="" width="454" height="454" loading="lazy">
        <img class="pet-cachorro" src="assets/img/decor/cachorro-footer.webp" alt="" width="353" height="310" loading="lazy">
      </div>
      <svg class="rodape__ondas" viewBox="0 0 1440 220" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path fill="#9C3573" d="M0 120C240 40 480 18 720 70s480 50 720-40v190H0Z"/>
        <path fill="#78114F" d="M0 175C200 95 420 82 640 132s480 48 800-42v130H0Z"/>
      </svg>
      <div class="rodape__creditos">
        <p>© ${ano} ${ONG.razaoSocial} · CNPJ ${ONG.cnpj} · ${ONG.cidade}</p>
        <p><a href="quem-somos.html#projeto">Projeto desenvolvido por alunos do 2º período de Ciência da Computação - Univértix</a></p>
      </div>
    </div>
  </footer>
  <a class="whats-flutuante" href="${linkWhatsApp()}" data-whatsapp target="_blank" rel="noopener" aria-label="Conversar com a ONG no WhatsApp (abre em nova aba)">${icone("whatsapp")}</a>`;
}

/* Links marcados com data-whatsapp usam o número configurado em ONG */
function aplicarLinksWhatsApp() {
  document.querySelectorAll("a[data-whatsapp]").forEach((a) => {
    a.href = linkWhatsApp(a.dataset.whatsapp || undefined);
  });
}

document.documentElement.classList.add("js");
montarHeader();
montarRodape();
aplicarIcones();
aplicarLinksWhatsApp();
