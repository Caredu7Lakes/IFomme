# Avaliação da função de Tech Lead — iFoome

> Registro de uma avaliação crítica da atuação como tech lead no projeto, feita a pedido.

## Pedido feito à IA

Estou atuando como Tech Lead em um projeto MVP com um grupo de pessoas, analise o repositório https://github.com/Caredu7Lakes/IFomme e procure por inconsistências da minha função dentro do repositório que prejudiquem o projeto.

## Retorno

**1. Abrir e triar as Issues de dívida — 100% tech lead.** Transformar débito conhecido em trabalho rastreável, priorizar o que entra no MVP e o que fica pra depois, é função nuclear do lead. O sinal de lead aqui não é só abrir a Issue — é atribuí-la (Felipe, Thiago) e definir prioridade/critério de pronto. Se você abre e resolve tudo sozinho, virou backlog pessoal, não liderança.

**2. Decompor o `App.jsx` — tech lead na DECISÃO, não necessariamente na execução.** O que é seu: definir a arquitetura-alvo (`src/components/` com teste co-locado, onde cortar os componentes, qual padrão seguir) e revisar os PRs do time contra esse padrão. Reescrever 1330 linhas na mão não é trabalho exclusivo de lead — isso você fatia e delega. E tem o filtro de MVP: lead também decide quanto decompor agora. Big-bang rewrite num MVP costuma ser over-investment; o caminho de lead é incremental (extrai um componente por PR, cada um gated pelo CI que você acabou de montar).

**3. Primeiro release + tag `v0.1.0` — 100% tech lead.** Definir o que significa "pronto para release", cortar `Developer → main` e versionar é gestão de release, uma das responsabilidades mais claras do papel. Ninguém mais no grupo decide isso.

## Síntese

Num MVP em grupo, a função de tech lead não se prova fazendo os três — se prova decidindo, delegando, revisando e sendo dono do release. O repositório já mostra isso em evidência real: integração do PR do Felipe com review, gate de qualidade (Vitest + ESLint no CI) e proteção de branch. Os três pontos reforçam isso se forem conduzidos como lead (atribuir, padronizar, revisar), não como executor único.