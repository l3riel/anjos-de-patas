/* =========================================================
   Interações: animação ao rolar, contadores e carrosséis
   ========================================================= */

const reduzirMovimento = matchMedia("(prefers-reduced-motion: reduce)");

/* ---------- Entrada suave ao rolar ---------- */
const observadorRevelar =
  "IntersectionObserver" in window
    ? new IntersectionObserver(
        (entradas) => {
          entradas.forEach((e) => {
            if (!e.isIntersecting) return;
            e.target.classList.add("visivel");
            observadorRevelar.unobserve(e.target);
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.1 }
      )
    : null;

function observarRevelar(raiz = document) {
  raiz.querySelectorAll(".revelar:not(.visivel)").forEach((el) => {
    if (observadorRevelar) observadorRevelar.observe(el);
    else el.classList.add("visivel");
  });
}

/* ---------- Contadores animados ---------- */
function animarContador(el) {
  const alvo = Number(el.dataset.contador);
  const formatar = (n) => n.toLocaleString("pt-BR");
  if (reduzirMovimento.matches) {
    el.textContent = formatar(alvo);
    return;
  }
  const duracao = 1800;
  const inicio = performance.now();
  const passo = (agora) => {
    const t = Math.min((agora - inicio) / duracao, 1);
    const suave = 1 - Math.pow(1 - t, 3);
    el.textContent = formatar(Math.round(alvo * suave));
    if (t < 1) requestAnimationFrame(passo);
  };
  requestAnimationFrame(passo);
}

function iniciarContadores() {
  const contadores = document.querySelectorAll("[data-contador]");
  if (!contadores.length) return;
  if (!("IntersectionObserver" in window)) return contadores.forEach(animarContador);
  const obs = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((e) => {
        if (!e.isIntersecting) return;
        animarContador(e.target);
        obs.unobserve(e.target);
      });
    },
    { threshold: 0.6 }
  );
  contadores.forEach((c) => obs.observe(c));
}

/* ---------- Carrossel de rolagem (histórias) ---------- */
function iniciarCarrossel(raiz) {
  if (!raiz || raiz.dataset.pronto) return;
  raiz.dataset.pronto = "1";
  const trilho = raiz.querySelector(".carrossel__trilho");
  const anterior = raiz.querySelector("[data-anterior]");
  const proximo = raiz.querySelector("[data-proximo]");

  const passo = () => {
    const item = trilho.querySelector(".carrossel__item");
    const gap = parseFloat(getComputedStyle(trilho).columnGap) || 0;
    return item ? item.getBoundingClientRect().width + gap : trilho.clientWidth;
  };

  const atualizar = () => {
    const max = trilho.scrollWidth - trilho.clientWidth - 2;
    anterior.disabled = trilho.scrollLeft <= 2;
    proximo.disabled = trilho.scrollLeft >= max;
  };

  anterior.addEventListener("click", () => trilho.scrollBy({ left: -passo() }));
  proximo.addEventListener("click", () => trilho.scrollBy({ left: passo() }));
  trilho.addEventListener("scroll", () => requestAnimationFrame(atualizar), { passive: true });
  addEventListener("resize", atualizar);
  atualizar();
}

/* ---------- Carrossel do hero (troca automática com pausa) ---------- */
function iniciarHero() {
  const raiz = document.querySelector("[data-hero-carrossel]");
  if (!raiz) return;
  const slides = [...raiz.querySelectorAll(".hero__slide")];
  const pontos = raiz.querySelector(".hero__pontos");
  const botaoPausa = raiz.querySelector("[data-pausar]");
  let atual = 0;
  let timer = null;
  let pausadoPeloUsuario = reduzirMovimento.matches;

  pontos.innerHTML = slides
    .map(
      (_, i) =>
        `<button type="button" class="hero__ponto" aria-label="Mostrar foto ${i + 1} de ${slides.length}"></button>`
    )
    .join("");
  const botoesPonto = [...pontos.children];

  const mostrar = (i) => {
    atual = (i + slides.length) % slides.length;
    slides.forEach((s, j) => {
      s.classList.toggle("ativo", j === atual);
      s.setAttribute("aria-hidden", j === atual ? "false" : "true");
    });
    botoesPonto.forEach((b, j) => b.setAttribute("aria-current", j === atual ? "true" : "false"));
  };

  const parar = () => clearInterval(timer);
  const tocar = () => {
    parar();
    if (!pausadoPeloUsuario) timer = setInterval(() => mostrar(atual + 1), 5500);
  };

  const atualizarBotaoPausa = () => {
    botaoPausa.innerHTML = pausadoPeloUsuario ? icone("tocar") : icone("pausar");
    botaoPausa.setAttribute(
      "aria-label",
      pausadoPeloUsuario ? "Retomar troca automática das fotos" : "Pausar troca automática das fotos"
    );
  };

  botoesPonto.forEach((b, i) => b.addEventListener("click", () => { mostrar(i); tocar(); }));
  raiz.querySelector("[data-anterior]").addEventListener("click", () => { mostrar(atual - 1); tocar(); });
  raiz.querySelector("[data-proximo]").addEventListener("click", () => { mostrar(atual + 1); tocar(); });
  botaoPausa.addEventListener("click", () => {
    pausadoPeloUsuario = !pausadoPeloUsuario;
    atualizarBotaoPausa();
    tocar();
  });

  // Para enquanto o usuário interage com o carrossel
  raiz.addEventListener("mouseenter", parar);
  raiz.addEventListener("mouseleave", tocar);
  raiz.addEventListener("focusin", parar);
  raiz.addEventListener("focusout", (e) => { if (!raiz.contains(e.relatedTarget)) tocar(); });
  document.addEventListener("visibilitychange", () => (document.hidden ? parar() : tocar()));

  mostrar(0);
  atualizarBotaoPausa();
  tocar();
}

document.addEventListener("DOMContentLoaded", () => {
  observarRevelar();
  iniciarContadores();
  iniciarHero();
  document.querySelectorAll("[data-carrossel]").forEach((c) => {
    if (c.querySelector(".carrossel__item")) iniciarCarrossel(c);
  });
});
