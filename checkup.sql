-- Gestao ADM. - Login com e-mail e senha pelo Supabase Auth
-- Execute depois de schema.sql, seed.sql e policies_public_read.sql.

-- A senha NAO fica na tabela profiles.
-- A senha fica no Supabase Auth, com armazenamento seguro gerenciado pelo Supabase.
-- A tabela profiles guarda apenas os dados de negocio do usuario.

alter table profiles
add column if not exists auth_user_id uuid unique;

create index if not exists idx_profiles_auth_user_id on profiles(auth_user_id);
create index if not exists idx_profiles_email on profiles(email);

drop policy if exists "Usuario logado le o proprio perfil" on profiles;

-- Permite que um usuario logado leia o proprio perfil usando o e-mail do login.
create policy "Usuario logado le o proprio perfil"
on profiles
for select
to authenticated
using (email = auth.jwt() ->> 'email');

-- As permissoes de gestor e RH/Admin para ler outros usuarios devem ser adicionadas
-- em uma segunda etapa, de preferencia com funcoes SQL security definer.
-- Nesta primeira versao, cada usuario logado le apenas o proprio perfil.
