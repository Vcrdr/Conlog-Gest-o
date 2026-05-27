-- Gestao ADM. - Politicas para salvar respostas do funcionario
-- Execute depois de auth_email_password.sql.

drop policy if exists "Funcionario cria propria avaliacao" on evaluations;
drop policy if exists "Funcionario le propria avaliacao" on evaluations;
drop policy if exists "Funcionario salva respostas da propria avaliacao" on answers;
drop policy if exists "Funcionario le respostas da propria avaliacao" on answers;

create policy "Funcionario cria propria avaliacao"
on evaluations
for insert
to authenticated
with check (
  employee_id in (
    select id
    from profiles
    where lower(email) = lower(auth.jwt() ->> 'email')
  )
);

create policy "Funcionario le propria avaliacao"
on evaluations
for select
to authenticated
using (
  employee_id in (
    select id
    from profiles
    where lower(email) = lower(auth.jwt() ->> 'email')
  )
);

create policy "Funcionario salva respostas da propria avaliacao"
on answers
for insert
to authenticated
with check (
  evaluation_id in (
    select e.id
    from evaluations e
    join profiles p on p.id = e.employee_id
    where lower(p.email) = lower(auth.jwt() ->> 'email')
  )
);

create policy "Funcionario le respostas da propria avaliacao"
on answers
for select
to authenticated
using (
  evaluation_id in (
    select e.id
    from evaluations e
    join profiles p on p.id = e.employee_id
    where lower(p.email) = lower(auth.jwt() ->> 'email')
  )
);

