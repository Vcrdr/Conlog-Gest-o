-- Gestao ADM. - Dados iniciais para demonstracao
-- Execute depois do schema.sql

insert into departments (name)
values
  ('Administrativo'),
  ('Financeiro'),
  ('Comercial'),
  ('Operacoes'),
  ('RH')
on conflict (name) do nothing;

insert into competencies (name, description)
values
  ('Comunicacao', 'Clareza na troca de informacoes entre pessoas e setores.'),
  ('Organizacao', 'Controle de tarefas, rotina e prioridades.'),
  ('Trabalho em equipe', 'Cooperacao e colaboracao com colegas.'),
  ('Lideranca', 'Capacidade de orientar e apoiar pessoas.'),
  ('Resolucao de problemas', 'Autonomia para resolver dificuldades.'),
  ('Proatividade', 'Iniciativa sem depender sempre de solicitacao.'),
  ('Gestao de tempo', 'Cumprimento de prazos e organizacao da agenda.')
on conflict (name) do nothing;

create temp table if not exists desired_questions_seed (
  competency text not null,
  question_text text not null
) on commit drop;

truncate table desired_questions_seed;

insert into desired_questions_seed (competency, question_text)
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

insert into questions (competency_id, question_text, active)
select c.id, dq.question_text, true
from desired_questions_seed dq
join competencies c on c.name = dq.competency
where not exists (
  select 1
  from questions q
  where q.competency_id = c.id
    and q.question_text = dq.question_text
);

update questions q
set active = true
from desired_questions_seed dq
join competencies c on c.name = dq.competency
where q.competency_id = c.id
  and q.question_text = dq.question_text;
