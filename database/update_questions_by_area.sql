-- Gestao ADM. - Atualizar perguntas por competencia
-- Use este arquivo no Supabase para remover repeticoes visiveis no questionario.
-- Ele nao apaga avaliacoes nem respostas antigas. Perguntas antigas ficam inativas.

create temp table desired_questions_update (
  competency text not null,
  question_text text not null
) on commit drop;

insert into desired_questions_update (competency, question_text)
values
  ('Comunicacao', 'Voce informa atrasos, mudancas ou bloqueios antes que eles afetem outros setores?'),
  ('Comunicacao', 'Voce registra combinados importantes para que a equipe acompanhe a demanda?'),
  ('Organizacao', 'Voce prioriza as atividades do dia conforme urgencia, prazo e impacto no setor?'),
  ('Organizacao', 'Voce mantem documentos, controles e informacoes em locais acessiveis para a equipe?'),
  ('Trabalho em equipe', 'Voce apoia colegas quando uma demanda depende de mais de uma area?'),
  ('Trabalho em equipe', 'Voce compartilha informacoes que ajudam o fluxo administrativo acontecer sem retrabalho?'),
  ('Lideranca', 'Voce orienta colegas quando percebe duvidas ou desalinhamentos no processo?'),
  ('Lideranca', 'Voce assume responsabilidade por decisoes dentro do seu papel antes de repassar o problema?'),
  ('Resolucao de problemas', 'Voce identifica a causa do problema antes de buscar uma solucao?'),
  ('Resolucao de problemas', 'Voce propoe alternativas quando encontra impedimentos em uma demanda?'),
  ('Proatividade', 'Voce antecipa necessidades do setor sem esperar uma cobranca?'),
  ('Proatividade', 'Voce sugere melhorias para reduzir retrabalho ou atrasos?'),
  ('Gestao de tempo', 'Voce cumpre prazos combinados mesmo quando surgem demandas paralelas?'),
  ('Gestao de tempo', 'Voce comunica prioridades quando nao consegue atender tudo no prazo?');

update questions q
set active = false
where exists (
  select 1
  from competencies c
  where c.id = q.competency_id
)
and not exists (
  select 1
  from desired_questions_update dq
  join competencies c on c.name = dq.competency
  where c.id = q.competency_id
    and dq.question_text = q.question_text
);

insert into questions (competency_id, question_text, active)
select c.id, dq.question_text, true
from desired_questions_update dq
join competencies c on c.name = dq.competency
where not exists (
  select 1
  from questions q
  where q.competency_id = c.id
    and q.question_text = dq.question_text
);

update questions q
set active = true
from desired_questions_update dq
join competencies c on c.name = dq.competency
where q.competency_id = c.id
  and q.question_text = dq.question_text;

select
  c.name as competencia,
  q.question_text as pergunta,
  q.active
from questions q
join competencies c on c.id = q.competency_id
where q.active = true
order by c.name, q.question_text;
