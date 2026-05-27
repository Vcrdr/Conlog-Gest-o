# Documentacao completa - Gestao ADM. | Conlog

Este arquivo reune as principais ideias, decisoes, instrucoes e proximas etapas discutidas durante a criacao da plataforma.

## 1. Visao geral da plataforma

A plataforma **Gestao ADM. | Conlog** e uma proposta de sistema interno para acompanhar o desenvolvimento dos colaboradores, organizar avaliacoes, registrar feedbacks e dar ao gestor e ao RH uma visao mais clara sobre desempenho, metas e pontos de melhoria.

A ideia principal e substituir controles manuais, planilhas soltas e acompanhamentos informais por uma plataforma centralizada, simples e acessivel.

## 2. Objetivo do projeto

Acompanhar o desenvolvimento do time administrativo, identificar dificuldades, melhorar a comunicacao entre setores e ajudar gestores a criar planos de melhoria para os funcionarios.

O sistema deve permitir:

- aplicar questionarios de competencias;
- acompanhar evolucao individual e por equipe;
- registrar feedbacks;
- criar metas;
- identificar pontos fortes;
- identificar pontos de melhoria;
- gerar indicadores para gestores e RH.

## 3. Perfis de usuario

### Funcionario

O funcionario deve conseguir:

- fazer login com e-mail e senha;
- responder questionarios;
- acompanhar sua evolucao;
- visualizar metas;
- receber feedbacks;
- ver pontos fortes e pontos de melhoria.

### Gestor

O gestor deve conseguir:

- acessar funcionarios da propria equipe;
- visualizar resultados;
- comparar desempenhos;
- deixar feedbacks;
- criar metas;
- acompanhar planos de melhoria.

### RH/Admin

O RH/Admin deve conseguir:

- gerenciar usuarios;
- cadastrar e alterar usuarios;
- criar perguntas;
- criar avaliacoes;
- acompanhar setores;
- visualizar indicadores gerais;
- ver desempenhos;
- administrar a plataforma.

## 4. Funcoes do sistema

As funcoes usadas no banco sao:

```txt
funcionario
gestor
rh_admin
```

Quem pode cadastrar, alterar usuarios e visualizar desempenhos gerais deve ser cadastrado como:

```txt
rh_admin
```

## 5. Competencias avaliadas

As competencias iniciais definidas foram:

| Competencia | O que avalia |
| --- | --- |
| Comunicacao | Clareza na troca de informacoes entre pessoas e setores |
| Organizacao | Controle de tarefas, rotina e prioridades |
| Trabalho em equipe | Cooperacao e colaboracao com colegas |
| Lideranca | Capacidade de orientar e apoiar pessoas |
| Resolucao de problemas | Autonomia para resolver dificuldades |
| Proatividade | Iniciativa sem depender sempre de solicitacao |
| Gestao de tempo | Cumprimento de prazos e organizacao da agenda |

## 6. Escala de avaliacao

| Nota | Significado |
| --- | --- |
| 1 | Muito ruim |
| 2 | Ruim |
| 3 | Medio |
| 4 | Bom |
| 5 | Excelente |

## 7. Telas planejadas

### Login

Tela de acesso com:

- e-mail;
- senha;
- botao entrar.

O login nao depende de Microsoft nem Google. A decisao atual foi usar usuario e senha proprios da plataforma.

### Dashboard

Mostra:

- desempenho geral;
- indicadores principais;
- evolucao mensal;
- competencias;
- ultimas avaliacoes;
- metas.

### Questionario

Tela onde o funcionario responde perguntas com notas de 1 a 5.

Exemplo:

```txt
Comunicacao: 4
Organizacao: 5
Trabalho em equipe: 3
```

### Resultado

Mostra:

- pontos fortes;
- pontos de melhoria;
- analise automatica;
- plano sugerido.

### Painel do gestor

Permite ao gestor:

- ver equipe;
- acompanhar medias;
- comparar resultados;
- registrar feedbacks;
- criar metas.

### Painel RH/Admin

Permite ao RH/Admin:

- cadastrar usuarios;
- alterar usuarios;
- criar perguntas;
- acompanhar setores;
- visualizar indicadores gerais;
- administrar o sistema.

## 8. Identidade visual

A interface foi adaptada para ter identidade visual inspirada no site:

```txt
https://conlogsa.com.br/
```

Direcao visual adotada:

- nome Conlog / Gestao ADM.;
- area colaborador;
- verde institucional;
- amarelo de destaque;
- layout corporativo;
- clima visual ligado a logistica e gestao interna.

Observacao: o visual foi inspirado no site, sem copiar codigo oficial. Caso existam logo e imagens internas autorizadas, elas podem substituir os elementos atuais.

## 9. Tecnologias usadas na amostra atual

A primeira versao foi feita com:

- HTML;
- CSS;
- JavaScript;
- Supabase;
- GitHub Pages.

Essa escolha foi feita para comecar de forma simples e conseguir publicar rapidamente um link externo.

## 10. Tecnologias recomendadas para versao profissional

Para transformar em um sistema mais robusto, a stack recomendada e:

- React + Vite para o front-end;
- Node.js + Express ou Supabase Functions para back-end;
- PostgreSQL/Supabase para banco de dados;
- Supabase Auth para login com e-mail e senha;
- Row Level Security para permissoes;
- Recharts para graficos;
- GitHub para controle de versao;
- Vercel, Netlify ou GitHub Pages para front-end;
- Supabase para banco hospedado.

## 11. Banco de dados

O banco foi estruturado em PostgreSQL/Supabase.

Tabelas principais:

- `departments`: setores da empresa;
- `profiles`: usuarios, funcoes, cargos e setores;
- `competencies`: competencias avaliadas;
- `questions`: perguntas dos questionarios;
- `evaluations`: avaliacoes respondidas;
- `answers`: respostas e notas;
- `feedbacks`: feedbacks dos gestores;
- `goals`: metas individuais;
- `action_plans`: planos de melhoria.

## 12. Arquivos de banco criados

Na pasta `database/`, existem arquivos SQL para criar e configurar o banco:

```txt
schema.sql
seed.sql
checkup.sql
demo_profiles.sql
policies_public_read.sql
auth_email_password.sql
policies_save_answers.sql
```

### Ordem recomendada de execucao

```txt
1. schema.sql
2. seed.sql
3. policies_public_read.sql
4. auth_email_password.sql
5. policies_save_answers.sql
6. checkup.sql
```

O `demo_profiles.sql` era apenas para teste e pode ser substituido por uma query fixa de cadastro de usuarios.

## 13. Organizacao das queries no Supabase

Sugestao de nomes para deixar o SQL Editor organizado:

```txt
01 - Criar estrutura do banco
02 - Criar setores, competencias e perguntas
03 - Cadastrar ou atualizar usuario
04 - Verificar tabelas e dados iniciais
05 - Liberar leitura publica de perguntas
06 - Configurar login e leitura de perfil
07 - Permitir salvar avaliacoes e respostas
08 - Buscar perfil por e-mail
09 - Teste de acompanhamento das respostas
```

## 14. Query modelo para cadastrar usuarios

Esta query pode ficar salva como:

```txt
03 - Cadastrar ou atualizar usuario
```

Modelo:

```sql
insert into profiles (name, email, role, job_title, department_id)
select
  'NOME DO USUARIO',
  'email@conlogsa.com.br',
  'funcionario',
  'Cargo do usuario',
  d.id
from departments d
where d.name = 'Administrativo'
on conflict (email) do update
set
  name = excluded.name,
  role = excluded.role,
  job_title = excluded.job_title,
  department_id = excluded.department_id;
```

Campos que devem ser alterados a cada novo cadastro:

```txt
NOME DO USUARIO
email@conlogsa.com.br
funcionario / gestor / rh_admin
Cargo do usuario
Administrativo / Financeiro / Comercial / Operacoes / RH
```

Importante: para o usuario conseguir entrar, ele precisa existir em dois lugares:

```txt
Authentication > Users
profiles
```

O Authentication guarda e-mail e senha.

A tabela `profiles` guarda nome, cargo, setor e funcao.

## 15. Usuarios citados

### Arthur Sant'tana

E-mail:

```txt
arthur.santana@conlogsa.com.br
```

Funcao recomendada:

```txt
rh_admin
```

Motivo: Arthur pode cadastrar, alterar usuarios e visualizar desempenhos.

SQL exemplo:

```sql
insert into profiles (name, email, role, job_title, department_id)
select
  'Arthur Sant''tana',
  'arthur.santana@conlogsa.com.br',
  'rh_admin',
  'Administrador da plataforma',
  d.id
from departments d
where d.name = 'RH'
on conflict (email) do update
set
  name = excluded.name,
  role = excluded.role,
  job_title = excluded.job_title,
  department_id = excluded.department_id;
```

### Cleir Leal

Funcao recomendada:

```txt
rh_admin
```

Motivo: Cleir tambem pode cadastrar, alterar usuarios e visualizar desempenhos.

Pendente: informar o e-mail de acesso da Cleir para criar o cadastro.

## 16. Login e seguranca

Decisao atual:

- nao usar conta Microsoft;
- nao usar conta Google;
- usar login com e-mail e senha proprios da plataforma;
- usar Supabase Auth para proteger senhas;
- usar a tabela `profiles` para controlar funcoes.

O site usa:

```txt
supabase-config.js
```

Esse arquivo contem:

```js
window.GESTAO_ADM_SUPABASE = {
  url: "https://pgfygfvjiylufpxeyvjj.supabase.co",
  publishableKey: "SUA_PUBLISHABLE_KEY"
};
```

Importante:

- pode usar a Publishable key no front-end;
- nao usar `service_role`;
- nao publicar chave secreta;
- nao enviar JWT secret;
- manter Row Level Security ativo.

## 17. Erros encontrados e solucao

### Mensagem: Configure a Publishable key do Supabase

Significa que o arquivo `supabase-config.js` ainda esta com:

```txt
COLE_AQUI_SUA_PUBLISHABLE_KEY
```

Solucao:

- trocar pela Publishable key;
- subir `supabase-config.js` atualizado no GitHub;
- aguardar GitHub Pages atualizar;
- abrir o site com Ctrl + F5.

### Mensagem: Login feito, mas nao encontrei perfil

Significa que o usuario existe em Authentication, mas nao existe em `profiles`, ou a politica de leitura esta errada.

Verificacao:

```sql
select id, name, email, role, job_title
from profiles
where email = 'email@conlogsa.com.br';
```

Politica corrigida:

```sql
alter table profiles enable row level security;

drop policy if exists "Usuario logado le o proprio perfil" on profiles;

create policy "Usuario logado le o proprio perfil"
on profiles
for select
to authenticated
using (lower(email) = lower(auth.jwt() ->> 'email'));
```

### Mensagem: Nenhuma pergunta encontrada

Possiveis causas:

- `seed.sql` nao foi executado;
- tabela `questions` esta vazia;
- politicas de leitura nao permitem acesso autenticado.

Politica recomendada:

```sql
drop policy if exists "Permitir leitura de competencias ativas" on competencies;
drop policy if exists "Permitir leitura de perguntas ativas" on questions;

create policy "Permitir leitura de competencias ativas"
on competencies
for select
to anon, authenticated
using (active = true);

create policy "Permitir leitura de perguntas ativas"
on questions
for select
to anon, authenticated
using (active = true);
```

Verificacao:

```sql
select
  c.name as competencia,
  q.question_text as pergunta
from questions q
join competencies c on c.id = q.competency_id
order by c.name;
```

## 18. GitHub Pages

O projeto foi publicado pelo GitHub Pages.

Para configurar:

```txt
Settings > Pages
Source: Deploy from a branch
Branch: main
Folder: /root
Save
```

O link esperado segue o formato:

```txt
https://vcrdr.github.io/Conlog-Gest-o/
```

Sempre que alterar arquivos, subir no GitHub:

```txt
index.html
styles.css
app.js
README.md
supabase-config.js
database/
```

Depois aguardar alguns minutos e atualizar com Ctrl + F5.

## 19. Status atual do projeto

Ja foi feito:

- amostra visual navegavel;
- identidade visual inspirada na Conlog;
- design atualizado em laranja, preto e branco, com layout responsivo para mobile;
- tela de login;
- conexao com Supabase;
- estrutura inicial do banco;
- login por e-mail e senha;
- perfis por funcao;
- permissoes iniciais com Row Level Security;
- questionario;
- perguntas especificas por competencia, com remocao visual de duplicadas;
- estrutura para salvar respostas em `evaluations` e `answers`;
- documentacao inicial.

Ainda precisa evoluir:

- garantir que as perguntas sejam carregadas corretamente do banco;
- garantir que o `app.js` atualizado esteja publicado;
- criar tela administrativa real para cadastrar usuarios sem precisar usar SQL;
- permitir que RH/Admin altere usuarios pela interface;
- transformar dashboard em dados reais;
- criar painel real do gestor;
- criar relatorios;
- melhorar permissoes por equipe e setor;
- testar com usuarios reais.

## 20. Proxima etapa tecnica recomendada

A proxima melhoria importante e criar uma tela de cadastro de usuarios dentro da propria plataforma.

Essa tela deve permitir ao RH/Admin:

- cadastrar nome;
- cadastrar e-mail;
- selecionar funcao;
- selecionar setor;
- definir cargo;
- atualizar usuario existente;
- desativar usuario.

Ponto importante: mesmo com essa tela, o usuario ainda precisa existir no Supabase Auth para conseguir login, a menos que seja criada uma funcao administrativa segura para criar usuarios automaticamente.

## 21. Roadmap realista

### Fase 1 - MVP visual

Status: iniciado.

Objetivo:

- mostrar a ideia;
- validar fluxo;
- apresentar ao gestor;
- demonstrar login, questionario e paineis.

### Fase 2 - Login e usuarios

Objetivo:

- login real;
- usuarios por funcao;
- permissao por perfil;
- cadastro inicial controlado.

### Fase 3 - Questionarios reais

Objetivo:

- carregar perguntas do banco;
- salvar respostas;
- criar avaliacoes;
- gerar historico.

### Fase 4 - Painel do gestor

Objetivo:

- gestor ver apenas sua equipe;
- acompanhar desempenho;
- criar feedbacks;
- criar metas.

### Fase 5 - Painel RH/Admin

Objetivo:

- cadastrar usuarios pela interface;
- criar perguntas;
- acompanhar setores;
- ver indicadores gerais.

### Fase 6 - Relatorios

Objetivo:

- relatorio por funcionario;
- relatorio por setor;
- evolucao mensal;
- exportacao em PDF.

### Fase 7 - Inteligencia e automacoes

Objetivo:

- sugestoes automaticas de melhoria;
- planos de acao;
- alertas;
- analises de padroes.

## 22. Argumento para apresentar ao chefe

Mensagem principal:

> A ideia e viavel e ja existe uma primeira amostra navegavel. Ela mostra o fluxo principal da plataforma: login, questionario, resultados, gestor e RH. Porem, para transformar isso em uma ferramenta real da empresa, precisamos de mais tempo e uma infraestrutura adequada, porque vamos lidar com dados de colaboradores.

Outro ponto importante:

> Nao e apenas uma tela bonita. O sistema precisa de regras de acesso, banco de dados, seguranca, testes e validacao. Da para fazer, mas precisa ser tratado como projeto interno, nao como uma pagina simples.

## 23. Por que precisa de mais infraestrutura

A plataforma vai lidar com dados sensiveis, como:

- desempenho;
- feedbacks;
- metas;
- avaliacoes;
- dados de funcionarios;
- historico individual;
- indicadores de equipe.

Por isso, para uso real, precisa de:

- banco de dados seguro;
- regras de permissao;
- login confiavel;
- backup;
- testes;
- ambiente de homologacao;
- hospedagem estavel;
- documentacao;
- manutencao;
- tempo de desenvolvimento.

## 24. Resumo para apresentacao

A plataforma **Gestao ADM. | Conlog** tem como objetivo centralizar o acompanhamento de desempenho dos colaboradores, oferecendo questionarios, feedbacks, metas e indicadores para funcionarios, gestores e RH.

Ela ja possui uma primeira base funcional com login, banco de dados e visual inspirado na Conlog.

Para virar uma ferramenta oficial da empresa, o projeto deve continuar em fases, com foco em seguranca, permissoes, cadastro de usuarios, dashboards reais e relatorios.

O projeto e possivel, mas precisa de tempo, infraestrutura e validacao para ser feito da forma correta.
