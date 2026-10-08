/* =========================================================
   Painel da ONG (admin.html)
   Login pelo Supabase Auth; a permissão de escrita é garantida
   pelas políticas RLS (tabela admins), não por este arquivo.
   ========================================================= */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const ROTULO = {
  especie: { cachorro: "Cachorro", gato: "Gato" },
  porte: { pequeno: "pequeno", medio: "médio", grande: "grande" },
};

let sb;
let animais = [];
let editandoId = null;
let fotoNova = null;

function escHtml(t = "") {
  return String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

function mostrarTela(nome) {
  $$("[data-tela]").forEach((t) => (t.hidden = t.dataset.tela !== nome));
  $("[data-sair]").hidden = !["painel", "sem-acesso"].includes(nome);
}

let timerAviso;
function avisar(texto) {
  const el = $("[data-aviso]");
  el.textContent = texto;
  el.classList.add("visivel");
  clearTimeout(timerAviso);
  timerAviso = setTimeout(() => el.classList.remove("visivel"), 4000);
}

function status(el, texto, tipo = "ok") {
  el.className = `form__status form__status--${tipo}`;
  el.textContent = texto;
}

/* ---------- Sessão ---------- */
async function iniciar() {
  if (!ONG.supabaseUrl || !ONG.supabaseAnonKey) return mostrarTela("config");
  sb = supabase.createClient(ONG.supabaseUrl, ONG.supabaseAnonKey);

  $("[data-form-login]").addEventListener("submit", entrar);
  $("[data-sair]").addEventListener("click", async () => {
    await sb.auth.signOut();
    mostrarTela("login");
  });
  $("[data-ver-senha]").addEventListener("click", (e) => {
    const campo = $("#l-senha");
    const ver = campo.type === "password";
    campo.type = ver ? "text" : "password";
    e.currentTarget.textContent = ver ? "Ocultar" : "Mostrar";
    e.currentTarget.setAttribute("aria-pressed", String(ver));
  });

  const { data } = await sb.auth.getSession();
  if (data.session) await abrirPainel(data.session.user);
  else mostrarTela("login");
}

async function entrar(e) {
  e.preventDefault();
  const form = e.currentTarget;
  const st = $(".form__status", form);
  const botao = $('[type="submit"]', form);
  botao.disabled = true;
  botao.textContent = "Entrando…";
  const { data, error } = await sb.auth.signInWithPassword({
    email: form.email.value.trim(),
    password: form.senha.value,
  });
  botao.disabled = false;
  botao.textContent = "Entrar";
  if (error) return status(st, "E-mail ou senha incorretos. Confira e tente de novo.", "erro");
  form.reset();
  st.textContent = "";
  await abrirPainel(data.user);
}

async function abrirPainel(usuario) {
  const { data } = await sb.from("admins").select("user_id").eq("user_id", usuario.id).maybeSingle();
  if (!data) {
    $("[data-email-usuario]").textContent = usuario.email;
    return mostrarTela("sem-acesso");
  }
  mostrarTela("painel");
  if (!abrirPainel.pronto) {
    ligarPainel();
    abrirPainel.pronto = true;
  }
  await Promise.all([carregarLista(), carregarTextos()]);
}

/* ---------- Abas ---------- */
function ligarAbas() {
  const abas = $$(".admin-aba");
  const ativar = (aba) => {
    abas.forEach((a) => {
      const sel = a === aba;
      a.setAttribute("aria-selected", String(sel));
      a.tabIndex = sel ? 0 : -1;
      $("#" + a.getAttribute("aria-controls")).hidden = !sel;
    });
    aba.focus();
  };
  abas.forEach((a, i) => {
    a.addEventListener("click", () => ativar(a));
    a.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") ativar(abas[(i + 1) % abas.length]);
      if (e.key === "ArrowLeft") ativar(abas[(i - 1 + abas.length) % abas.length]);
    });
  });
}

function ligarPainel() {
  ligarAbas();
  $("[data-busca]").addEventListener("input", renderLista);
  $("[data-filtro-status]").addEventListener("change", renderLista);
  $("[data-novo]").addEventListener("click", () => abrirEditor(null));
  $("[data-lista-admin]").addEventListener("click", acaoNaLista);
  $$("[data-fechar]").forEach((b) => b.addEventListener("click", () => $("[data-dialogo]").close()));
  $("[data-foto]").addEventListener("change", escolherFoto);
  $("[data-form-animal]").addEventListener("submit", salvarAnimal);
  $("[data-form-textos]").addEventListener("submit", salvarTextos);
}

/* ---------- Lista de animais ---------- */
async function carregarLista() {
  const { data, error } = await sb.from("animais").select("*").order("adotado").order("ordem").order("criado_em");
  if (error) return avisar("Não foi possível carregar os animais: " + error.message);
  animais = data;
  renderLista();
}

function renderLista() {
  const busca = $("[data-busca]").value.trim().toLowerCase();
  const filtro = $("[data-filtro-status]").value;
  const lista = animais.filter((a) => {
    if (busca && !a.nome.toLowerCase().includes(busca)) return false;
    if (filtro === "adocao") return !a.adotado && a.disponivel_adocao;
    if (filtro === "padrinho") return !a.adotado && a.precisa_padrinho;
    if (filtro === "adotados") return a.adotado;
    return true;
  });

  $("[data-contagem-admin]").textContent =
    lista.length === 1 ? "1 animal" : `${lista.length} animais`;

  $("[data-lista-admin]").innerHTML = lista.length
    ? lista
        .map(
          (a) => `
      <li class="card admin-item${a.adotado ? " admin-item--adotado" : ""}" data-id="${escHtml(a.id)}">
        <img src="${escHtml(a.foto || "assets/img/brand/logo.webp")}" alt="" width="96" height="72" loading="lazy">
        <div class="admin-item__info">
          <h3>${escHtml(a.nome)}</h3>
          <p>${ROTULO.especie[a.especie]} · porte ${ROTULO.porte[a.porte]} · ${escHtml(a.idade_texto || "")}</p>
          <div class="admin-item__selos">
            ${a.adotado ? '<span class="selo">Adotado</span>' : ""}
            ${!a.adotado && a.disponivel_adocao ? '<span class="selo selo--claro">Para adoção</span>' : ""}
            ${!a.adotado && a.precisa_padrinho ? '<span class="selo selo--claro">Precisa de padrinho</span>' : ""}
            ${a.exemplo ? '<span class="selo selo--exemplo">Exemplo</span>' : ""}
          </div>
        </div>
        <div class="admin-item__acoes">
          <button class="btn btn--contorno btn--pequeno" type="button" data-acao="editar">Editar<span class="visualmente-oculto"> ${escHtml(a.nome)}</span></button>
          <button class="btn btn--pequeno" type="button" data-acao="adotado">${a.adotado ? "Voltar para adoção" : "Marcar adotado"}<span class="visualmente-oculto"> ${escHtml(a.nome)}</span></button>
          <button class="admin-remover" type="button" data-acao="remover">Remover<span class="visualmente-oculto"> ${escHtml(a.nome)}</span></button>
        </div>
      </li>`
        )
        .join("")
    : '<li class="admin-vazio">Nenhum animal encontrado.</li>';
}

async function acaoNaLista(e) {
  const botao = e.target.closest("[data-acao]");
  if (!botao) return;
  const id = botao.closest("[data-id]").dataset.id;
  const a = animais.find((x) => x.id === id);

  if (botao.dataset.acao === "editar") return abrirEditor(a);

  if (botao.dataset.acao === "adotado") {
    const adotado = !a.adotado;
    botao.disabled = true;
    const { error } = await sb
      .from("animais")
      .update({ adotado, adotado_em: adotado ? new Date().toISOString().slice(0, 10) : null })
      .eq("id", id);
    if (error) return avisar("Não foi possível salvar: " + error.message);
    avisar(adotado ? `${a.nome} marcado como adotado. Que alegria!` : `${a.nome} voltou para a lista de adoção.`);
    return carregarLista();
  }

  if (botao.dataset.acao === "remover") {
    if (!confirm(`Remover ${a.nome} do site? Isso não pode ser desfeito. Se ele foi adotado, prefira "Marcar adotado".`)) return;
    const { error } = await sb.from("animais").delete().eq("id", id);
    if (error) return avisar("Não foi possível remover: " + error.message);
    const caminho = caminhoNoStorage(a.foto);
    if (caminho) await sb.storage.from("fotos").remove([caminho]);
    avisar(`${a.nome} foi removido.`);
    carregarLista();
  }
}

/* ---------- Editor ---------- */
function abrirEditor(a) {
  const form = $("[data-form-animal]");
  form.reset();
  editandoId = a ? a.id : null;
  fotoNova = null;
  $("[data-status-animal]").textContent = "";
  $("[data-dialogo-titulo]").textContent = a ? `Editar ${a.nome}` : "Novo animal";

  const padrao = { especie: "cachorro", sexo: "macho", porte: "medio", idade: "adulto", disponivel_adocao: true, vacinado: true, vermifugado: true };
  const dados = a || padrao;
  ["nome", "idade_texto", "historia", "alt", "especie", "sexo", "porte", "idade"].forEach((c) => {
    if (dados[c] != null) form.elements[c].value = dados[c];
  });
  form.elements.temperamento.value = (dados.temperamento || []).join(", ");
  ["castrado", "vacinado", "vermifugado", "disponivel_adocao", "precisa_padrinho"].forEach((c) => {
    form.elements[c].checked = Boolean(dados[c]);
  });

  const preview = $("[data-preview]");
  preview.hidden = !a?.foto;
  if (a?.foto) preview.src = a.foto;

  $("[data-dialogo]").showModal();
  form.elements.nome.focus();
}

/* Reduz para no máximo 1200px e converte para WebP (economiza o 1 GB grátis) */
async function comprimirFoto(arquivo) {
  const bitmap = await createImageBitmap(arquivo);
  const escala = Math.min(1, 1200 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * escala);
  canvas.height = Math.round(bitmap.height * escala);
  canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return new Promise((ok) => canvas.toBlob(ok, "image/webp", 0.8));
}

async function escolherFoto(e) {
  const arquivo = e.target.files[0];
  if (!arquivo) return;
  const st = $("[data-status-animal]");
  status(st, "Preparando a foto…");
  try {
    fotoNova = await comprimirFoto(arquivo);
    const preview = $("[data-preview]");
    preview.src = URL.createObjectURL(fotoNova);
    preview.hidden = false;
    status(st, `Foto pronta (${Math.round(fotoNova.size / 1024)} KB). Ela é enviada quando você salvar.`);
  } catch {
    fotoNova = null;
    status(st, "Não consegui ler essa imagem. Tente uma foto JPG ou PNG.", "erro");
  }
}

function caminhoNoStorage(url) {
  const marca = "/storage/v1/object/public/fotos/";
  return url && url.includes(marca) ? url.split(marca)[1] : null;
}

function gerarId(nome) {
  const base = nome
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "animal";
  let id = base;
  for (let n = 2; animais.some((a) => a.id === id); n++) id = `${base}-${n}`;
  return id;
}

async function salvarAnimal(e) {
  e.preventDefault();
  const form = e.currentTarget;
  const st = $("[data-status-animal]");
  const obrigatorios = ["nome", "idade_texto", "historia"].map((c) => form.elements[c]);
  const vazio = obrigatorios.find((c) => !c.value.trim());
  obrigatorios.forEach((c) => c.setAttribute("aria-invalid", String(!c.value.trim())));
  if (vazio) {
    status(st, "Preencha nome, idade e história.", "erro");
    return vazio.focus();
  }

  const botao = $("[data-salvar]");
  botao.disabled = true;
  botao.textContent = "Salvando…";

  try {
    const id = editandoId || gerarId(form.elements.nome.value);
    const registro = {
      nome: form.elements.nome.value.trim(),
      idade_texto: form.elements.idade_texto.value.trim(),
      historia: form.elements.historia.value.trim(),
      alt: form.elements.alt.value.trim() || null,
      especie: form.elements.especie.value,
      sexo: form.elements.sexo.value,
      porte: form.elements.porte.value,
      idade: form.elements.idade.value,
      temperamento: form.elements.temperamento.value.split(",").map((t) => t.trim()).filter(Boolean),
      castrado: form.elements.castrado.checked,
      vacinado: form.elements.vacinado.checked,
      vermifugado: form.elements.vermifugado.checked,
      disponivel_adocao: form.elements.disponivel_adocao.checked,
      precisa_padrinho: form.elements.precisa_padrinho.checked,
      exemplo: false,
    };

    if (fotoNova) {
      const caminho = `animais/${id}-${Date.now()}.webp`;
      const { error } = await sb.storage.from("fotos").upload(caminho, fotoNova, { contentType: "image/webp" });
      if (error) throw error;
      const url = sb.storage.from("fotos").getPublicUrl(caminho).data.publicUrl;
      const antiga = caminhoNoStorage(animais.find((a) => a.id === id)?.foto);
      registro.foto = url;
      registro.foto_grande = url;
      if (antiga) await sb.storage.from("fotos").remove([antiga]);
    }

    const { error } = editandoId
      ? await sb.from("animais").update(registro).eq("id", id)
      : await sb.from("animais").insert({ id, ordem: animais.length * 10 + 10, ...registro });
    if (error) throw error;

    $("[data-dialogo]").close();
    avisar(editandoId ? `${registro.nome} atualizado.` : `${registro.nome} cadastrado! Já aparece no site.`);
    carregarLista();
  } catch (err) {
    console.error(err);
    status(st, "Não foi possível salvar: " + (err.message || err), "erro");
  } finally {
    botao.disabled = false;
    botao.textContent = "Salvar animal";
  }
}

/* ---------- Textos e números ---------- */
async function carregarTextos() {
  const { data, error } = await sb.from("conteudo").select("*").order("ordem");
  if (error) return avisar("Não foi possível carregar os textos: " + error.message);
  const grupos = Object.groupBy
    ? Object.groupBy(data, (l) => l.grupo)
    : data.reduce((g, l) => ((g[l.grupo] ||= []).push(l), g), {});

  $("[data-campos-textos]").innerHTML = Object.entries(grupos)
    .map(
      ([grupo, linhas]) => `
    <fieldset class="admin-grupo">
      <legend>${escHtml(grupo)}</legend>
      <div class="admin-grupo__campos">
        ${linhas
          .map(
            (l) => `
          <div class="campo">
            <label for="t-${escHtml(l.chave)}">${escHtml(l.rotulo)}</label>
            <input id="t-${escHtml(l.chave)}" name="${escHtml(l.chave)}" value="${escHtml(l.valor)}" data-original="${escHtml(l.valor)}"${l.chave.startsWith("contador_") ? ' inputmode="numeric"' : ""}>
          </div>`
          )
          .join("")}
      </div>
    </fieldset>`
    )
    .join("");
}

async function salvarTextos(e) {
  e.preventDefault();
  const form = e.currentTarget;
  const st = $(".form__status", form);
  const alterados = $$("input[name]", form).filter((i) => i.value.trim() !== i.dataset.original);
  if (!alterados.length) return status(st, "Nada mudou desde a última vez.");

  const botao = $('[type="submit"]', form);
  botao.disabled = true;
  const resultados = await Promise.all(
    alterados.map((i) => sb.from("conteudo").update({ valor: i.value.trim() }).eq("chave", i.name))
  );
  botao.disabled = false;
  const erro = resultados.find((r) => r.error);
  if (erro) return status(st, "Não foi possível salvar: " + erro.error.message, "erro");
  alterados.forEach((i) => (i.dataset.original = i.value.trim()));
  status(st, `${alterados.length === 1 ? "1 texto salvo" : `${alterados.length} textos salvos`}. O site já mostra a versão nova.`);
}

document.addEventListener("DOMContentLoaded", iniciar);
