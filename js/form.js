/* =========================================================
   Formulários: validação acessível e envio
   Ordem de envio: ONG.formEndpoint (Formspree etc.) →
   WhatsApp com a mensagem pronta → e-mail (mailto)
   ========================================================= */

const MENSAGENS_ERRO = {
  valueMissing: () => "Preencha este campo.",
  typeMismatch: () => "Confira o formato. Ex.: nome@email.com",
  patternMismatch: () => "Use DDD + número. Ex.: (31) 99999-9999",
  tooShort: (rotulo, el) => `Escreva pelo menos ${el.minLength} caracteres.`,
};

function rotuloDo(campo) {
  const label = campo.closest(".campo")?.querySelector("label, legend");
  return label ? label.textContent.replace("*", "").trim().toLowerCase() : "obrigatório";
}

function validarCampo(campo) {
  const erro = document.getElementById(campo.getAttribute("aria-describedby")?.split(" ").find((id) => id.endsWith("-erro")));
  const v = campo.validity;
  let msg = "";
  if (!v.valid && campo.type === "checkbox") {
    msg = "Marque esta opção para continuar.";
  } else if (!v.valid && campo.type === "radio") {
    msg = "Escolha uma das opções.";
  } else if (!v.valid) {
    const tipo = Object.keys(MENSAGENS_ERRO).find((k) => v[k]);
    msg = tipo ? MENSAGENS_ERRO[tipo](rotuloDo(campo), campo) : "Confira este campo.";
  }
  const grupo = campo.type === "radio" ? campo.form.querySelectorAll(`[name="${campo.name}"]`) : [campo];
  grupo.forEach((c) => c.setAttribute("aria-invalid", msg ? "true" : "false"));
  if (erro) erro.textContent = msg;
  return !msg;
}

/* Máscara simples de telefone brasileiro */
function mascararTelefone(campo) {
  campo.addEventListener("input", () => {
    const d = campo.value.replace(/\D/g, "").slice(0, 11);
    let f = d;
    if (d.length > 2) f = `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length > 7) f = `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`;
    campo.value = f;
  });
}

function montarMensagem(form) {
  const dados = new FormData(form);
  const titulo = form.dataset.titulo || "Mensagem pelo site";
  const linhas = [`*${titulo}*`];
  for (const [chave, valor] of dados) {
    if (!String(valor).trim() || chave.startsWith("_")) continue;
    const campo = form.elements[chave];
    const el = campo?.length && !campo.tagName ? campo[0] : campo;
    const rotulo = el?.closest(".campo")?.querySelector("label, legend")?.textContent.replace("*", "").trim() || chave;
    linhas.push(`${rotulo}: ${valor}`);
  }
  return linhas.join("\n");
}

async function enviar(form) {
  if (ONG.formEndpoint) {
    const r = await fetch(ONG.formEndpoint, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" },
    });
    if (!r.ok) throw new Error("Falha no envio");
    return "Mensagem enviada! A equipe da Anjos de Patas responde em até 2 dias úteis.";
  }
  const texto = montarMensagem(form);
  if (ONG.whatsappNumero) {
    window.open(linkWhatsApp(texto), "_blank", "noopener");
    return "Abrimos o WhatsApp com a sua mensagem pronta. É só tocar em enviar.";
  }
  location.href = `mailto:${ONG.email}?subject=${encodeURIComponent(form.dataset.titulo || "Contato pelo site")}&body=${encodeURIComponent(texto.replace(/\*/g, ""))}`;
  return "Abrimos o seu aplicativo de e-mail com a mensagem pronta. É só enviar.";
}

function iniciarFormulario(form) {
  const status = form.querySelector(".form__status");
  const botao = form.querySelector('[type="submit"]');
  // Um item por grupo de rádio, para não contar o mesmo erro várias vezes
  const vistos = new Set();
  const campos = [...form.querySelectorAll("input, select, textarea")].filter((c) => {
    if (!c.willValidate) return false;
    if (c.type !== "radio") return true;
    if (vistos.has(c.name)) return false;
    vistos.add(c.name);
    return true;
  });

  form.setAttribute("novalidate", "");
  form.querySelectorAll('input[type="tel"]').forEach(mascararTelefone);

  campos.forEach((c) => {
    const grupo = c.type === "radio" ? form.querySelectorAll(`[name="${c.name}"]`) : [c];
    grupo.forEach((el) => {
      el.addEventListener("blur", () => { if (el.value && !/radio|checkbox/.test(el.type)) validarCampo(c); });
      el.addEventListener("input", () => { if (c.getAttribute("aria-invalid") === "true") validarCampo(c); });
      el.addEventListener("change", () => { if (c.getAttribute("aria-invalid") === "true") validarCampo(c); });
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const invalidos = campos.filter((c) => !validarCampo(c));
    if (invalidos.length) {
      status.className = "form__status form__status--erro";
      status.textContent =
        invalidos.length === 1 ? "Falta corrigir 1 campo." : `Faltam corrigir ${invalidos.length} campos.`;
      invalidos[0].focus();
      return;
    }

    const textoBotao = botao.innerHTML;
    botao.disabled = true;
    botao.textContent = "Enviando…";
    try {
      const msg = await enviar(form);
      status.className = "form__status form__status--ok";
      status.textContent = msg;
      form.reset();
      form.querySelectorAll("[aria-invalid]").forEach((c) => c.removeAttribute("aria-invalid"));
    } catch (err) {
      console.error(err);
      status.className = "form__status form__status--erro";
      status.textContent = "Não conseguimos enviar agora. Tente de novo ou fale com a gente pelo WhatsApp.";
    } finally {
      botao.disabled = false;
      botao.innerHTML = textoBotao;
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("form[data-form]").forEach(iniciarFormulario);
});
