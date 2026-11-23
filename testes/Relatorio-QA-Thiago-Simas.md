# Relatorio de QA e Privacidade

**Responsavel:** Thiago Simas  
**Funcao:** QA / Privacy  
**Projeto:** iFoome Delivery  
**Data:** 23/11/2026  
**Ambiente:** Vite local, modo demonstracao, navegador integrado  
**Escopo:** Testes manuais sem alteracoes no codigo-fonte.

## Prompt log

- **Objetivo:** Avaliar o MVP como QA/Privacy e registrar funcionamento, falhas e riscos.
- **Prompt utilizado:** "Execute os testes de QA e privacidade necessarios no projeto iFoome sem modificar arquivos. Verifique os fluxos principais, registre falhas e limitacoes e apresente os resultados de forma estruturada para o prompt log."
- **Restricao:** Nao alterar codigo nem configuracoes do projeto.
- **Resultado:** Testes manuais e build documentados neste relatorio.

## Resumo

- Build de producao: **PASSOU** (`npm run build`).
- Testes manuais executados: **PASSARAM**, com os achados descritos abaixo.
- Testes automatizados: nao existem scripts de teste ou lint configurados no `package.json`.
- Integracao Supabase: **NAO EXECUTADA**; o ambiente nao tinha credenciais configuradas.
- O arquivo `package-lock.json` ja estava modificado antes desta rodada e foi preservado.

## Cenarios executados

| ID | Cenario | Resultado | Evidencia |
|---|---|---|---|
| QA-001 | Abrir painel e entrar com as credenciais pre-preenchidas no modo demonstracao | PASSOU | Painel de pedidos foi exibido. |
| QA-002 | Exibir pedidos e filtrar pelo status "Recebido" | PASSOU | Lista inicial mostrou tres pedidos e o filtro selecionou o pedido recebido. |
| QA-003 | Criar prato com nome, ingredientes e preco validos | PASSOU | Prato apareceu no cardapio com preco formatado. |
| QA-004 | Gerar descricao sem endpoint `/api/description` configurado | PASSOU COM FALLBACK | A chamada retornou 404; o sistema exibiu uma sugestao local editavel. |
| QA-005 | Abrir o cardapio publico diretamente pela rota `/r/marmitaria-do-raimundo` | PASSOU | Foram exibidos os pratos disponiveis, sem o prato indisponivel. |
| QA-006 | Adicionar itens de pratos diferentes ao carrinho | PASSOU | Quantidades e total foram atualizados corretamente. |
| QA-007 | Finalizar pedido com dados validos | PASSOU | Foi exibida a confirmacao do pedido. |
| QA-008 | Abrir o cardapio em viewport de 390 px | PASSOU | Nao houve rolagem horizontal na pagina publica. |
| QA-009 | Confirmar pedido com nome e endereco de uma letra | FALHOU | O modo demonstracao aceitou os dados e confirmou o pedido; ver QA-DEF-002. |

## Achados

### QA-DEF-001 — Leitura publica do restaurante pode ser bloqueada por RLS

- **Prioridade:** Alta / bloqueador potencial da integracao.
- **Evidencia:** O cardapio publico busca o restaurante pelo slug. No schema, a politica de leitura de `restaurants` permite acesso somente ao proprietario autenticado; nao ha politica de leitura publica para essa tabela.
- **Impacto esperado:** Com Supabase habilitado e sem uma politica de leitura publica compativel, a pagina publica pode nao carregar o restaurante.
- **Status:** Pendente de verificacao em um projeto Supabase configurado.
- **Referencias:** `src/App.jsx` (busca publica do restaurante); `supabase/schema.sql` (politicas RLS).

### QA-DEF-002 — Validacao de nome e endereco diverge entre demo e banco

- **Prioridade:** Media.
- **Evidencia:** No modo demonstracao, um pedido com nome "A" e endereco "B" foi confirmado. A funcao SQL exige nome com pelo menos 2 caracteres e endereco com pelo menos 5.
- **Impacto:** O mesmo pedido pode ser aceito na demonstracao e rejeitado no Supabase.
- **Recomendacao:** Alinhar a validacao do formulario com as regras do servidor e cobrir os limites em testes.
- **Status:** Reproduzido no modo demonstracao; comparacao em banco nao executada.

### QA-DEF-003 — Dados pessoais permanecem no localStorage no modo demo

- **Prioridade:** Media / privacidade.
- **Evidencia:** O estado do modo demonstracao e salvo no `localStorage`; os pedidos incluem nome, telefone e endereco. Nao foi identificada expiracao ou acao de limpeza de dados na interface.
- **Impacto:** Dados podem continuar acessiveis no navegador, especialmente em dispositivo compartilhado.
- **Recomendacao:** Definir prazo de retencao e procedimento de limpeza; nao usar o modo demonstracao para pedidos reais.
- **Status:** Confirmado por inspecao do codigo. O README tambem informa que o modo demo nao deve ser usado em producao.

## Testes pendentes

- Validacao de login invalido e encerramento de sessao.
- Avanco de status do pedido e atualizacao em tempo real.
- Resumo de vendas para a data selecionada.
- Edicao, exclusao e indisponibilizacao de pratos.
- Validacoes negativas do checkout (campos vazios, telefone curto, carrinho vazio).
- Integracao Supabase: autenticacao, RLS, RPC de pedidos e Realtime.
- Responsividade do painel administrativo em celular.
- Acessibilidade, navegadores adicionais, desempenho e testes automatizados.
- Politicas de privacidade, retencao e exclusao de dados em producao.

## Observacoes de execucao

- O build foi executado com `npm.cmd run build` por causa da politica local do PowerShell, e concluiu sem erros.
- O endpoint `/api/description` nao esta configurado no ambiente local; o fallback foi testado.
- Os dados criados durante os testes foram limpos do navegador ao final.
- Nenhum arquivo de codigo foi alterado para executar esta rodada.
