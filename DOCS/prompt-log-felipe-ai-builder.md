# Prompt Log – AI Builder | iFoome Delivery

**Projeto:** iFoome – Delivery  
**Responsabilidade:** AI Builder Felipe Ferreira 
**Objetivo:** Documentar os prompts elaborados e as interações realizadas com ferramentas de inteligência artificial durante o processo de construção e refinamento do MVP.

Este documento registra exclusivamente as atividades relacionadas à função de AI Builder, incluindo a criação de prompts, definição de instruções para a IA, refinamento dos comandos e organização dos resultados gerados.

---

## 1. Criação do prompt inicial – Prompt Mestre

**Objetivo:** Transformar a descrição inicial do desafio em um prompt mais completo e estruturado, orientando uma ferramenta de IA na criação do MVP.

### Prompt enviado

```text
Crie um prompt para a criação desse MVP:

iFoome - Delivery: Organizar pedidos de restaurantes recebidos por WhatsApp.

A iFoome quer atender restaurantes pequenos que hoje não têm cardápio digital e recebem tudo por mensagem.

- Persona: Seu Raimundo, dono de uma marmitaria que vende 60 marmitas por dia.
- O MVP precisa: cardápio do dia editável pelo dono; página de pedido para o cliente; painel de pedidos com status (recebido, em preparo, saiu para entrega); resumo do dia (pedidos e total vendido).
- IA no produto (opcional): gerar a descrição de um prato a partir do nome e dos ingredientes.
- Pergunta do cliente no pitch: "Seu Raimundo consegue usar isso sozinho no celular, com a cozinha cheia?"
```

### Resultado retornado pela IA

Crie um MVP web chamado "iFoome – Delivery": uma plataforma simples e acessível
para pequenos restaurantes digitalizarem o cardápio, organizarem os pedidos e
acompanharem as vendas do dia em um único ambiente, reduzindo a dependência de
conversas pelo WhatsApp.

## Problema
Pequenos restaurantes recebem pedidos pelo WhatsApp e têm dificuldade para
organizar o cardápio, controlar os pedidos e acompanhar as entregas.

## Persona
Seu Raimundo, proprietário de uma marmitaria que vende ~60 marmitas por dia.
Ele usa principalmente o celular, tem pouco tempo e trabalha com a cozinha
cheia. Precisa organizar pedidos e cardápio de forma simples, rápida e
acessível. A interface do dono deve ser tão clara que ele use sozinho, com uma
mão, sem treinamento.

## Funcionalidades obrigatórias (must-have)

### 1. Cardápio digital editável pelo proprietário
- Cadastro de pratos com: nome, ingredientes, descrição, preço, foto (opcional)
  e interruptor "Disponível hoje" (liga/desliga com 1 toque).
- Editar e excluir pratos. Botão grande "Adicionar prato" com formulário curto.
- IA para descrição: botão "Gerar descrição com IA" que, a partir do NOME e dos
  INGREDIENTES, gera uma descrição curta e apetitosa (máx. 2 frases) em
  português do Brasil. O dono pode editar o texto antes de salvar. Se a IA
  falhar, o campo continua editável manualmente (a IA nunca bloqueia o cadastro).
- Botão "Copiar link do cardápio" para o dono compartilhar o link com os
  clientes (compartilhamento manual, sem integração com WhatsApp).

### 2. Página de pedidos para os clientes
- Página pública por restaurante (ex.: /r/marmitaria-do-raimundo), sem login.
- Mostra só os pratos disponíveis, com nome, descrição, foto e preço.
- O cliente escolhe as quantidades, vê o total e informa: nome, telefone,
  endereço de entrega, observações e forma de pagamento NA ENTREGA (dinheiro,
  Pix ou cartão na maquininha). É só uma informação para o dono: NÃO há
  pagamento online.
- Ao confirmar, o pedido é salvo com status "Recebido" e o cliente vê uma tela
  de confirmação com o número do pedido.

### 3. Painel administrativo de pedidos
- Mostra os pedidos por status: "Recebido", "Em preparo" e "Saiu para entrega".
  No celular, use abas ou cards empilhados com filtro por status.
- Cada card traz: número, hora, nome do cliente, itens e quantidades, endereço,
  forma de pagamento, observações e total.
- Cada card tem UM botão grande que avança o status ("Iniciar preparo" →
  "Saiu para entrega"), sem menus escondidos.
- Novos pedidos aparecem automaticamente (tempo real ou atualização a cada
  poucos segundos), com destaque visual.

### 4. Resumo diário
- Tela simples com a QUANTIDADE DE PEDIDOS do dia e o TOTAL VENDIDO (R$).
- Filtra pela data de hoje, com opção de escolher outro dia.

## Fora do escopo (NÃO implementar)
- Aplicativo mobile nativo (é um site web responsivo).
- Integração automática com WhatsApp (nada de API, bot ou envio automático).
- Pagamentos online por cartão ou Pix.
- Rastreamento de entregadores em tempo real.
- Programa de fidelidade.

## Requisitos de usabilidade
- Web responsivo e mobile-first: botões grandes (mín. 48px), textos legíveis,
  alto contraste, no máximo 1-2 toques por ação.
- Linguagem simples em português do Brasil, sem termos técnicos.
- Feedback claro após cada ação ("Prato salvo", "Pedido em preparo").
- Visual quente e apetitoso (laranja como cor principal), limpo e profissional.

## Privacidade e segurança (LGPD)
- Login simples (e-mail e senha) só para o dono; o cliente não precisa de conta.
- Coletar apenas os dados necessários do cliente (nome, telefone, endereço).
- Só o dono autenticado pode ver os pedidos e o resumo do dia; use regras de
  acesso por restaurante (ex.: Row Level Security no Supabase).
- Mostrar um aviso curto na página de pedido sobre o uso dos dados.
- Validar os campos dos formulários (telefone, preço, quantidade > 0).

## Modelo de dados sugerido
- Restaurante: id, nome, slug, dono_id
- Prato: id, restaurante_id, nome, ingredientes, descrição, preço, foto,
  disponível_hoje
- Pedido: id, restaurante_id, número, cliente_nome, cliente_telefone, endereço,
  pagamento_na_entrega, observações, status (recebido | em_preparo |
  saiu_para_entrega), total, criado_em
- ItemPedido: id, pedido_id, prato_id, nome, preço_unitário, quantidade

## Dados de exemplo
Deixe cadastrado o restaurante "Marmitaria do Seu Raimundo" com 4 pratos
(Feijoada, Frango Grelhado, Strogonoff, Parmegiana) e 3 pedidos de teste em
status diferentes, para eu ver o painel e o resumo do dia funcionando.

## Entrega
Um MVP funcional, responsivo e PUBLICADO na internet (link público), em que o
restaurante gerencia o cardápio, recebe pedidos e acompanha as vendas em um
único ambiente.

Comece pelo fluxo completo: cadastrar prato → cliente faz pedido → dono vê no
painel e muda o status. Depois o resumo diário e a IA de descrição.


O prompt gerado contemplou:

1. **Problema:** dificuldades dos pequenos restaurantes em organizar pedidos recebidos pelo WhatsApp.
2. **Persona:** Seu Raimundo, proprietário de uma marmitaria que vende aproximadamente 60 marmitas por dia.
3. **Funcionalidades obrigatórias:**
   - Cardápio digital editável pelo proprietário.
   - Geração de descrições de pratos com IA.
   - Página pública para os clientes realizarem pedidos.
   - Painel administrativo para acompanhar e atualizar pedidos.
   - Resumo diário de pedidos e vendas.
4. **Fora do escopo:** aplicativo nativo, integração automática com WhatsApp, pagamentos online, rastreamento de entregadores e programa de fidelidade.
5. **Requisitos de usabilidade:** interface responsiva, mobile-first, botões grandes, linguagem simples e feedback das ações.
6. **Privacidade e segurança:** autenticação do proprietário, proteção dos dados dos clientes e regras de acesso por restaurante.
7. **Modelo de dados:** Restaurante, Prato, Pedido e ItemPedido.
8. **Dados de exemplo:** restaurante Marmitaria do Seu Raimundo, com quatro pratos e três pedidos de teste.
9. **Entrega:** MVP funcional, responsivo e publicado na internet.

### Complemento tecnológico

Após a elaboração do prompt mestre, foi acrescentada uma instrução para definir a tecnologia utilizada na geração do projeto:

```text
Crie o código em React.
```

**Resultado esperado:** orientar a ferramenta de IA a gerar a aplicação web utilizando React.

---

## 2. Refinamento do código gerado pela IA

**Objetivo:** Melhorar a organização e a legibilidade do código gerado, facilitando sua compreensão e manutenção, sem modificar a implementação existente.

### Solicitação realizada

Foi solicitado à ferramenta de IA que realizasse exclusivamente a formatação e organização dos dois arquivos, mantendo integralmente a lógica e o funcionamento da aplicação.

**Instruções principais:**
- Organizar a estrutura do código.
- Melhorar a indentação e o espaçamento.
- Facilitar a leitura dos componentes e estilos.
- Não alterar funcionalidades ou regras de negócio.
- Preservar o comportamento original da aplicação.

**Arquivos envolvidos:**
- `src/App.jsx`
- `src/styles.css`

### Resultado esperado

Código mais organizado, padronizado e legível, facilitando futuras análises e manutenções, sem introduzir alterações funcionais.

---

## 3. Organização da documentação dos prompts

**Objetivo:** Centralizar e estruturar o histórico de interações com a IA em um documento Markdown, permitindo registrar as instruções utilizadas e os resultados obtidos durante a atuação como AI Builder.

### Solicitação enviada ao ChatGPT

```text
Organize as informações dos prompts que utilizei durante minha atuação
como AI Builder no projeto iFoome em um arquivo Markdown.

O documento deve registrar os prompts enviados, os resultados
retornados pela IA, os objetivos de cada solicitação e o refinamento
das instruções realizadas durante o processo.
```

### Resultado esperado

- Centralização dos prompts em um único documento.
- Organização cronológica das interações.
- Registro dos objetivos de cada instrução.
- Documentação dos resultados gerados pela IA.
- Facilidade para consultar e acompanhar o processo de construção dos prompts.

---

## 4. Resumo das atividades como AI Builder

| Etapa | Atividade | Resultado |
|---|---|---|
| 1 | Análise da descrição inicial do desafio | Identificação das necessidades do MVP |
| 2 | Elaboração do prompt mestre | Requisitos estruturados para geração da aplicação |
| 3 | Definição da tecnologia | Instrução para utilização de React |
| 4 | Refinamento das instruções à IA | Organização e formatação do código gerado |
| 5 | Documentação dos prompts | Registro das interações em Markdown |

---

## 5. Considerações finais

A atuação como AI Builder no projeto iFoome teve como foco transformar as necessidades do desafio em instruções claras, estruturadas e direcionadas para ferramentas de inteligência artificial.

O trabalho envolveu a elaboração do prompt mestre, o refinamento das instruções para geração da aplicação, a solicitação de melhorias na organização do código e a documentação das interações realizadas.

Este Prompt Log tem como finalidade registrar essa atuação, demonstrando como a engenharia de prompts foi utilizada para orientar e apoiar o desenvolvimento do MVP.

**Observação:** este documento contempla as atividades de AI Builder registradas até o momento e poderá ser atualizado conforme novas instruções e refinamentos forem realizados.