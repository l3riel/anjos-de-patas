# ONG Anjos de Patas

Site institucional da ONG Anjos de Patas, que resgata, trata e encaminha para adoção cães e gatos de rua em Matipó - MG.

Projeto desenvolvido por alunos do 2º período de Ciência da Computação - Univértix.

## Stack

HTML, CSS e JavaScript puros, sem build. O deploy é estático na Vercel (`vercel.json` com `cleanUrls`, então `doe.html` responde em `/doe`).

## Rodar localmente

```bash
npx serve -l 4173 .
```

Abra http://localhost:4173. Use um servidor (e não abrir o arquivo direto) porque as páginas carregam `data/*.json` com `fetch`.

## Onde editar

| O quê | Arquivo |
|---|---|
| Animais para adoção e apadrinhamento | `data/animais.json` |
| Histórias de superação e resgates | `data/historias.json` |
| Menu, rodapé, WhatsApp, Instagram, e-mail | `js/layout.js` (objeto `ONG` no topo) |
| Cores, fontes, sombras | `css/base.css` (`:root`) |

Textos marcados com **[PREENCHER]** dependem de informação real da ONG. Imagens com o comentário `TROCAR` são placeholders (Unsplash) e devem ser substituídas por fotos reais em `assets/img/`.

### Campos de um animal (`data/animais.json`)

```json
{
  "id": "thor",                     // vira a URL: /animal?id=thor
  "nome": "Thor",
  "especie": "cachorro",            // cachorro | gato
  "sexo": "macho",                  // macho | femea
  "porte": "medio",                 // pequeno | medio | grande
  "idade": "adulto",                // filhote | adulto | idoso
  "idadeTexto": "3 anos",
  "foto": "assets/img/fotos/thor.webp",
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
css/   base.css (tokens), components.css, pages.css
js/    layout.js, main.js, animais.js, form.js
data/  animais.json, historias.json
assets/img/  brand, decor, icons, fotos, equipe
```
