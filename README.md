# ONG Anjos de Patas

Site institucional da ONG Anjos de Patas, que resgata, trata e encaminha para adoção cães e gatos de rua em Matipó - MG.

O site foi produzido pelos alunos do 4º período de Ciência da Computação da Univértix.

**Site no ar:** https://anjos-de-patas-bay.vercel.app

## Arquitetura

```
Navegador ──► Vercel (HTML, CSS, JS estáticos)
                │
                └──► data/*.json (animais, histórias e textos)
```

- **HTML, CSS e JavaScript puros, sem build.** Todos os caminhos são relativos (`css/base.css`, `doe.html`).
- **Sem banco de dados:** os animais, as histórias e os textos editáveis ficam em arquivos JSON na pasta `data/`.

## Funcionalidades

| Funcionalidade | Onde |
| --- | --- |
| Guia "Achei um animal" (ferido, filhotes, perdido, maus-tratos, castração, devolução) | `ajuda.html` + atalhos na home |
| Pix com valor: a pessoa digita quanto quer doar e o site gera o QR Code e o copia e cola no navegador | `doe.html#lojinha`, `js/pix.js` |
| Comparador antes/depois arrastável | `resgates.html` |
| Selo "Adoção em andamento" e "Precisa de padrinho" | cards e página do animal |
| Contato, adoção e apadrinhamento pelo Instagram e pelo Facebook da ONG | todo o site + botão flutuante |
| Carrossel com pausa e acessibilidade (teclado, leitor de tela, movimento reduzido) | todo o site |

O Pix usa o padrão BR Code do Banco Central (o mesmo do "copia e cola"), montado em `js/pix.js` com CRC16. Não passa por gateway, então não há taxa. A chave fica em `pix_chave`, em `data/conteudo.json`.

## Publicação

O repositório está ligado à [Vercel](https://vercel.com): cada `git push` na branch `main` publica o site sozinho em cerca de 1 minuto. As configurações (URLs sem `.html` e cache) estão em `vercel.json`.

Ao trocar o domínio, atualize as URLs do Open Graph, do `canonical`, do `sitemap.xml` e do `robots.txt`.

## Rodar localmente

```bash
npx serve -l 4173 .
```

Abra http://localhost:4173. Use um servidor (e não abrir o arquivo direto) porque as páginas carregam dados com `fetch`.

## Onde editar

| O quê | Onde |
|---|---|
| Animais para adoção e apadrinhamento | `data/animais.json` |
| Chave Pix, CNPJ e ano de fundação | `data/conteudo.json` |
| Histórias de superação e resgates | `data/historias.json` |
| Menu, rodapé, Instagram e Facebook | `js/layout.js` (objeto `ONG` no topo) |
| Cores, fontes, sombras | `css/base.css` (`:root`) |

**Sem formulários:** todo contato (adoção, apadrinhamento, doação, voluntariado, denúncia) leva ao Instagram da ONG (`ONG.instagram`), e cada botão ganha um par para o Facebook (`ONG.facebook`, função `adicionarFacebook` em `js/layout.js`). A ONG não tem WhatsApp próprio; o link do grupo fica na bio do Instagram.

**Dados que faltam não aparecem:** blocos com `data-requer="chave"` só aparecem quando a chave está preenchida em `data/conteudo.json`.

### Campos de um animal (`data/animais.json`)

```jsonc
{
  "id": "hulk",                     // vira a URL: animal.html?id=hulk
  "nome": "Hulk",                   // vazio = cachorro sem nome
  "especie": "cachorro",            // cachorro | gato
  "sexo": "macho",                  // macho | femea (só ajusta "este/esta")
  "porte": null,                    // pequeno | medio | grande | null
  "idade": null,                    // filhote | adulto | idoso | null
  "foto": "assets/img/fotos/hulk-600.webp",   // caminho relativo, sem "/" no início
  "castrado": false,
  "vacinado": false,
  "disponivelAdocao": true,
  "precisaPadrinho": true,
  "historia": "Texto curto..."
}
```

Nos cards de adoção o nome não aparece; ele fica nas histórias, na página do animal e no Apadrinhe.

## Estrutura

```
index.html, doe.html, adote.html, animal.html, apadrinhe.html,
ajuda.html, resgates.html, quem-somos.html, 404.html
css/   base.css (tokens), components.css, pages.css
js/    layout.js, dados.js, main.js, animais.js, pix.js
data/  animais.json, historias.json, conteudo.json
assets/img/  brand, decor, icons, fotos, equipe
vercel.json
```
