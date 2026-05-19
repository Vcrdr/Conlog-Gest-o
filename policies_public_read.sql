-- Gestao ADM. - Perfis de exemplo
-- Use apenas para teste inicial. Depois, os usuarios reais devem vir do login Microsoft.

insert into profiles (name, email, role, job_title, department_id)
select
  'Marina Costa',
  'marina.costa@empresa.com',
  'funcionario',
  'Assistente administrativa',
  d.id
from departments d
where d.name = 'Administrativo'
on conflict (email) do nothing;

insert into profiles (name, email, role, job_title, department_id)
select
  'Carlos Mendes',
  'carlos.mendes@empresa.com',
  'gestor',
  'Gestor administrativo',
  d.id
from departments d
where d.name = 'Administrativo'
on conflict (email) do nothing;

insert into profiles (name, email, role, job_title, department_id)
select
  'Ana Ribeiro',
  'ana.ribeiro@empresa.com',
  'rh_admin',
  'Analista de RH',
  d.id
from departments d
where d.name = 'RH'
on conflict (email) do nothing;

update profiles employee
set manager_id = manager.id
from profiles manager
where employee.email = 'marina.costa@empresa.com'
  and manager.email = 'carlos.mendes@empresa.com';

select name, email, role, job_title
from profiles
order by role, name;

