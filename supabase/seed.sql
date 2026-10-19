-- =========================================================
-- Dados iniciais: os animais de data/animais.json
-- e as chaves de texto editáveis (vazias = mantém o texto do HTML).
-- Gerado a partir dos JSON; rode depois da migração.
-- =========================================================

insert into public.animais (id, nome, especie, sexo, porte, idade, idade_texto, foto, foto_grande, alt, castrado, vacinado, vermifugado, disponivel_adocao, precisa_padrinho, temperamento, historia, exemplo, ordem) values
  ('hulk', 'Hulk', 'cachorro', 'macho', 'medio', 'adulto', 'adulto', 'assets/img/fotos/hulk-600.webp', 'assets/img/fotos/hulk.webp', 'Hulk, pitbull de pelo marrom, em pé no canil da ONG olhando para a câmera', false, false, false, true, true, array['manso','carinhoso','um pouco medroso']::text[], 'Fui encontrado atropelado na beira do asfalto. A ONG cuidou de mim e hoje sou manso e adoro carinho, mas ainda tenho um pouco de medo por causa do que passei. Preciso de alguém paciente, que me deixe confiar no meu tempo.', false, 10),
  ('pitty', 'Pitty', 'cachorro', 'macho', 'medio', 'adulto', 'adulto', 'assets/img/fotos/pitty-600.webp', 'assets/img/fotos/pitty.webp', 'Pitty, pitbull caramelo e branco, deitado no chão olhando para cima', false, false, false, true, true, array['manso','carinhoso','cego']::text[], 'Fui abandonado ainda filhote, com machucados nos olhos. A ONG tratou meus ferimentos, mas acabei ficando cego. Isso não me impede de nada: sou manso e muito carinhoso com todo mundo que está por perto.', false, 20)
on conflict (id) do nothing;

insert into public.conteudo (chave, rotulo, grupo, ordem) values
  ('contador_resgatados', 'Animais resgatados', 'Números da página inicial', 10),
  ('contador_adotados', 'Animais adotados', 'Números da página inicial', 20),
  ('contador_castrados', 'Animais castrados', 'Números da página inicial', 30),
  ('ano_fundacao', 'Ano de fundação', 'Números da página inicial', 40),
  ('voluntarios', 'Voluntários ativos', 'Números da página inicial', 50),
  ('comedouros', 'Comedouros na cidade', 'Números da página inicial', 60),
  ('pix_chave', 'Chave Pix', 'Doações', 70),
  ('pix_favorecido', 'Razão social (favorecido do Pix)', 'Doações', 80),
  ('banco', 'Banco', 'Doações', 90),
  ('agencia', 'Agência', 'Doações', 100),
  ('conta', 'Conta corrente', 'Doações', 110),
  ('cnpj', 'CNPJ', 'Doações', 120),
  ('whatsapp_numero', 'WhatsApp da ONG (só números, com 55 e DDD)', 'Contato', 130),
  ('whatsapp_texto', 'WhatsApp como aparece no site', 'Contato', 140),
  ('email', 'E-mail da ONG', 'Contato', 150)
on conflict (chave) do nothing;

-- Dados públicos do CNPJ (Receita Federal, consultados em 2026-10-09)
update public.conteudo set valor = '2019' where chave = 'ano_fundacao' and valor = '';
update public.conteudo set valor = '35.761.357/0001-77' where chave = 'cnpj' and valor = '';
update public.conteudo set valor = 'Anjos de Patas Matipó - APM' where chave = 'pix_favorecido' and valor = '';
