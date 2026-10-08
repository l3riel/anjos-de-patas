# Configurar o Supabase (banco, login e fotos)

O site funciona sem o Supabase, lendo `data/animais.json`. Com ele configurado, a ONG passa a cadastrar animais, marcar adoções e editar textos e números pelo painel `admin.html`, e as mudanças aparecem no site na hora, sem novo deploy.

Tudo cabe no plano gratuito: banco PostgreSQL, login e 1 GB de fotos.

## 1. Criar o projeto

1. Crie uma conta em <https://supabase.com>. Use um e-mail da ONG, não o pessoal de quem desenvolveu.
2. **New project**: nome `anjos-de-patas`, região **South America (São Paulo)**. Guarde a senha do banco num gerenciador de senhas.

## 2. Criar as tabelas

No menu **SQL Editor**, rode nesta ordem:

1. Todo o conteúdo de `supabase/migrations/20261008000000_inicial.sql`: cria as tabelas `animais`, `conteudo` e `admins`, as regras de acesso (RLS) e o bucket de fotos.
2. Todo o conteúdo de `supabase/seed.sql`: copia os animais de exemplo e cria os campos de texto editáveis.

> Quem usa a CLI pode trocar os dois passos por `npx supabase link` e `npx supabase db push`, rodando o seed em seguida.

## 3. Criar o usuário da ONG

1. **Authentication > Sign In / Providers**: desligue **Allow new users to sign up**. Assim ninguém cria conta sozinho.
2. **Authentication > Users > Add user > Create new user**: e-mail e senha de quem vai usar o painel. Marque **Auto Confirm User**.
3. No **SQL Editor**, dê permissão de administrador a esse e-mail:

```sql
insert into public.admins (user_id, email)
select id, email from auth.users where email = 'email-da-ong@exemplo.com';
```

Repita os passos 2 e 3 para cada voluntário que for usar o painel. Para tirar o acesso de alguém: `delete from public.admins where email = '...';`.

## 4. Conectar o site

1. **Project Settings > API**: copie a **Project URL** e a chave **anon public**.
2. Cole as duas no objeto `ONG`, no início de `js/layout.js`:

```js
supabaseUrl: "https://xxxxxxxx.supabase.co",
supabaseAnonKey: "eyJhbGciOi...",
```

3. Faça commit e push. Em 1 ou 2 minutos o GitHub Pages publica.

A chave **anon** pode ficar no código: ela é pública por design, e quem protege os dados são as regras RLS. Só administradores conseguem gravar. **Nunca** coloque a chave `service_role` no site nem no GitHub.

## 5. Evitar que o projeto pause

No plano gratuito, o Supabase pausa o projeto depois de cerca de 7 dias sem nenhum acesso. O workflow `.github/workflows/manter-supabase-ativo.yml` faz uma consulta a cada 3 dias para evitar isso. Para ativá-lo, em **GitHub > Settings > Secrets and variables > Actions**, crie:

- `SUPABASE_URL`: a mesma Project URL
- `SUPABASE_ANON_KEY`: a mesma chave anon

## Como o painel funciona

- `admin.html` não aparece no menu. Acesse direto: `https://l3riel.github.io/anjos-de-patas/admin.html`.
- **Animais**: cadastrar, editar, trocar a foto, marcar como adotado (sai do site, mas fica no histórico) e remover.
- **Fotos**: o painel reduz para no máximo 1200px e converte para WebP antes de enviar (cerca de 100 a 200 KB por foto), para não estourar o 1 GB grátis.
- **Textos e números**: chave Pix, dados bancários, contadores da home, ano de fundação, WhatsApp e e-mail. Campo vazio = o site mantém o texto padrão.

## Tabelas

| Tabela | Para quê | Quem lê | Quem grava |
| --- | --- | --- | --- |
| `animais` | Animais do site | Todos | Admins |
| `conteudo` | Textos e números editáveis (`data-conteudo` no HTML) | Todos | Admins |
| `admins` | Quem pode usar o painel | O próprio admin | Só pelo SQL Editor |
| `storage: fotos` | Fotos dos animais | Todos | Admins |
