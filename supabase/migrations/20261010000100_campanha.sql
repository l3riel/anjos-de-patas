-- Campanha com meta: aparece na home e na página de doação quando o título está preenchido.
insert into public.conteudo (chave, rotulo, grupo, ordem) values
  ('campanha_titulo', 'Título da campanha (vazio = sem campanha)', 'Campanha do momento', 200),
  ('campanha_texto', 'Descrição curta da campanha', 'Campanha do momento', 210),
  ('campanha_meta', 'Meta em reais (só números, ex.: 3000)', 'Campanha do momento', 220),
  ('campanha_arrecadado', 'Já arrecadado em reais (só números)', 'Campanha do momento', 230)
on conflict (chave) do nothing;
