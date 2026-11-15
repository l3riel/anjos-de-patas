/* =========================================================
   Dados do site (arquivos JSON em data/)
   - Animais: data/animais.json
   - Textos e números: data/conteudo.json, aplicados em [data-conteudo]
   ========================================================= */

let promessaAnimais;
function carregarAnimais() {
  promessaAnimais ??= (async () => {
    const r = await fetch("data/animais.json");
    if (!r.ok) throw new Error(`Erro ${r.status} ao carregar data/animais.json`);
    return (await r.json()).animais.filter((a) => !a.adotado);
  })();
  return promessaAnimais;
}

/* ---------- Textos e números editáveis ----------
   Vêm de data/conteudo.json.
   Retorna só as chaves preenchidas: { chave: "valor" }. */
let promessaConteudo;
function carregarConteudo() {
  promessaConteudo ??= (async () => {
    let pares = [];
    try {
      const r = await fetch("data/conteudo.json");
      if (r.ok) pares = Object.entries((await r.json()).valores || {});
    } catch (e) {
      console.warn("Textos editáveis indisponíveis, mantendo os do HTML:", e);
    }
    return Object.fromEntries(
      pares.filter(([, v]) => String(v ?? "").trim()).map(([k, v]) => [k, String(v).trim()])
    );
  })();
  return promessaConteudo;
}

async function aplicarConteudo() {
  const valores = await carregarConteudo();
  if (!Object.keys(valores).length) return;

  document.querySelectorAll("[data-conteudo]").forEach((el) => {
    const valor = valores[el.dataset.conteudo];
    if (!valor) return;
    el.textContent = valor;
    el.classList.remove("preencher");
  });

  // data-requer="chave": só aparece quando o dado existe
  // data-sem="chave": alternativa mostrada enquanto o dado não existe
  document.querySelectorAll("[data-requer]").forEach((el) => {
    if (el.dataset.requer.split("|").some((k) => valores[k])) el.hidden = false;
  });
  document.querySelectorAll("[data-sem]").forEach((el) => {
    if (valores[el.dataset.sem]) el.hidden = true;
  });
}

document.addEventListener("DOMContentLoaded", aplicarConteudo);
