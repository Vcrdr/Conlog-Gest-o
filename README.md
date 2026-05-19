# Banco de dados - Gestao ADM.

Esta pasta contem a primeira estrutura do banco de dados da plataforma.

## Banco recomendado

Para comecar de forma simples, use o Supabase, porque ele fornece PostgreSQL hospedado, painel visual, API e recursos de seguranca.

Tambem e possivel usar PostgreSQL instalado localmente ou hospedado em outros servicos.

## Arquivos

- `schema.sql`: cria as tabelas principais do sistema.
- `seed.sql`: adiciona competencias e perguntas iniciais para demonstracao.
- `checkup.sql`: verifica se o banco foi criado corretamente.
- `demo_profiles.sql`: cria perfis ficticios para teste.
- `policies_public_read.sql`: libera leitura publica apenas de competencias e perguntas.
- `auth_email_password.sql`: configura permissoes iniciais para login com e-mail e senha.
- `policies_save_answers.sql`: permite que funcionarios salvem as proprias respostas.

## Como criar no Supabase

1. Acesse o Supabase.
2. Crie um projeto novo.
3. Abra o menu SQL Editor.
4. Cole o conteudo de `schema.sql` e execute.
5. Depois cole o conteudo de `seed.sql` e execute.
6. Execute `checkup.sql` para conferir se tudo foi criado.
7. Se quiser dados de teste, execute `demo_profiles.sql`.
8. Execute `policies_public_read.sql` para permitir que o site leia perguntas e competencias.
9. Execute `auth_email_password.sql` para permitir que usuarios logados leiam seus perfis.
10. Execute `policies_save_answers.sql` para salvar questionarios respondidos.

## Depois de criar o banco

O proximo passo e ligar o site ao Supabase. Para isso, precisamos de duas informacoes do projeto:

- Project URL
- anon public key

Essas informacoes ficam no Supabase em:

```txt
Project Settings > Data API
```

Mesmo sendo chamada de `anon public key`, ela deve ser usada junto com politicas de seguranca no banco. Nao devemos liberar dados reais antes de configurar o login e as permissoes.

## Tabelas principais

- `departments`: setores da empresa.
- `profiles`: usuarios da plataforma.
- `competencies`: competencias avaliadas.
- `questions`: perguntas dos questionarios.
- `evaluations`: avaliacoes respondidas.
- `answers`: respostas e notas.
- `feedbacks`: feedbacks dos gestores.
- `goals`: metas individuais.
- `action_plans`: planos de melhoria.

## Observacao importante de seguranca

As tabelas ja ficam com Row Level Security ativado no `schema.sql`.

Isso significa que, no Supabase, o banco fica protegido por padrao. Antes de ligar o site diretamente ao banco, precisamos criar politicas de acesso conforme os perfis:

- funcionario acessa apenas seus proprios dados;
- gestor acessa dados da propria equipe;
- RH/Admin acessa dados gerais;
- usuarios anonimos nao acessam dados internos.

## Login com e-mail e senha

Nesta versao simples, o login pode ser feito com e-mail e senha usando Supabase Auth.

O Supabase Auth guarda as senhas de forma segura. A tabela `profiles` guarda apenas nome, e-mail, setor e funcao do usuario:

```txt
funcionario
gestor
rh_admin
```

Para testar, crie usuarios em:

```txt
Authentication > Users > Add user
```

Use os mesmos e-mails cadastrados em `profiles`, por exemplo:

```txt
marina.costa@empresa.com
carlos.mendes@empresa.com
ana.ribeiro@empresa.com
```

Assim, quando a pessoa fizer login, o sistema encontra o perfil pelo e-mail e abre a tela correta.
