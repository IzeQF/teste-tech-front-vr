# Decisões Técnicas e Registro de Progresso

## Visão Geral do Projeto

**Desafio:** Desenvolver uma aplicação React com arquitetura Micro Frontend utilizando Module Federation.

**Aplicações:**
- `shell` (porta 3000) — App central que orquestra os MFEs
- `header` (porta 3001) — Cabeçalho com navegação e modal de produtos selecionados
- `footer` (porta 3002) — Rodapé da aplicação
- `cards` (porta 3003) — Listagem e seleção de produtos

---

## Tarefas

| # | Descrição | Branch | Status |
|---|-----------|--------|--------|
| 1 | Setup do monorepo | `feat/setup-monorepo` | ✅ Concluída |
| 2 | Bootstrap das aplicações React com Webpack + Module Federation | `feat/setup-monorepo` | ✅ Concluída |
| 3 | Shell: integração dos microfrontends | `feat/setup-monorepo` | ✅ Concluída |
| 4 | Módulo compartilhado: tipos e contexto do carrinho | `feat/shared-module` | ✅ Concluída |
| 5 | Cards: listagem de produtos da API | `feat/cards-product-list` | ✅ Concluída |
| 6 | Header: modal com produtos do carrinho | `feat/header-cart-modal` | ✅ Concluída |
| 7 | Footer | `feat/footer` | ✅ Concluída |
| 8 | Responsividade | `feat/responsive-design` | ✅ Concluída |
| 9 | Testes unitários | `feat/tests` | ⏳ Pendente |
| 10 | README final | `feat/docs` | ⏳ Pendente |

---

## Observações sobre o plano

- **API de Cart** (`https://dummyjson.com/carts`) será usada na Task 4/5: ao adicionar produtos no Cards, o estado do carrinho é atualizado e o Header reflete isso via contexto compartilhado.
- **Reaproveitamento de código** (critério do desafio): será atendido pelo módulo compartilhado com tipos TypeScript (`Product`, `CartItem`) e o `CartContext` acessível por todos os MFEs.
- **Branches separadas por feature** a partir da Task 4, demonstrando organização e semântica de commits.

---

## Decisões Técnicas

### Monorepo
- Estrutura de pastas simples sem gerenciador de monorepo (ex: Turborepo, Nx), mantendo a solução leve e adequada para uma vaga jr.
- Cada app tem seu próprio `package.json`, `node_modules` e scripts independentes, facilitando o entendimento e a manutenção.

### React 18 + TypeScript
- React 18 pela estabilidade e por ser o padrão atual do mercado.
- TypeScript para tipagem estática, redução de bugs e melhor legibilidade do código — um diferencial avaliado no teste.

### Webpack 5 + Module Federation
- Requisito implícito do desafio. O Module Federation permite que cada MFE seja deployado de forma independente e consumido em runtime pelo shell.
- Cada remote expõe seu componente principal via `remoteEntry.js`.
- `react` e `react-dom` são compartilhados como `singleton` para evitar múltiplas instâncias.

### Portas definidas
| App | Porta |
|-----|-------|
| shell | 3000 |
| header | 3001 |
| footer | 3002 |
| cards | 3003 |

### Babel
- Utilizado como transpilador junto ao Webpack (`babel-loader`) por ser mais rápido no desenvolvimento e ter melhor suporte ao ecossistema de testes com Jest.

### Jest + Testing Library
- Jest como runner de testes com ambiente `jsdom`.
- `@testing-library/react` pela filosofia de testar comportamento (o que o usuário vê) e não implementação.
- Sem comentários nos arquivos de teste, conforme preferência do projeto.

### Gerenciamento de Estado (a definir na Task 5)
- A ser decidido entre **React Context API** ou **Redux Toolkit**.
- Tendência: Context API por ser nativa do React, sem dependência extra, e suficiente para o escopo do desafio.

---

## Design

### Paleta de Cores
| Uso | Cor |
|-----|-----|
| Fundo geral | `#f5f5f0` |
| Header / Footer | `#1a1a2e` |
| Preços / Destaque | `#00b894` |
| Botões | `#1a1a2e` |
| Cards | `#ffffff` |
| Texto principal | `#1a1a2e` |

### Tipografia
- Logo: fonte serifada bold (`Georgia` ou similar)
- Corpo: sans-serif (`system-ui` / `sans-serif`)

### Layout
- Grid de produtos: 3 colunas em desktop, responsivo para mobile
- Cards com bordas arredondadas e sombra suave
- Header fixo com navegação central e ícone de carrinho à direita

---

## APIs

| Recurso | Endpoint |
|---------|----------|
| Produtos | `https://dummyjson.com/products` |
| Carrinho | `https://dummyjson.com/carts` |
