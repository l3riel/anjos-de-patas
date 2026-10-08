/* =========================================================
   Animais e histórias: lê os JSON e monta cards
   ========================================================= */

const ROTULOS = {
  especie: { cachorro: "Cachorro", gato: "Gato" },
  sexo: { macho: "Macho", femea: "Fêmea" },
  porte: { pequeno: "Porte pequeno", medio: "Porte médio", grande: "Porte grande" },
  idade: { filhote: "Filhote", adulto: "Adulto", idoso: "Idoso" },
};

function esc(texto = "") {
  return String(texto).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]
  );
}

const cacheJson = {};
function carregarJson(url) {
  cacheJson[url] ??= fetch(url).then((r) => {
    if (!r.ok) throw new Error(`Erro ${r.status} ao carregar ${url}`);
    return r.json();
  });
  return cacheJson[url];
}

const carregarAnimais = () => carregarJson("/data/animais.json").then((d) => d.animais);
const carregarHistorias = () => carregarJson("/data/historias.json");

function artigo(a) {
  return a.sexo === "femea" ? "a" : "o";
}

function seloExemplo(item) {
  return item.exemplo ? '<span class="selo selo--exemplo">Exemplo [PREENCHER]</span>' : "";
}

function cardAnimal(a, { modo = "adocao", atraso = 0 } = {}) {
  const href = `/animal?id=${encodeURIComponent(a.id)}`;
  const selos = [
    modo !== "padrinho" && a.precisaPadrinho ? `<span class="selo">${icone("coracao")}Precisa de padrinho</span>` : "",
    modo === "padrinho" && !a.disponivelAdocao ? '<span class="selo">Em tratamento</span>' : "",
    seloExemplo(a),
  ].join("");
  const cta =
    modo === "padrinho"
      ? `Apadrinhar ${artigo(a)} ${esc(a.nome)}`
      : `Conhecer ${artigo(a)} ${esc(a.nome)}`;

  return `
  <article class="card card--interativo animal-card revelar" style="--atraso:${atraso}ms">
    <div class="animal-card__foto">
      <img src="${esc(a.foto)}" alt="${esc(a.alt || a.nome)}" width="600" height="450" loading="lazy" decoding="async">
      <div class="animal-card__selos">${selos}</div>
    </div>
    <div class="animal-card__corpo">
      <h3 class="animal-card__nome"><a href="${modo === "padrinho" ? href + "#apadrinhar" : href}">${esc(a.nome)}</a></h3>
      <ul class="tags" role="list" aria-label="Características">
        <li>${esc(a.idadeTexto || ROTULOS.idade[a.idade])}</li>
        <li>${ROTULOS.porte[a.porte]}</li>
        <li>${ROTULOS.sexo[a.sexo]}</li>
      </ul>
      ${modo === "padrinho" ? `<p class="animal-card__resumo">${esc(a.historia)}</p>` : ""}
      <span class="animal-card__cta" aria-hidden="true">${cta}${icone("seta-dir")}</span>
    </div>
  </article>`;
}

function erroCarregamento(alvo, mensagem = "Não foi possível carregar os animais agora.") {
  alvo.innerHTML = `
    <div class="vazio">
      <p>${mensagem}</p>
      <button class="btn btn--contorno btn--pequeno" type="button" onclick="location.reload()">Tentar de novo</button>
    </div>`;
}

/* Home: 6 animais disponíveis */
async function montarAnimaisHome() {
  const alvo = document.querySelector("[data-animais-home]");
  if (!alvo) return;
  try {
    const animais = (await carregarAnimais()).filter((a) => a.disponivelAdocao).slice(0, 6);
    alvo.innerHTML = animais.map((a, i) => cardAnimal(a, { atraso: (i % 3) * 60 })).join("");
    observarRevelar(alvo);
  } catch (e) {
    console.error(e);
    erroCarregamento(alvo);
  }
}

/* Home: histórias de superação no carrossel */
async function montarHistorias() {
  const alvo = document.querySelector("[data-historias]");
  if (!alvo) return;
  try {
    const { superacao } = await carregarHistorias();
    alvo.innerHTML = superacao
      .map(
        (h) => `
      <li class="carrossel__item">
        <article class="card historia-card">
          <div class="historia-card__foto">
            <img src="${esc(h.foto)}" alt="${esc(h.alt)}" width="600" height="450" loading="lazy" decoding="async">
          </div>
          <div class="historia-card__corpo">
            ${seloExemplo(h)}
            <h3>${esc(h.titulo)}</h3>
            <p>${esc(h.texto)}</p>
            <a class="btn btn--pequeno" href="/doe">${icone("coracao")}Doar agora</a>
          </div>
        </article>
      </li>`
      )
      .join("");
    iniciarCarrossel(alvo.closest("[data-carrossel]"));
  } catch (e) {
    console.error(e);
    erroCarregamento(alvo, "Não foi possível carregar as histórias agora.");
  }
}

/* /adote: grade com filtros (estado salvo na URL para poder compartilhar) */
async function montarAdote() {
  const alvo = document.querySelector("[data-animais-adote]");
  if (!alvo) return;
  const contagem = document.querySelector("[data-contagem]");
  const limpar = document.querySelector("[data-limpar]");
  const botoes = [...document.querySelectorAll("[data-filtro]")];
  const params = new URLSearchParams(location.search);
  const filtros = { especie: "", porte: "", sexo: "", idade: "" };
  Object.keys(filtros).forEach((k) => (filtros[k] = params.get(k) || ""));

  let animais = [];
  try {
    animais = (await carregarAnimais()).filter((a) => a.disponivelAdocao);
  } catch (e) {
    console.error(e);
    contagem.textContent = "";
    return erroCarregamento(alvo);
  }

  const render = () => {
    botoes.forEach((b) =>
      b.setAttribute("aria-pressed", String(filtros[b.dataset.filtro] === b.dataset.valor))
    );
    const lista = animais.filter((a) => Object.entries(filtros).every(([k, v]) => !v || a[k] === v));
    const ativos = Object.values(filtros).some(Boolean);
    limpar.hidden = !ativos;

    contagem.textContent =
      lista.length === 1 ? "1 animal encontrado" : `${lista.length} animais encontrados`;
    alvo.innerHTML = lista.length
      ? lista.map((a, i) => cardAnimal(a, { atraso: (i % 3) * 60 })).join("")
      : `<div class="vazio">
           <p>Nenhum animal com essas características agora. Novos resgatados chegam sempre!</p>
           <button class="btn btn--contorno btn--pequeno" type="button" data-limpar-vazio>Ver todos os animais</button>
         </div>`;
    alvo.querySelector("[data-limpar-vazio]")?.addEventListener("click", limparTudo);
    alvo.querySelectorAll(".revelar").forEach((el) => el.classList.add("visivel"));

    const url = new URL(location.href);
    Object.entries(filtros).forEach(([k, v]) => (v ? url.searchParams.set(k, v) : url.searchParams.delete(k)));
    history.replaceState(null, "", url);
  };

  const limparTudo = () => {
    Object.keys(filtros).forEach((k) => (filtros[k] = ""));
    render();
  };

  botoes.forEach((b) =>
    b.addEventListener("click", () => {
      filtros[b.dataset.filtro] = b.dataset.valor;
      render();
    })
  );
  limpar.addEventListener("click", limparTudo);
  render();
}

/* /animal?id=...: página de detalhe */
async function montarDetalhe() {
  const alvo = document.querySelector("[data-detalhe]");
  if (!alvo) return;
  const id = new URLSearchParams(location.search).get("id");
  let animais;
  try {
    animais = await carregarAnimais();
  } catch (e) {
    console.error(e);
    return erroCarregamento(alvo, "Não foi possível carregar este animal agora.");
  }
  const a = animais.find((x) => x.id === id);

  if (!a) {
    document.title = "Animal não encontrado | ONG Anjos de Patas";
    alvo.innerHTML = `
      <div class="vazio">
        <h1>Não encontramos este animal</h1>
        <p>Talvez ele já tenha sido adotado. Que notícia boa!</p>
        <a class="btn" href="/adote">Ver animais para adoção</a>
      </div>`;
    return;
  }

  const o = artigo(a);
  document.title = `${a.nome}: ${ROTULOS.especie[a.especie].toLowerCase()} para adoção | ONG Anjos de Patas`;
  document.querySelector('meta[name="description"]')?.setAttribute("content", `${a.nome}, ${a.idadeTexto}, ${ROTULOS.porte[a.porte].toLowerCase()}. ${a.historia}`);
  document.querySelector("[data-trilha-nome]").textContent = a.nome;

  const saude = [
    ["Castrad" + o, a.castrado],
    ["Vacinad" + o, a.vacinado],
    ["Vermifugad" + o, a.vermifugado],
  ];

  alvo.innerHTML = `
    <article class="detalhe__grid">
      <div class="detalhe__foto">
        <img src="${esc(a.fotoGrande || a.foto.replace("w=600&h=450", "w=1000&h=750"))}" alt="${esc(a.alt || a.nome)}" width="1000" height="750">
      </div>
      <div class="detalhe__info">
        <div class="detalhe__selos">
          ${a.precisaPadrinho ? `<span class="selo">${icone("coracao")}Precisa de padrinho</span>` : ""}
          ${!a.disponivelAdocao ? '<span class="selo">Em tratamento</span>' : ""}
          ${seloExemplo(a)}
        </div>
        <h1>Oi, eu sou ${o} ${esc(a.nome)}!</h1>
        <ul class="tags tags--grandes" role="list" aria-label="Características">
          <li>${ROTULOS.especie[a.especie]}</li>
          <li>${esc(a.idadeTexto)}</li>
          <li>${ROTULOS.porte[a.porte]}</li>
          <li>${ROTULOS.sexo[a.sexo]}</li>
        </ul>
        <p class="detalhe__historia">${esc(a.historia)}</p>
        ${a.temperamento?.length ? `<p class="detalhe__temperamento"><strong>Meu jeitinho:</strong> ${a.temperamento.map(esc).join(", ")}</p>` : ""}
        <ul class="detalhe__saude" role="list">
          ${saude.map(([t, ok]) => `<li class="${ok ? "ok" : ""}">${icone(ok ? "check" : "relogio")}${ok ? t : t.replace(/^./, (c) => "Ainda não " + c.toLowerCase())}</li>`).join("")}
        </ul>
        <div class="grupo-botoes">
          ${a.disponivelAdocao ? `<a class="btn" href="#interesse">${icone("coracao")}Quero adotar ${o} ${esc(a.nome)}</a>` : ""}
          ${a.precisaPadrinho ? `<a class="btn btn--contorno" href="/apadrinhe?animal=${encodeURIComponent(a.id)}#formulario">Quero apadrinhar</a>` : ""}
        </div>
        ${!a.disponivelAdocao ? `<p class="detalhe__aviso">${o === "a" ? "Ela" : "Ele"} ainda está em tratamento e logo fica disponível para adoção. Enquanto isso, você pode apadrinhar.</p>` : ""}
      </div>
    </article>`;

  if (a.disponivelAdocao) {
    document.querySelector("[data-bloco-interesse]").hidden = false;
    document.querySelector("[data-nome-animal]").textContent = `${o} ${a.nome}`;
    // setAttribute para o valor sobreviver ao form.reset()
    document.querySelector("[data-campo-animal]").setAttribute("value", `${a.nome} (${a.id})`);
  }

  const outros = animais.filter((x) => x.disponivelAdocao && x.id !== a.id && x.especie === a.especie).slice(0, 3);
  if (outros.length) {
    document.querySelector("[data-bloco-outros]").hidden = false;
    const grade = document.querySelector("[data-outros-animais]");
    grade.innerHTML = outros.map((x) => cardAnimal(x)).join("");
    observarRevelar(grade);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  montarAnimaisHome();
  montarHistorias();
  montarAdote();
  montarDetalhe();
});
