-- =========================================================
-- Dados iniciais: os animais de exemplo de data/animais.json
-- e as chaves de texto editáveis (vazias = mantém o texto do HTML).
-- Gerado a partir dos JSON; rode depois da migração.
-- =========================================================

insert into public.animais (id, nome, especie, sexo, porte, idade, idade_texto, foto, foto_grande, alt, castrado, vacinado, vermifugado, disponivel_adocao, precisa_padrinho, temperamento, historia, exemplo, ordem) values
  ('branquinha', 'Branquinha', 'cachorro', 'femea', 'medio', 'adulto', 'cerca de 4 anos', 'assets/img/fotos/cachorro1-600.webp', 'assets/img/fotos/cachorro1.webp', 'Cachorra branca de roupinha amarela deitada no chão', true, true, true, true, true, array['dócil','calma','carinhosa']::text[], 'Fui encontrada com frio e muito magrinha. Hoje estou forte, uso minha roupinha amarela com orgulho e espero uma família que goste de cochilos ao sol.', true, 10),
  ('pacoca', 'Paçoca', 'cachorro', 'macho', 'medio', 'adulto', '2 anos', 'https://images.unsplash.com/photo-1544568100-847a948585b9?w=600&h=450&fit=crop&q=70&auto=format', null, 'Cachorro de pelo marrom com a língua de fora numa trilha', true, true, true, true, false, array['brincalhão','sociável com cães']::text[], 'Vivia perto da rodoviária pedindo carinho a quem passava. Adoro correr, buscar bolinha e receber visitas.', true, 20),
  ('mel', 'Mel', 'cachorro', 'femea', 'pequeno', 'filhote', '5 meses', 'https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?w=600&h=450&fit=crop&q=70&auto=format', null, 'Filhote de orelhas compridas deitado de barriga para cima na grama', false, true, true, true, false, array['curiosa','agitada','amorosa']::text[], 'Nasci numa ninhada abandonada numa caixa de papelão. Sou a mais bagunceira dos irmãos e prometo encher sua casa de alegria.', true, 30),
  ('tigrao', 'Tigrão', 'gato', 'macho', 'pequeno', 'adulto', '3 anos', 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=600&h=450&fit=crop&q=70&auto=format', null, 'Gato rajado sentado em uma escada clara', true, true, true, true, false, array['independente','tranquilo']::text[], 'Fui resgatado de cima de um telhado depois de uma chuva forte. Gosto de observar tudo do alto e de um colo no fim do dia.', true, 40),
  ('luna', 'Luna', 'gato', 'femea', 'pequeno', 'adulto', '2 anos', 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=450&fit=crop&q=70&auto=format', null, 'Gata preta e branca com as patinhas apoiadas numa mesa', true, true, true, true, false, array['carinhosa','conversadeira']::text[], 'Cheguei à ONG desconfiada, mas descobri que carinho atrás da orelha resolve quase tudo. Me dou bem com outros gatos.', true, 50),
  ('bolt', 'Bolt', 'cachorro', 'macho', 'grande', 'adulto', '3 anos', 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=450&fit=crop&q=70&auto=format', null, 'Cachorro branco com manchas marrons sorrindo na praia', true, true, true, true, false, array['enérgico','leal']::text[], 'Fui atropelado e passei semanas em tratamento. Hoje corro sem dor e preciso de um quintal e de alguém que goste de caminhadas.', true, 60),
  ('nina', 'Nina', 'gato', 'femea', 'pequeno', 'filhote', '3 meses', 'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=600&h=450&fit=crop&q=70&auto=format', null, 'Filhote de gato rajado olhando para a câmera', false, true, true, true, false, array['brincalhona','curiosa']::text[], 'Fui achada sozinha num terreno baldio, chorando de fome. Agora brinco com tudo o que se mexe.', true, 70),
  ('cafe', 'Café', 'cachorro', 'macho', 'grande', 'idoso', '10 anos', 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=600&h=450&fit=crop&q=70&auto=format', null, 'Cachorro marrom de olhos cor de mel lambendo o focinho', true, true, true, true, true, array['sereno','companheiro']::text[], 'Fui deixado amarrado num poste depois de anos com uma família. Tomo remédio para o coração todos os dias e ainda tenho muito amor para dar.', true, 80),
  ('fuba', 'Fubá', 'gato', 'macho', 'medio', 'idoso', '9 anos', 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600&h=450&fit=crop&q=70&auto=format', null, 'Gato laranja deitado sobre uma mesa de madeira', true, true, true, false, true, array['dorminhoco','manso']::text[], 'Estou em tratamento para os rins e preciso de ração especial. Enquanto isso, um padrinho ou madrinha faz toda a diferença.', true, 90),
  ('pingo', 'Pingo', 'cachorro', 'macho', 'medio', 'adulto', '5 anos', 'https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=600&h=450&fit=crop&q=70&auto=format', null, 'Cachorro preto e branco sorrindo numa calçada', true, true, true, false, true, array['alegre','sociável']::text[], 'Perdi parte da visão de um olho por uma infecção não tratada. Estou terminando o tratamento e logo fico disponível para adoção.', true, 100)
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
