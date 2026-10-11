-- Status "adoção em andamento": o animal continua no site, com um selo,
-- enquanto a equipe conversa com uma família. Rode no SQL Editor depois da migração inicial.
alter table public.animais
  add column if not exists adocao_em_andamento boolean not null default false;
