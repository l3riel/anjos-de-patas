# Site Anjos de Patas — Custos e Arquitetura

Oct 8, 2026 · @Gabriel

> Estudo que orientou a arquitetura do site. A decisão final está no [README](../README.md#por-que-não-nextjs): mantivemos o HTML puro no GitHub Pages com o Supabase recomendado aqui.

## Resumo

O site pode funcionar gastando apenas com o domínio, cerca de **R$ 40/ano**. Hospedagem, banco de dados, login do admin e armazenamento de fotos cabem em planos gratuitos.

## Domínio

O .org.br é o ideal, mas exige que a ONG tenha CNPJ e comprove ser sem fins lucrativos; o domínio fica reservado por duas semanas aguardando os documentos ([fonte](https://support.openprovider.eu/hc/en-us/articles/14165120329106--org-br)).

| Opção | Custo/ano | Requisito |
| --- | --- | --- |
| anjosdepatas.org.br | R$ 40 (Registro.br) | CNPJ de ONG/associação |
| anjosdepatas.com.br | R$ 40 | CPF ou CNPJ |
| anjosdepatas.org | \~US$ 10–15 | Nenhum |

Preços do Registro.br segundo [este guia](https://guiaferramentasdigitais.com.br/guias/como-registrar-dominio-brasil/). Sem CNPJ, use .com.br no CPF de um responsável. O domínio deve ficar no nome da ONG ou de um responsável dela, não no do desenvolvedor.

## Arquitetura recomendada

**Next.js + Supabase**, hospedado na Vercel ou no Cloudflare Pages, com custo zero.

- **Supabase (grátis):** PostgreSQL, login do admin e armazenamento de fotos (1 GB)
- **Vercel ou Cloudflare Pages (grátis):** hospedagem do site
- **Página /admin protegida por login**, onde a ONG pode:
  - cadastrar, editar e remover animais com upload de fotos
  - marcar um animal como adotado
  - editar textos e contadores

As alterações aparecem em tempo real: o site lê o banco a cada acesso, sem precisar de novo deploy. É backend de verdade: banco relacional, autenticação, políticas de acesso (RLS) e API.

## Alternativas

| Opção | Admin | Tempo real | Aprendizado de backend |
| --- | --- | --- | --- |
| Next.js + Supabase (recomendada) | Feito por você | Sim | Alto |
| Sanity (CMS headless, plano grátis) | Painel pronto | Sim | Baixo |
| Decap CMS | Salva no GitHub | Não (rebuild de \~1 min) | Baixo |
| Firebase | Feito por você | Sim | Médio (NoSQL) |

## Cuidados

- **Supabase grátis pausa após \~7 dias sem acesso.** Um site com visitas não costuma ser afetado; um ping agendado evita o problema.
- **O plano Hobby da Vercel é para uso não comercial.** ONG geralmente se encaixa, mas o Cloudflare Pages não tem essa restrição.
- **Comprimir fotos antes do upload** (ex.: converter para WebP no admin) para não estourar 1 GB.
- **Doações via Pix** dispensam gateway: basta exibir a chave e o QR code, sem custo.
