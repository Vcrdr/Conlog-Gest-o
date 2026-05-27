-- Gestao ADM. - Estrutura inicial do banco de dados
-- Banco recomendado: PostgreSQL ou Supabase

create extension if not exists "pgcrypto";

create table if not exists departments (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  microsoft_id text unique,
  name text not null,
  email text not null unique,
  role text not null check (role in ('funcionario', 'gestor', 'rh_admin')),
  job_title text,
  department_id uuid references departments(id) on delete set null,
  manager_id uuid references profiles(id) on delete set null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists competencies (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists questions (
  id uuid primary key default gen_random_uuid(),
  competency_id uuid not null references competencies(id) on delete cascade,
  question_text text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists evaluations (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references profiles(id) on delete cascade,
  evaluator_id uuid references profiles(id) on delete set null,
  title text not null,
  status text not null default 'draft' check (status in ('draft', 'submitted', 'reviewed')),
  period_start date,
  period_end date,
  submitted_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists answers (
  id uuid primary key default gen_random_uuid(),
  evaluation_id uuid not null references evaluations(id) on delete cascade,
  question_id uuid not null references questions(id) on delete cascade,
  score integer not null check (score between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  unique (evaluation_id, question_id)
);

create table if not exists feedbacks (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references profiles(id) on delete cascade,
  manager_id uuid not null references profiles(id) on delete cascade,
  evaluation_id uuid references evaluations(id) on delete set null,
  strengths text,
  improvement_points text,
  general_comment text not null,
  created_at timestamptz not null default now()
);

create table if not exists goals (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references profiles(id) on delete cascade,
  created_by uuid references profiles(id) on delete set null,
  title text not null,
  description text,
  status text not null default 'active' check (status in ('active', 'completed', 'paused', 'canceled')),
  due_date date,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists action_plans (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references profiles(id) on delete cascade,
  created_by uuid references profiles(id) on delete set null,
  title text not null,
  diagnosis text not null,
  suggested_action text not null,
  methodology text,
  status text not null default 'open' check (status in ('open', 'in_progress', 'done')),
  created_at timestamptz not null default now()
);

create index if not exists idx_profiles_department on profiles(department_id);
create index if not exists idx_profiles_manager on profiles(manager_id);
create index if not exists idx_questions_competency on questions(competency_id);
create index if not exists idx_evaluations_employee on evaluations(employee_id);
create index if not exists idx_answers_evaluation on answers(evaluation_id);
create index if not exists idx_feedbacks_employee on feedbacks(employee_id);
create index if not exists idx_goals_employee on goals(employee_id);

-- Segurança para Supabase:
-- RLS ligado por padrao. As politicas devem ser ajustadas quando o login estiver definido.
alter table departments enable row level security;
alter table profiles enable row level security;
alter table competencies enable row level security;
alter table questions enable row level security;
alter table evaluations enable row level security;
alter table answers enable row level security;
alter table feedbacks enable row level security;
alter table goals enable row level security;
alter table action_plans enable row level security;

