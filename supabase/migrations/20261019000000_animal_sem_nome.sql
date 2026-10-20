-- Animais que a ONG ainda não batizou nem avaliou: nome vazio e
-- sexo, porte e idade desconhecidos (null) até a equipe confirmar.
alter table public.animais alter column sexo drop not null;
alter table public.animais alter column porte drop not null;
alter table public.animais alter column idade drop not null;
