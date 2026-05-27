-- Gestao ADM. - Verificacao do banco
-- Use este arquivo no SQL Editor do Supabase depois de executar schema.sql e seed.sql.

-- 1. Conferir se as tabelas principais existem
select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in (
    'departments',
    'profiles',
    'competencies',
    'questions',
    'evaluations',
    'answers',
    'feedbacks',
    'goals',
    'action_plans'
  )
order by table_name;

-- 2. Conferir quantos registros iniciais foram criados
select 'departments' as tabela, count(*) as total from departments
union all
select 'competencies', count(*) from competencies
union all
select 'questions', count(*) from questions;

-- 3. Ver as perguntas criadas com suas competencias
select
  c.name as competencia,
  q.question_text as pergunta
from questions q
join competencies c on c.id = q.competency_id
order by c.name, q.question_text;

