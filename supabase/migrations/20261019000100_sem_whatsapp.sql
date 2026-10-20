-- A ONG não tem WhatsApp próprio: o contato é só pelo Instagram.
delete from public.conteudo where chave in ('whatsapp_numero', 'whatsapp_texto');
