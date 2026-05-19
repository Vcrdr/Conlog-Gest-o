-- Gestao ADM. - Politicas iniciais de leitura publica
-- Use depois de schema.sql e seed.sql.
-- Estas politicas liberam apenas dados nao sensiveis para o site.

drop policy if exists "Permitir leitura de competencias ativas" on competencies;
drop policy if exists "Permitir leitura de perguntas ativas" on questions;

create policy "Permitir leitura de competencias ativas"
on competencies
for select
to anon
using (active = true);

create policy "Permitir leitura de perguntas ativas"
on questions
for select
to anon
using (active = true);
