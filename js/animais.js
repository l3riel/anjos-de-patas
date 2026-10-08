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

document.addEventListener("DOMContentLoaded", () => {
  montarAnimaisHome();
  montarHistorias();
});
