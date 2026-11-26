**O objetivo, como eu entendo:**

Você é **tech lead** do projeto **iFoome** (repositório `IFomme` no seu GitHub). Chegou a **primeira contribuição** de código — o PR do Felipe, com os 9 arquivos iniciais e integração Supabase, mirando a branch `developer`. 

Vou **revisar esse PR**, para decidir com critério se aprovo ou peço ajustes — com atenção especial a segredos/segurança (chaves do Supabase).

**O meio para isso:** ter o código do PR na minha máquina para inspecionar rodando, não só ler o diff na tela do GitHub.

git clone https\://github.com/Caredu7Lakes/IFomme.git cd IFomme 

branches:

`main` ← você está aqui (local)

`origin/Developer` ← a branch de integração

`origin/feat/implementacao-ifoome` ← **a branch do PR do Felipe**

**git checkout feat/implementacao-ifoome**

**git branch**

**o `checkout` troca pra branch do PR**

**`git branch` (sem `-a`) mostra a branch atual com um `*` do lado — tem que aparecer `* feat/implementacao-ifoome`**

#### **Agora veja os arquivos que chegaram:** 

#### `git log --oneline -5`

`ls`

#### 

`git log` mostra os 2 commits do Felipe

`ls` lista os arquivos do projeto que vieram na branch

Prioridade 1 — caçar segredo 

Get-Content .gitignore

git log \--all \--oneline \-- ".env"

git grep \-nI "eyJ"

Prioridade 2 — entender a stack e a estrutura 

Get-Content .env.example

stack, dependências e scripts  
Get-Content package.json

árvore de arquivos dentro das pastas  
Get-ChildItem \-Recurse src, supabase \| Select-Object FullName

Agora os arquivos que **decidem a review** 

Get-Content .env.example  
Get-Content package.json  
Get-Content src\\App.jsx  
Get-Content supabase\\schema.sql

O que avaliei em cada:

**`App.jsx`** → é o coração da review. Procuro: como ele cria o cliente Supabase (a key vem de `import.meta.env.VITE_...`, nunca colada), e se há query direta às tabelas (`supabase.from('...').select()`). Query direta do front **só é segura se o `schema.sql` tiver RLS**.

**`supabase/schema.sql`** → aqui está o veredito de segurança. Procuro: as tabelas têm `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` e políticas (`CREATE POLICY`)? **Sem RLS, qualquer pessoa com a anon key lê e escreve o banco inteiro** — e a anon key fica exposta no front por natureza. 

**`env.example`** → confirmar que só pede as chaves públicas (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).

**`package.json`** → stack e scripts pra rodar.

Rodar o build — o Vite acusa JSX inválido na hora.

CI é próximo passo

RESULTADO DO NPM

added 76 packages, and audited 77 packages in 1m

9 packages are looking for funding  
  run \`npm fund\` for details

found 0 vulnerabilities  
npm warn install-scripts 1 package has install scripts not yet covered by allowScripts:  
npm warn install-scripts   esbuild@0.25.12 (postinstall: node install.js)  
npm warn install-scripts  
npm warn install-scripts Run \`npm install-scripts ls\` to review, or \`npm install-scripts approve \<pkg\>\` to allow.  
PS C:\\Users\\Carlos\\Desktop\\IFomme\> npm run build

\> ifoome-delivery@1.0.0 build  
\> vite build

vite v6.4.6 building for production...  
✓ 1615 modules transformed.  
dist/index.html                   0.56 kB │ gzip:  0.35 kB  
dist/assets/index-DkkmBZsE.css   16.81 kB │ gzip:  4.35 kB  
dist/assets/index-D-r6ONY2.js   175.67 kB │ gzip: 55.22 kB  
✓ built in 7.84s

**RLS \= Row Level Security** (Segurança em Nível de Linha 

CHECK DEVELOPER TOOLS

**Console** ← é a que você quer agora  
 Erros (vermelho) e avisos (amarelo) em runtime. 

**Network**  
 Mostra as requisições que o app faz. Aqui seria útil pra ver as chamadas ao Supabase — mas em **modo demo** (`supabase = null`) não há nenhuma, então agora vai estar vazio de chamadas de API. Quando conectar o Supabase real, é aqui que confere se as queries respondem ou tomam erro de permissão (RLS).

**Elements**  
 O HTML/CSS renderizado. Útil pra depurar layout, pouco pra esta review.

**Files changed**, 2 comentários 

`schema.sql`, na função `create_public_order` 

no `schema.sql`, nas policies de `restaurants` 

ACTIONS DO CI

O CI vai rodar `npm ci` \+ `npm run build` a cada PR, travando qualquer código que não compile. Começamos só com o build (o projeto ainda não tem ESLint configurado — lint fica como incremento depois, pra não quebrar o CI de cara) 