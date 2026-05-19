# Impulso RH - Amostra MVP

Esta pasta contem uma primeira amostra navegavel da plataforma de desenvolvimento de funcionarios.
Ela foi feita em HTML, CSS e JavaScript puro para voce apresentar rapidamente e continuar sem depender de instalacao.

## Como abrir

Abra o arquivo `index.html` no navegador.

## O que esta pronto na amostra

- Login demonstrativo por perfil: funcionario, gestor e RH/Admin.
- Dashboard com indicadores, grafico simples e competencias.
- Questionario com notas de 1 a 5.
- Tela de resultado com pontos fortes, melhorias e plano sugerido.
- Painel do gestor com equipe, medias e status.
- Painel RH/Admin com cadastro visual, perguntas e indicadores por setor.

## Proximos passos recomendados

1. Trocar os dados simulados do `app.js` por dados reais.
2. Migrar a interface para React + Vite quando quiser escalar.
3. Criar backend Node.js + Express para login, respostas e relatorios.
4. Criar banco PostgreSQL com tabelas `users`, `questions`, `answers` e `feedbacks`.
5. Adicionar autenticacao com JWT e criptografia de senha com bcrypt.

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

## Escala de avaliacao

| Nota | Significado |
| --- | --- |
| 1 | Muito ruim |
| 2 | Ruim |
| 3 | Medio |
| 4 | Bom |
| 5 | Excelente |
