# Gestão ADM.

Plataforma web para acompanhar o desenvolvimento de funcionarios, apoiar gestores na analise de desempenho e ajudar o RH a visualizar indicadores gerais da equipe.

Este repositorio contem uma primeira amostra navegavel do projeto, criada para apresentacao inicial e validacao da ideia.

## Link do projeto

Quando o GitHub Pages estiver ativado, o site ficara disponivel em um link parecido com:

```txt
https://seu-usuario.github.io/nome-do-repositorio/
```

## Objetivo

O objetivo da plataforma e acompanhar o desenvolvimento do time administrativo, identificar dificuldades, melhorar a comunicacao entre setores e ajudar gestores a criar planos de melhoria para os funcionarios.

## Perfis de usuario

### Funcionario

- Faz login na plataforma.
- Responde questionarios de autoavaliacao.
- Acompanha sua evolucao.
- Visualiza metas, feedbacks e pontos de melhoria.

### Gestor

- Acompanha os funcionarios da equipe.
- Visualiza medias e resultados individuais.
- Compara desempenhos.
- Cria feedbacks e planos de melhoria.

### RH/Admin

- Gerencia usuarios e setores.
- Cria perguntas e avaliacoes.
- Acompanha indicadores gerais.
- Analisa resultados por equipe ou departamento.

## Funcionalidades da amostra

- Login demonstrativo por perfil: funcionario, gestor e RH/Admin.
- Dashboard com indicadores principais.
- Grafico simples de evolucao mensal.
- Lista de competencias avaliadas.
- Questionario com notas de 1 a 5.
- Tela de resultado com pontos fortes e pontos de melhoria.
- Analise automatica com sugestao de plano de acao.
- Painel do gestor com acompanhamento da equipe.
- Painel RH/Admin com cadastro visual e indicadores por setor.

## Competencias avaliadas

| Competencia | O que avalia |
| --- | --- |
| Comunicacao | Clareza na troca de informacoes entre pessoas e setores |
| Organizacao | Controle de tarefas, rotina e prioridades |
| Trabalho em equipe | Cooperacao e colaboracao com colegas |
| Lideranca | Capacidade de orientar e apoiar pessoas |
| Resolucao de problemas | Autonomia para resolver dificuldades |
| Proatividade | Iniciativa sem depender sempre de solicitacao |
| Gestao de tempo | Cumprimento de prazos e organizacao da agenda |

## Escala de avaliacao

| Nota | Significado |
| --- | --- |
| 1 | Muito ruim |
| 2 | Ruim |
| 3 | Medio |
| 4 | Bom |
| 5 | Excelente |

## Tecnologias usadas nesta amostra

- HTML
- CSS
- JavaScript

A escolha foi feita para manter a primeira versao simples, leve e facil de publicar no GitHub Pages.

## Tecnologias planejadas para a versao completa

- React + Vite para o front-end.
- Node.js + Express para o back-end.
- PostgreSQL para banco de dados.
- JWT para autenticacao.
- bcrypt para criptografia de senhas.
- Recharts para graficos.

## Roadmap

| Etapa | Objetivo |
| --- | --- |
| 1 | Criar amostra visual navegavel |
| 2 | Migrar interface para React |
| 3 | Criar login real com autenticacao |
| 4 | Salvar usuarios, perguntas e respostas no banco |
| 5 | Criar dashboard com dados reais |
| 6 | Adicionar graficos e comparativos |
| 7 | Gerar feedbacks e planos de melhoria automaticamente |
| 8 | Criar relatorios para gestores e RH |

## Estrutura futura sugerida

```txt
frontend/
  src/
    pages/
    components/
    services/
    routes/
    contexts/
    styles/

backend/
  src/
    routes/
    controllers/
    services/
    database/
```

## Status do projeto

Em fase inicial de MVP.

A versao atual serve para apresentar a proposta, demonstrar o fluxo principal e facilitar a continuidade do desenvolvimento.
