# iFoome – Delivery

MVP web mobile-first para pequenos restaurantes.

## Rodar localmente
1. Instale Node.js 18 ou superior.
2. Na pasta do projeto, execute `npm install`.
3. Copie `.env.example` para `.env` (sem Supabase, o projeto usa modo demonstração).
4. Execute `npm run dev` e abra o endereço indicado pelo Vite.

## Acesso de demonstração
- E-mail: `raimundo@ifoome.com`
- Senha: `123456`
- Cardápio público: `/r/marmitaria-do-raimundo`

No modo demonstração, os dados ficam salvos no `localStorage` do navegador. É ideal para apresentar e testar o fluxo, mas não sincroniza entre dispositivos nem oferece autenticação real.

## Ativar Supabase
1. Crie um projeto Supabase.
2. Execute `supabase/schema.sql` no SQL Editor.
3. Crie um usuário em Authentication > Users.
4. Insira um restaurante com o `owner_id` igual ao ID do usuário e slug `marmitaria-do-raimundo`.
5. Cadastre pratos em `dishes` (o projeto já traz exemplos apenas no modo demonstração).
6. Configure `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` em `.env`.
7. Em Database > Replication/Realtime, habilite Realtime para `orders`.
8. Configure as mesmas variáveis no serviço de hospedagem e faça o deploy do projeto.

**Atenção:** revise as políticas RLS e faça testes de segurança antes de usar com clientes reais. A chave `anon` pode ficar no frontend; nunca coloque a `service_role` no navegador.

## IA de descrição
O botão tenta chamar `POST /api/description`. Se o endpoint não estiver configurado ou falhar, o formulário gera uma sugestão local editável para não bloquear o cadastro. Para IA generativa real, implemente esse endpoint em uma função server-side e guarde a chave do provedor como segredo no servidor. Nunca exponha uma chave de IA no React.

## Publicação
O projeto está pronto para build estático:
- `npm run build`
- publique a pasta `dist` em Vercel, Netlify ou serviço equivalente.
- configure as variáveis de ambiente do Supabase na hospedagem.
- configure fallback de SPA para `index.html`, para que `/r/:slug` abra corretamente.

O modo demonstração não deve ser usado como ambiente de produção. Para operação real, configure Supabase e revise políticas, backups, termos de privacidade e retenção dos dados pessoais.
