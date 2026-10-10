/* =========================================================
   Dados do site: Supabase quando configurado, JSON como reserva
   - Animais: tabela "animais" (ou data/animais.json)
   - Textos e números: tabela "conteudo", aplicada em [data-conteudo]
   Configure a URL e a chave anon no objeto ONG (js/layout.js).
   ========================================================= */

const supabaseAtivo = () => Boolean(ONG.supabaseUrl && ONG.supabaseAnonKey);

async function apiSupabase(caminho) {
  const r = await fetch(`${ONG.supabaseUrl}/rest/v1/${caminho}`, {
    headers: { apikey: ONG.supabaseAnonKey, Authorization: `Bearer ${ONG.supabaseAnonKey}` },
  });
  if (!r.ok) throw new Error(`Supabase respondeu ${r.status} em ${caminho}`);
  return r.json();
}

/* Linha do banco (snake_case) → formato usado pelo site (o mesmo do JSON) */
function animalDoBanco(l) {
  return {
    id: l.id,
    nome: l.nome,
    especie: l.especie,
    sexo: l.sexo,
    porte: l.porte,
    idade: l.idade,
    idadeTexto: l.idade_texto,
    foto: l.foto,
    fotoGrande: l.foto_grande,
    alt: l.alt,
    castrado: l.castrado,
    vacinado: l.vacinado,
    vermifugado: l.vermifugado,
    disponivelAdocao: l.disponivel_adocao,
    precisaPadrinho: l.precisa_padrinho,
    adotado: l.adotado,
    temperamento: l.temperamento || [],
    historia: l.historia,
    exemplo: l.exemplo,
  };
}

let promessaAnimais;
function carregarAnimais() {
  promessaAnimais ??= (async () => {
    if (supabaseAtivo()) {
      try {
        const linhas = await apiSupabase("animais?select=*&adotado=eq.false&order=ordem.asc,criado_em.asc");
        return linhas.map(animalDoBanco);
      } catch (e) {
        console.warn("Usando data/animais.json porque o Supabase falhou:", e);
      }
    }
    const r = await fetch("data/animais.json");
    if (!r.ok) throw new Error(`Erro ${r.status} ao carregar data/animais.json`);
    return (await r.json()).animais.filter((a) => !a.adotado);
  })();
  return promessaAnimais;
}

/* ---------- Textos e números editáveis pelo painel ---------- */
async function aplicarConteudo() {
  if (!supabaseAtivo()) return;
  let linhas;
  try {
    linhas = await apiSupabase("conteudo?select=chave,valor");
  } catch (e) {
    console.warn("Textos do Supabase indisponíveis, mantendo os do HTML:", e);
    return;
  }
  const valores = Object.fromEntries(linhas.filter((l) => l.valor.trim()).map((l) => [l.chave, l.valor.trim()]));

  document.querySelectorAll("[data-conteudo]").forEach((el) => {
    const valor = valores[el.dataset.conteudo];
    if (!valor) return;
    if ("contador" in el.dataset) {
      // Contadores: só números; a animação usa o data-contador atualizado
      const numero = valor.replace(/\D/g, "");
      if (!numero) return;
      el.dataset.contador = numero;
      el.textContent = Number(numero).toLocaleString("pt-BR");
    } else {
      el.textContent = valor;
    }
    el.classList.remove("preencher");
  });

  // data-requer="chave": só aparece quando o dado existe
  // data-sem="chave": alternativa mostrada enquanto o dado não existe
  document.querySelectorAll("[data-requer]").forEach((el) => {
    if (valores[el.dataset.requer]) el.hidden = false;
  });
  document.querySelectorAll("[data-sem]").forEach((el) => {
    if (valores[el.dataset.sem]) el.hidden = true;
  });

  if (valores.whatsapp_numero) {
    ONG.whatsappNumero = valores.whatsapp_numero.replace(/\D/g, "");
    aplicarLinksWhatsApp();
  }
  if (valores.email) {
    document.querySelectorAll("a[data-email]").forEach((a) => (a.href = `mailto:${valores.email}`));
    ONG.email = valores.email;
  }
}

document.addEventListener("DOMContentLoaded", aplicarConteudo);
