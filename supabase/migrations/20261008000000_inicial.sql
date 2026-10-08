-- =========================================================
-- Anjos de Patas: esquema inicial do Supabase
-- Rode no SQL Editor do Supabase (ou `supabase db push`).
-- Leitura pública; escrita só para quem está na tabela admins.
-- =========================================================

-- ---------- Administradores ----------
-- Só quem estiver aqui consegue editar pelo /admin.html.
-- Depois de criar o usuário em Authentication > Users, rode:
--   insert into public.admins (user_id, email)
--   select id, email from auth.users where email = 'email-da-ong@exemplo.com';
create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  criado_em timestamptz not null default now()
);

alter table public.admins enable row level security;

-- Cada admin enxerga só o próprio registro (usado pelo painel para checar acesso)
create policy "admin le o proprio registro"
  on public.admins for select
  to authenticated
  using (user_id = auth.uid());

create or replace function public.eh_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- ---------- Animais ----------
create table public.animais (
  id text primary key check (id ~ '^[a-z0-9-]+$'),
  nome text not null,
  especie text not null check (especie in ('cachorro', 'gato')),
  sexo text not null check (sexo in ('macho', 'femea')),
  porte text not null check (porte in ('pequeno', 'medio', 'grande')),
  idade text not null check (idade in ('filhote', 'adulto', 'idoso')),
  idade_texto text,
  foto text,
  foto_grande text,
  alt text,
  castrado boolean not null default false,
  vacinado boolean not null default false,
  vermifugado boolean not null default false,
  disponivel_adocao boolean not null default true,
  precisa_padrinho boolean not null default false,
  adotado boolean not null default false,
  adotado_em date,
  temperamento text[] not null default '{}',
  historia text,
  exemplo boolean not null default false,
  ordem integer not null default 0,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create index animais_vitrine_idx on public.animais (adotado, ordem);

-- ---------- Textos e números editáveis ----------
-- Cada chave corresponde a um data-conteudo="chave" no HTML.
create table public.conteudo (
  chave text primary key,
  valor text not null default '',
  rotulo text not null,
  grupo text not null default 'Geral',
  ordem integer not null default 0,
  atualizado_em timestamptz not null default now()
);

-- ---------- atualizado_em automático ----------
create or replace function public.tocar_atualizado_em()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$;

create trigger animais_atualizado_em
  before update on public.animais
  for each row execute function public.tocar_atualizado_em();

create trigger conteudo_atualizado_em
  before update on public.conteudo
  for each row execute function public.tocar_atualizado_em();

-- ---------- RLS ----------
alter table public.animais enable row level security;
alter table public.conteudo enable row level security;

create policy "todos leem animais"
  on public.animais for select
  to anon, authenticated
  using (true);

create policy "admin cadastra animais"
  on public.animais for insert
  to authenticated
  with check ((select public.eh_admin()));

create policy "admin edita animais"
  on public.animais for update
  to authenticated
  using ((select public.eh_admin()))
  with check ((select public.eh_admin()));

create policy "admin remove animais"
  on public.animais for delete
  to authenticated
  using ((select public.eh_admin()));

create policy "todos leem conteudo"
  on public.conteudo for select
  to anon, authenticated
  using (true);

create policy "admin edita conteudo"
  on public.conteudo for update
  to authenticated
  using ((select public.eh_admin()))
  with check ((select public.eh_admin()));

-- ---------- Fotos (Storage) ----------
-- Bucket público para leitura, limitado a imagens de até 2 MB.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('fotos', 'fotos', true, 2097152, array['image/webp', 'image/jpeg', 'image/png'])
on conflict (id) do nothing;

create policy "admin envia fotos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'fotos' and (select public.eh_admin()));

create policy "admin troca fotos"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'fotos' and (select public.eh_admin()));

create policy "admin apaga fotos"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'fotos' and (select public.eh_admin()));

-- O Storage pede permissão de leitura nas linhas para trocar/apagar arquivos
create policy "admin lista fotos"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'fotos' and (select public.eh_admin()));
