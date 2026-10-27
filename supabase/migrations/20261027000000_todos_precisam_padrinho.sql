-- Todos os animais da ONG precisam de padrinho
update public.animais set precisa_padrinho = true where not adotado;
