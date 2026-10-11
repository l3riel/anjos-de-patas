/* =========================================================
   Lojinha de donativos: gera o Pix "copia e cola" (BR Code)
   e o QR Code no próprio navegador, sem custo e sem servidor.
   A chave vem de pix_chave (painel do Supabase ou data/conteudo.json).
   ========================================================= */

/* ---------- BR Code (padrão EMV do Banco Central) ---------- */
function campoPix(id, valor) {
  return id + String(valor.length).padStart(2, "0") + valor;
}

// CRC16-CCITT (polinômio 0x1021, início 0xFFFF), exigido no campo 63
function crc16(texto) {
  let crc = 0xffff;
  for (const c of texto) {
    crc ^= c.charCodeAt(0) << 8;
    for (let i = 0; i < 8; i++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

// Sem acento e em maiúsculas: alguns bancos recusam caracteres especiais
function semAcento(texto, limite) {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Za-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .toUpperCase()
    .slice(0, limite)
    .trim();
}

// CNPJ/CPF digitados com pontuação viram só números; e-mail, +55... e chave aleatória ficam como estão
function normalizarChave(chave) {
  const c = chave.trim();
  if (/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(c) || /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(c)) return c.replace(/\D/g, "");
  return c;
}

function gerarPix({ chave, nome, cidade, valor }) {
  const conta = campoPix("00", "br.gov.bcb.pix") + campoPix("01", normalizarChave(chave));
  let payload =
    campoPix("00", "01") +
    campoPix("26", conta) +
    campoPix("52", "0000") +
    campoPix("53", "986") +
    (valor ? campoPix("54", Number(valor).toFixed(2)) : "") +
    campoPix("58", "BR") +
    campoPix("59", semAcento(nome, 25)) +
    campoPix("60", semAcento(cidade, 15)) +
    campoPix("62", campoPix("05", "***")) +
    "6304";
  return payload + crc16(payload);
}

/* ---------- QR Code (biblioteca carregada só quando precisa) ---------- */
let promessaQr;
function carregarQr() {
  promessaQr ??= new Promise((ok, falha) => {
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js";
    s.onload = () => ok(window.qrcode);
    s.onerror = falha;
    document.head.append(s);
  });
  return promessaQr;
}

/* ---------- Interface da lojinha ---------- */
const formatoReal = (v) => Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

async function iniciarLojinha() {
  const raiz = document.querySelector("[data-lojinha]");
  if (!raiz) return;
  const painel = raiz.querySelector("[data-lojinha-painel]");
  const outro = raiz.querySelector("[data-outro-valor]");
  const valores = await carregarConteudo();
  const chave = valores.pix_chave;
  const nome = valores.pix_favorecido || ONG.razaoSocial;

  async function mostrar(item, valor) {
    raiz.querySelectorAll("[data-item]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.item === item)));
    const descricao = valor ? `${item} (${formatoReal(valor)})` : item;
    const msgComprovante = `Olá! Fiz uma doação para a Anjos de Patas: ${descricao}. Segue o comprovante.`;
    painel.hidden = false;
    // No celular o painel fica abaixo dos itens: leva a pessoa até ele
    const irAoPainel = () =>
      painel.scrollIntoView({ block: "nearest", behavior: reduzirMovimento.matches ? "auto" : "smooth" });

    if (!chave) {
      painel.innerHTML = `
        <p class="lojinha__escolha">Você escolheu: <strong>${descricao}</strong></p>
        <p>A chave Pix ainda não está publicada no site. A equipe envia pelo WhatsApp na hora.</p>
        <a class="btn" href="${linkWhatsApp(`Olá! Quero doar ${descricao} para a Anjos de Patas. Pode me passar a chave Pix?`)}" target="_blank" rel="noopener">${icone("whatsapp")}Pedir a chave Pix</a>`;
      irAoPainel();
      return;
    }

    const codigo = gerarPix({ chave, nome, cidade: "Matipo", valor });
    painel.innerHTML = `
      <div class="lojinha__qr" data-qr aria-hidden="true"></div>
      <div class="lojinha__pagar">
        <p class="lojinha__escolha">Você escolheu: <strong>${descricao}</strong></p>
        <ol class="lojinha__passos">
          <li>No app do banco, escolha <strong>Pix copia e cola</strong> (ou leia o QR Code).</li>
          <li>Cole o código abaixo e confirme o pagamento para <strong>${nome}</strong>.</li>
          <li>Mande o comprovante pelo WhatsApp, se quiser receber o agradecimento.</li>
        </ol>
        <label class="visualmente-oculto" for="codigo-pix">Código Pix copia e cola</label>
        <textarea id="codigo-pix" class="lojinha__codigo" readonly rows="3">${codigo}</textarea>
        <div class="grupo-botoes">
          <button class="btn" type="button" data-copiar-pix>${icone("copiar")}Copiar código Pix</button>
          <a class="btn btn--contorno" href="${linkWhatsApp(msgComprovante)}" target="_blank" rel="noopener">${icone("whatsapp")}Enviar comprovante</a>
        </div>
        <p class="form__status" role="status" aria-live="polite"></p>
      </div>`;
    irAoPainel();

    painel.querySelector("[data-copiar-pix]").addEventListener("click", async () => {
      const st = painel.querySelector("[role=status]");
      const campo = painel.querySelector("#codigo-pix");
      try {
        await navigator.clipboard.writeText(codigo);
        st.className = "form__status form__status--ok";
        st.textContent = "Código copiado! Agora é só colar no app do banco.";
      } catch {
        campo.select();
        st.className = "form__status form__status--ok";
        st.textContent = "Código selecionado. Use Ctrl+C (ou segure e copie).";
      }
    });

    try {
      const qrcode = await carregarQr();
      const qr = qrcode(0, "M");
      qr.addData(codigo);
      qr.make();
      painel.querySelector("[data-qr]").innerHTML = `<img src="${qr.createDataURL(6, 2)}" alt="" width="220" height="220">`;
    } catch {
      painel.querySelector("[data-qr]").remove(); // sem internet para a biblioteca: fica só o copia e cola
    }
  }

  raiz.querySelectorAll("[data-item]").forEach((botao) =>
    botao.addEventListener("click", () => {
      if (botao.dataset.valor === "outro") {
        outro.hidden = false;
        outro.querySelector("input").focus();
        return;
      }
      outro.hidden = true;
      mostrar(botao.dataset.item, botao.dataset.valor);
    })
  );

  outro.addEventListener("submit", (e) => {
    e.preventDefault();
    const v = Number(String(outro.elements.valor.value).replace(",", "."));
    if (!(v >= 1)) {
      outro.elements.valor.setAttribute("aria-invalid", "true");
      outro.elements.valor.focus();
      return;
    }
    outro.elements.valor.removeAttribute("aria-invalid");
    mostrar("Doação livre", v.toFixed(2));
  });
}

document.addEventListener("DOMContentLoaded", iniciarLojinha);
