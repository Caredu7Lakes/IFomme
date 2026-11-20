# Prompt de criação do MVP – iFoome Delivery

Este documento registra o prompt mestre utilizado para orientar a criação do MVP iFoome – Delivery.

## Prompt original

Crie um MVP web chamado "iFoome – Delivery": uma plataforma simples e acessível para pequenos restaurantes digitalizarem o cardápio, organizarem os pedidos e acompanharem as vendas do dia em um único ambiente, reduzindo a dependência de conversas pelo WhatsApp.

## Problema

Pequenos restaurantes recebem pedidos pelo WhatsApp e têm dificuldade para organizar o cardápio, controlar os pedidos e acompanhar as entregas.

## Persona

Seu Raimundo, proprietário de uma marmitaria que vende ~60 marmitas por dia. Ele usa principalmente o celular, tem pouco tempo e trabalha com a cozinha cheia. Precisa organizar pedidos e cardápio de forma simples, rápida e acessível. A interface do dono deve ser tão clara que ele use sozinho, com uma mão, sem treinamento.

## Funcionalidades obrigatórias (must-have)

### 1. Cardápio digital editável pelo proprietário

- Cadastro de pratos com: nome, ingredientes, descrição, preço, foto (opcional) e interruptor "Disponível hoje" (liga/desliga com 1 toque).
- Editar e excluir pratos. Botão grande "Adicionar prato" com formulário curto.
- IA para descrição: botão "Gerar descrição com IA" que, a partir do NOME e dos INGREDIENTES, gera uma descrição curta e apetitosa (máx. 2 frases) em português do Brasil. O dono pode editar o texto antes de salvar. Se a IA falhar, o campo continua editável manualmente (a IA nunca bloqueia o cadastro).
- Botão "Copiar link do cardápio" para o dono compartilhar o link com os clientes (compartilhamento manual, sem integração com WhatsApp).

### 2. Página de pedidos para os clientes

- Página pública por restaurante (ex.: /r/marmitaria-do-raimundo), sem login.
- Mostra só os pratos disponíveis, com nome, descrição, foto e preço.
- O cliente escolhe as quantidades, vê o total e informa: nome, telefone, endereço de entrega, observações e forma de pagamento NA ENTREGA (dinheiro, Pix ou cartão na maquininha). É só uma informação para o dono: NÃO há pagamento online.
- Ao confirmar, o pedido é salvo com status "Recebido" e o cliente vê uma tela de confirmação com o número do pedido.

### 3. Painel administrativo de pedidos

- Mostra os pedidos por status: "Recebido", "Em preparo" e "Saiu para entrega". No celular, use abas ou cards empilhados com filtro por status.
- Cada card traz: número, hora, nome do cliente, itens e quantidades, endereço, forma de pagamento, observações e total.
- Cada card tem UM botão grande que avança o status ("Iniciar preparo" → "Saiu para entrega"), sem menus escondidos.
- Novos pedidos aparecem automaticamente (tempo real ou atualização a cada poucos segundos), com destaque visual.

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

- Web responsivo e mobile-first: botões grandes (mín. 48px), textos legíveis, alto contraste, no máximo 1-2 toques por ação.
- Linguagem simples em português do Brasil, sem termos técnicos.
- Feedback claro após cada ação ("Prato salvo", "Pedido em preparo").
- Visual quente e apetitoso (laranja como cor principal), limpo e profissional.

## Privacidade e segurança (LGPD)

- Login simples (e-mail e senha) só para o dono; o cliente não precisa de conta.
- Coletar apenas os dados necessários do cliente (nome, telefone, endereço).
- Só o dono autenticado pode ver os pedidos e o resumo do dia; use regras de acesso por restaurante (ex.: Row Level Security no Supabase).
- Mostrar um aviso curto na página de pedido sobre o uso dos dados.
- Validar os campos dos formulários (telefone, preço, quantidade > 0).

## Modelo de dados sugerido

- Restaurante: id, nome, slug, dono_id
- Prato: id, restaurante_id, nome, ingredientes, descrição, preço, foto, disponível_hoje
- Pedido: id, restaurante_id, número, cliente_nome, cliente_telefone, endereço, pagamento_na_entrega, observações, status (recebido | em_preparo | saiu_para_entrega), total, criado_em
- ItemPedido: id, pedido_id, prato_id, nome, preço_unitário, quantidade

## Dados de exemplo

Deixe cadastrado o restaurante "Marmitaria do Seu Raimundo" com 4 pratos (Feijoada, Frango Grelhado, Strogonoff, Parmegiana) e 3 pedidos de teste em status diferentes, para eu ver o painel e o resumo do dia funcionando.

## Entrega

Um MVP funcional, responsivo e PUBLICADO na internet (link público), em que o restaurante gerencia o cardápio, recebe pedidos e acompanha as vendas em um único ambiente.

Comece pelo fluxo completo: cadastrar prato → cliente faz pedido → dono vê no painel e muda o status. Depois o resumo diário e a IA de descrição.