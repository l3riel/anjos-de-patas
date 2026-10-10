# ONG Anjos de Patas

Site institucional da ONG Anjos de Patas, que resgata, trata e encaminha para adoção cães e gatos de rua em Matipó - MG.

Projeto desenvolvido por alunos do 2º período de Ciência da Computação - Univértix.

**Site no ar:** https://l3riel.github.io/anjos-de-patas/

## Arquitetura

```
Navegador ──► GitHub Pages (HTML, CSS, JS estáticos)
    │
    ├──► Supabase REST  (lê animais e textos: tabelas animais e conteudo)
    └──► admin.html ──► Supabase Auth + banco + Storage (grava, com RLS)
```

- **Front-end:** HTML, CSS e JavaScript puros, sem build. Todos os caminhos são relativos (`css/base.css`, `doe.html`), então o site funciona no GitHub Pages (em subpasta), na Vercel, no Cloudflare Pages ou em qualquer hospedagem estática.
- **Back-end:** [Supabase](https://supabase.com) no plano gratuito: PostgreSQL, login do painel, políticas de acesso (RLS) e armazenamento de fotos (1 GB). O site público lê pela API REST; o painel `admin.html` usa o `supabase-js`.
- **Sem Supabase configurado, nada quebra:** o site lê `data/animais.json` e mantém os textos do HTML. Como configurar: [`supabase/LEIA-ME.md`](supabase/LEIA-ME.md).

### Por que não Next.js?

O estudo de custos ([`docs/custos-e-arquitetura.md`](docs/custos-e-arquitetura.md)) recomenda Next.js + Supabase. Mantivemos o HTML puro com o mesmo Supabase porque: o site já está publicado no GitHub Pages (que não roda Next.js com servidor), o painel e as atualizações em tempo real funcionam igual, e quem mantém o site não precisa aprender React nem um processo de build. Se um dia o site precisar de renderização no servidor (por exemplo, SEO por animal), a migração reaproveita o mesmo banco.

## Painel da ONG

`admin.html` (fora do menu, com `noindex`). Depois de entrar com e-mail e senha, a equipe pode:

- cadastrar, editar e remover animais, com upload de foto (convertida para WebP no navegador);
- marcar um animal como adotado (ele sai do site, mas fica no histórico);
- editar textos e números: chave Pix, dados bancários, contadores, ano de fundação, WhatsApp e e-mail.

As mudanças aparecem no site no próximo carregamento da página, sem deploy.

## Custos

| Item | Serviço | Custo |
| --- | --- | --- |
| Hospedagem | GitHub Pages (ou Cloudflare Pages / Vercel) | Grátis |
| Banco, login e fotos | Supabase (plano gratuito) | Grátis |
| Domínio | Registro.br | cerca de R$ 40/ano |

**Total: cerca de R$ 40 por ano**, só o domínio. Doações por Pix não precisam de gateway de pagamento: o site só mostra a chave e o QR Code.

### Domínio

| Opção | Custo/ano | Requisito |
| --- | --- | --- |
| anjosdepatas.org.br | R$ 40 | CNPJ de ONG/associação e comprovação de entidade sem fins lucrativos |
| anjosdepatas.com.br | R$ 40 | CPF ou CNPJ |
| anjosdepatas.org | US$ 10 a 15 | Nenhum |

O `.org.br` é o ideal; sem CNPJ, use `.com.br` no CPF de um responsável. **Registre no nome da ONG ou de um responsável dela, nunca no de quem desenvolveu.** Ao trocar o domínio, atualize as URLs do Open Graph, do `canonical`, do `sitemap.xml` e do `robots.txt`.

### Cuidados com os planos gratuitos

- **O Supabase pausa o projeto após cerca de 7 dias sem acesso.** O workflow `.github/workflows/manter-supabase-ativo.yml` faz uma consulta a cada 3 dias. O GitHub desliga workflows agendados após 60 dias sem commits no repositório; se isso acontecer, reative em **Actions**.
- **O plano Hobby da Vercel é para uso não comercial.** Uma ONG geralmente se encaixa, mas o GitHub Pages e o Cloudflare Pages não têm essa restrição.
- **1 GB de fotos:** o painel comprime cada foto para cerca de 100 a 200 KB, o que dá espaço para milhares de fotos.

## Publicação

O GitHub Pages publica automaticamente a branch `main` a cada `git push` (leva 1 ou 2 minutos). O arquivo `.nojekyll` desliga o processamento Jekyll, que não é usado.

## Rodar localmente

```bash
npx serve -l 4173 .
```

Abra http://localhost:4173. Use um servidor (e não abrir o arquivo direto) porque as páginas carregam dados com `fetch`.

## Onde editar

| O quê | Onde |
|---|---|
| Animais, textos e números (com Supabase) | Painel `admin.html` |
| Animais para adoção e apadrinhamento (sem Supabase) | `data/animais.json` |
| Histórias de superação e resgates | `data/historias.json` |
| Menu, rodapé, WhatsApp, Instagram, e-mail, chaves do Supabase | `js/layout.js` (objeto `ONG` no topo) |
| Cores, fontes, sombras | `css/base.css` (`:root`) |

**Sem formulários:** todo contato (adoção, apadrinhamento, doação, voluntariado, denúncia) abre o WhatsApp com a mensagem pronta (`data-whatsapp="mensagem"` no link). Com `ONG.whatsappNumero` vazio, os links abrem o grupo da ONG.

**Dados que faltam não aparecem para o visitante:** blocos com `data-requer="chave"` ficam ocultos até o dado ser cadastrado no painel; `data-sem="chave"` mostra uma alternativa (ex.: "Peça a chave Pix pelo WhatsApp") enquanto isso. Pendências ficam marcadas em comentários no HTML. Imagens com o comentário `TROCAR` são placeholders (Unsplash) e devem ser substituídas por fotos reais em `assets/img/`.

### Campos de um animal (`data/animais.json`)

```jsonc
{
  "id": "thor",                     // vira a URL: animal.html?id=thor
  "nome": "Thor",
  "especie": "cachorro",            // cachorro | gato
  "sexo": "macho",                  // macho | femea
  "porte": "medio",                 // pequeno | medio | grande
  "idade": "adulto",                // filhote | adulto | idoso
  "idadeTexto": "3 anos",
  "foto": "assets/img/fotos/thor.webp",   // caminho relativo, sem "/" no início
  "castrado": true,
  "vacinado": true,
  "disponivelAdocao": true,
  "precisaPadrinho": false,
  "historia": "Texto curto..."
}
```

## Estrutura

```
index.html, doe.html, adote.html, animal.html, apadrinhe.html,
resgates.html, quem-somos.html, 404.html
admin.html                       painel da ONG
css/   base.css (tokens), components.css, pages.css, admin.css
js/    layout.js, dados.js, main.js, animais.js, form.js, admin.js
data/  animais.json, historias.json  (reserva quando não há Supabase)
supabase/  migrations/ (tabelas e RLS), seed.sql, LEIA-ME.md
docs/  custos-e-arquitetura.md
assets/img/  brand, decor, icons, fotos, equipe
```
