-- =========================================================
-- Dados iniciais: os animais de data/animais.json
-- e as chaves de texto editáveis (vazias = mantém o texto do HTML).
-- Gerado a partir dos JSON; rode depois da migração.
-- =========================================================

insert into public.animais (id, nome, especie, sexo, porte, idade, idade_texto, foto, foto_grande, alt, castrado, vacinado, vermifugado, disponivel_adocao, precisa_padrinho, temperamento, historia, exemplo, ordem) values
  ('hulk', 'Hulk', 'cachorro', 'macho', null, null, null, 'assets/img/fotos/hulk-600.webp', 'assets/img/fotos/hulk.webp', 'Hulk, pitbull de pelo marrom, em pé no canil da ONG olhando para a câmera', false, false, false, true, true, array['manso','carinhoso','um pouco medroso']::text[], 'Fui encontrado atropelado na beira do asfalto. A ONG cuidou de mim e hoje sou manso e adoro carinho, mas ainda tenho um pouco de medo por causa do que passei. Preciso de alguém paciente, que me deixe confiar no meu tempo.', false, 10),
  ('pitty', 'Pitty', 'cachorro', 'macho', null, null, null, 'assets/img/fotos/pitty-600.webp', 'assets/img/fotos/pitty.webp', 'Pitty, pitbull caramelo e branco, em pé dentro de uma caixa de madeira no canil', false, false, false, true, true, array['manso','carinhoso','cego']::text[], 'Fui abandonado ainda filhote, com machucados nos olhos. A ONG tratou meus ferimentos, mas acabei ficando cego. Isso não me impede de nada: sou manso e muito carinhoso com todo mundo que está por perto.', false, 20),
  ('sem-nome-1', '', 'cachorro', null, null, null, null, 'assets/img/fotos/acolhido-1-600.webp', 'assets/img/fotos/acolhido-1.webp', 'Cão caramelo com as patas apoiadas na cerca do canil', false, false, false, true, true, '{}'::text[], 'Ainda não tenho nome nem uma história contada aqui no site, mas já vivo na Anjos de Patas, cuidado e esperando uma família. Quem me adotar pode escolher o meu nome!', false, 30),
  ('sem-nome-2', '', 'cachorro', null, null, null, null, 'assets/img/fotos/acolhido-3-600.webp', 'assets/img/fotos/acolhido-3.webp', 'Cão preto de orelhas compridas e olhos cor de mel', false, false, false, true, true, '{}'::text[], 'Ainda não tenho nome nem uma história contada aqui no site, mas já vivo na Anjos de Patas, cuidado e esperando uma família. Quem me adotar pode escolher o meu nome!', false, 40),
  ('sem-nome-3', '', 'cachorro', null, null, null, null, 'assets/img/fotos/acolhido-4-600.webp', 'assets/img/fotos/acolhido-4.webp', 'Cão preto e caramelo com a pata enfaixada, deitado sobre um cobertor', false, false, false, true, true, '{}'::text[], 'Ainda não tenho nome nem uma história contada aqui no site, mas já vivo na Anjos de Patas, cuidado e esperando uma família. Quem me adotar pode escolher o meu nome!', false, 50),
  ('sem-nome-4', '', 'cachorro', null, null, null, null, 'assets/img/fotos/acolhido-5-600.webp', 'assets/img/fotos/acolhido-5.webp', 'Cão caramelo de orelhas em pé descansando dentro de uma casinha improvisada', false, false, false, true, true, '{}'::text[], 'Ainda não tenho nome nem uma história contada aqui no site, mas já vivo na Anjos de Patas, cuidado e esperando uma família. Quem me adotar pode escolher o meu nome!', false, 60),
  ('sem-nome-5', '', 'cachorro', null, null, null, null, 'assets/img/fotos/acolhido-6-600.webp', 'assets/img/fotos/acolhido-6.webp', 'Cão caramelo pequeno sentado encostado na parede', false, false, false, true, true, '{}'::text[], 'Ainda não tenho nome nem uma história contada aqui no site, mas já vivo na Anjos de Patas, cuidado e esperando uma família. Quem me adotar pode escolher o meu nome!', false, 70),
  ('sem-nome-6', '', 'cachorro', null, null, null, null, 'assets/img/fotos/acolhido-7-600.webp', 'assets/img/fotos/acolhido-7.webp', 'Cão tigrado deitado no chão do canil', false, false, false, true, true, '{}'::text[], 'Ainda não tenho nome nem uma história contada aqui no site, mas já vivo na Anjos de Patas, cuidado e esperando uma família. Quem me adotar pode escolher o meu nome!', false, 80),
  ('sem-nome-7', '', 'cachorro', null, null, null, null, 'assets/img/fotos/acolhido-8-600.webp', 'assets/img/fotos/acolhido-8.webp', 'Cão branco com manchas pretas deitado sobre um cobertor estampado', false, false, false, true, true, '{}'::text[], 'Ainda não tenho nome nem uma história contada aqui no site, mas já vivo na Anjos de Patas, cuidado e esperando uma família. Quem me adotar pode escolher o meu nome!', false, 90)
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
  ('email', 'E-mail da ONG', 'Contato', 150)
on conflict (chave) do nothing;

-- Dados públicos do CNPJ (Receita Federal, consultados em 2026-10-09)
update public.conteudo set valor = '2019' where chave = 'ano_fundacao' and valor = '';
update public.conteudo set valor = '35.761.357/0001-77' where chave = 'cnpj' and valor = '';
update public.conteudo set valor = 'Anjos de Patas Matipó - APM' where chave = 'pix_favorecido' and valor = '';
